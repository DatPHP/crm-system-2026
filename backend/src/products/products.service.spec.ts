import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockProduct = {
  id: 1,
  title: 'iPhone 15',
  sku: 'IP15-001',
  price: 999,
  stockQuantity: 10,
  isActive: true,
  categoryId: 1,
  category: { id: 1, name: 'Electronics' },
};

const mockPrismaService = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  describe('findAll()', () => {
    it('should return paginated products', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      const result = await service.findAll(undefined, undefined, {
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by search', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      await service.findAll('iPhone', undefined, { page: 1, limit: 10 });

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ OR: expect.any(Array) }),
        }),
      );
    });
  });

  describe('findOne()', () => {
    it('should return product by id', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);
      expect(result.sku).toBe('IP15-001');
    });

    it('should throw NotFoundException', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create()', () => {
    const createDto = {
      title: 'iPhone 15',
      sku: 'IP15-001',
      price: 999,
      stockQuantity: 10,
      categoryId: 1,
    };

    it('should create product successfully', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null); // SKU chưa tồn tại
      mockPrismaService.product.create.mockResolvedValue(mockProduct);

      const result = await service.create(createDto);
      expect(result.sku).toBe('IP15-001');
    });

    it('should throw ConflictException if SKU exists', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove()', () => {
    it('should delete product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await service.remove(1);
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
