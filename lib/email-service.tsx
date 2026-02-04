import nodemailer from "nodemailer"

/**
 * Email Service for Invoice & Payment Notifications
 * Sends professional invoices and payment confirmations to customers
 */

export interface InvoiceData {
  transactionId: string
  customerEmail: string
  customerName: string
  customerPhone: string
  amount: number
  date: Date
  accountReference: string
  description: string
  paymentMethod: string
  mpesaReceiptNumber?: string
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  /**
   * Initialize email transporter
   * Uses SendGrid or your email provider
   */
  private initializeTransporter(): void {
    const emailProvider = process.env.EMAIL_PROVIDER || "sendgrid"

    if (emailProvider === "sendgrid") {
      const apiKey = process.env.SENDGRID_API_KEY

      if (!apiKey) {
        console.error("[v0] Email: SENDGRID_API_KEY not configured")
        return
      }

      this.transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: "apikey",
          pass: apiKey,
        },
      })
    }
  }

  /**
   * Check if email service is configured
   */
  isConfigured(): boolean {
    return this.transporter !== null
  }

  /**
   * Generate professional HTML invoice template
   */
  private generateInvoiceHTML(invoice: InvoiceData): string {
    const formattedDate = new Date(invoice.date).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const invoiceNumber = `INV-${invoice.transactionId.substring(0, 12)}`

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 5px 0 0 0; opacity: 0.9; }
    .body { background: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; }
    .invoice-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #667eea; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { font-weight: bold; color: #555; }
    .detail-value { color: #333; }
    .amount { font-size: 24px; font-weight: bold; color: #667eea; }
    .status { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; text-align: center; margin: 15px 0; font-weight: bold; }
    .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e0e0e0; }
    .footer a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Receipt</h1>
      <p>Oxic International Group</p>
    </div>

    <div class="body">
      <div class="status">
        Payment Confirmed Successfully
      </div>

      <div class="invoice-details">
        <div class="detail-row">
          <span class="detail-label">Invoice Number:</span>
          <span class="detail-value">${invoiceNumber}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Transaction ID:</span>
          <span class="detail-value">${invoice.transactionId}</span>
        </div>
      </div>

      <div class="invoice-details">
        <div class="detail-row">
          <span class="detail-label">Customer Name:</span>
          <span class="detail-value">${invoice.customerName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">${invoice.customerPhone}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${invoice.customerEmail}</span>
        </div>
      </div>

      <div class="invoice-details">
        <div class="detail-row">
          <span class="detail-label">Description:</span>
          <span class="detail-value">${invoice.description}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Payment Method:</span>
          <span class="detail-value">${invoice.paymentMethod}</span>
        </div>
        ${
          invoice.mpesaReceiptNumber
            ? `
        <div class="detail-row">
          <span class="detail-label">M-Pesa Receipt:</span>
          <span class="detail-value">${invoice.mpesaReceiptNumber}</span>
        </div>
        `
            : ""
        }
        <div class="detail-row" style="border-top: 2px solid #667eea; margin-top: 10px; padding-top: 10px;">
          <span class="detail-label">Amount Paid:</span>
          <span class="amount">KES ${invoice.amount.toLocaleString("en-KE")}</span>
        </div>
      </div>

      <p style="margin-top: 20px; font-style: italic; color: #666;">
        Thank you for your payment. This is an automated receipt. Please keep this for your records.
      </p>
    </div>

    <div class="footer">
      <p>Oxic International Group Limited</p>
      <p>Email: <a href="mailto:support@oxicinternational.co.ke">support@oxicinternational.co.ke</a></p>
      <p style="margin-top: 10px; border-top: 1px solid #ddd; padding-top: 10px;">
        © 2026 Oxic International Group. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Send invoice via email
   */
  async sendInvoice(invoice: InvoiceData): Promise<boolean> {
    if (!this.transporter) {
      console.warn("[v0] Email service not configured. Skipping invoice sending.")
      return false
    }

    const fromEmail = process.env.INVOICE_EMAIL_FROM || "invoices@oxicinternational.co.ke"
    const htmlContent = this.generateInvoiceHTML(invoice)

    try {
      console.log("[v0] Sending invoice email to:", invoice.customerEmail)

      const result = await this.transporter.sendMail({
        from: fromEmail,
        to: invoice.customerEmail,
        subject: `Payment Receipt - Invoice ${invoice.transactionId.substring(0, 12)}`,
        html: htmlContent,
        replyTo: process.env.INVOICE_EMAIL_REPLY_TO || "support@oxicinternational.co.ke",
      })

      console.log("[v0] Invoice email sent successfully:", result.messageId)
      return true
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error("[v0] Failed to send invoice email:", errorMsg)
      return false
    }
  }

  /**
   * Send payment confirmation SMS-style email (optional)
   */
  async sendPaymentConfirmation(
    customerEmail: string,
    customerName: string,
    amount: number,
    transactionId: string
  ): Promise<boolean> {
    if (!this.transporter) {
      console.warn("[v0] Email service not configured. Skipping confirmation.")
      return false
    }

    const fromEmail = process.env.INVOICE_EMAIL_FROM || "invoices@oxicinternational.co.ke"

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 400px; margin: 20px auto; padding: 20px; background: #f0f0f0; border-radius: 8px; }
    .message { background: white; padding: 20px; border-left: 4px solid #28a745; border-radius: 5px; }
    .amount { font-size: 32px; font-weight: bold; color: #28a745; margin: 15px 0; }
    .tx-id { font-size: 12px; color: #999; margin-top: 15px; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="message">
      <h2 style="margin-top: 0;">Payment Confirmed</h2>
      <p>Hi ${customerName},</p>
      <p>Your payment has been received successfully.</p>
      <div class="amount">KES ${amount.toLocaleString("en-KE")}</div>
      <p style="font-size: 14px; color: #666;">
        A detailed receipt has been sent to your email. If you have any questions, please contact support.
      </p>
      <div class="tx-id">
        Reference: ${transactionId}
      </div>
    </div>
  </div>
</body>
</html>
    `

    try {
      await this.transporter.sendMail({
        from: fromEmail,
        to: customerEmail,
        subject: "Payment Received",
        html: htmlContent,
        replyTo: process.env.INVOICE_EMAIL_REPLY_TO || "support@oxicinternational.co.ke",
      })

      return true
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error("[v0] Failed to send confirmation:", errorMsg)
      return false
    }
  }
}

// Singleton instance
const emailService = new EmailService()

export default emailService
