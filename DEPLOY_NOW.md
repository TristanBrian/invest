# Quick Deployment Guide - 5 Minutes to Live

## Your Code is Ready ✅

All TypeScript errors fixed. Build passes. Ready for Netlify.

## Step 1: Add Environment Variables (2 min)

1. Go to **https://app.netlify.com** → Your site → **Site settings**
2. Click **Build & Deploy** → **Environment**
3. Click **Add environment variables**

Add these 9 variables:

| Key | Value | Where to Get |
|-----|-------|--------------|
| STRIPE_SECRET_KEY | sk_test_... | https://dashboard.stripe.com/apikeys |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | pk_test_... | https://dashboard.stripe.com/apikeys |
| STRIPE_WEBHOOK_SECRET | whsec_... | https://dashboard.stripe.com/webhooks (create first) |
| RESEND_API_KEY | re_... | https://resend.com/api-keys |
| MPESA_CONSUMER_KEY | From Safaricom | Daraja API portal |
| MPESA_CONSUMER_SECRET | From Safaricom | Daraja API portal |
| MPESA_PASSKEY | Your M-Pesa | Account settings |
| MPESA_SHORTCODE | e.g., 174379 | Your business code |
| NEXT_PUBLIC_APP_URL | https://yourdomain.com | Your production URL |

## Step 2: Deploy (1 min)

Option A: Auto-deploy
- Commit changes to GitHub
- Netlify automatically deploys

Option B: Manual deploy
- Netlify dashboard → "Trigger deploy"

## Step 3: Verify (2 min)

1. Wait for build (3-5 minutes)
2. Visit your site
3. Test payment methods:
   - Try Stripe card: 4242 4242 4242 4242
   - Test M-Pesa (if enabled)
   - Check bank transfer info displays

## That's It! 🚀

Your payment system is now live.

### Troubleshooting

**Build fails?**
- Check all environment variables are set
- Verify no typos in variable names

**Payments not working?**
- Check Stripe API keys are correct
- Verify webhook secret is set
- Check Resend API key for emails

**Need help?**
- See STRIPE_SETUP_GUIDE.md
- See EMAIL_SERVICE_SETUP.md
- See MPESA_INTEGRATION_GUIDE.md
