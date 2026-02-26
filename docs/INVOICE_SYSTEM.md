# Professional Invoice System Documentation

## Overview

The invoice system provides professional invoice generation and automated email distribution to clients and internal team members. Built with Resend API for reliable email delivery and retry logic for fault tolerance.

## Features

- **Professional HTML Templates**: Branded invoice designs with company information
- **Dual Email Distribution**: Sends to client and multiple team members independently
- **Automatic Retry Logic**: Ensures delivery with intelligent retry mechanisms
- **Client Auto-Reply**: Optional auto-reply templates for client confirmation
- **Tax Calculation**: Automatic tax calculation based on rates
- **Currency Support**: USD, KES, EUR with proper formatting
- **Unique Invoice Tracking**: Each invoice gets a unique ID and reference number
- **Detailed Logging**: Comprehensive audit trail for all operations

## Setup

### Prerequisites

1. **Resend API Key**: Configure `RESEND_API_KEY` in environment variables
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
   ```

2. **Email Configuration**: Invoices send from `invoices@oxicinternational.co.ke`

### Default Team Emails

Invoices are automatically sent to both team addresses:
- `oxicgroupltd@gmail.com`
- `Info@oxicinternational.co.ke`

If one fails, the system retries with automatic fallback.

## API Endpoint

### POST /api/invoices/send

Generates and sends a professional invoice to client and team.

#### Request Body

```json
{
  "client": {
    "name": "Client Company Name",
    "email": "contact@client.com",
    "phone": "+254748992777",
    "organization": "Client Organization",
    "address": "123 Main Street",
    "city": "Nairobi",
    "country": "Kenya",
    "taxId": "PIN/00000000"
  },
  "lineItems": [
    {
      "description": "Professional Services - Q1 2026",
      "quantity": 1,
      "unitPrice": 50000
    },
    {
      "description": "Technical Support",
      "quantity": 10,
      "unitPrice": 5000
    }
  ],
  "details": {
    "invoiceDate": "2026-02-26",
    "dueDate": "2026-03-26",
    "currency": "KES",
    "taxRate": 16,
    "paymentTerms": "Net 30 - Please remit payment by due date",
    "notes": "Thank you for your business. For inquiries, contact our finance team."
  },
  "teamEmails": [
    "oxicgroupltd@gmail.com",
    "Info@oxicinternational.co.ke"
  ]
}
```

#### Request Fields

##### client (Required)
- `name` (string, required): Client contact name
- `email` (string, required): Client email address
- `phone` (string, optional): Client phone number
- `organization` (string, optional): Client organization name
- `address` (string, optional): Client street address
- `city` (string, optional): Client city
- `country` (string, optional): Client country
- `taxId` (string, optional): Client tax ID or PIN

##### lineItems (Required)
Array of invoice items. Each item must include:
- `description` (string, required): Item description
- `quantity` (number, required): Quantity (must be positive)
- `unitPrice` (number, required): Price per unit

##### details (Required)
Invoice metadata:
- `invoiceDate` (string, required): ISO date format (YYYY-MM-DD)
- `dueDate` (string, required): ISO date format (YYYY-MM-DD)
- `currency` (string, required): USD, KES, or EUR
- `taxRate` (number, optional): Tax percentage (0-100)
- `paymentTerms` (string, optional): Payment terms description
- `notes` (string, optional): Additional notes or thank you message
- `invoiceNumber` (string, optional): Custom invoice number (auto-generated if not provided)

##### teamEmails (Optional)
Array of email addresses for team notification. Defaults to company addresses if not provided.

#### Response

##### Success Response (200)
```json
{
  "success": true,
  "invoiceId": "invoice_1708950123456_abc1234",
  "invoiceNumber": "INV-2026-123456-ABC1234",
  "message": "Invoice successfully sent to client and all team members",
  "emailStatus": {
    "clientEmailSent": true,
    "teamEmailsSent": 2
  }
}
```

##### Partial Success Response (207)
```json
{
  "success": false,
  "invoiceId": "invoice_1708950123456_abc1234",
  "invoiceNumber": "INV-2026-123456-ABC1234",
  "message": "Invoice sent to client and 1 of 2 team members",
  "emailStatus": {
    "clientEmailSent": true,
    "teamEmailsSent": 1
  },
  "errors": [
    "Team email (backup@example.com): API Error: Invalid recipient"
  ]
}
```

##### Error Response (400/500)
```json
{
  "success": false,
  "message": "Client name and email are required"
}
```

## Usage Examples

### Server-Side (Node.js)

```typescript
import { createInvoice, sendInvoice } from "@/lib/invoice-service"
import { InvoiceSendRequest } from "@/lib/invoice-types"

