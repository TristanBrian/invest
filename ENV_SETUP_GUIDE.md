# Environment Variables Setup Guide
## The Oxic International Group

This guide will help you set up all required environment variables for the Oxic Group website.

---

## Quick Start

1. Copy `.env.example` to `.env.local` (for local development)
2. Copy `.env.example` to `.env.production` (for production/Netlify)
3. Fill in each variable with your actual credentials
4. Test locally before deploying

---

## Step-by-Step Setup

### 1. EMAIL SERVICE (SendGrid)

**Why needed:** Send invoices, enquiry confirmations, and account notifications

**Setup:**
1. Go to [SendGrid.com](https://sendgrid.com)
2. Create a free account (up to 100 emails/day)
3. Go to Settings → API Keys
4. Click "Create API Key"
5. Choose "Full Access" or custom permissions
6. Copy the key and paste into `SENDGRID_API_KEY`

**Verify your email:**
1. Go to Settings → Sender Authentication
2. Add your domain or verify single sender email
3. You must verify `oxicgroupltd@consultant.com` as a sender

**Environment variables:**
\`\`\`
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=oxicgroupltd@consultant.com
SENDGRID_FROM_NAME=The Oxic International Group
SENDGRID_ENQUIRY_TO=oxicgroupltd@consultant.com
SENDGRID_INVOICE_TO=oxicgroupltd@consultant.com
SENDGRID_ACCOUNT_EMAIL=accounts@oxicgroup.com
\`\`\`

---

### 2. M-PESA PAYMENT (Safaricom Daraja)

**Why needed:** Accept M-Pesa payments in Kenya

**Setup (Sandbox/Testing):**

1. Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
2. Create an account and complete KYC verification
3. Go to "My Apps" and create a new app called "Oxic Group"
4. You'll get:
   - **Consumer Key** → `MPESA_CONSUMER_KEY`
   - **Consumer Secret** → `MPESA_CONSUMER_SECRET`

5. Go to [Safaricom Business Portal](https://businessportal.safaricom.co.ke/)
6. Navigate to "Online Checkout" section
7. Copy the **Online Passkey** → `MPESA_PASSKEY`
8. Your **Shortcode** should be provided (usually starts with 1 for Paybill)

**For Testing:**
- Use shortcode: 174379 (Safaricom test shortcode)
- Test phone: 254712345678 (format: 254 + number without leading 0)
- Amount: Any amount between 1-150,000 KES
- Set `MPESA_ENV=sandbox`

**For Production:**
1. Get your own Paybill or Till number
2. Register on Safaricom Business Portal
3. Switch `MPESA_ENV=production`
4. Update all credentials

**Environment variables:**
\`\`\`
MPESA_CONSUMER_KEY=xxxxxxxxxxxxx
MPESA_CONSUMER_SECRET=xxxxxxxxxxxxx
MPESA_PASSKEY=xxxxxxxxxxxxx
MPESA_SHORTCODE=174379
MPESA_ENV=sandbox
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
\`\`\`

**Test credentials (sandbox):**
- Phone: 254700000000 - 254700100000
- Amount: 1 - 150,000 KES
- PIN: 12345

---

### 3. STRIPE PAYMENT

**Why needed:** Accept international card payments (Visa, Mastercard, etc.)

**Setup:**

1. Go to [Stripe.com](https://stripe.com)
2. Create account and complete verification
3. Go to Dashboard → Developers → API Keys
4. You'll see two keys:
   - **Publishable Key** (starts with `pk_`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret Key** (starts with `sk_`) → `STRIPE_SECRET_KEY`

5. Copy both keys

**Setup Webhook (for payment confirmations):**
1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

**Test Cards (for sandbox testing):**
- Visa: `4242 4242 4242 4242`
- Mastercard: `5555 5555 5555 4444`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)

**Environment variables:**
\`\`\`
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxxxxxxxxxx
\`\`\`

---

### 4. APPLICATION URLS

**Local Development:**
\`\`\`
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
\`\`\`

**Production (Netlify):**
\`\`\`
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
\`\`\`

---

## Netlify Deployment Setup

### Adding Environment Variables to Netlify:

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to Site Settings → Build & Deploy → Environment
4. Click "Edit variables"
5. Add each variable:
   - Key: `SENDGRID_API_KEY`
   - Value: `SG.xxxxx...`
6. Repeat for all variables from `.env.example`

### Important Netlify Notes:
- Variables starting with `NEXT_PUBLIC_` are exposed to frontend (use only for Stripe publishable key)
- Secret variables (API keys, secrets) must NOT start with `NEXT_PUBLIC_`
- After adding variables, redeploy your site: Site Settings → Deploys → Trigger deploy

---

## Verification Checklist

Before going live, verify:

- [ ] SendGrid API key works (test email sending)
- [ ] M-Pesa sandbox credentials tested
- [ ] Stripe test cards work
- [ ] All URLs are correct for your domain
- [ ] Netlify environment variables are set
- [ ] Webhook URLs are reachable
- [ ] CORS is configured if needed

---

## Testing the APIs

### Test Email:
\`\`\`bash
# Run a test from contact form with test email
# Check your inbox and spam folder
\`\`\`

### Test M-Pesa:
1. Use sandbox shortcode: 174379
2. Enter test phone: 254700000000
3. Enter amount: 1000 KES
4. You should see confirmation message

### Test Stripe:
1. Fill payment form with test card: 4242 4242 4242 4242
2. Use any future expiry and CVC
3. Should redirect to success page

---

## Troubleshooting

### SendGrid Issues:
- "Unauthorized": Check API key is correct and has full access
- "Invalid sender": Verify email in Settings → Sender Authentication
- "No domain": Add your domain or verify sender email

### M-Pesa Issues:
- "Invalid credentials": Double-check Consumer Key/Secret
- "Phone number format": Must be 254XXXXXXXXX (12 digits total)
- "Timeout": Ensure callback URL is reachable and public

### Stripe Issues:
- "Invalid API key": Ensure you're using Secret key (sk_), not Publishable (pk_)
- "Webhook failed": Check webhook URL is public and accessible
- "Test mode": Ensure API key starts with `sk_test_`

---

## Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use `.env.example`** - Share this, not actual keys
3. **Rotate keys** - Generate new keys periodically
4. **Netlify only** - Never hardcode secrets in code
5. **HTTPS only** - All webhooks must use HTTPS
6. **Webhook secrets** - Always verify webhook signatures in production

---

## Support

For issues:
- SendGrid: [Support](https://support.sendgrid.com)
- M-Pesa: [Developer Docs](https://developer.safaricom.co.ke/docs)
- Stripe: [Documentation](https://stripe.com/docs)
