# Resend Email Service Integration

## Overview

The email service uses **Resend** for professional invoice and payment notification delivery. Resend is optimized for Next.js and Vercel deployments with excellent TypeScript support.

## Setup

### 1. Get Your Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to Settings → API Keys
4. Copy your API key

### 2. Add to Environment Variables

Add to your Netlify environment variables:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
```

Or to `.env.local` for local development:

```
RESEND_API_KEY=re_your_api_key_here
```

### 3. Verify Sender Domain (Production)

For production, Resend requires domain verification:

1. In Resend dashboard, add your domain: `oxicinternational.co.ke`
2. Add the DNS records provided
3. Once verified, you can send from `invoices@oxicinternational.co.ke`

For sandbox/testing, you can use the default `onboarding@resend.dev` domain.

## Features

### Professional Invoice Emails

Sends detailed payment invoices with:
- Invoice number and date
- Customer information
- Transaction details
- Amount breakdown
- Payment verification badge
- Professional branding

### Payment Notifications

Quick confirmation emails when payment is received:
- Payment amount confirmation
- Transaction ID reference
- Link to detailed invoice
- Support contact information

## Code Usage

```typescript
import emailService from "@/lib/email-service"

// Send invoice
const result = await emailService.sendInvoiceEmail({
  transactionId: "OXIC-20260204-ABC123XY",
  customerEmail: "customer@example.com",
  customerName: "John Doe",
  customerPhone: "0712345678",
  amount: 50000,
  date: new Date(),
  accountReference: "OxicGroup",
  description: "Investment Payment",
  paymentMethod: "M-Pesa",
})

// Send notification
const notif = await emailService.sendPaymentNotification(
  "customer@example.com",
  "John Doe",
  50000,
  "OXIC-20260204-ABC123XY"
)
```

## Error Handling

Service gracefully handles missing API key:
- Returns `success: false` with error message
- Logs warning to console
- Application continues without email notifications

## Resend vs Alternatives

**Why Resend?**
- Next.js native support
- Vercel integration
- Email tracking and analytics
- Transactional email optimized
- Generous free tier (100 emails/day)
- Production-ready reliability

## Cost

- **Free**: 100 emails/day
- **Paid**: $20/month for unlimited

## Support

For issues or questions about Resend:
- Documentation: https://resend.com/docs
- Support: https://resend.com/support
