# Netlify Environment Variables Configuration

# This file documents all environment variables needed for the Oxic International platform
# Copy these variable names to your Netlify dashboard (Site Settings → Build & Deploy → Environment)

## === STRIPE PAYMENT INTEGRATION ===

# Get from: https://dashboard.stripe.com/apikeys
# Secret key for server-side Stripe operations (starts with sk_test_ or sk_live_)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# Get from: https://dashboard.stripe.com/apikeys
# Publishable key for client-side usage (starts with pk_test_ or pk_live_)
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# Get from: https://dashboard.stripe.com/webhooks
# After creating webhook endpoint for your app
# Select events: checkout.session.completed, payment_intent.succeeded, account.updated, account.external_account.created
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

## === RESEND EMAIL SERVICE ===

# Get from: https://resend.com/api-keys
# Used for sending invoice confirmations and payment notifications
RESEND_API_KEY=re_YOUR_RESEND_KEY_HERE

## === M-PESA PAYMENT INTEGRATION ===

# Get from: Daraja portal at https://developer.safaricom.co.ke
# OAuth consumer key for M-Pesa API authentication
MPESA_CONSUMER_KEY=YOUR_CONSUMER_KEY_HERE

# Get from: Daraja portal
# OAuth consumer secret for M-Pesa API authentication
MPESA_CONSUMER_SECRET=YOUR_CONSUMER_SECRET_HERE

# Get from: Daraja portal
# M-Pesa SIM PIN for transaction verification
MPESA_PASSKEY=YOUR_PASSKEY_HERE

# Get from: Daraja portal
# Business short code (usually 5-6 digits)
MPESA_SHORTCODE=YOUR_SHORTCODE_HERE

## === APPLICATION URLS ===

# Your domain (without trailing slash)
# For Netlify: https://yoursitename.netlify.app or your custom domain
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Stripe Connect redirect URL (same as your domain)
STRIPE_CONNECT_REDIRECT_URL=https://yourdomain.com/stripe/connected

## === DEVELOPMENT ONLY (remove for production) ===

# For local development with Stripe CLI
# Run: stripe listen --forward-to localhost:3000/api/webhooks/stripe
# STRIPE_WEBHOOK_SECRET=whsec_test_local_development_key

---

## How to Add These to Netlify

1. Go to your site on Netlify
2. Click "Site Settings" in the top navigation
3. Go to "Build & Deploy" → "Environment"
4. Click "Edit variables"
5. Add each variable with its value:
   - Key: STRIPE_SECRET_KEY
   - Value: sk_test_...
   - Scope: All scopes
6. Repeat for all required variables
7. Redeploy your site

## Deployment Checklist

- [ ] All STRIPE_* keys added and correct
- [ ] RESEND_API_KEY configured
- [ ] MPESA_* keys configured
- [ ] NEXT_PUBLIC_APP_URL matches your domain
- [ ] Stripe webhook created in dashboard
- [ ] Test payment flow before going live
- [ ] Switched to live keys (sk_live_, pk_live_, whsec_live_)
- [ ] Webhook tested with live events

## Getting Each Key

### Stripe Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Use test keys (starts with test_) for staging
3. Use live keys (starts with live_) for production
4. Copy both secret and publishable keys

### Stripe Webhook Secret
1. Go to https://dashboard.stripe.com/webhooks
2. Click "+ Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events (see above)
5. Copy signing secret (whsec_...)

### Resend API Key
1. Sign up at https://resend.com
2. Go to API Keys
3. Create new key
4. Copy the key value

### M-Pesa Credentials
1. Register at https://developer.safaricom.co.ke
2. Create an app
3. Copy Consumer Key, Consumer Secret, Passkey
4. Get your shortcode from Safaricom

## Testing

### Local Testing
\`\`\`bash
npm install -g stripe
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
\`\`\`

### Test Payment
1. Use card number: 4242 4242 4242 4242
2. Any future expiry date
3. Any 3-digit CVC
4. Any postal code

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Payment system not configured" | Check STRIPE_SECRET_KEY is set in Netlify |
| Webhook 401 | Verify STRIPE_WEBHOOK_SECRET matches dashboard |
| Email not sending | Verify RESEND_API_KEY is correct |
| M-Pesa payment fails | Check all MPESA_* keys are set |

## Questions?

- Stripe docs: https://docs.stripe.com
- Resend docs: https://resend.com/docs
- M-Pesa docs: https://developer.safaricom.co.ke/apis
