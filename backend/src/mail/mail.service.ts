import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { welcomeTemplate } from './templates/welcome.template';
import { orderConfirmationTemplate } from './templates/order-confirmation.template';
import { orderStatusTemplate } from './templates/order-status.template';
import { resetPasswordTemplate } from './templates/reset-password.template';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);
  private readonly from: string;
  private readonly frontendUrl: string;

  constructor(private config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
    this.from =
      this.config.get<string>('MAIL_FROM') ||
      'CRM System <onboarding@resend.dev>';
    this.frontendUrl =
      this.config.get<string>('FRONTEND_URL') ||
      'https://crm-system-2026.vercel.app';
    this.logger.log('✅ Mail service ready (Resend)');
  }

  // ─── Core send method ─────────────────────────────
  private async sendMail(options: {
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (error) {
        this.logger.error(`❌ Failed to send email to ${options.to}:`, error);
        return false;
      }

      this.logger.log(
        `✅ Email sent to ${options.to}: ${options.subject} (id: ${data?.id})`,
      );
      return true;
    } catch (error) {
      this.logger.error(`❌ Failed to send email to ${options.to}:`, error);
      return false;
    }
  }

  async sendWelcomeEmail(name: string, email: string): Promise<void> {
    await this.sendMail({
      to: email,
      subject: '👋 Welcome to CRM System',
      html: welcomeTemplate(name, this.frontendUrl), // ← thêm
    });
  }

  async sendOrderConfirmation(
    customerEmail: string,
    orderData: any,
  ): Promise<void> {
    await this.sendMail({
      to: customerEmail,
      subject: `✅ Order Confirmed — ${orderData.orderCode}`,
      html: orderConfirmationTemplate(orderData, this.frontendUrl), // ← thêm
    });
  }

  async sendOrderStatusUpdate(
    customerEmail: string,
    customerName: string,
    orderCode: string,
    status: string,
  ): Promise<void> {
    const subjects: Record<string, string> = {
      PAID: `💳 Payment Confirmed — ${orderCode}`,
      COMPLETED: `✅ Order Completed — ${orderCode}`,
      CANCELLED: `❌ Order Cancelled — ${orderCode}`,
    };
    await this.sendMail({
      to: customerEmail,
      subject: subjects[status] || `📦 Order Update — ${orderCode}`,
      html: orderStatusTemplate(
        customerName,
        orderCode,
        status,
        this.frontendUrl,
      ), // ← thêm
    });
  }

  async sendResetPassword(
    name: string,
    email: string,
    resetToken: string,
  ): Promise<void> {
    await this.sendMail({
      to: email,
      subject: '🔐 Reset Your Password — CRM System',
      html: resetPasswordTemplate(name, resetToken, this.frontendUrl), // ← thêm
    });
  }
}