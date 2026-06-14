import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateNotificationDto {
  userId: number;
  title: string;
  message: string;
  type: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // ─── Tạo notification ─────────────────────────────
  async create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        title: dto.title,
        message: dto.message,
        type: dto.type,
        metadata: dto.metadata || {},
      },
    });
  }

  // ─── Tạo notification cho tất cả ADMIN/SUPER_ADMIN ─
  async createForAllAdmins(data: Omit<CreateNotificationDto, 'userId'>) {
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN'] },
        isActive: true,
      },
      select: { id: true },
    });

    await Promise.all(
      admins.map((admin) => this.create({ ...data, userId: admin.id })),
    );
  }

  // ─── Lấy danh sách ────────────────────────────────
  async findAll(userId: number) {
    const [notifications, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50, // max 50 notifications
      }),
      this.prisma.notification.count({
        where: { userId, isRead: false },
      }),
    ]);

    return { notifications, unreadCount };
  }

  // ─── Mark one as read ─────────────────────────────
  async markAsRead(id: number, userId: number) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  // ─── Mark all as read ─────────────────────────────
  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  // ─── Delete one ───────────────────────────────────
  async remove(id: number, userId: number) {
    return this.prisma.notification.deleteMany({
      where: { id, userId },
    });
  }

  // ─── Delete all read ──────────────────────────────
  async clearRead(userId: number) {
    return this.prisma.notification.deleteMany({
      where: { userId, isRead: true },
    });
  }
}
