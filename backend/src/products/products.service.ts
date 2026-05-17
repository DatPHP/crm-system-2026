import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(categoryId?: number) {
    return this.prisma.product.findMany({
      where: { ...(categoryId && { categoryId }) },
      include: {
        category: { select: { id: true, name: true } },
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto) {
    // Kiểm tra SKU unique
    const existing = await this.prisma.product.findUnique({ where: { sku: dto.sku } });
    if (existing) throw new ConflictException('SKU already exists');

    return this.prisma.product.create({
      data: {
        title: dto.title,
        sku: dto.sku,
        description: dto.description,
        image: dto.image,
        price: dto.price,
        stockQuantity: dto.stockQuantity,
        categoryId: dto.categoryId,
        isActive: dto.isActive ?? true,
      },
      include: { category: true },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}