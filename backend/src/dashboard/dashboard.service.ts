import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async getSummary() {
    const CACHE_KEY = 'dashboard:summary';

    return this.cache.getOrSet(
      CACHE_KEY,
      CacheService.TTL.DASHBOARD,
      async () => {
        const [
          totalProducts,
          totalOrders,
          totalCustomers,
          revenueData,
          recentOrders,
          ordersByStatus,
        ] = await Promise.all([
          this.prisma.product.count({ where: { isActive: true } }),
          this.prisma.order.count(),
          this.prisma.customer.count(),
          this.prisma.order.aggregate({
            _sum: { totalPrice: true },
            where: { status: 'COMPLETED' },
          }),
          this.prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
              customer: { select: { fullName: true } },
              orderItems: true,
            },
          }),
          this.prisma.order.groupBy({
            by: ['status'],
            _count: { status: true },
          }),
        ]);

        return {
          totalProducts,
          totalOrders,
          totalCustomers,
          revenue: revenueData._sum.totalPrice ?? 0,
          recentOrders,
          ordersByStatus,
        };
      },
    );
  }
}
