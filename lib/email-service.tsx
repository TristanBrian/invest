/**
 * Email Service for Invoice & Payment Notifications
 * Uses Resend Email API for professional invoices and payment confirmations
 * Optimized for Next.js and Vercel deployments
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
  private resendApiKey: string | null = null
  private fromEmail = "invoices@oxicinternational.co.ke"
  private fromName = "Oxic International Group"

  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY || null

    if (!this.resendApiKey) {
      console.warn("[v0] Email Service: RESEND_API_KEY not configured. Email notifications disabled.")
    }
  }

  /**
   * Check if email service is configured
   */
  isConfigured(): boolean {
    return this.resendApiKey !== null
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - Oxic International</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
      color: #333; 
      line-height: 1.6; 
      background-color: #f9fafb;
    }
    .container { 
      max-width: 600px; 
      margin: 20px auto; 
      padding: 0; 
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .header p {
      margin: 5px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content { padding: 30px; }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 20px;
    }
    .invoice-info h3 { margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase; font-weight: 600; }
    .invoice-info p { margin: 5px 0; font-size: 14px; font-weight: 500; }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .details-table td {
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
    }
    .details-table .label {
      color: #666;
      font-weight: 500;
      width: 40%;
    }
    .details-table .value {
      color: #333;
      font-weight: 600;
      text-align: right;
    }
    .amount-total {
      background-color: #f0f7ff;
      padding: 15px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;
      border-left: 4px solid #667eea;
    }
    .amount-total .label {
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    .amount-total .amount {
      font-size: 24px;
      font-weight: 700;
      color: #667eea;
    }
    .verification-box {
      background-color: #f0fdf4;
      border: 1px solid #dcfce7;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      font-size: 13px;
      color: #166534;
      line-height: 1.5;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px 30px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .footer p { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Confirmation</h1>
      <p>Oxic International Group</p>
    </div>
    
    <div class="content">
      <p>Dear <strong>${invoice.customerName}</strong>,</p>
      
      <p>Thank you for your payment. We're pleased to confirm that your transaction has been successfully processed.</p>
      
      <div class="invoice-header">
        <div class="invoice-info">
          <h3>Invoice Number</h3>
          <p>${invoiceNumber}</p>
        </div>
        <div class="invoice-info">
          <h3>Date</h3>
          <p>${formattedDate}</p>
        </div>
      </div>
      
      <table class="details-table">
        <tr>
          <td class="label">Transaction ID:</td>
          <td class="value">${invoice.transactionId}</td>
        </tr>
        <tr>
          <td class="label">Phone Number:</td>
          <td class="value">${invoice.customerPhone}</td>
        </tr>
        <tr>
          <td class="label">Payment Method:</td>
          <td class="value">${invoice.paymentMethod}</td>
        </tr>
        ${invoice.mpesaReceiptNumber ? `<tr>
          <td class="label">M-Pesa Receipt:</td>
          <td class="value">${invoice.mpesaReceiptNumber}</td>
        </tr>` : ''}
        <tr>
          <td class="label">Description:</td>
          <td class="value">${invoice.description}</td>
        </tr>
        <tr>
          <td class="label">Account Reference:</td>
          <td class="value">${invoice.accountReference}</td>
        </tr>
      </table>
      
      <div class="amount-total">
        <span class="label">Total Amount Paid:</span>
        <span class="amount">KES ${invoice.amount.toLocaleString("en-KE")}</span>
      </div>
      
      <div class="verification-box">
        <strong>✓ Payment Verified</strong><br>
        Your payment has been verified and processed successfully. You will receive an SMS confirmation from M-Pesa shortly.
      </div>
      
      <p>If you have any questions about this payment, please don't hesitate to contact our support team.</p>
      
      <p>Best regards,<br><strong>Oxic International Group</strong></p>
    </div>
    
    <div class="footer">
      <p><strong>Oxic International Group</strong></p>
      <p>Email: support@oxicinternational.co.ke</p>
      <p>Web: https://oxicinternational.co.ke</p>
      <p style="margin-top: 15px; color: #999;">This is an automated email. Please do not reply directly.</p>
    </div>
  </div>
</body>
</html>
    `.trim()
  }

  /**
   * Send invoice via Resend Email API
   */
  async sendInvoiceEmail(invoice: InvoiceData): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    if (!this.resendApiKey) {
      console.warn("[v0] Email: RESEND_API_KEY not configured. Email not sent.")
      return {
        success: false,
        error: "Email service not configured",
      }
    }

    try {
      const htmlContent = this.generateInvoiceHTML(invoice)
      const invoiceNumber = `INV-${invoice.transactionId.substring(0, 12)}`

      console.log("[v0] Email: Sending invoice to", invoice.customerEmail)

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${this.fromName} <${this.fromEmail}>`,
          to: invoice.customerEmail,
          subject: `Invoice ${invoiceNumber} - Oxic International`,
          html: htmlContent,
          reply_to: "support@oxicinternational.co.ke",
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("[v0] Email: Resend API error", {
          status: response.status,
          error: error,
        })
        return {
          success: false,
          error: `Resend error: ${response.status}`,
        }
      }

      const data = (await response.json()) as { id?: string }
      console.log("[v0] Email: Invoice sent successfully to", invoice.customerEmail)

      return {
        success: true,
        messageId: data.id || `resend-${Date.now()}`,
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error("[v0] Email: Failed to send invoice", errorMsg)
      return {
        success: false,
        error: errorMsg,
      }
    }
  }

  /**
   * Send payment notification email
   */
  async sendPaymentNotification(
    email: string,
    name: string,
    amount: number,
    transactionId: string
  ): Promise<{
    success: boolean
    error?: string
  }> {
    if (!this.resendApiKey) {
      console.warn("[v0] Email: RESEND_API_KEY not configured.")
      return { success: false, error: "Email service not configured" }
    }

    try {
      const htmlContent = `
<p>Dear ${name},</p>
<p>Your payment of <strong>KES ${amount.toLocaleString("en-KE")}</strong> has been received and confirmed.</p>
<p><strong>Transaction ID:</strong> ${transactionId}</p>
<p>A detailed invoice has been sent to your email. Thank you for choosing Oxic International Group.</p>
<p>Best regards,<br>Oxic International Group Support Team</p>
      `

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${this.fromName} <noreply@oxicinternational.co.ke>`,
          to: email,
          subject: `Payment Received - Transaction ${transactionId}`,
          html: htmlContent,
          reply_to: "support@oxicinternational.co.ke",
        }),
      })

      if (!response.ok) {
        console.error("[v0] Email: Failed to send payment notification")
        return { success: false, error: "Failed to send email" }
      }

      console.log("[v0] Email: Payment notification sent to", email)
      return { success: true }
    } catch (error) {
      console.error("[v0] Email: Payment notification error", error)
      return { success: false, error: String(error) }
    }
  }
}

const emailService = new EmailService()
export default emailService
