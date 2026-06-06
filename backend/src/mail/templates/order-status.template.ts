import { baseTemplate } from './base.template';

export const statusConfig = {
  PAID: {
    label: 'Payment Confirmed',
    badge: 'status-paid',
    message: 'Your payment has been confirmed. Your order is being prepared.',
    emoji: '💳',
  },
  COMPLETED: {
    label: 'Order Completed',
    badge: 'status-completed',
    message:
      'Your order has been completed successfully. Thank you for your business!',
    emoji: '✅',
  },
  CANCELLED: {
    label: 'Order Cancelled',
    badge: 'status-cancelled',
    message:
      'Your order has been cancelled. If you have questions, please contact us.',
    emoji: '❌',
  },
} as const;

export type OrderStatusKey = keyof typeof statusConfig;

export function isOrderStatus(status: string): status is OrderStatusKey {
  return status in statusConfig;
}

export function orderStatusTemplate(
  customerName: string,
  orderCode: string,
  status: string,
  frontendUrl: string,
) {
  const baseUrl = (frontendUrl || '').replace(/\/$/, '');
  const config = isOrderStatus(status)
    ? statusConfig[status]
    : {
        label: status,
        badge: 'status-pending',
        message: `Your order status has been updated to ${status}.`,
        emoji: '📦',
      };

  const content = `
    <h2>Order Update ${config.emoji}</h2>
    <p>Hi <strong>${customerName}</strong>,</p>
    <p>${config.message}</p>

    <div class="card">
      <div class="card-row">
        <span class="label">Order Code</span>
        <span class="value" style="font-family:monospace">${orderCode}</span>
      </div>
      <div class="card-row">
        <span class="label">New Status</span>
        <span class="value">
          <span class="status-badge ${config.badge}">${config.label}</span>
        </span>
      </div>
      <div class="card-row">
        <span class="label">Updated At</span>
        <span class="value">${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
      </div>
    </div>

    <a href="${baseUrl}/orders" class="btn">
      View Order →
    </a>
  `;
  return baseTemplate(content, `Order Update — ${orderCode}`);
}
