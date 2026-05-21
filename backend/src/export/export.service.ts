import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  // ─── HEADER STYLE ─────────────────────────────────────
  private styleHeader(worksheet: ExcelJS.Worksheet, columns: number) {
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2563EB' }, // blue-600
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 30;

    for (let i = 1; i <= columns; i++) {
      const cell = headerRow.getCell(i);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  }

  // ─── EXPORT CUSTOMERS ─────────────────────────────────
  async exportCustomers(): Promise<Buffer> {
    const customers = await this.prisma.customer.findMany({
      include: { _count: { select: { orders: true } } },
      orderBy: { id: 'asc' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Customers');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Full Name', key: 'fullName', width: 25 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Phone', key: 'phone', width: 16 },
      { header: 'Address', key: 'address', width: 35 },
      { header: 'Orders', key: 'orders', width: 10 },
      { header: 'Created', key: 'createdAt', width: 18 },
    ];

    this.styleHeader(worksheet, 7);

    customers.forEach((c, index) => {
      const row = worksheet.addRow({
        id: c.id,
        fullName: c.fullName,
        email: c.email || '',
        phone: c.phone || '',
        address: c.address || '',
        orders: c._count.orders,
        createdAt: new Date(c.createdAt).toLocaleDateString(),
      });
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: index % 2 === 0 ? 'FFFFFFFF' : 'FFF1F5FF' },
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  // ─── EXPORT PRODUCTS ──────────────────────────────────
  async exportProducts(): Promise<Buffer> {
    const products = await this.prisma.product.findMany({
      include: { category: true },
      orderBy: { id: 'asc' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'SKU', key: 'sku', width: 16 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Price', key: 'price', width: 12 },
      { header: 'Stock', key: 'stock', width: 10 },
      { header: 'Status', key: 'status', width: 12 },
    ];

    this.styleHeader(worksheet, 7);

    products.forEach((p, index) => {
      const row = worksheet.addRow({
        id: p.id,
        title: p.title,
        sku: p.sku,
        category: p.category?.name || '',
        price: Number(p.price),
        stock: p.stockQuantity,
        status: p.isActive ? 'Active' : 'Inactive',
      });

      // Format price cell
      row.getCell('price').numFmt = '$#,##0.00';

      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: index % 2 === 0 ? 'FFFFFFFF' : 'FFF1F5FF' },
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  // ─── EXPORT ORDERS ────────────────────────────────────
  async exportOrders(): Promise<Buffer> {
    const orders = await this.prisma.order.findMany({
      include: {
        customer: { select: { fullName: true } },
        createdBy: { select: { name: true } },
        orderItems: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    worksheet.columns = [
      { header: 'Order Code', key: 'orderCode', width: 22 },
      { header: 'Customer', key: 'customer', width: 25 },
      { header: 'Items', key: 'items', width: 8 },
      { header: 'Total', key: 'total', width: 14 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Created By', key: 'createdBy', width: 18 },
      { header: 'Created At', key: 'createdAt', width: 18 },
    ];

    this.styleHeader(worksheet, 7);

    const statusColor: Record<string, string> = {
      PENDING: 'FFFBBF24',
      PAID: 'FF3B82F6',
      COMPLETED: 'FF22C55E',
      CANCELLED: 'FFEF4444',
    };

    orders.forEach((o, index) => {
      const row = worksheet.addRow({
        orderCode: o.orderCode,
        customer: o.customer?.fullName || '',
        items: o.orderItems.length,
        total: Number(o.totalPrice),
        status: o.status,
        createdBy: o.createdBy?.name || '',
        createdAt: new Date(o.createdAt).toLocaleDateString(),
      });

      row.getCell('total').numFmt = '$#,##0.00';

      // Color status cell
      row.getCell('status').font = {
        bold: true,
        color: { argb: statusColor[o.status] || 'FF000000' },
      };

      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: index % 2 === 0 ? 'FFFFFFFF' : 'FFF1F5FF' },
      };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  // ─── EXPORT ORDERS PDF ────────────────────────────────
  async exportOrdersPdf(): Promise<Buffer> {
    const orders = await this.prisma.order.findMany({
      include: {
        customer: { select: { fullName: true, phone: true } },
        createdBy: { select: { name: true } },
        orderItems: { include: { product: { select: { title: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return new Promise((resolve, reject) => {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Title
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('Orders Report', { align: 'center' });
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#666')
        .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown();

      // Table header
      const tableTop = doc.y;
      const cols = {
        code: 40,
        customer: 180,
        total: 330,
        status: 420,
        date: 490,
      };

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#FFFFFF');
      doc.rect(40, tableTop, 515, 20).fill('#2563EB');
      doc
        .fillColor('#FFFFFF')
        .text('Order Code', cols.code, tableTop + 5)
        .text('Customer', cols.customer, tableTop + 5)
        .text('Total', cols.total, tableTop + 5)
        .text('Status', cols.status, tableTop + 5)
        .text('Date', cols.date, tableTop + 5);

      let y = tableTop + 25;
      doc.font('Helvetica').fontSize(9);

      orders.forEach((order, index) => {
        if (y > 750) {
          doc.addPage();
          y = 40;
        }

        const bg = index % 2 === 0 ? '#FFFFFF' : '#F1F5FF';
        doc.rect(40, y - 3, 515, 18).fill(bg);
        doc
          .fillColor('#000000')
          .text(order.orderCode, cols.code, y, { width: 130 })
          .text(order.customer?.fullName || '', cols.customer, y, {
            width: 140,
          })
          .text(
            `$${Number(order.totalPrice).toLocaleString()}`,
            cols.total,
            y,
            { width: 80 },
          )
          .text(order.status, cols.status, y, { width: 60 })
          .text(new Date(order.createdAt).toLocaleDateString(), cols.date, y);
        y += 20;
      });

      doc.end();
    });
  }

  // ─── INVOICE PDF ──────────────────────────────────────
  async generateInvoice(orderId: number): Promise<Buffer> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        createdBy: { select: { name: true } },
        orderItems: {
          include: { product: { select: { title: true, sku: true } } },
        },
      },
    });

    if (!order) throw new Error('Order not found');

    return new Promise((resolve, reject) => {
      const PDFDocument = require('pdfkit');
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ── Header ──
      doc.rect(0, 0, 612, 80).fill('#2563EB');
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .fillColor('#FFFFFF')
        .text('INVOICE', 50, 25);
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#BFDBFE')
        .text(`CRM Order Management System`, 50, 55);

      // Order code top right
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#FFFFFF')
        .text(order.orderCode, 400, 30, { width: 160, align: 'right' });
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#BFDBFE')
        .text(new Date(order.createdAt).toLocaleDateString(), 400, 50, {
          width: 160,
          align: 'right',
        });

      doc.moveDown(2);

      // ── Bill To ──
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#1E3A5F')
        .text('BILL TO:', 50, 110);
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#333333')
        .text(order.customer?.fullName || '', 50, 128)
        .text(order.customer?.email || '', 50, 143)
        .text(order.customer?.phone || '', 50, 158)
        .text(order.customer?.address || '', 50, 173);

      // ── Order Info ──
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#1E3A5F')
        .text('ORDER INFO:', 350, 110);
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#333333')
        .text(`Code:    ${order.orderCode}`, 350, 128)
        .text(`Status:  ${order.status}`, 350, 143)
        .text(
          `Created: ${new Date(order.createdAt).toLocaleDateString()}`,
          350,
          158,
        )
        .text(`By:      ${order.createdBy?.name || ''}`, 350, 173);

      // ── Items Table ──
      const tableY = 215;
      doc.rect(50, tableY, 512, 22).fill('#2563EB');
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#FFFFFF')
        .text('Product', 60, tableY + 6)
        .text('SKU', 260, tableY + 6)
        .text('Qty', 340, tableY + 6)
        .text('Unit Price', 390, tableY + 6)
        .text('Subtotal', 470, tableY + 6, { width: 80, align: 'right' });

      let y = tableY + 28;
      doc.font('Helvetica').fontSize(9).fillColor('#333333');

      order.orderItems.forEach((item, index) => {
        const bg = index % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
        doc.rect(50, y - 4, 512, 20).fill(bg);
        doc
          .fillColor('#333333')
          .text(item.product?.title || '', 60, y, { width: 190 })
          .text(item.product?.sku || '', 260, y, { width: 70 })
          .text(String(item.quantity), 340, y, { width: 40 })
          .text(`$${Number(item.unitPrice).toLocaleString()}`, 390, y, {
            width: 70,
          })
          .text(`$${Number(item.subtotal).toLocaleString()}`, 470, y, {
            width: 80,
            align: 'right',
          });
        y += 22;
      });

      // ── Total ──
      y += 10;
      doc.rect(380, y, 182, 1).fill('#2563EB');
      y += 10;
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#2563EB')
        .text('TOTAL:', 380, y)
        .text(`$${Number(order.totalPrice).toLocaleString()}`, 380, y, {
          width: 182,
          align: 'right',
        });

      // ── Footer ──
      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#999999')
        .text('Thank you for your business!', 50, 750, {
          align: 'center',
          width: 512,
        });

      doc.end();
    });
  }
}
