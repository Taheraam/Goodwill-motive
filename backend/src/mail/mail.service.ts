import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export interface DonationReceiptData {
  donorName: string;
  amount: number;
  currency: string;
  mealsSponsored: number;
  campaignName?: string;
  paymentId: string;
  orderId: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly fromAddress: string;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    this.fromAddress = process.env.SMTP_FROM || 'Goodwill Motive <support@goodwillmotive.org>';

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`SMTP Mail transport initialized with ${host}:${port}`);
    } else {
      this.logger.warn('SMTP credentials not provided. MailService is running in development fallback (console output) mode.');
    }
  }

  async sendWelcomeEmail(to: string, username: string): Promise<boolean> {
    const subject = `Welcome to Goodwill Motive, ${username}! 🌱`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8F9F4; margin: 0; padding: 20px; color: #1B4332; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(27,67,50,0.08); border: 1px solid rgba(64,145,108,0.15); }
          .header { background: linear-gradient(135deg, #1B4332 0%, #40916C 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
          .content { padding: 32px 24px; }
          .badge { display: inline-block; background: #D8F3DC; color: #1B4332; font-weight: bold; font-size: 12px; padding: 6px 14px; border-radius: 20px; margin-bottom: 12px; }
          .btn { display: inline-block; background: #40916C; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: bold; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6c757d; border-top: 1px solid #e9ecef; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 26px;">Goodwill Motive</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9;">Learn Together. Help Others. Change Real Lives.</p>
          </div>
          <div class="content">
            <span class="badge">Welcome Onboard</span>
            <h2 style="margin-top: 0;">Welcome, ${username}!</h2>
            <p>We're thrilled to have you join our global humanitarian learning ecosystem. Every quiz you complete, question you answer, and mission you accomplish directly contributes towards funding nutritious meals for communities in need.</p>
            
            <h3 style="color: #40916C; margin-top: 24px;">🚀 3 Ways to Kickstart Your Impact:</h3>
            <ul>
              <li><strong>Take your first daily quiz:</strong> Earn your initial +25 Contribution XP.</li>
              <li><strong>Join a study community:</strong> Collaborate with peers on math, tech, and science.</li>
              <li><strong>Keep your streak alive:</strong> Unlock humanitarian multiplier badges!</li>
            </ul>

            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="btn">Go to Dashboard</a>
            </div>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} The Goodwill Motive Foundation. All contributions are transparently tracked.
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail(to, subject, html);
  }

  async sendDonationReceipt(to: string, data: DonationReceiptData): Promise<boolean> {
    const formattedAmount = `${data.currency} ${(data.amount / 100).toFixed(2)}`;
    const subject = `Donation Receipt & Impact Certificate: ${formattedAmount} (#${data.paymentId}) 🥣`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F8F9F4; margin: 0; padding: 20px; color: #1B4332; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(27,67,50,0.08); border: 1px solid rgba(64,145,108,0.15); }
          .header { background: linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
          .content { padding: 32px 24px; }
          .receipt-box { background: #E8F5EF; border: 1px dashed #40916C; border-radius: 16px; padding: 20px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .row.total { font-size: 18px; font-weight: bold; border-top: 1px solid rgba(64,145,108,0.2); padding-top: 8px; margin-top: 8px; }
          .meals-badge { background: #FFD54F; color: #1B4332; font-size: 16px; font-weight: bold; padding: 10px 16px; border-radius: 12px; display: inline-block; margin: 12px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6c757d; border-top: 1px solid #e9ecef; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Humanitarian Impact Receipt</h1>
            <p style="margin: 6px 0 0 0; opacity: 0.9;">Thank you for feeding real lives!</p>
          </div>
          <div class="content">
            <p>Dear <strong>${data.donorName || 'Generous Donor'}</strong>,</p>
            <p>Your contribution through Razorpay was received successfully. Here is your official impact receipt:</p>

            <div style="text-align: center;">
              <div class="meals-badge">🥣 ${data.mealsSponsored} Nutritious Meals Funded!</div>
            </div>

            <div class="receipt-box">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 4px 0; color: #555;">Payment ID:</td><td style="text-align: right; font-family: monospace;">${data.paymentId}</td></tr>
                <tr><td style="padding: 4px 0; color: #555;">Order ID:</td><td style="text-align: right; font-family: monospace;">${data.orderId}</td></tr>
                <tr><td style="padding: 4px 0; color: #555;">Campaign:</td><td style="text-align: right; font-weight: bold;">${data.campaignName || 'General Emergency Hunger Relief'}</td></tr>
                <tr><td style="padding: 4px 0; color: #555;">Date:</td><td style="text-align: right;">${new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</td></tr>
                <tr style="border-top: 1px solid #40916C;"><td style="padding: 8px 0; font-size: 16px; font-weight: bold;">Total Amount:</td><td style="text-align: right; font-size: 18px; font-weight: bold; color: #1B4332;">${formattedAmount}</td></tr>
              </table>
            </div>

            <p style="font-size: 13px; color: #555;">100% of your sponsored meal funding is distributed to verified ground NGO distribution centers. You can inspect live dispatch tracking on the platform.</p>
          </div>
          <div class="footer">
            Goodwill Motive Foundation • Registered Humanitarian Initiative • 100% Transparent
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendMail(to, subject, html);
  }

  private async sendMail(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.transporter) {
      this.logger.log(`\n================== [EMAIL DEV LOG] ==================\nTO: ${to}\nSUBJECT: ${subject}\nFROM: ${this.fromAddress}\n======================================================`);
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject,
        html,
      });
      this.logger.log(`Email dispatched successfully to ${to} (${subject})`);
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err?.message || err}`);
      return false;
    }
  }
}
