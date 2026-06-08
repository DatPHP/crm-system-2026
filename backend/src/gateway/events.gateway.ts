import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', process.env.FRONTEND_URL || ''],
    credentials: true,
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private connectedClients = 0;

  afterInit() {
    this.logger.log('✅ WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.connectedClients++;
    this.logger.log(
      `Client connected: ${client.id} (total: ${this.connectedClients})`,
    );
  }

  handleDisconnect(client: Socket) {
    this.connectedClients--;
    this.logger.log(
      `Client disconnected: ${client.id} (total: ${this.connectedClients})`,
    );
  }

  // ─── Emit Events ──────────────────────────────────

  // Khi tạo order mới
  emitOrderCreated(order: {
    id: number;
    orderCode: string;
    totalPrice: number;
    customerName: string;
  }) {
    this.server.emit('order:created', {
      ...order,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`📢 Emitted order:created — ${order.orderCode}`);
  }

  // Khi update order status
  emitOrderUpdated(order: { id: number; orderCode: string; status: string }) {
    this.server.emit('order:updated', {
      ...order,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(
      `📢 Emitted order:updated — ${order.orderCode} → ${order.status}`,
    );
  }

  // Khi dashboard stats thay đổi
  emitDashboardUpdated(stats: {
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    revenue: number;
  }) {
    this.server.emit('dashboard:updated', {
      ...stats,
      timestamp: new Date().toISOString(),
    });
  }

  // Notification chung
  emitNotification(
    message: string,
    type: 'success' | 'info' | 'warning' = 'info',
  ) {
    this.server.emit('notification', {
      message,
      type,
      timestamp: new Date().toISOString(),
    });
  }
}
