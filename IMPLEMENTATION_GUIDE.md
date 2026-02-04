# Oxic International - Production Implementation Guide

## Project Overview

Oxic International is a secure M-Pesa payment gateway and investment advisory platform serving Kenya and East Africa. This guide covers the complete implementation from sandbox testing to production deployment.

## Architecture Overview

### Core Systems

1. **Payment Processing System**
   - M-Pesa STK Push integration with Safaricom API
   - Professional transaction ID generation (OXIC-YYYYMMDD-XXXXXXXX-XXXX)
   - Real-time STK push delivery and user PIN entry
   - Callback handling for payment confirmation

2. **Transaction Management**
   - In-memory transaction tracking (production: database-backed)
   - Audit trail with full transaction history
   - Status tracking: INITIATED → WAITING → COMPLETED/FAILED
   - Export functionality for invoices and reconciliation

3. **Security System**
   - Rate limiting (5 requests/minute per IP)
   - Origin validation for CORS
   - Request parameter validation
   - Suspicious activity detection and logging
   - Security headers and CSP implementation

4. **Email Notification System**
   - HTML email templates with professional branding
   - SendGrid integration for reliable delivery
   - Invoice generation and PDF support (future)
   - Payment confirmation notifications

5. **SEO & Performance**
   - Optimized metadata and Open Graph tags
   - Core Web Vitals optimization
   - Mobile-first responsive design
   - DNS prefetch and resource optimization

## File Structure

```
/
├── app/
│   ├── layout.tsx                 # Root layout with SEO metadata
│   ├── globals.css                # Tailwind CSS configuration
│   └── api/
│       ├── mpesa/
│       │   ├── route.ts          # Main payment API endpoint
│       │   └── callback/
│       │       └── route.ts      # M-Pesa callback handler
│       └── diagnostic/
│           └── route.ts          # M-Pesa credentials testing
│
├── components/
│   └── payment-methods-section.tsx # UI for all payment methods
│
├── lib/
│   ├── mpesa.ts                  # M-Pesa API client
│   ├── transaction-manager.ts    # Transaction tracking
│   ├── email-service.ts          # Email notifications
│   └── security.ts               # Security utilities
│
├── middleware.ts                  # Global security headers
├── .env.example                   # Environment variable template
├── .env.local                     # (git-ignored) Local development
│
├── MPESA_PRODUCTION_SETUP.md      # Production requirements
├── SECURITY_BEST_PRACTICES.md     # Security guidelines
├── SEO_OPTIMIZATION_GUIDE.md      # SEO implementation
├── MPESA_PASSKEY_REQUIRED_FIX.md  # Passkey debugging guide
└── IMPLEMENTATION_GUIDE.md        # This file
```

## Step-by-Step Implementation

### Phase 1: Sandbox Testing (Current)

#### 1.1 Get Sandbox Credentials
```bash
# From https://developer.safaricom.co.ke
MPESA_CONSUMER_KEY=your_sandbox_consumer_key
MPESA_CONSUMER_SECRET=your_sandbox_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9ba9b9d4777000d3839bc10d0
MPESA_ENV=sandbox
MPESA_CALLBACK_URL=https://YOUR_NETLIFY_DOMAIN/api/mpesa/callback
```

#### 1.2 Configure Environment
1. Go to Netlify → Site Settings → Build & Deploy → Environment
2. Add the above variables
3. Trigger redeploy

#### 1.3 Test Payment Flow
```bash
curl -X POST https://YOUR_SITE/api/mpesa \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0712046110",
    "amount": 50000,
    "accountReference": "TEST",
    "transactionDesc": "Test Payment"
  }'

# Expected response:
{
  "success": true,
  "message": "STK push sent. Please enter M-Pesa PIN on your phone.",
  "transactionId": "OXIC-20260204-a7f2b3c1-5d8e",
  "checkoutRequestID": "..."
}
```

#### 1.4 Verify Callback
1. Check browser console for logs
2. Monitor Netlify function logs
3. Verify transaction record created
4. Check email delivery (if configured)

### Phase 2: Production Preparation

#### 2.1 Get Production Credentials
Contact Safaricom:
- Register business account at https://developer.safaricom.co.ke
- Complete KYC verification
- Request production credentials
- Get real Paybill/Shortcode
- Receive production Lipa Na M-Pesa Passkey

#### 2.2 Database Setup
See `/MPESA_PRODUCTION_SETUP.md` for schema

```sql
-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  merchant_request_id VARCHAR(255) UNIQUE,
  checkout_request_id VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20),
  amount DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP
  -- ... see schema in MPESA_PRODUCTION_SETUP.md
);

-- Create payment confirmations table
CREATE TABLE payment_confirmations (
  id UUID PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id),
  result_code VARCHAR(10),
  result_desc TEXT,
  mpesa_receipt_number VARCHAR(50)
  -- ... see schema in MPESA_PRODUCTION_SETUP.md
);

-- Create invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id),
  customer_email VARCHAR(255),
  invoice_number VARCHAR(50)
  -- ... see schema in MPESA_PRODUCTION_SETUP.md
);
```

