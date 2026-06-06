import { baseTemplate } from './base.template';

interface OrderItem {
  productTitle: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface OrderData {
  orderCode: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: Date;
}

export function orderConfirmationTemplate(
  order: OrderData,
  frontendUrl: string,
): string {
  const baseUrl = (frontendUrl || '').replace(/\/$/, '');
  const formatCurrency = (val: number) =>
    Number(val).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const itemRows = order.items
    .map(
      (item) => `
    <tr>
      <td>${item.productTitle}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:right">${formatCurrency(item.unitPrice)}</td>
      <td style="text-align:right">${formatCurrency(item.subtotal)}</td>
    </tr>
  `,
    )
    .join('');

  const content = `
    <h2>Order Confirmation ✅</h2>
    <p>Hi <strong>${order.customerName}</strong>,</p>
    <p>Your order has been received and is being processed.</p>

    <div class="card">
      <div class="card-row">
        <span class="label">Order Code</span>
        <span class="value" style="font-family:monospace">${order.orderCode}</span>
      </div>
      <div class="card-row">
        <span class="label">Date</span>
        <span class="value">${new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
      </div>
      <div class="card-row">
        <span class="label">Status</span>
        <span class="value">
          <span class="status-badge status-pending">PENDING</span>
        </span>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Product</th>
          <th style="text-align:center">Qty</th>
          <th style="text-align:right">Price</th>
          <th style="text-align:right">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
        <tr class="total-row">
          <td colspan="3" style="text-align:right">Total</td>
          <td style="text-align:right">${formatCurrency(order.totalPrice)}</td>
        </tr>
      </tbody>
    </table>

    <p>You can track your order status here:</p>
    <a href="${baseUrl}/orders" class="btn">
      View Order →
    </a>
  `;
  return baseTemplate(content, `Order Confirmation — ${order.orderCode}`);
}
