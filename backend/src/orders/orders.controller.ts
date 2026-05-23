import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // thêm RolesGuard
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query() pagination?: PaginationDto,
  ) {
    return this.ordersService.findAll(search, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  @Roles('ADMIN', 'SUPER_ADMIN') // chỉ ADMIN+ mới tạo được
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: any) {
    return this.ordersService.create(dto, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order (customer/status only)' })
  @Roles('ADMIN', 'SUPER_ADMIN') // chỉ ADMIN+ mới cập nhật được
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.update(id, dto, user.id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel order + restore stock' })
  @Roles('ADMIN', 'SUPER_ADMIN') // chỉ ADMIN+ mới hủy được
  cancel(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return this.ordersService.cancel(id, user.id);
  }
}
