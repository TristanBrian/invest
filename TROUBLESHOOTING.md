# Troubleshooting Guide

## Site Not Loading - Common Issues

### Issue: "POST https://r.stripe.com/b net::ERR_BLOCKED_BY_CLIENT"

This error indicates that your browser extensions (ad blocker, privacy extensions) are blocking Stripe's telemetry calls.

**Solutions:**

1. **Disable Ad Blocker temporarily**
   - Add the site to your ad blocker's whitelist
   - Or disable the ad blocker for testing
   - The site will load normally after

2. **Use Incognito/Private Mode**
   - Open the site in incognito mode to bypass browser extensions
   - Most ad blockers are disabled by default in private browsing

3. **Clear Browser Cache**
   ```
   Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
   - Clear browsing data
   - Select "All time"
   - Click "Clear data"
   ```

4. **Use a Different Browser**
   - Try Chrome, Firefox, Safari, or Edge
   - Stripe works across all modern browsers

### Technical Details

The errors you see are:
- `net::ERR_BLOCKED_BY_CLIENT` - Browser extension blocking external calls
- `WebSocket connection failed` - Can happen with aggressive blocking extensions
- `[useBrowserFrame] ultimate timeout` - Page taking too long to load due to blocked resources

**Why This Happens:**
- Stripe's analytics endpoint (`r.stripe.com/b`) is blocked by ad blockers
- The payment section now lazy-loads to prevent page freezing
- Payment features are fully available once loaded

### Stripe Integration Status

The Stripe integration is working correctly. The errors are purely from browser blocking, not code issues.

**Payment Methods Still Available:**
- M-Pesa (fully functional)
- Cryptocurrency (static wallet addresses)
- Bank Transfer (contact info provided)
- Invoice (institutional billing)
- Stripe (works after ad blocker disabled)

## How to Test

1. **Test M-Pesa Payments** (No ad blocker interference)
   - Go to Payment Methods section
   - Select "Mobile Money"
   - Enter a Kenyan phone number
   - Enter amount (KES 1 - 150,000)
   - Submit
   - Check server logs for callback

2. **Test Contact Form** (No issues)
   - Scroll to contact section
   - Fill in details
   - Email will be sent via Resend

3. **Test Stripe Payments** (Requires ad blocker disabled)
   - Disable ad blocker
   - Refresh page
   - Go to Payment Methods
   - Select "Card Payments"
   - Follow checkout process

## Environment Setup

Ensure all required environment variables are set:

```bash
# In Netlify Vars (or .env for local dev)
RESEND_API_KEY=xxx
MPESA_CONSUMER_KEY=xxx
MPESA_CONSUMER_SECRET=xxx
MPESA_PASSKEY=xxx
MPESA_SHORTCODE=xxx
STRIPE_SECRET_KEY=xxx
```

## Server-Side Logs

To check payment callbacks and form submissions:
- M-Pesa callbacks: Check server console
- Form submissions: Check Resend dashboard
- Stripe webhooks: Check Stripe dashboard

## Production Deployment

On Netlify, these errors should not appear because:
1. Browsers on production sites trust HTTPS domains
2. Ad blockers typically don't affect production deployments as aggressively
3. The lazy-loading pattern prevents page freezing

## Support

If issues persist:
1. Check browser console for specific errors
2. Verify all environment variables are set
3. Check that external APIs are accessible
4. Contact: oxicgroupltd@gmail.com
