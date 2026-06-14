import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

const mockNotificationsService = {
  findAll: jest.fn(),
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
  remove: jest.fn(),
  clearRead: jest.fn(),
};

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const mockUser = { id: 1, name: 'Admin', email: 'admin@gmail.com' };

  describe('findAll', () => {
    it('should return all notifications for the current user', async () => {
      const expectedResult = {
        notifications: [
          {
            id: 1,
            title: 'Test',
            message: 'Hello',
            type: 'info',
            isRead: false,
          },
        ],
        unreadCount: 1,
      };
      mockNotificationsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockUser);

      expect(mockNotificationsService.findAll).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('markAsRead', () => {
    it('should mark a specific notification as read', async () => {
      mockNotificationsService.markAsRead.mockResolvedValue({ count: 1 });

      const result = await controller.markAsRead(10, mockUser);

      expect(mockNotificationsService.markAsRead).toHaveBeenCalledWith(
        10,
        mockUser.id,
      );
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      mockNotificationsService.markAllAsRead.mockResolvedValue({ count: 5 });

      const result = await controller.markAllAsRead(mockUser);

      expect(mockNotificationsService.markAllAsRead).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(result).toEqual({ count: 5 });
    });
  });

  describe('remove', () => {
    it('should remove a notification', async () => {
      mockNotificationsService.remove.mockResolvedValue({ count: 1 });

      const result = await controller.remove(10, mockUser);

      expect(mockNotificationsService.remove).toHaveBeenCalledWith(
        10,
        mockUser.id,
      );
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('clearRead', () => {
    it('should clear all read notifications', async () => {
      mockNotificationsService.clearRead.mockResolvedValue({ count: 3 });

      const result = await controller.clearRead(mockUser);

      expect(mockNotificationsService.clearRead).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(result).toEqual({ count: 3 });
    });
  });
});
