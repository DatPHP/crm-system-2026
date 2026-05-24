import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// ─── MOCK DATA ────────────────────────────────────────
const mockCustomer = {
  id: 1,
  fullName: 'Nguyen Van A',
  email: 'a@gmail.com',
};

const mockProduct = {
  id: 1,
  title: 'iPhone 15',
  sku: 'IP15',
  price: 999,
  stockQuantity: 10,
  isActive: true,
};

const mockOrder = {
  id: 1,
  orderCode: 'ORD-20260521-001',
  customerId: 1,
  totalPrice: 1998,
  status: 'PENDING',
  createdById: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  customer: mockCustomer,
  orderItems: [
    { id: 1, productId: 1, quantity: 2, unitPrice: 999, subtotal: 1998 },
  ],
  orderHistories: [],
};

// ─── MOCK PRISMA ──────────────────────────────────────
const mockPrismaService = {
  order: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  customer: {
    findUnique: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  orderHistory: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

// ─── TEST SUITE ───────────────────────────────────────
describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  // ─── findAll ─────────────────────────────────────────
  describe('findAll()', () => {
    it('should return paginated orders', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([mockOrder]);
      mockPrismaService.order.count.mockResolvedValue(1);

      const result = await service.findAll(undefined, { page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should filter by search term', async () => {
      mockPrismaService.order.findMany.mockResolvedValue([]);
      mockPrismaService.order.count.mockResolvedValue(0);

      const result = await service.findAll('ORD-999', { page: 1, limit: 10 });

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);

      // Kiểm tra where clause có search không
      expect(mockPrismaService.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ OR: expect.any(Array) }),
        }),
      );
    });
  });

  // ─── findOne ─────────────────────────────────────────
  describe('findOne()', () => {
    it('should return order by id', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(result.orderCode).toBe('ORD-20260521-001');
    });

    it('should throw NotFoundException if order not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ─── create ──────────────────────────────────────────
  describe('create()', () => {
    const createDto = {
      customerId: 1,
      items: [{ productId: 1, quantity: 2 }],
    };

    it('should create order successfully with transaction', async () => {
      // Mock transaction thực thi callback
      mockPrismaService.$transaction.mockImplementation(
        async (callback: any) => {
          const tx = {
            customer: { findUnique: jest.fn().mockResolvedValue(mockCustomer) },
            product: {
              findUnique: jest.fn().mockResolvedValue(mockProduct),
              update: jest.fn().mockResolvedValue(mockProduct),
            },
            order: {
              create: jest.fn().mockResolvedValue(mockOrder),
              count: jest.fn().mockResolvedValue(0),
            },
            orderHistory: { create: jest.fn().mockResolvedValue({}) },
          };
          return callback(tx);
        },
      );

      const result = await service.create(createDto, 1);

      expect(result.orderCode).toBe('ORD-20260521-001');
      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockPrismaService.$transaction.mockImplementation(
        async (callback: any) => {
          const tx = {
            customer: { findUnique: jest.fn().mockResolvedValue(null) },
          };
          return callback(tx);
        },
      );

      await expect(service.create(createDto, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if stock insufficient', async () => {
      const lowStockProduct = { ...mockProduct, stockQuantity: 1 };

      mockPrismaService.$transaction.mockImplementation(
        async (callback: any) => {
          const tx = {
            customer: { findUnique: jest.fn().mockResolvedValue(mockCustomer) },
            product: {
              findUnique: jest.fn().mockResolvedValue(lowStockProduct),
            },
          };
          return callback(tx);
        },
      );

      // quantity: 2 nhưng stock chỉ có 1
      await expect(service.create(createDto, 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if product inactive', async () => {
      const inactiveProduct = { ...mockProduct, isActive: false };

      mockPrismaService.$transaction.mockImplementation(
        async (callback: any) => {
          const tx = {
            customer: { findUnique: jest.fn().mockResolvedValue(mockCustomer) },
            product: {
              findUnique: jest.fn().mockResolvedValue(inactiveProduct),
            },
          };
          return callback(tx);
        },
      );

      await expect(service.create(createDto, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ─── cancel ──────────────────────────────────────────
  describe('cancel()', () => {
    it('should cancel order and restore stock', async () => {
      const pendingOrder = { ...mockOrder, status: 'PENDING' };

      mockPrismaService.$transaction.mockImplementation(
        async (callback: any) => {
          const tx = {
            order: {
              findUnique: jest.fn().mockResolvedValue(pendingOrder),
              update: jest
                .fn()
                .mockResolvedValue({ ...pendingOrder, status: 'CANCELLED' }),
            },
            product: { update: jest.fn().mockResolvedValue(mockProduct) },
            orderHistory: { create: jest.fn().mockResolvedValue({}) },
          };
          return callback(tx);
        },
      );

      const result = await service.cancel(1, 1);
      expect(result.status).toBe('CANCELLED');
    });

    it('should throw BadRequestException if already cancelled', async () => {
      const cancelledOrder = { ...mockOrder, status: 'CANCELLED' };

      mockPrismaService.$transaction.mockImplementation(
        async (callback: any) => {
          const tx = {
            order: { findUnique: jest.fn().mockResolvedValue(cancelledOrder) },
          };
          return callback(tx);
        },
      );

      await expect(service.cancel(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if order completed', async () => {
      const completedOrder = { ...mockOrder, status: 'COMPLETED' };

      mockPrismaService.$transaction.mockImplementation(
        async (callback: any) => {
          const tx = {
            order: { findUnique: jest.fn().mockResolvedValue(completedOrder) },
          };
          return callback(tx);
        },
      );

      await expect(service.cancel(1, 1)).rejects.toThrow(BadRequestException);
    });
  });
});
