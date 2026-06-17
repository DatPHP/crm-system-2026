import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateAuditLogDto {
  userId: number;
  userName: string;
  userRole: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;
  entityId?: number;
  before?: any;
  after?: any;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async log(dto: CreateAuditLogDto) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: dto.userId,
          userName: dto.userName,
          userRole: dto.userRole,
          action: dto.action,
          entity: dto.entity,
          entityId: dto.entityId,
          before: dto.before
            ? JSON.parse(JSON.stringify(dto.before))
            : undefined,
          after: dto.after ? JSON.parse(JSON.stringify(dto.after)) : undefined,
          ipAddress: dto.ipAddress,
          userAgent: dto.userAgent,
        },
      });
    } catch (error) {
      // Không để audit log làm fail request
      this.logger.error('Failed to create audit log:', error);
    }
  }

  async findAll(filters: {
    entity?: string;
    userId?: number;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.entity) where.entity = filters.entity;
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {
        ...(filters.startDate && { gte: new Date(filters.startDate) }),
        ...(filters.endDate && { lte: new Date(filters.endDate) }),
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats() {
    const [total, byAction, byEntity, recentActivity] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.groupBy({
        by: ['action'],
        _count: { action: true },
      }),
      this.prisma.auditLog.groupBy({
        by: ['entity'],
        _count: { entity: true },
        orderBy: { _count: { entity: 'desc' } },
        take: 5,
      }),
      this.prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, byAction, byEntity, recentActivity };
  }
}
