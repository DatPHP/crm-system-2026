import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  // Auto tạo slug từ name
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  async findAll() {
    const CACHE_KEY = 'categories:all';

    return this.cache.getOrSet(
      CACHE_KEY,
      CacheService.TTL.CATEGORIES,
      async () => {
        return this.prisma.category.findMany({
          include: {
            parent: { select: { id: true, name: true } },
            _count: { select: { products: true, children: true } },
          },
          orderBy: { id: 'asc' },
        });
      },
    );
  }

  async findOne(id: number) {
    const CACHE_KEY = `categories:${id}`;

    return this.cache.getOrSet(
      CACHE_KEY,
      CacheService.TTL.CATEGORIES,
      async () => {
        const category = await this.prisma.category.findUnique({
          where: { id },
          include: {
            parent: true,
            children: true,
            products: true,
          },
        });
        if (!category) throw new NotFoundException('Category not found');
        return category;
      },
    );
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug || this.generateSlug(dto.name);

    // Kiểm tra slug unique
    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Slug already exists');

    const newCategory = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        parentId: dto.parentId,
      },
    });

    await this.cache.del('categories:all');
    if (dto.parentId) {
      await this.cache.del(`categories:${dto.parentId}`);
    }

    return newCategory;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Category not found');

    const slug =
      dto.slug || (dto.name ? this.generateSlug(dto.name) : undefined);

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(slug && { slug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.parentId !== undefined && { parentId: dto.parentId }),
      },
    });

    await this.cache.del('categories:all');
    await this.cache.del(`categories:${id}`);
    if (existing.parentId)
      await this.cache.del(`categories:${existing.parentId}`);
    if (dto.parentId && dto.parentId !== existing.parentId) {
      await this.cache.del(`categories:${dto.parentId}`);
    }

    return updatedCategory;
  }

  async remove(id: number) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Category not found');

    // Kiểm tra có products không
    const hasProducts = await this.prisma.product.count({
      where: { categoryId: id },
    });
    if (hasProducts > 0) {
      throw new ConflictException('Cannot delete category that has products');
    }

    const deletedCategory = await this.prisma.category.delete({
      where: { id },
    });

    await this.cache.del('categories:all');
    await this.cache.del(`categories:${id}`);
    if (existing.parentId) {
      await this.cache.del(`categories:${existing.parentId}`);
    }

    return deletedCategory;
  }
}