#### 2.3 Email Configuration
1. Set up SendGrid account: https://sendgrid.com
2. Verify sender domain
3. Get API key
4. Add to Netlify environment

#### 2.4 SSL Certificate
- Verify Netlify provides automatic SSL
- Test HTTPS connection: https://oxicinternational.co.ke
- Confirm certificate is valid (not self-signed)

#### 2.5 Production Checklist
See `/MPESA_PRODUCTION_SETUP.md` section 12 for complete checklist

### Phase 3: Production Deployment

#### 3.1 Update Environment Variables (Netlify)
```
MPESA_ENV=production
MPESA_CONSUMER_KEY=production_consumer_key
MPESA_CONSUMER_SECRET=production_consumer_secret
MPESA_SHORTCODE=your_paybill_shortcode
MPESA_PASSKEY=production_passkey
MPESA_CALLBACK_URL=https://oxicinternational.co.ke/api/mpesa/callback

DATABASE_URL=production_database_url
SENDGRID_API_KEY=sendgrid_api_key
INVOICE_EMAIL_FROM=invoices@oxicinternational.co.ke
INVOICE_EMAIL_REPLY_TO=support@oxicinternational.co.ke
```

#### 3.2 Deploy Code
```bash
# Push to GitHub/Netlify
git add .
git commit -m "Production deployment: M-Pesa, security, SEO"
git push origin main

# Or deploy directly from Netlify UI
# Site → Deploys → Trigger deploy
```

#### 3.3 Post-Deployment Testing
```bash
# Test 1: Small transaction (KES 10)
curl -X POST https://oxicinternational.co.ke/api/mpesa \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0712046110",
    "amount": 10,
    "accountReference": "PROD-TEST-1",
    "transactionDesc": "Production Test"
  }'

# Expected: STK push to phone

# Test 2: Check callback
# Monitor logs to verify callback received

# Test 3: Verify email
# Check if invoice email arrives

# Test 4: Check database
# Verify transaction recorded in database

# Test 5: Monitor for 24 hours
# Check daily transaction volume
# Monitor error rates
# Verify email delivery
```

#### 3.4 Monitor & Alert
Set up monitoring:
1. Sentry for error tracking
2. Datadog or similar for performance
3. Google Analytics for user behavior
4. Custom Netlify logs monitoring

### Phase 4: Scale & Optimize

#### 4.1 Performance Optimization
- Monitor Lighthouse scores
- Optimize images with next/image
- Implement caching strategies
- Monitor Core Web Vitals
- A/B test payment UI

#### 4.2 User Growth
- Implement analytics
- Track conversion rates
- Monitor payment success rates
- Collect user feedback
- Plan feature updates

#### 4.3 Financial
- Reconcile M-Pesa statements daily
- Generate reports
- Monitor transaction fees
- Plan for scale
- Review compliance

#### 4.4 Security Reviews
- Monthly security audits
- Penetration testing
- Access log review
- Incident response practice
- Team security training

## Key Integration Points

### 1. M-Pesa API Endpoints

#### OAuth Token Generation
```
POST https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
Authorization: Basic [base64(consumer_key:consumer_secret)]
```

#### STK Push Request
```
POST https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest
Authorization: Bearer [access_token]
{
  "BusinessShortCode": "shortcode",
  "Password": "base64(shortcode+passkey+timestamp)",
  "Timestamp": "YYYYMMDDHHMMSS",
  "TransactionType": "CustomerPayBillOnline",
  "Amount": 50000,
  "PartyA": "254712046110",
  "PartyB": "shortcode",
  "PhoneNumber": "254712046110",
  "CallBackURL": "https://oxicinternational.co.ke/api/mpesa/callback",
  "AccountReference": "OXIC",
  "TransactionDesc": "Payment"
}
```

#### M-Pesa Callback (to your server)
```
POST https://oxicinternational.co.ke/api/mpesa/callback
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "...",
      "CheckoutRequestID": "...",
      "ResultCode": 0,
      "ResultDesc": "The service request has been processed successfully.",
      "CallbackMetadata": {
        "Item": [
          {"Name": "Amount", "Value": 50000},
          {"Name": "MpesaReceiptNumber", "Value": "PJL41..."},
          {"Name": "PhoneNumber", "Value": "254712046110"}
        ]
      }
    }
  }
}
```

### 2. SendGrid Email Integration

```typescript
import emailService from "@/lib/email-service"

const sent = await emailService.sendInvoice({
  transactionId: "OXIC-20260204-a7f2b3c1-5d8e",
  customerEmail: "user@example.com",
  customerName: "John Doe",
  customerPhone: "0712046110",
  amount: 50000,
  date: new Date(),
  accountReference: "OXIC",
  description: "Investment Payment",
  paymentMethod: "M-Pesa",
  mpesaReceiptNumber: "PJL41...",
})
```

