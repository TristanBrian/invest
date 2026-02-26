/**
 * Professional Invoice Email Service
 * Handles invoice generation, delivery to clients and internal team
 * Uses Resend API for reliable email transmission
 */

import { Invoice, InvoiceSendRequest, InvoiceSendResponse, EmailDeliveryResult } from "./invoice-types"
import { generateInvoiceHTML, generateTeamNotificationHTML } from "./invoice-template"

/**
 * Default team email addresses for invoice distribution
 */
const DEFAULT_TEAM_EMAILS = [
  "oxicgroupltd@gmail.com",
  "Info@oxicinternational.co.ke",
]

/**
 * Generate unique invoice ID and number
 */
export function generateInvoiceNumber(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9).toUpperCase()
  return `INV-${new Date().getFullYear()}-${String(timestamp).slice(-6)}-${random}`
}

/**
 * Calculate invoice totals
 */
export function calculateInvoiceTotals(lineItems: any[], taxRate: number = 0) {
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const tax = (subtotal * taxRate) / 100
  const total = subtotal + tax

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}

/**
 * Create invoice object from request
 */
export function createInvoice(
  request: InvoiceSendRequest,
  invoiceNumber: string = generateInvoiceNumber()
): Invoice {
  const { subtotal, tax, total } = calculateInvoiceTotals(
    request.lineItems,
    request.details.taxRate || 0
  )

  return {
    id: `invoice_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    invoiceNumber,
    client: request.client,
    lineItems: request.lineItems,
    details: request.details,
    subtotal,
    tax,
    total,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Send single email via Resend API with retry logic
 */
async function sendEmailViaResend(
  to: string,
  subject: string,
  html: string,
  replyTo: string,
  retries: number = 2
): Promise<EmailDeliveryResult> {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.error("[v0] RESEND_API_KEY not configured")
    return {
      recipient: to,
      success: false,
      error: "Email service not configured",
    }
  }

  let lastError: any = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "invoices@oxicinternational.co.ke",
          to,
          subject,
          html,
          reply_to: replyTo,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        lastError = error
        
        if (attempt < retries) {
          console.warn(`[v0] Invoice email failed for ${to}, retrying... (attempt ${attempt + 1}/${retries})`)
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
          continue
        }

        console.error(`[v0] Invoice email failed for ${to} after ${retries + 1} attempts:`, error)
        return {
          recipient: to,
          success: false,
          error: `API Error: ${error.message}`,
        }
      }

      const result = await response.json()
      console.log(`[v0] Invoice email sent successfully to ${to}:`, result.id)
      return {
        recipient: to,
        success: true,
        emailId: result.id,
      }
    } catch (error: any) {
      lastError = error
      
      if (attempt < retries) {
        console.warn(`[v0] Invoice email request failed for ${to}, retrying... (attempt ${attempt + 1}/${retries})`)
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
        continue
      }

      console.error(`[v0] Invoice email request failed for ${to} after ${retries + 1} attempts:`, error)
      return {
        recipient: to,
        success: false,
        error: String(error),
      }
    }
  }

  return {
    recipient: to,
    success: false,
    error: String(lastError),
  }
}

/**
 * Send invoice to client and team
 * Ensures delivery to at least one team email even if others fail
 */
export async function sendInvoice(
  invoice: Invoice,
  teamEmails?: string[]
): Promise<InvoiceSendResponse> {
  const invoiceHTML = generateInvoiceHTML(invoice)
  const teamNotificationHTML = generateTeamNotificationHTML(invoice)
  const emailsToSend = teamEmails && teamEmails.length > 0 ? teamEmails : DEFAULT_TEAM_EMAILS

  try {
    // Send to client
    const clientResult = await sendEmailViaResend(
      invoice.client.email,
      `Your Invoice ${invoice.invoiceNumber} - OXIC International`,
      invoiceHTML,
      emailsToSend[0] || "Info@oxicinternational.co.ke"
    )

    if (!clientResult.success) {
      console.warn(`[v0] Failed to send invoice to client ${invoice.client.email}`)
    }

    // Send to team members (parallel)
    const teamResults = await Promise.all(
      emailsToSend.map((email) =>
        sendEmailViaResend(
          email,
          `Invoice Sent: ${invoice.invoiceNumber} - ${invoice.client.name}`,
          teamNotificationHTML,
          invoice.client.email
        )
      )
    )

    const teamEmailsSent = teamResults.filter((r) => r.success).length
    const totalSuccess = clientResult.success && teamEmailsSent >= 1

    const response: InvoiceSendResponse = {
      success: totalSuccess,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientEmailSent: clientResult.success,
      teamEmailsSent,
      message: generateResponseMessage(clientResult.success, teamEmailsSent, emailsToSend.length),
      errors: [
        clientResult.error ? `Client email: ${clientResult.error}` : "",
        ...teamResults
          .filter((r) => !r.success)
          .map((r) => `Team email (${r.recipient}): ${r.error}`),
      ].filter(Boolean),
    }

    // Log summary
    console.log("[v0] Invoice distribution complete:", {
      invoiceNumber: invoice.invoiceNumber,
      clientEmailSent: clientResult.success,
      teamEmailsSent,
      totalTeamEmails: emailsToSend.length,
    })

    return response
  } catch (error) {
    console.error("[v0] Invoice sending error:", error)
    return {
      success: false,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientEmailSent: false,
      teamEmailsSent: 0,
      message: "An error occurred while sending the invoice",
      errors: [String(error)],
    }
  }
}

/**
 * Generate appropriate response message based on delivery status
 */
function generateResponseMessage(
  clientEmailSent: boolean,
  teamEmailsSent: number,
  totalTeamEmails: number
): string {
  if (clientEmailSent && teamEmailsSent === totalTeamEmails) {
    return "Invoice successfully sent to client and all team members"
  } else if (clientEmailSent && teamEmailsSent > 0) {
    return `Invoice sent to client and ${teamEmailsSent} of ${totalTeamEmails} team members`
  } else if (clientEmailSent) {
    return "Invoice sent to client. Team notification pending"
  } else if (teamEmailsSent > 0) {
    return "Invoice recorded and team notified. Client email delivery pending"
  } else {
    return "Invoice processed with partial delivery. Please verify email configuration"
  }
}
