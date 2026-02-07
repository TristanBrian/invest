# Stripe Integration - Complete Implementation Guide

## 🚀 Overview

This document outlines the complete Stripe integration for the Oxic International platform, including basic checkout, Stripe Connect for multi-seller marketplace, and webhook handling.

## ✅ What's Implemented

### 1. **Basic Checkout** (Already Working)
- One-time payment processing
- Multiple currencies (USD, EUR, GBP, KES)
- Customer email capture
- Endpoint: `POST /api/stripe/checkout`

### 2. **Stripe Connect** (New)
- Create seller accounts
- Onboard sellers for payments
- Check onboarding status
- Application collects fees automatically

**Endpoints:**
- `POST /api/stripe/connect/create-account` - Create connected account
- `POST /api/stripe/connect/account-link` - Generate onboarding URL
- `GET /api/stripe/connect/account-status?accountId=...` - Check status

### 3. **Product Management** (New)
- Create products at platform level
- Store seller mapping in metadata
- List all products

**Endpoints:**
- `POST /api/stripe/products` - Create product
- `GET /api/stripe/products` - List products

### 4. **Webhooks** (New)
- Payment completion notifications
- Account status updates
- Bank account creation
- Automatic handlers for all events

**Endpoint:** `POST /api/webhooks/stripe`

## 📋 Setup Steps

### Step 1: Get Stripe Keys

1. Create account at https://stripe.com
2. Go to Dashboard → Developers → API Keys
3. Copy **Secret Key** (sk_test_...)
4. Copy **Publishable Key** (pk_test_...)
5. Create webhook endpoint at Dashboard → Developers → Webhooks
6. Copy **Webhook Secret** (whsec_...)

### Step 2: Add to Netlify Environment

Go to your Netlify site:
1. Site Settings → Build & Deploy → Environment
2. Add these variables:

\`\`\`
STRIPE_SECRET_KEY = sk_test_YOUR_KEY
STRIPE_PUBLISHABLE_KEY = pk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET = whsec_YOUR_SECRET
NEXT_PUBLIC_APP_URL = https://yourdomain.com
\`\`\`

### Step 3: Redeploy

Push your changes or redeploy on Netlify. Site will automatically pick up env vars.

### Step 4: Test the Flow

Use Stripe test cards:
- Visa: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits

## 🔌 API Reference

### Create Connected Account

\`\`\`bash
curl -X POST https://yourdomain.com/api/stripe/connect/create-account \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Amazing Coffee Co",
    "contactEmail": "owner@coffee.com",
    "country": "us"
  }'
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "accountId": "acct_1234567890",
  "displayName": "Amazing Coffee Co",
  "status": "created"
}
\`\`\`

### Generate Onboarding Link

\`\`\`bash
curl -X POST https://yourdomain.com/api/stripe/connect/account-link \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "acct_1234567890"
  }'
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "url": "https://connect.stripe.com/...",
  "expiresAt": 1234567890,
  "accountId": "acct_1234567890"
}
\`\`\`

User visits this URL to complete onboarding.

### Check Account Status

\`\`\`bash
curl https://yourdomain.com/api/stripe/connect/account-status?accountId=acct_1234567890
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "accountId": "acct_1234567890",
  "displayName": "Amazing Coffee Co",
  "status": "complete|pending|incomplete",
  "onboardingComplete": true,
  "readyForPayments": true,
  "requirements": {
    "currentlyDue": [],
    "pastDue": [],
    "eventuallyDue": []
  }
}
\`\`\`

### Create Product

\`\`\`bash
curl -X POST https://yourdomain.com/api/stripe/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Coffee",
    "description": "Freshly roasted",
    "priceInCents": 1299,
    "currency": "usd",
    "accountId": "acct_1234567890"
  }'
\`\`\`

### List Products

\`\`\`bash
curl https://yourdomain.com/api/stripe/products
\`\`\`

### Process Payment (Destination Charge)

The existing checkout endpoint automatically routes payments to the connected account:

\`\`\`bash
curl -X POST https://yourdomain.com/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 9999,
    "currency": "usd",
    "description": "Premium Coffee",
    "customerEmail": "customer@email.com",
    "customerName": "John Doe",
    "connectedAccountId": "acct_1234567890"
  }'
\`\`\`

## 🔐 Security

✅ **Implemented:**
- API key validation at application start
- Webhook signature verification
- Environment variable encryption
- Error handling without exposing sensitive data
- Proper CORS configuration
- Rate limiting ready

## 🧪 Testing

### Local Testing with Stripe CLI

\`\`\`bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# In another terminal, test API
curl -X POST http://localhost:3000/api/stripe/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","priceInCents":1000,"accountId":"acct_test"}'
\`\`\`

### Test Webhook Events

\`\`\`bash
# List test events
stripe events list

# Trigger test events
stripe trigger checkout.session.completed
\`\`\`

## 📊 Payment Flow

\`\`\`
Customer Visit Store
        ↓
Browse Products (from Stripe)
        ↓
Click "Buy"
        ↓
Redirect to Stripe Checkout
        ↓
Customer enters payment info
        ↓
Stripe processes payment
        ↓
Amount transfers to Connected Account
        ↓
Platform keeps application fee
        ↓
Webhook notifies your system
        ↓
Order updated, email sent
\`\`\`

## ⚙️ Webhook Events Handled

1. **checkout.session.completed** - Payment successful
   - Update order status
   - Send confirmation email
   - Trigger fulfillment

2. **payment_intent.succeeded** - Alternative payment success
   - Log payment
   - Update customer account

3. **account.updated** - Connected account changed
   - Check new requirements
   - Notify seller if action needed

4. **account.external_account.created** - Bank account linked
   - Enable payouts
   - Send confirmation

## 🚦 Deployment Checklist

- [ ] Stripe account created
- [ ] API keys generated
- [ ] Webhook endpoint created in Stripe dashboard
- [ ] All 3 env vars added to Netlify
- [ ] Site redeployed
- [ ] Test payment with test card succeeds
- [ ] Webhook receives completion event
- [ ] Switch to live keys before production
- [ ] Monitor webhook deliveries regularly

## 📚 Documentation Files

- `STRIPE_SETUP_GUIDE.md` - Initial setup instructions
- `NETLIFY_ENV_VARIABLES.md` - All environment variables
- `.env.example` - Configuration template
- `/app/api/stripe/*` - API endpoints
- `/app/api/webhooks/stripe/route.ts` - Webhook handler

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| 503 Payment system not configured | Check STRIPE_SECRET_KEY in Netlify |
| Webhook not firing | Verify STRIPE_WEBHOOK_SECRET, check Stripe dashboard |
| Connected account not found | Ensure accountId is correct format (acct_...) |
| Test payment fails | Use test card 4242 4242 4242 4242 |
| Email not sent after payment | Check RESEND_API_KEY is set |

## 📞 Next Steps

1. **Get Keys** - Complete Stripe setup
2. **Add Env Vars** - Configure Netlify
3. **Deploy** - Push changes
4. **Test** - Use test cards
5. **Go Live** - Switch to live keys

## 📖 Resources

- [Stripe Documentation](https://docs.stripe.com)
- [Stripe Connect Guide](https://docs.stripe.com/connect)
- [Webhook Documentation](https://docs.stripe.com/webhooks)
- [API Reference](https://docs.stripe.com/api)
- [Testing Guide](https://docs.stripe.com/testing)