### 3. Transaction Manager Integration

```typescript
import transactionManager from "@/lib/transaction-manager"

// Create transaction
const tx = transactionManager.createTransaction(
  merchantRequestId,
  checkoutRequestId,
  "0712046110",
  50000,
  "OXIC",
  "Payment"
)

// Update status
transactionManager.updateTransactionStatus(
  tx.transactionId,
  "COMPLETED",
  "0",
  "Success"
)

// Get transaction
const transaction = transactionManager.getTransaction("OXIC-20260204-a7f2b3c1-5d8e")

// Export for invoice
const invoice = transactionManager.exportTransactionForInvoice(tx.transactionId)
```

### 4. Security Validation

```typescript
import {
  rateLimiter,
  getClientIp,
  validatePaymentRequest,
  detectSuspiciousActivity,
} from "@/lib/security"

// Check rate limit
if (rateLimiter.isLimited(clientIp)) {
  return 429 // Too Many Requests
}

// Validate request
const validation = validatePaymentRequest(body)
if (!validation.isValid) {
  return { error: validation.error }
}

// Detect suspicious activity
const suspicion = detectSuspiciousActivity(phoneNumber, amount, clientIp)
if (suspicion.isSuspicious) {
  // Log and potentially block
}
```

## API Reference

### Payment Endpoint: POST /api/mpesa

**Request:**
```json
{
  "phoneNumber": "0712046110",
  "amount": 50000,
  "accountReference": "OXIC",
  "transactionDesc": "Payment",
  "customerEmail": "user@example.com",
  "customerName": "John Doe"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "STK push sent...",
  "transactionId": "OXIC-20260204-a7f2b3c1-5d8e",
  "checkoutRequestID": "...",
  "merchantRequestID": "..."
}
```

**Error Responses:**
- 400: Invalid request parameters
- 429: Rate limit exceeded
- 503: M-Pesa credentials not configured
- 500: Server error

### Callback Endpoint: POST /api/mpesa/callback

Handles M-Pesa payment confirmations. Automatically:
- Verifies callback format
- Updates transaction status
- Sends confirmation email
- Stores receipt number

## Monitoring & Logging

### Log Levels

```
[v0] DEBUG: Detailed debugging information
[v0] INFO: General information (normal operations)
[v0] WARN: Warning messages (non-critical issues)
[v0] ERROR: Error messages (failures)
[v0] SECURITY: Security-related events
```

### Key Logs to Monitor

```
[v0] M-Pesa: OAuth token obtained
[v0] M-Pesa: STK Push successful
[v0] Transaction created: OXIC-20260204-...
[v0] SECURITY: RATE_LIMIT_EXCEEDED
[v0] SECURITY: INVALID_ORIGIN
[v0] Invoice email sent successfully
```

### Performance Metrics

- Payment success rate (target: 95%+)
- Average response time (target: < 2 seconds)
- Email delivery rate (target: 99%+)
- Uptime (target: 99.9%+)

## Troubleshooting

### Common Issues

1. **"Wrong credentials" error**
   - Verify MPESA_PASSKEY is set
   - Check MPESA_PASSKEY format (32 chars)
   - Ensure all credentials are for same environment

2. **STK push not appearing on phone**
   - Verify phone number format (0712046110 or +254712046110)
   - Check amount is between 1-150,000 KES
   - Verify callback URL is HTTPS and accessible
   - Check M-Pesa account has sufficient balance

3. **Callback not received**
   - Ensure callback URL is HTTPS
   - Verify firewall allows incoming requests
   - Check Netlify function logs
   - Verify M-Pesa can reach your domain

4. **Rate limiting too strict**
   - Whitelist trusted IPs in /lib/security.ts
   - Adjust rate limit: currently 5 requests/minute
   - Check if legitimate traffic spike

5. **Emails not sending**
   - Verify SendGrid API key is set
   - Check sender domain verification
   - Review SendGrid logs
   - Test SENDGRID_API_KEY directly

## Support & Resources

- Safaricom Developer Docs: https://developer.safaricom.co.ke
- M-Pesa API Documentation: https://developer.safaricom.co.ke/docs
- SendGrid Documentation: https://docs.sendgrid.com
- OWASP Security Guide: https://owasp.org
- Next.js Documentation: https://nextjs.org/docs

## Compliance & Legal

- Kenya Data Protection Act compliance
- PCI DSS principles adherence
- Terms & Conditions (to be created)
- Privacy Policy (update with payment handling)
- Refund Policy (document process)
- SLA Agreement (99.9% uptime commitment)

## Contact & Support

For issues or questions:
- Email: support@oxicinternational.co.ke
- Support Portal: https://oxicinternational.co.ke/support
- Incident Hotline: [Phone number]
