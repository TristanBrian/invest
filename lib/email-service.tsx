/**
 * Email Service for Invoice & Payment Notifications
 * Uses SendGrid REST API for sending professional invoices and payment confirmations
 * No external dependencies - uses native fetch API
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
  private sendgridApiKey: string | null = null

  constructor() {
    this.sendgridApiKey = process.env.SENDGRID_API_KEY || null
    
    if (!this.sendgridApiKey) {
      console.warn("[v0] Email Service: SENDGRID_API_KEY not configured. Email notifications disabled.")
    }
  }

  /**
   * Check if email service is configured
   */
  isConfigured(): boolean {
    return this.sendgridApiKey !== null
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
    .invoice-info h3 { margin: 0 0 10px 0; font-size: 14px; color: #666; text-transform: uppercase; }
    .invoice-info p { margin: 5px 0; font-size: 14px; }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .details-table td {
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
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
    .footer {
      background-color: #f9fafb;
      padding: 20px 30px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .footer p { margin: 5px 0; }
    .verification-box {
      background-color: #f0fdf4;
      border: 1px solid #dcfce7;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      font-size: 13px;
      color: #166534;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      margin-top: 20px;
      text-align: center;
    }
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
        <span class="amount">KES ${invoice.amount.toLocaleString('en-KE')}</span>
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
   * Send invoice via SendGrid REST API
   */
  async sendInvoiceEmail(invoice: InvoiceData): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    if (!this.sendgridApiKey) {
      console.warn("[v0] Email: SENDGRID_API_KEY not configured. Email not sent.")
      return {
        success: false,
        error: "Email service not configured",
      }
    }

    try {
      const htmlContent = this.generateInvoiceHTML(invoice)
      const invoiceNumber = `INV-${invoice.transactionId.substring(0, 12)}`

      const payload = {
        personalizations: [
          {
            to: [
              {
                email: invoice.customerEmail,
                name: invoice.customerName,
              },
            ],
            subject: `Invoice ${invoiceNumber} - Oxic International`,
          },
        ],
        from: {
          email: "invoices@oxicinternational.co.ke",
          name: "Oxic International Group",
        },
        content: [
          {
            type: "text/html",
            value: htmlContent,
          },
        ],
        reply_to: {
          email: "support@oxicinternational.co.ke",
          name: "Support Team",
        },
      }

      console.log("[v0] Email: Sending invoice to", invoice.customerEmail)

      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.sendgridApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.text()
        console.error("[v0] Email: SendGrid API error", {
          status: response.status,
          error: error,
        })
        return {
          success: false,
          error: `SendGrid error: ${response.status}`,
        }
      }

      console.log("[v0] Email: Invoice sent successfully to", invoice.customerEmail)
      return {
        success: true,
        messageId: `sendgrid-${Date.now()}`,
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
    if (!this.sendgridApiKey) {
      console.warn("[v0] Email: SENDGRID_API_KEY not configured.")
      return { success: false, error: "Email service not configured" }
    }

    try {
      const payload = {
        personalizations: [
          {
            to: [{ email, name }],
            subject: `Payment Received - Transaction ${transactionId}`,
          },
        ],
        from: {
          email: "noreply@oxicinternational.co.ke",
          name: "Oxic International",
        },
        content: [
          {
            type: "text/html",
            value: `
<p>Dear ${name},</p>
<p>Your payment of <strong>KES ${amount.toLocaleString("en-KE")}</strong> has been received.</p>
<p><strong>Transaction ID:</strong> ${transactionId}</p>
<p>Thank you for choosing Oxic International Group.</p>
<p>Best regards,<br>Oxic International Group</p>
            `,
          },
        ],
      }

      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.sendgridApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.error("[v0] Email: Failed to send payment notification")
        return { success: false, error: "Failed to send email" }
      }

      return { success: true }
    } catch (error) {
      console.error("[v0] Email: Payment notification error", error)
      return { success: false, error: String(error) }
    }
  }
}

const emailService = new EmailService()
export default emailService\
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }\
    .header h1 { margin: 0; font-size: 28px; }\
    .header p { margin: 5px 0 0 0; opacity: 0.9; }\
    .body { background: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; }\
    .invoice-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #667eea; }\
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }\
    .detail-row:last-child { border-bottom: none; }\
    .detail-label { font-weight: bold; color: #555; }\
    .detail-value { color: #333; }\
    .amount { font-size: 24px; font-weight: bold; color: #667eea; }\
    .status { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; text-align: center; margin: 15px 0; font-weight: bold; }\
    .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e0e0e0; }\
    .footer a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>\
  <div class=\"container">\
    <div class="header">
      <h1>Payment Receipt</h1>\
      <p>Oxic International Group</p>\
    </div>\
\
    <div class="body">
      <div class="status">
        Payment Confirmed Successfully
      </div>
\
      <div class="invoice-details">
        <div class="detail-row">
          <span class="detail-label">Invoice Number:</span>
          <span class="detail-value">${invoiceNumber}</span>
        </div>\
        <div class="detail-row">
          <span class="detail-label">Date:</span>\
          <span class=\"detail-value\">${formattedDate}</span>\
        </div>\
        <div class=\"detail-row\">\
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