async function createAndSendInvoice() {
  const invoiceRequest: InvoiceSendRequest = {
    client: {
      name: "Acme Corporation",
      email: "billing@acme.com",
      organization: "Acme Corporation Ltd",
      phone: "+254700000000",
      address: "100 Business Park",
      city: "Nairobi",
      country: "Kenya",
    },
    lineItems: [
      {
        description: "Investment Advisory Services",
        quantity: 1,
        unitPrice: 150000,
      },
      {
        description: "Portfolio Management Fee",
        quantity: 1,
        unitPrice: 50000,
      },
    ],
    details: {
      invoiceDate: "2026-02-26",
      dueDate: "2026-03-28",
      currency: "KES",
      taxRate: 16,
      paymentTerms: "Net 30 - Payment due by due date",
      notes: "Thank you for partnering with OXIC International Group",
    },
  }

  // Create invoice object
  const invoice = createInvoice(invoiceRequest)

  // Send invoice
  const result = await sendInvoice(invoice)

  console.log("Invoice sent:", result)
  return result
}
```

### Client-Side (React)

```typescript
"use client"

import { useState } from "react"
import { useInvoice } from "@/lib/use-invoice"
import { InvoiceSendRequest } from "@/lib/invoice-types"

export function InvoiceForm() {
  const { loading, error, success, sendInvoice } = useInvoice()

  const handleGenerateInvoice = async () => {
    const invoiceRequest: InvoiceSendRequest = {
      client: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+254700000000",
        organization: "Doe Enterprises",
      },
      lineItems: [
        {
          description: "Professional Consultation",
          quantity: 20,
          unitPrice: 5000,
        },
        {
          description: "Implementation Services",
          quantity: 1,
          unitPrice: 100000,
        },
      ],
      details: {
        invoiceDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        currency: "KES",
        taxRate: 16,
        paymentTerms: "Net 30 days",
        notes: "Thank you for your business",
      },
    }

    const result = await sendInvoice(invoiceRequest)

    if (result?.success) {
      console.log("Invoice sent successfully:", result.invoiceNumber)
      // Show success toast
    } else {
      console.error("Failed to send invoice:", error)
      // Show error toast
    }
  }

  return (
    <div>
      <button onClick={handleGenerateInvoice} disabled={loading}>
        {loading ? "Generating Invoice..." : "Send Invoice"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Invoice sent successfully!</p>}
    </div>
  )
}
```

### Direct Fetch Request

```bash
curl -X POST http://localhost:3000/api/invoices/send \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
      "name": "Test Client",
      "email": "test@example.com",
      "organization": "Test Organization"
    },
    "lineItems": [
      {
        "description": "Service",
        "quantity": 1,
        "unitPrice": 10000
      }
    ],
    "details": {
      "invoiceDate": "2026-02-26",
      "dueDate": "2026-03-26",
      "currency": "KES",
      "taxRate": 16
    }
  }'
```

## Email Templates

### Client Invoice Email
- Professional branded design with OXIC branding
- Complete invoice details including line items
- Client and company information
- Payment status and due date highlighted
- Reply button for easy communication

### Team Notification Email
- Concise summary of invoice sent
- Client information and contact details
- Invoice total and status
- Quick action items for team

## Error Handling

### Validation Errors

```json
{
  "success": false,
  "message": "Invalid client email format"
}
```

Common validation errors:
- Missing required fields (client, lineItems, details)
- Invalid email format
- Negative quantities or prices
- Invalid currency codes
- Tax rate outside 0-100 range

### Email Delivery Errors

The system implements automatic retry logic:
1. **Initial Attempt**: Send email
2. **Retry 1**: Wait 1 second, retry
3. **Retry 2**: Wait 2 seconds, retry

If all retries fail, the error is logged but partial success may still occur.

## Testing

### Test Endpoint

```bash
curl http://localhost:3000/api/invoices/send
```

Returns API health status and documentation.

### Test Invoice

Create a test invoice with your own details to verify:
1. Email configuration is correct
2. Templates render properly
3. Resend API key is valid
4. Email delivery is working

## Monitoring

### Logs

All invoice operations are logged with the prefix `[v0]`:
- Invoice creation
- Email delivery attempts and retries
- Failures and errors
- Delivery summaries

### Tracking

Each invoice includes:
- Unique invoice ID
- Invoice number with timestamp
- Client and amount
- Delivery status
- Sent timestamp

## Best Practices

1. **Always include client email**: Required for successful delivery
2. **Specify due date**: Clear payment expectations
3. **Include payment terms**: Reduces payment delays
4. **Add notes**: Personal touch improves client relations
5. **Use correct currency**: Avoid customer confusion
6. **Set appropriate tax rate**: Ensures accurate totals

## Troubleshooting

### "Email service not configured"
- Verify `RESEND_API_KEY` is set in environment variables
- Restart the application after adding the key

### "Invoice sent but client email failed"
- Check client email address for typos
- Verify email is not in spam filters
- Manual email copy can be resent from team dashboard

### "Team notification failed"
- Verify team email addresses are correct
- Check Resend API dashboard for account restrictions
- Ensure sending domain is verified in Resend

## Support

For issues or feature requests, contact the development team at `Info@oxicinternational.co.ke`.
