import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { welcomeTemplate } from './templates/welcome.template';
import { orderConfirmationTemplate } from './templates/order-confirmation.template';
import {
  orderStatusTemplate,
  statusConfig,
  isOrderStatus,
} from './templates/order-status.template';
import { resetPasswordTemplate } from './templates/reset-password.template';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private config: ConfigService) {
    const host = this.config.get<string>('MAIL_HOST');
    const auth = {
      user: this.config.get<string>('MAIL_USER'),
      pass: this.config.get<string>('MAIL_PASSWORD'),
    };

    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.config.get<number>('MAIL_PORT'),
        secure: this.config.get<string>('MAIL_SECURE') === 'true',
        auth,
      });
    } else {
      this.transporter = nodemailer.createTransport({
        service: this.config.get<string>('MAIL_SERVICE') || 'gmail',
        auth,
      });
    }

    // Verify connection khi khởi động
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('Mail transporter error:', error);
      } else {
        this.logger.log('✅ Mail service ready');
      }
    });
  }

  // ─── Core send method ─────────────────────────────
  private async sendMail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('MAIL_FROM'),
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      this.logger.log(`✅ Email sent to ${options.to}: ${options.subject}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  // ─── Welcome Email ────────────────────────────────
  async sendWelcomeEmail(name: string, email: string): Promise<boolean> {
    const frontendUrl = this.config.get<string>('FRONTEND_URL') || '';
    return await this.sendMail({
      to: email,
      subject: '👋 Welcome to CRM System',
      html: welcomeTemplate(name, frontendUrl),
    });
  }

  // ─── Order Confirmation ───────────────────────────
  async sendOrderConfirmation(
    customerEmail: string,
    orderData: {
      orderCode: string;
      customerName: string;
      customerEmail: string;
      items: {
        productTitle: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
      }[];
      totalPrice: number;
      createdAt: Date;
    },
  ): Promise<boolean> {
    const frontendUrl = this.config.get<string>('FRONTEND_URL') || '';
    return await this.sendMail({
      to: customerEmail,
      subject: `✅ Order Confirmed — ${orderData.orderCode}`,
      html: orderConfirmationTemplate(orderData, frontendUrl),
    });
  }

  // ─── Order Status Update ──────────────────────────
  async sendOrderStatusUpdate(
    customerEmail: string,
    customerName: string,
    orderCode: string,
    status: string,
  ): Promise<boolean> {
    const frontendUrl = this.config.get<string>('FRONTEND_URL') || '';
    const subjectPrefix = isOrderStatus(status)
      ? statusConfig[status].label
      : 'Order Update';
    const emoji = isOrderStatus(status) ? statusConfig[status].emoji : '📦';

    return await this.sendMail({
      to: customerEmail,
      subject: `${emoji} ${subjectPrefix} — ${orderCode}`,
      html: orderStatusTemplate(customerName, orderCode, status, frontendUrl),
    });
  }

  // ─── Reset Password ───────────────────────────────
  async sendResetPassword(
    name: string,
    email: string,
    resetToken: string,
  ): Promise<boolean> {
    const frontendUrl = this.config.get<string>('FRONTEND_URL') || '';
    return await this.sendMail({
      to: email,
      subject: '🔐 Reset Your Password — CRM System',
      html: resetPasswordTemplate(name, resetToken, frontendUrl),
    });
  }
}
