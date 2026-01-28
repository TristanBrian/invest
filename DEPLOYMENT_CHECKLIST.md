# Deployment Checklist - The Oxic International Group

## Pre-Deployment Testing (Local)

### Email Testing
- [ ] Test contact form submission
- [ ] Check email arrives at oxicgroupltd@consultant.com
- [ ] Verify email formatting and branding
- [ ] Test invoice email sending

### Payment Testing (M-Pesa)
- [ ] Test STK push with sandbox credentials
- [ ] Verify callback URL receives confirmation
- [ ] Check database records payment correctly
- [ ] Test error handling with invalid phone

### Payment Testing (Stripe)
- [ ] Test with card 4242 4242 4242 4242
- [ ] Verify success redirect works
- [ ] Check webhook receives confirmation
- [ ] Test with invalid card (should fail)

### UI/UX Testing
- [ ] Responsive design on mobile
- [ ] Logo displays correctly
- [ ] Links work (LinkedIn, WhatsApp, mailto)
- [ ] Forms validate correctly
- [ ] Error messages display properly
- [ ] Loading states show correctly

### Performance
- [ ] Page load time < 3 seconds
- [ ] Images are optimized
- [ ] No console errors
- [ ] Network requests are efficient

---

## Netlify Setup

### 1. Connect Repository
- [ ] Push code to GitHub
- [ ] Connect GitHub repo to Netlify
- [ ] Build settings configured correctly
- [ ] Deploy key added to GitHub

### 2. Environment Variables
In Netlify Dashboard → Site Settings → Build & Deploy → Environment:

**SendGrid:**
- [ ] `SENDGRID_API_KEY`
- [ ] `SENDGRID_FROM_EMAIL`
- [ ] `SENDGRID_FROM_NAME`
- [ ] `SENDGRID_ENQUIRY_TO`
- [ ] `SENDGRID_INVOICE_TO`
- [ ] `SENDGRID_ACCOUNT_EMAIL`

**M-Pesa:**
- [ ] `MPESA_CONSUMER_KEY`
- [ ] `MPESA_CONSUMER_SECRET`
- [ ] `MPESA_PASSKEY`
- [ ] `MPESA_SHORTCODE`
- [ ] `MPESA_ENV` (should be "sandbox" initially)
- [ ] `MPESA_CALLBACK_URL`

**Stripe:**
- [ ] `STRIPE_SECRET_KEY`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`

**Application:**
- [ ] `NEXT_PUBLIC_APP_URL` (https://yourdomain.com)
- [ ] `NODE_ENV=production`

### 3. Deploy
- [ ] Trigger manual deploy
- [ ] Check build logs for errors
- [ ] Verify build completed successfully
- [ ] Check deployed site loads

---

## Post-Deployment Testing

### Email Testing
- [ ] Submit contact form
- [ ] Check email arrives (may take 1-2 minutes)
- [ ] Generate and send invoice
- [ ] Verify invoice email format

### Payment Testing
**M-Pesa (if using sandbox):**
- [ ] Complete M-Pesa test payment
- [ ] Check callback received
- [ ] Verify confirmation email sent

**Stripe (if live):**
- [ ] Test Stripe payment
- [ ] Verify webhook confirmation
- [ ] Check order confirmation email

### Webhooks
- [ ] M-Pesa callback URL reachable
- [ ] Stripe webhook working
- [ ] All webhook signatures verify

### External Links
- [ ] LinkedIn URL works
- [ ] Email links work (mailto)
- [ ] WhatsApp link works (if used)
- [ ] All navigation links work

---

## Domain Setup

### DNS Configuration
- [ ] Domain DNS points to Netlify
- [ ] CNAME record configured: `_yourdomain.com` → Netlify domain
- [ ] SSL certificate auto-renewed
- [ ] HTTPS working on all pages

### SSL/TLS
- [ ] HTTPS enabled
- [ ] Certificate valid and auto-renewing
- [ ] No mixed content warnings
- [ ] Redirect HTTP to HTTPS

### Custom Domain
- [ ] Domain connected in Netlify
- [ ] Primary domain selected
- [ ] Subdomain aliases configured (if needed)

---

## Monitoring & Maintenance

### Error Tracking
- [ ] No JavaScript errors in console
- [ ] No 404 errors on assets
- [ ] No CORS errors
- [ ] Network requests all succeeding

### API Health
- [ ] SendGrid sending emails
- [ ] M-Pesa webhooks receiving callbacks
- [ ] Stripe webhooks functional
- [ ] All APIs responding < 500ms

### Database/Logs
- [ ] Check payment logs
- [ ] Check email delivery logs
- [ ] Monitor error rates
- [ ] Review webhook failures (if any)

### Backup & Recovery
- [ ] Environment variables backed up securely
- [ ] API keys stored securely
- [ ] Database backups enabled (if applicable)
- [ ] Disaster recovery plan documented

---

## Security Checklist

- [ ] No API keys exposed in code
- [ ] `.env.local` in `.gitignore`
- [ ] All secrets in Netlify environment only
- [ ] HTTPS enabled everywhere
- [ ] Webhook signatures verified
- [ ] CORS configured properly
- [ ] Sensitive logs don't expose data
- [ ] Email addresses validated
- [ ] Phone numbers validated
- [ ] Forms protected against injection

---

## Post-Launch Monitoring

### Daily (First Week)
- [ ] Check for errors in logs
- [ ] Verify payments processing
- [ ] Monitor email delivery
- [ ] Check user feedback

### Weekly
- [ ] Review analytics
- [ ] Check API response times
- [ ] Verify all integrations working
- [ ] Check for failed payments

### Monthly
- [ ] Review usage patterns
- [ ] Check for performance degradation
- [ ] Update dependencies
- [ ] Security audit

---

## Rollback Procedure

If issues occur after deployment:

1. **Immediate Actions:**
   - [ ] Disable payment processing (if needed)
   - [ ] Notify affected users
   - [ ] Document the issue

2. **Rollback Steps:**
   - [ ] Go to Netlify Deploys
   - [ ] Select previous working deploy
   - [ ] Click "Publish deploy"
   - [ ] Verify site restored

3. **Investigation:**
   - [ ] Review commit changes
   - [ ] Check error logs
   - [ ] Test locally with issue reproduction
   - [ ] Fix and test thoroughly

4. **Redeploy:**
   - [ ] Push fix to GitHub
   - [ ] Verify new deploy succeeds
   - [ ] Test all functionality again

---

## Support Contacts

- **SendGrid Issues:** support@sendgrid.com
- **M-Pesa Issues:** developer@safaricom.co.ke
- **Stripe Issues:** support@stripe.com
- **Netlify Issues:** support@netlify.com

---

## Sign-Off

- [ ] All tests passed
- [ ] Stakeholders approved
- [ ] Documentation complete
- [ ] Team trained on maintenance
- [ ] Ready for public launch

**Deployed by:** _______________
**Date:** _______________
**Notes:** _______________
