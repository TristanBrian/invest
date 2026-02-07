# Stripe Integration Setup Guide

## Complete Environment Variables Required for Netlify

Add these variables to your Netlify Environment Variables (Site Settings → Build & Deploy → Environment):

### **Stripe Keys** (Required for all features)
```
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### **Application URLs**
```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
STRIPE_CONNECT_REDIRECT_URL=https://yourdomain.com/stripe/connected
```

### **Other Integrations** (Already configured)
```
RESEND_API_KEY=your_resend_key
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_SHORTCODE=your_shortcode
```

---

## Getting Stripe Keys

### 1. **Get Stripe Secret & Publishable Keys**
   - Go to https://dashboard.stripe.com/apikeys
   - Copy your "Secret key" (starts with `sk_test_` or `sk_live_`)
   - Copy your "Publishable key" (starts with `pk_test_` or `pk_live_`)

### 2. **Get Webhook Secret**
   - Go to https://dashboard.stripe.com/webhooks
   - Create a new endpoint for: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: 
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `account.updated`
     - `account.external_account.created`
   - Copy the signing secret (starts with `whsec_`)

### 3. **Set Up Stripe Connect** (Optional, for multi-seller)
   - Ensure your Stripe account has Connect enabled
   - These are used automatically with your Secret Key

---

## Features Included

### ✅ **Basic Checkout** (Already working)
- One-time payments
- Multiple currencies (USD, EUR, GBP, KES)
- Customer email capture

### ✅ **New: Stripe Connect** (Being added)
- Multi-seller marketplace
- Connected account management
- Automatic fee collection

### ✅ **New: Product Management** (Being added)
- Create products at platform level
- Manage pricing
- Storefront display

### ✅ **New: Webhooks** (Being added)
- Payment notifications
- Account updates
- Automatic order fulfillment

---

## File Structure

```
app/api/stripe/
├── checkout/route.ts          # Basic checkout (existing)
├── webhooks/route.ts          # Webhook handling (new)
├── products/route.ts          # Product management (new)
├── connect/
│   ├── create-account/route.ts    # Create connected account (new)
│   ├── account-link/route.ts      # Onboarding link (new)
│   └── account-status/route.ts    # Check onboarding status (new)
└── storefront/route.ts        # Get all products & accounts (new)

components/
├── stripe-storefront.tsx       # Marketplace UI (new)
├── connect-onboarding.tsx      # Account setup UI (new)
└── payment-methods-section.tsx # Existing payment UI
```

---

## Deployment Checklist

- [ ] Add all 3 Stripe keys to Netlify Environment Variables
- [ ] Set NEXT_PUBLIC_APP_URL to your live domain
- [ ] Create Stripe Connect webhook in dashboard
- [ ] Test payment flow in preview/staging first
- [ ] Switch to live keys before production launch
- [ ] Monitor webhook deliveries in Stripe dashboard

---

## Testing Without Live Domain

For local testing:
1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe` (macOS)
2. Authenticate: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Use test keys (sk_test_*, pk_test_*)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Payment system not configured" | Ensure STRIPE_SECRET_KEY is set in Netlify |
| Webhook 401 error | Verify STRIPE_WEBHOOK_SECRET matches dashboard |
| Connected account fails | Ensure Stripe account has Connect enabled |
| Currency not supported | Add to SUPPORTED_CURRENCIES in checkout route |

---

## Next Steps

1. Add the 3 keys to Netlify now
2. Deploy the new Stripe Connect endpoints (coming next)
3. Test checkout flow
4. Set up webhooks
5. Launch marketplace features
