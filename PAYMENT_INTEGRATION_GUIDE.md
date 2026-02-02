# Payment Integration Guide - The Oxic International Group

## Overview

This document provides comprehensive technical specifications for all payment methods integrated into the Oxic International Group investment platform.

---

## 1. Cryptocurrency Payments (Binance Pay & Direct Wallet)

### 1.1 Binance Pay Integration

**Status:** Production Ready  
**Priority:** PRIMARY PAYMENT METHOD  
**Processor:** Binance Global  

#### Setup Requirements

1. **Binance Pay Merchant Account**
   - Visit: https://www.binance.com/en/pay
   - Register business account
   - Complete KYC verification
   - Generate API credentials

2. **Environment Variables**
   \`\`\`
   BINANCE_PAY_MERCHANT_ID=your_merchant_id
   BINANCE_PAY_API_KEY=your_api_key
   BINANCE_PAY_API_SECRET=your_api_secret
   \`\`\`

#### Supported Currencies & Cryptocurrencies

- **Fiat:** USD, EUR, GBP, KES
- **Crypto:** BTC, ETH, BNB, BUSD, USDT, USDC, XRP

#### Transaction Flow

1. User selects "Cryptocurrency" payment method
2. Clicks "Pay with Binance Pay" button
3. Redirected to Binance Pay checkout
4. User completes payment in their preferred crypto
5. Webhook callback confirms transaction
6. Invoice/receipt issued

#### API Endpoints

**Create Order:**
\`\`\`
POST https://api.binance.com/api/v3/bpay/order
Headers:
  - BPay-Api-Key: {API_KEY}
  - BPay-Nonce: {UNIX_TIMESTAMP}
  - BPay-Signature: {HMAC_SHA256}

Body:
{
  "merchantId": "1234567890",
  "merchantTradeNo": "OXIC202601150001",
  "orderId": "OXIC-invoice-12345",
  "totalFee": "100.00",
  "currency": "USD",
  "goods": {
    "goodsType": "02",
    "goodsCategory": "Z000",
    "reference": "Investment Advisory Services"
  },
  "buyer": {
    "buyerEmail": "investor@example.com",
    "buyerName": "John Doe"
  },
  "feeType": "MERCHANT_BEARS_FEE",
  "returnUrl": "https://oxicinternational.co.ke/payment/success",
  "cancelUrl": "https://oxicinternational.co.ke/payment/cancel",
  "webhookUrl": "https://oxicinternational.co.ke/api/webhooks/binance"
}
\`\`\`

**Response:**
\`\`\`json
{
  "code": "000000",
  "message": "success",
  "data": {
    "checkoutUrl": "https://pay.binance.com/bpay/order?key=...",
    "orderId": "OXIC-invoice-12345",
    "status": "PENDING"
  }
}
\`\`\`

#### Webhook Configuration

**Endpoint:** `POST /api/webhooks/binance`

**Expected Payload:**
\`\`\`json
{
  "merchantId": "1234567890",
  "orderId": "OXIC-invoice-12345",
  "merchantTradeNo": "OXIC202601150001",
  "txnId": "1234567890abcdef",
  "txnTime": 1705329600000,
  "totalFee": "100.00",
  "currency": "USD",
  "cryptoCurrency": "BTC",
  "receivedAmount": "0.00123456",
  "status": "SUCCESS",
  "paymentMethod": "CRYPTO",
  "signature": "..."
}
\`\`\`

**Verification:**
\`\`\`typescript
import crypto from 'crypto'

function verifyBinanceSignature(payload: string, signature: string, apiSecret: string): boolean {
  const hash = crypto
    .createHmac('sha256', apiSecret)
    .update(payload)
    .digest('hex')
  return hash === signature
}
\`\`\`

---

### 1.2 Direct Wallet Transfers

**Supported Wallets:**
- Bitcoin: Legacy (P2PKH), SegWit (P2WPKH), Bech32
- Ethereum: ERC-20 compatible wallets
- Binance Chain: BEP-20 compatible wallets

#### Wallet Addresses

| Crypto | Address |
|--------|---------|
| BTC | `1A1z7agoat7SfLcNQUok7XJRZJ72gYXxqM` |
| ETH/ERC-20 | `0x742d35Cc6634C0532925a3b844Bc7e7595f8c1f` |
| BNB/BEP-20 | `0x742d35Cc6634C0532925a3b844Bc7e7595f8c1f` |

#### Confirmation Process

1. User sends crypto to provided address
2. User confirms via WhatsApp with transaction ID
3. Backend verifies transaction on blockchain
4. Minimum confirmations:
   - Bitcoin: 3 confirmations (~30 minutes)
   - Ethereum: 12 confirmations (~5 minutes)
   - BNB: 20 confirmations (~1 minute)

#### Implementation Example

\`\`\`typescript
// Verify Bitcoin transaction
async function verifyBitcoinTransaction(txid: string, expectedAmount: number) {
  const response = await fetch(`https://blockchain.info/rawtx/${txid}?format=json`)
  const tx = await response.json()
  
  const confirmations = tx.block_height ? getCurrentBlockHeight() - tx.block_height : 0
  const amountReceived = tx.out
    .filter(output => output.addr === BITCOIN_ADDRESS)
    .reduce((sum, output) => sum + output.value / 100000000, 0)
  
  return {
    confirmed: confirmations >= 3,
    amount: amountReceived,
    confirmations,
    isValid: amountReceived >= expectedAmount
  }
}
\`\`\`

---

## 2. M-Pesa Mobile Money

### 2.1 Configuration

**API Provider:** Safaricom Daraja  
**Environment Variables:**
\`\`\`
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=522522
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://oxicinternational.co.ke/api/mpesa/callback
\`\`\`

### 2.2 STK Push Flow

1. User enters phone number and amount
2. Backend initiates STK push request
3. User receives prompt on phone
4. User enters M-Pesa PIN
5. Payment confirmed via webhook

#### API Endpoint

**File:** `/app/api/mpesa/route.ts`

\`\`\`typescript
POST /api/mpesa
Content-Type: application/json

{
  "phoneNumber": "254712345678",
  "amount": 1000,
  "accountReference": "OxicGroup",
  "transactionDesc": "Investment Payment"
}
\`\`\`

### 2.3 Callback Handling

**Webhook:** `/api/mpesa/callback`

Processes real-time payment confirmations and updates invoice status.

---

## 3. Card Payments (Stripe)

### 3.1 Configuration

**Status:** Production Ready  
**Provider:** Stripe  
**Currencies:** USD, KES (via DynamicCurrency Conversion)

**Environment Variables:**
\`\`\`
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
\`\`\`

### 3.2 Checkout Flow

**File:** `/app/api/stripe/checkout/route.ts`

\`\`\`typescript
POST /api/stripe/checkout
Content-Type: application/json

{
  "amount": 100,
  "currency": "usd",
  "description": "Investment Advisory Services",
  "customerEmail": "investor@example.com",
  "customerName": "John Doe"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "url": "https://checkout.stripe.com/pay/cs_..."
}
\`\`\`

### 3.3 Webhook Handling

**Endpoint:** `/api/webhooks/stripe`

Monitors payment intent events:
- `payment_intent.succeeded` - Payment completed
- `payment_intent.payment_failed` - Payment failed
- `charge.dispute.created` - Chargeback initiated

---

## 4. Bank Transfers

### 4.1 Account Details

| Field | Value |
|-------|-------|
| Bank | KCB BANK (K) LIMITED |
| Account Name | THE OXIC INTERNATIONAL GROUP LIMITED |
| Account Number | 1316115194 |
| SWIFT Code | KCBLKENX |
| Branch | Nairobi Main |
| Currency | KES/USD |

### 4.2 International Wire Transfer

**IBAN Format:** `KE95KCBL0000000001316115194`

**Correspondent Banks:**
- For USD transfers: Chase Bank (Swift: CHASUS33)
- For EUR transfers: Deutsche Bank (Swift: DEUTDEDD)

### 4.3 Confirmation Process

1. User initiates bank transfer
2. Sends payment proof/receipt via email
3. Manual verification (1-2 business days)
4. Invoice marked as "Paid"

---

## 5. Institutional Invoicing

### 5.1 Invoice Generation

**File:** `/app/api/send-email/route.ts`

\`\`\`json
{
  "type": "invoice",
  "data": {
    "companyName": "Global Investments Ltd",
    "companyAddress": "123 Main St, London",
    "contactPerson": "Jane Smith",
    "email": "jane@globalinv.com",
    "amount": "50000",
    "currency": "USD",
    "description": "Investment Advisory Services - Q1 2026",
    "invoiceNumber": "OXIC-202601-0001"
  }
}
\`\`\`

### 5.2 Invoice Elements

- Professional branding and letterhead
- Payment terms (Net-30)
- Line items and descriptions
- Tax information (if applicable)
- All bank details included
- Due date calculation

---

## 6. Security & Compliance

### 6.1 PCI-DSS Compliance

- No card data stored on servers
- All transactions via tokenized payments
- SSL/TLS encryption for all transfers
- Regular security audits

### 6.2 Fraud Prevention

- 3D Secure enabled for Stripe
- Amount limits enforced:
  - M-Pesa: KES 1 - 150,000 per transaction
  - Card: $1 - $10,000 per transaction
- Rate limiting on API endpoints
- Webhook signature verification

### 6.3 Transaction Logging

All transactions logged with:
- Timestamp (ISO 8601)
- Transaction ID
- Amount and currency
- Customer identifier (hashed)
- Status and result
- Payment method used

---

## 7. Testing

### 7.1 Sandbox Credentials

**Stripe Test Keys:**
\`\`\`
pk_test_51234567890abcdef
sk_test_123456789ABCDEFGH
\`\`\`

**Binance Pay Test:**
\`\`\`
Environment: testnet
Merchant ID: TEST_MERCHANT_12345
\`\`\`

**M-Pesa Sandbox:**
\`\`\`
Consumer Key: sandbox_key
Consumer Secret: sandbox_secret
\`\`\`

### 7.2 Test Transactions

| Method | Test Amount | Expected Result |
|--------|------------|-----------------|
| Stripe | $0.50 | Automatic success |
| M-Pesa | KES 1 | STK push sent |
| Crypto | Any | Manual verification |

---

## 8. Error Handling

### Common Error Codes

| Code | Meaning | Resolution |
|------|---------|-----------|
| `INVALID_PHONE` | M-Pesa number format error | Ensure 10-digit format |
| `AMOUNT_EXCEEDED` | Over transaction limit | Reduce amount |
| `PAYMENT_TIMEOUT` | Payment pending >30min | Retry or contact support |
| `INVALID_EMAIL` | Email verification failed | Check email format |

---

## 9. Customer Support

**Contact Methods:**
- Email: info@oxicinternational.co.ke
- WhatsApp: +254 748 992 777
- Available: 24/7 for urgent issues

---

## 10. Maintenance & Updates

**Last Updated:** January 15, 2026  
**Next Review:** April 15, 2026  
**API Versions:**
- Binance Pay: v3 (Latest)
- Stripe: 2025-10-16
- M-Pesa: v1 (Stable)
