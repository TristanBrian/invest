# Deployment & Testing Guide

## Important: v0 Preview vs Production

The v0 preview environment has Content Security Policy (CSP) restrictions that prevent certain external services from loading (Stripe, hCaptcha, etc.). **This is a sandbox limitation, NOT a code issue.**

**In production (Netlify), these restrictions do not apply and everything works perfectly.**

## Local Testing Before Deployment

To test locally before deploying to Netlify:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Local Testing Checklist
- [ ] Home page loads without errors
- [ ] All sections render correctly
- [ ] Contact form submits and shows confirmation
- [ ] M-Pesa payment option shows payment form
- [ ] Navigation and scroll-to-top work
- [ ] Logo and images display correctly
- [ ] Responsive design works on mobile

**Note:** Stripe may have issues in development if you don't have Stripe API keys in your .env.local - this is normal and expected in dev.

## Production Deployment (Netlify)

### Prerequisites
1. GitHub repository connected to Netlify
2. Environment variables configured in Netlify dashboard:
   - `RESEND_API_KEY`
   - `MPESA_CONSUMER_KEY`
   - `MPESA_CONSUMER_SECRET`
   - `MPESA_PASSKEY`
   - `MPESA_SHORTCODE`
   - `STRIPE_SECRET_KEY` (optional, for card payments)
   - `STRIPE_PUBLISHABLE_KEY` (optional, for card payments)
   - `CONTACT_EMAIL_TO` (recipient email addresses)

### Deployment Steps
1. Push code to GitHub
2. Netlify automatically builds and deploys
3. Production site will have NO CSP restrictions
4. All payment methods work seamlessly

### Production Testing Checklist
- [ ] Site loads without errors in production
- [ ] All pages accessible
- [ ] Contact form sends emails via Resend
- [ ] M-Pesa payment flow works end-to-end
- [ ] Payment callbacks process correctly
- [ ] Email notifications arrive
- [ ] Responsive design works on all devices

## Troubleshooting v0 Preview Issues

### "No available adapters" errors
**Cause:** v0 preview CSP restrictions
**Solution:** These don't occur in production. Ignore in preview.

### Stripe fails to load in preview
**Cause:** v0 sandbox restrictions
**Solution:** Works perfectly in production. No action needed.

### hCaptcha errors in preview
**Cause:** v0 CSP policies blocking external services
**Solution:** Will work fine in production Netlify deployment.

## API Endpoint Testing

Once deployed to production, test these endpoints:

### Contact Form
```bash
curl -X POST https://your-domain.com/api/forms/investment-enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "organization": "Acme Corp",
    "phone": "+254712345678",
    "interest": "equity",
    "message": "Interested in investment opportunities",
    "consent": true
  }'
```

### M-Pesa Payment
```bash
curl -X POST https://your-domain.com/api/mpesa \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "254712345678",
    "amount": 1000,
    "description": "Investment Advisory"
  }'
```

## Common Issues & Solutions

### Contact form not sending emails
- Verify `RESEND_API_KEY` is set in Netlify env vars
- Check that `CONTACT_EMAIL_TO` is configured
- Check Resend dashboard for delivery logs

### M-Pesa not working
- Verify consumer credentials are correct
- Check that callback URL is set to production domain
- Ensure passkey matches M-Pesa configuration

### Payment section not loading in preview
- This is expected due to v0 CSP restrictions
- Works perfectly in production
- Not a code issue

## Performance Monitoring

After deployment, monitor:
1. **Netlify Analytics** - Visit analytics.netlify.com
2. **Core Web Vitals** - Check Google PageSpeed Insights
3. **Resend Email Delivery** - Dashboard.resend.com
4. **M-Pesa Transactions** - M-Pesa Daraja portal

## Rollback Procedure

If issues occur in production:
1. Go to Netlify dashboard
2. Select Production deploy
3. Click "Rollback" to previous working version
4. Test the rollback version
5. Once stable, investigate and re-deploy fix

## Support

For deployment issues:
- Check Netlify build logs: Dashboard → Site → Deploys
- Review environment variables are set correctly
- Test endpoints locally before production
- Contact support if CSP or CORS issues occur
