/**
 * Invoice System Type Definitions
 * Defines all interfaces and types for professional invoice generation and management
 */

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface InvoiceClient {
  name: string
  email: string
  phone?: string
  organization?: string
  address?: string
  city?: string
  country?: string
  taxId?: string
}

export interface InvoiceDetails {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  paymentTerms?: string
  notes?: string
  currency: "USD" | "KES" | "EUR"
  taxRate?: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  client: InvoiceClient
  lineItems: InvoiceLineItem[]
  details: InvoiceDetails
  subtotal: number
  tax: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  createdAt: string
  updatedAt: string
  sentAt?: string
  paidAt?: string
}

export interface InvoiceSendRequest {
  client: InvoiceClient
  lineItems: InvoiceLineItem[]
  details: InvoiceDetails
  sendToTeam?: boolean
  teamEmails?: string[]
}

export interface InvoiceSendResponse {
  success: boolean
  invoiceId: string
  invoiceNumber: string
  clientEmailSent: boolean
  teamEmailsSent: number
  message: string
  errors?: string[]
}

export interface EmailDeliveryResult {
  recipient: string
  success: boolean
  emailId?: string
  error?: string
}
