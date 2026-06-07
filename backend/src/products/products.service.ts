import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { paginate } from '../common/interfaces/paginated.interface';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async findAll(
    search?: string,
    categoryId?: number,
    pagination?: PaginationDto,
  ) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `products:${search || 'all'}:${categoryId || 'all'}:${page}:${limit}`;

    return this.cache.getOrSet(
      cacheKey,
      CacheService.TTL.PRODUCTS,
      async () => {
        const where = {
          ...(categoryId && { categoryId }),
          ...(search && {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { sku: { contains: search, mode: 'insensitive' as const } },
            ],
          }),
        };

        const [data, total] = await Promise.all([
          this.prisma.product.findMany({
            where,
            include: { category: { select: { id: true, name: true } } },
            orderBy: { id: 'desc' },
            skip,
            take: limit,
          }),
          this.prisma.product.count({ where }),
        ]);

        return paginate(data, total, page, limit);
      },
    );
  }

  async findOne(id: number) {
    const cacheKey = `products:${id}`;

    return this.cache.getOrSet(
      cacheKey,
      CacheService.TTL.PRODUCTS,
      async () => {
        const product = await this.prisma.product.findUnique({
          where: { id },
          include: { category: true },
        });
        if (!product) throw new NotFoundException('Product not found');
        return product;
      },
    );
  }

  async create(dto: CreateProductDto) {
    // Kiểm tra SKU unique
    const existing = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });
    if (existing) throw new ConflictException('SKU already exists');

    const newProduct = await this.prisma.product.create({
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

    await this.cache.delPattern('products:*');
    await this.cache.del('categories:all');
    await this.cache.del(`categories:${dto.categoryId}`);

    return newProduct;
  }

  async update(id: number, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true },
    });

    await this.cache.delPattern('products:*');
    await this.cache.del('categories:all');
    await this.cache.del(`categories:${existing.categoryId}`);
    if (dto.categoryId && dto.categoryId !== existing.categoryId) {
      await this.cache.del(`categories:${dto.categoryId}`);
    }

    return updatedProduct;
  }

  async remove(id: number) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    const deletedProduct = await this.prisma.product.delete({ where: { id } });

    await this.cache.delPattern('products:*');
    await this.cache.del('categories:all');
    await this.cache.del(`categories:${existing.categoryId}`);

    return deletedProduct;
  }
}
