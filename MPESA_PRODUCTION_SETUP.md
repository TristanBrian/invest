# M-Pesa Production Setup Guide

## Prerequisites for Production

### 1. Safaricom Business Account
- Register at https://developer.safaricom.co.ke
- Complete business verification
- Have active M-Pesa merchant account with Safaricom

### 2. Production Credentials (NOT Sandbox)
Get from Safaricom:
- **MPESA_CONSUMER_KEY**: OAuth credentials for production
- **MPESA_CONSUMER_SECRET**: OAuth secret for production
- **MPESA_SHORTCODE**: Your actual business paybill number (not 174379)
- **MPESA_PASSKEY**: Live Lipa Na M-Pesa Online passkey

### 3. Security Requirements

#### SSL/HTTPS Certificate
- Your domain MUST have valid SSL certificate
- `https://oxicinternational.co.ke/api/mpesa/callback` must be accessible via HTTPS
- Certificate must NOT be self-signed

#### API Security
- Never expose credentials in frontend code
- Use environment variables only on server-side
- Implement request signing where applicable

#### Network Security
- Whitelist Safaricom IP addresses in firewall if applicable
- All M-Pesa communications go through secured HTTPS only

### 4. Database Setup (for production)

You need to store:
- Transaction records (for reconciliation)
- Payment confirmations from M-Pesa callbacks
- Invoice records with customer details

#### Database Schema

\`\`\`sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_request_id VARCHAR(255) UNIQUE,
  checkout_request_id VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  account_reference VARCHAR(255),
  transaction_desc TEXT,
  status VARCHAR(50) DEFAULT 'INITIATED',
  response_code VARCHAR(10),
  response_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  callback_received_at TIMESTAMP,
  INDEX (phone_number),
  INDEX (merchant_request_id),
  INDEX (status)
);

CREATE TABLE payment_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  result_code VARCHAR(10),
  result_desc TEXT,
  amount DECIMAL(10, 2),
  mpesa_receipt_number VARCHAR(50) UNIQUE,
  balance_amount DECIMAL(10, 2),
  transaction_date TIMESTAMP,
  phone_number VARCHAR(20),
  received_at TIMESTAMP DEFAULT NOW(),
  INDEX (transaction_id),
  INDEX (mpesa_receipt_number)
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  invoice_number VARCHAR(50) UNIQUE,
  amount DECIMAL(10, 2),
  invoice_date TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'PENDING',
  INDEX (transaction_id),
  INDEX (customer_email)
);
\`\`\`

### 5. Netlify Environment Variables (Production)

Set these in Netlify → Site Settings → Build & Deploy → Environment:

\`\`\`
MPESA_ENV=production
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
MPESA_SHORTCODE=your_paybill_shortcode
MPESA_PASSKEY=your_production_passkey
MPESA_CALLBACK_URL=https://oxicinternational.co.ke/api/mpesa/callback

DATABASE_URL=your_database_connection_string
SENDGRID_API_KEY=your_sendgrid_key_for_emails
INVOICE_EMAIL_FROM=invoices@oxicinternational.co.ke
INVOICE_EMAIL_REPLY_TO=support@oxicinternational.co.ke
\`\`\`

### 6. Email Configuration

For sending invoices, set up:
- SendGrid account (free tier available)
- Email domain verification
- API key in environment variables

### 7. Callback URL Configuration

M-Pesa MUST be able to reach your callback endpoint:
- URL: `https://oxicinternational.co.ke/api/mpesa/callback`
- Method: POST
- Firewall must allow incoming requests from Safaricom IP ranges
- Endpoint must respond within 30 seconds

### 8. Testing in Production

Before going live:

1. **Test with small amounts** (KES 10-100) to verify flow
2. **Check callback reception** - verify `/api/mpesa/callback` logs show receipt
3. **Verify email sending** - test invoice email delivery
4. **Monitor transaction logs** - ensure all transactions are recorded
5. **Verify reconciliation** - compare M-Pesa statements with your database

### 9. Production Checklist

- [ ] SSL certificate valid and non-self-signed
- [ ] All environment variables set in Netlify (production values, NOT sandbox)
- [ ] Database created and migrated
- [ ] Email service configured and tested
- [ ] Callback URL tested and accessible
- [ ] Transaction logging working
- [ ] Error alerts configured (Sentry or similar)
- [ ] Rate limiting enabled
- [ ] CORS headers restricted to your domain
- [ ] Security headers implemented (CSP, X-Frame-Options, etc.)
- [ ] Audit logging enabled
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting set up

### 10. Differences from Sandbox

| Aspect | Sandbox | Production |
|--------|---------|-----------|
| URL | sandbox.safaricom.co.ke | api.safaricom.co.ke |
| Credentials | Demo credentials | Real business credentials |
| Shortcode | 174379 | Your paybill number |
| Passkey | Demo passkey | Production passkey |
| Real Money | No | YES - real transactions |
| Callback | May not work | Must work reliably |

### 11. Support & Monitoring

- Register at Safaricom MPESA Supervision: https://app.safaricom.co.ke/
- Monitor transaction logs daily
- Set up alerts for failed transactions
- Keep transaction records for minimum 7 years
- Reconcile with M-Pesa statements monthly

### 12. Compliance Requirements

- Must comply with KBRA (Kenya Bankers Association) if handling payments
- Keep audit trail of all transactions
- Store payment data securely (encrypted at rest)
- Must have privacy policy explaining payment data handling
- Must comply with PCI DSS standards for payment handling
- Document all refund policies

### 13. Error Handling in Production

When M-Pesa returns errors:
- Log all errors with full context
- Alert operators for human review if needed
- Auto-retry failed callbacks (up to 3 times)
- Store failed transactions for manual investigation
- Notify customer of transaction status changes

### 14. Production Deployment Steps

1. Prepare environment variables with production credentials
2. Deploy code to production
3. Test with small transaction
4. Monitor logs for first 24 hours
5. Gradually increase transaction limits
6. Monitor daily for issues

### 15. Disaster Recovery

- Keep backups of transaction database (daily)
- Have manual refund process if system fails
- Document emergency contact for Safaricom support
- Test restoration from backup quarterly
