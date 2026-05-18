import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.create(dto, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order (customer/status only)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.update(id, dto, user.id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel order + restore stock' })
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.cancel(id, user.id);
  }
}