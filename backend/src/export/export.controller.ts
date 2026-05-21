import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../guards/jwt.guard';

@ApiTags('Export')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('export')
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get('customers/excel')
  @ApiOperation({ summary: 'Export customers to Excel' })
  async exportCustomers(@Res() res: Response) {
    const buffer = await this.exportService.exportCustomers();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=customers.xlsx');
    res.send(buffer);
  }

  @Get('products/excel')
  @ApiOperation({ summary: 'Export products to Excel' })
  async exportProducts(@Res() res: Response) {
    const buffer = await this.exportService.exportProducts();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');
    res.send(buffer);
  }

  @Get('orders/excel')
  @ApiOperation({ summary: 'Export orders to Excel' })
  async exportOrders(@Res() res: Response) {
    const buffer = await this.exportService.exportOrders();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
    res.send(buffer);
  }

  @Get('orders/pdf')
  @ApiOperation({ summary: 'Export orders to PDF' })
  async exportOrdersPdf(@Res() res: Response) {
    const buffer = await this.exportService.exportOrdersPdf();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.pdf');
    res.send(buffer);
  }

  @Get('orders/:id/invoice')
  @ApiOperation({ summary: 'Generate invoice PDF for order' })
  async generateInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const buffer = await this.exportService.generateInvoice(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${id}.pdf`,
    );
    res.send(buffer);
  }
}
