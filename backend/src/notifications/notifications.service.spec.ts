import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  notification: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  user: {
    findMany: jest.fn(),
  },
};

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification with metadata', async () => {
      const dto = {
        userId: 1,
        title: 'New order',
        message: 'Order ORD-123 has been created',
        type: 'order_created',
        metadata: { orderId: 123 },
      };
      const expectedOutput = {
        id: 1,
        ...dto,
        isRead: false,
        createdAt: new Date(),
      };
      mockPrismaService.notification.create.mockResolvedValue(expectedOutput);

      const result = await service.create(dto);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: dto.userId,
          title: dto.title,
          message: dto.message,
          type: dto.type,
          metadata: dto.metadata,
        },
      });
      expect(result).toEqual(expectedOutput);
    });

    it('should default metadata to an empty object if not provided', async () => {
      const dto = {
        userId: 1,
        title: 'New order',
        message: 'Order ORD-123 has been created',
        type: 'order_created',
      };
      const expectedOutput = {
        id: 1,
        ...dto,
        metadata: {},
        isRead: false,
        createdAt: new Date(),
      };
      mockPrismaService.notification.create.mockResolvedValue(expectedOutput);

      const result = await service.create(dto);

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: dto.userId,
          title: dto.title,
          message: dto.message,
          type: dto.type,
          metadata: {},
        },
      });
      expect(result).toEqual(expectedOutput);
    });
  });

  describe('createForAllAdmins', () => {
    it('should create notifications for all active admin and super admin users', async () => {
      const data = {
        title: 'System alert',
        message: 'High CPU usage',
        type: 'system_alert',
      };
      const admins = [{ id: 2 }, { id: 3 }];
      mockPrismaService.user.findMany.mockResolvedValue(admins);

      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValue({} as any);

      await service.createForAllAdmins(data);

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: {
          role: { in: ['ADMIN', 'SUPER_ADMIN'] },
          isActive: true,
        },
        select: { id: true },
      });
      expect(createSpy).toHaveBeenCalledTimes(2);
      expect(createSpy).toHaveBeenNthCalledWith(1, { ...data, userId: 2 });
      expect(createSpy).toHaveBeenNthCalledWith(2, { ...data, userId: 3 });

      createSpy.mockRestore();
    });

    it('should do nothing if no active admins are found', async () => {
      const data = {
        title: 'System alert',
        message: 'High CPU usage',
        type: 'system_alert',
      };
      mockPrismaService.user.findMany.mockResolvedValue([]);
      const createSpy = jest.spyOn(service, 'create');

      await service.createForAllAdmins(data);

      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(createSpy).not.toHaveBeenCalled();

      createSpy.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return a list of notifications and the count of unread ones', async () => {
      const userId = 1;
      const notifications = [
        {
          id: 2,
          userId,
          title: 'Notification 2',
          isRead: false,
          createdAt: new Date(),
        },
        {
          id: 1,
          userId,
          title: 'Notification 1',
          isRead: true,
          createdAt: new Date(),
        },
      ];
      mockPrismaService.notification.findMany.mockResolvedValue(notifications);
      mockPrismaService.notification.count.mockResolvedValue(1);

      const result = await service.findAll(userId);

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      expect(mockPrismaService.notification.count).toHaveBeenCalledWith({
        where: { userId, isRead: false },
      });
      expect(result).toEqual({ notifications, unreadCount: 1 });
    });
  });

  describe('markAsRead', () => {
    it('should mark a specific notification as read for the user', async () => {
      const id = 10;
      const userId = 1;
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.markAsRead(id, userId);

      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { id, userId },
        data: { isRead: true },
      });
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read for the user', async () => {
      const userId = 1;
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllAsRead(userId);

      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
      expect(result).toEqual({ count: 5 });
    });
  });

  describe('remove', () => {
    it('should delete a specific notification for the user', async () => {
      const id = 10;
      const userId = 1;
      mockPrismaService.notification.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.remove(id, userId);

      expect(mockPrismaService.notification.deleteMany).toHaveBeenCalledWith({
        where: { id, userId },
      });
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('clearRead', () => {
    it('should delete all read notifications for the user', async () => {
      const userId = 1;
      mockPrismaService.notification.deleteMany.mockResolvedValue({ count: 3 });

      const result = await service.clearRead(userId);

      expect(mockPrismaService.notification.deleteMany).toHaveBeenCalledWith({
        where: { userId, isRead: true },
      });
      expect(result).toEqual({ count: 3 });
    });
  });
});
