import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrdersModule } from './orders/orders.module';
import { ExportModule } from './export/export.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';
import { CacheModule } from './cache/cache.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    CustomersModule,
    DashboardModule,
    CacheModule,
    OrdersModule,
    ExportModule,
    UploadModule,
    MailModule,
    GatewayModule,
  ],
})
export class AppModule {}
