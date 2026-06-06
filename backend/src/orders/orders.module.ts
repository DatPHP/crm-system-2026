import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [MailModule],
})
export class OrdersModule {}
