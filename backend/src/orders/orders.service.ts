import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { paginate } from '../common/interfaces/paginated.interface';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Generate order code: ORD-20260516-001
  private async generateOrderCode(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    const count = await this.prisma.order.count();
    const sequence = String(count + 1).padStart(3, '0');

    return `ORD-${dateStr}-${sequence}`;
  }

  // ─── GET ALL ───────────────────────────────────────────
  async findAll(search?: string, pagination?: PaginationDto) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { orderCode: { contains: search, mode: 'insensitive' as const } },
            {
              customer: {
                fullName: { contains: search, mode: 'insensitive' as const },
              },
            },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          customer: { select: { id: true, fullName: true, phone: true } },
          createdBy: { select: { id: true, name: true } },
          orderItems: {
            include: {
              product: { select: { id: true, title: true, sku: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  // ─── GET ONE ───────────────────────────────────────────
  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        createdBy: { select: { id: true, name: true } },
        orderItems: {
          include: { product: true },
        },
        orderHistories: {
          include: {
            createdBy: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // ─── CREATE ORDER (Transaction) ────────────────────────
  async create(dto: CreateOrderDto, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { id: dto.customerId },
      });
      if (!customer) throw new NotFoundException('Customer not found');

      const orderItemsData: Array<{
        productId: number;
        quantity: number;
        unitPrice: number;
        subtotal: number;
      }> = [];

      let totalPrice = 0;

      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product #${item.productId} not found`);
        }
        if (!product.isActive) {
          throw new BadRequestException(
            `Product "${product.title}" is inactive`,
          );
        }
        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Product "${product.title}" only has ${product.stockQuantity} in stock`,
          );
        }

        const unitPrice = Number(product.price); // ← convert Decimal → number
        const subtotal = unitPrice * item.quantity;
        totalPrice += subtotal;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice,
          subtotal,
        });
      }

      const orderCode = await this.generateOrderCode();

      const order = await tx.order.create({
        data: {
          orderCode,
          customerId: dto.customerId,
          totalPrice,
          createdById: userId,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          customer: true,
          orderItems: {
            include: { product: true },
          },
        },
      });

      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      await tx.orderHistory.create({
        data: {
          orderId: order.id,
          action: 'ORDER_CREATED',
          description: `Order created with ${dto.items.length} item(s), total $${totalPrice}`,
          createdById: userId,
        },
      });

      return order;
    });
  }

  // ─── UPDATE ORDER ──────────────────────────────────────
  async update(id: number, dto: UpdateOrderDto, userId: number) {
    const order = await this.findOne(id);

    // Không cho update order đã CANCELLED
    if (order.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update a cancelled order');
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        ...(dto.customerId && { customerId: dto.customerId }),
        ...(dto.status && { status: dto.status }),
      },
      include: { customer: true, orderItems: { include: { product: true } } },
    });

    // Ghi history nếu đổi status
    if (dto.status && dto.status !== order.status) {
      await this.prisma.orderHistory.create({
        data: {
          orderId: id,
          action: `STATUS_CHANGED`,
          description: `Status changed from ${order.status} to ${dto.status}`,
          createdById: userId,
        },
      });
    }

    return updated;
  }

  // ─── CANCEL ORDER (hoàn stock) ─────────────────────────
  async cancel(id: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { orderItems: true },
      });

      if (!order) throw new NotFoundException('Order not found');

      if (order.status === 'CANCELLED') {
        throw new BadRequestException('Order is already cancelled');
      }

      if (order.status === 'COMPLETED') {
        throw new BadRequestException('Cannot cancel a completed order');
      }

      // Hoàn stock cho từng product
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        });
      }

      // Update status
      const updated = await tx.order.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });

      // Ghi history
      await tx.orderHistory.create({
        data: {
          orderId: id,
          action: 'ORDER_CANCELLED',
          description: 'Order cancelled and stock restored',
          createdById: userId,
        },
      });

      return updated;
    });
  }
}
