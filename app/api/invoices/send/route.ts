/**
 * Invoice Generation and Send API Endpoint
 * POST /api/invoices/send
 * 
 * Handles professional invoice generation and email distribution
 * Sends to client and internal team with redundancy
 */

import { NextRequest, NextResponse } from "next/server"
import { InvoiceSendRequest, InvoiceSendResponse } from "@/lib/invoice-types"
import { createInvoice, sendInvoice, generateInvoiceNumber } from "@/lib/invoice-service"

/**
 * Validate invoice request payload
 */
function validateInvoiceRequest(body: any): { valid: boolean; error?: string } {
  // Validate client
  if (!body.client) {
    return { valid: false, error: "Client information is required" }
  }
  if (!body.client.name || !body.client.email) {
    return { valid: false, error: "Client name and email are required" }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.client.email)) {
    return { valid: false, error: "Invalid client email format" }
  }

  // Validate line items
  if (!body.lineItems || !Array.isArray(body.lineItems) || body.lineItems.length === 0) {
    return { valid: false, error: "At least one line item is required" }
  }

  for (const item of body.lineItems) {
    if (!item.description || typeof item.quantity !== "number" || typeof item.unitPrice !== "number") {
      return { valid: false, error: "Invalid line item format" }
    }
    if (item.quantity <= 0 || item.unitPrice < 0) {
      return { valid: false, error: "Line item quantities must be positive" }
    }
  }

  // Validate invoice details
  if (!body.details) {
    return { valid: false, error: "Invoice details are required" }
  }
  if (!body.details.invoiceDate || !body.details.dueDate) {
    return { valid: false, error: "Invoice date and due date are required" }
  }
  if (!body.details.currency) {
    return { valid: false, error: "Currency is required" }
  }

  // Validate currency
  const validCurrencies = ["USD", "KES", "EUR"]
  if (!validCurrencies.includes(body.details.currency)) {
    return { valid: false, error: `Currency must be one of: ${validCurrencies.join(", ")}` }
  }

  // Validate tax rate if provided
  if (body.details.taxRate !== undefined && body.details.taxRate !== null) {
    if (typeof body.details.taxRate !== "number" || body.details.taxRate < 0 || body.details.taxRate > 100) {
      return { valid: false, error: "Tax rate must be between 0 and 100" }
    }
  }

  return { valid: true }
}

/**
 * Calculate line item totals
 */
function calculateLineItems(items: any[]) {
  return items.map((item) => ({
    id: `item_${Math.random().toString(36).substring(2, 9)}`,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: Number((item.quantity * item.unitPrice).toFixed(2)),
  }))
}

/**
 * POST handler for invoice generation and sending
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json() as InvoiceSendRequest

    // Validate request
    const validation = validateInvoiceRequest(body)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error,
        },
        { status: 400 }
      )
    }

    // Calculate line item totals
    const lineItems = calculateLineItems(body.lineItems)

    // Generate invoice number if not provided
    const invoiceNumber = body.details.invoiceNumber || generateInvoiceNumber()

    // Create invoice object
    const invoice = createInvoice(
      {
        ...body,
        lineItems,
      },
      invoiceNumber
    )

    // Log invoice creation
    console.log("[v0] Invoice created:", {
      invoiceNumber: invoice.invoiceNumber,
      client: invoice.client.name,
      total: invoice.total,
      currency: invoice.details.currency,
      timestamp: new Date().toISOString(),
    })

    // Send invoice
    const sendResult = await sendInvoice(invoice, body.teamEmails)

    // Update invoice status
    invoice.status = sendResult.clientEmailSent ? "sent" : "draft"
    invoice.sentAt = sendResult.clientEmailSent ? new Date().toISOString() : undefined
    invoice.updatedAt = new Date().toISOString()

    // Prepare response
    const response: InvoiceSendResponse = {
      ...sendResult,
      invoiceId: invoice.id,
    }

    // Return success response
    return NextResponse.json(
      {
        success: response.success,
        invoiceId: response.invoiceId,
        invoiceNumber: response.invoiceNumber,
        message: response.message,
        emailStatus: {
          clientEmailSent: response.clientEmailSent,
          teamEmailsSent: response.teamEmailsSent,
        },
        errors: response.errors && response.errors.length > 0 ? response.errors : undefined,
      },
      {
        status: response.success ? 200 : 207, // 207 Multi-Status for partial success
      }
    )
  } catch (error) {
    console.error("[v0] Invoice API error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing the invoice. Please try again.",
        error: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * GET handler to test API health
 */
export async function GET() {
  return NextResponse.json({
    status: "operational",
    service: "Invoice API",
    endpoints: {
      send: "POST /api/invoices/send",
    },
    documentation: "Send invoice via POST with client, lineItems, and details",
  })
}
