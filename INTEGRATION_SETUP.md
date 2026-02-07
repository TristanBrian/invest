# Integration Setup Guide

This guide covers all required integrations for The Oxic International Group application.

## Table of Contents
1. [Resend Email Service](#resend-email-service)
2. [M-Pesa Daraja API](#m-pesa-daraja-api)
3. [Stripe Payment (Optional)](#stripe-payment-optional)
4. [Environment Configuration](#environment-configuration)
5. [Production Deployment](#production-deployment)

---

## Resend Email Service

Resend is used for sending contact form inquiries and M-Pesa payment notifications.

### Setup Steps

1. **Create Resend Account**
   - Go to https://resend.com
   - Sign up with your email
   - Verify your email address

2. **Get API Key**
   - Navigate to Settings → API Keys
   - Create a new API key (copy and save securely)
   - This will be your `RESEND_API_KEY`

3. **Verify Domain (Production Only)**
   - In Resend dashboard, go to Domains
   - Add your domain: `oxicinternational.co.ke`
   - Follow DNS setup instructions provided by Resend
   - Configure SPF, DKIM, and DMARC records in your DNS provider

4. **Email Configuration**
   - From email: `noreply@oxicinternational.co.ke`
   - Reply-to: Automatically set to user's email
   - Recipients: `oxicgroupltd@gmail.com` and `Info@oxicinternational.co.ke`

### Testing Resend Integration

\`\`\`bash
# Test contact form submission
curl -X POST http://localhost:3000/api/forms/investment-enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "organization": "Test Org",
    "phone": "254748992777",
    "interest": "Investment",
    "message": "Test message",
    "consent": true
  }'
\`\`\`

---

## M-Pesa Daraja API

M-Pesa integration enables STK push payments and automatic callback handling.

### Prerequisites

- Active Safaricom business account
- M-Pesa Paybill or Till number (shortcode)
- Access to Daraja API portal

### Setup Steps

1. **Create Daraja Account**
   - Go to https://developer.safaricom.co.ke
   - Sign up for a developer account
   - Verify your email

2. **Register Your Application**
   - In Daraja portal, click "Create App"
   - Fill in application details
   - Select "Sandbox" for testing
   - You'll receive:
     - `Consumer Key`
     - `Consumer Secret`

3. **Enable M-Pesa Services**
   - In your app settings, enable these services:
     - Lipa Na M-Pesa Online
     - M-Pesa Payment Notifications

4. **Configure Lipa Na M-Pesa Online**
   - Generate your Passkey (Lipa Na M-Pesa Online)
   - This is used for STK push requests
   - Different from Consumer Secret

5. **Set Business Shortcode**
   - Your M-Pesa Paybill number or Till number
   - This is where payments will be received

### Environment Configuration

\`\`\`env
# Sandbox Testing
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_PASSKEY=your_lipa_na_mpesa_passkey_here
MPESA_SHORTCODE=your_paybill_or_till_number
MPESA_ENV=sandbox
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
\`\`\`

### Callback URL Configuration

1. **In Daraja Portal**
   - Go to your app settings
   - Set Confirmation URL: `https://yourdomain.com/api/mpesa/callback`
   - Set Validation URL: `https://yourdomain.com/api/mpesa/callback`

2. **Important Notes**
   - URL must be publicly accessible
   - Must use HTTPS (not HTTP)
   - Respond to callbacks with HTTP 200 status
   - Our callback handler automatically does this

### Testing M-Pesa Integration

\`\`\`bash
# Test STK Push
curl -X POST http://localhost:3000/api/mpesa \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "254748992777",
    "amount": 100,
    "accountReference": "TestRef",
    "transactionDesc": "Test Payment"
  }'

# Response includes CheckoutRequestID for tracking
\`\`\`

### Transition to Production

1. **Get Production Credentials**
   - Contact Safaricom for production approval
   - Provide your business details and use case
   - Receive production Consumer Key and Secret

2. **Update Configuration**
   \`\`\`env
   MPESA_ENV=production
   MPESA_CONSUMER_KEY=your_production_key
   MPESA_CONSUMER_SECRET=your_production_secret
   MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
   \`\`\`

3. **Domain Verification**
   - Ensure callback domain is properly configured in Daraja
   - Test a small transaction first
   - Monitor callback logs

---

## Stripe Payment (Optional)

Stripe is available as an alternative payment method.

### Setup Steps

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Sign up and verify email
   - Complete business verification

2. **Get API Keys**
   - Dashboard → Developers → API Keys
   - Copy:
     - Publishable Key: `pk_test_...`
     - Secret Key: `sk_test_...`

3. **Configuration**
   \`\`\`env
   STRIPE_PUBLIC_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   \`\`\`

---

## Environment Configuration

### Setup .env.local

1. **Copy template**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. **Fill in your values**
   \`\`\`env
   RESEND_API_KEY=re_xxxxxxxxxxxx
   CONTACT_EMAIL_TO=oxicgroupltd@gmail.com,Info@oxicinternational.co.ke
   
   MPESA_CONSUMER_KEY=your_key
   MPESA_CONSUMER_SECRET=your_secret
   MPESA_PASSKEY=your_passkey
   MPESA_SHORTCODE=123456
   MPESA_ENV=sandbox
   MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
   
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   \`\`\`

3. **Never commit .env.local**
   - Already in .gitignore
   - Keep keys secret and secure

---

## Production Deployment

### Pre-deployment Checklist

- [ ] Resend API key configured and tested
- [ ] Resend domain verified (SPF, DKIM, DMARC)
- [ ] M-Pesa production credentials obtained
- [ ] M-Pesa callback URL configured in Daraja
- [ ] All environment variables set in Netlify dashboard
- [ ] Domain SSL certificate active
- [ ] HTTPS enforced on all endpoints
- [ ] Email recipients verified
- [ ] Test payment completed successfully

### Netlify Environment Variables

1. **In Netlify Dashboard**
   - Site settings → Build & deploy → Environment
   - Add all variables from .env.local
   - **DO NOT include .env.local in repository**

2. **Sensitive Variables**
   \`\`\`
   RESEND_API_KEY
   MPESA_CONSUMER_KEY
   MPESA_CONSUMER_SECRET
   MPESA_PASSKEY
   STRIPE_SECRET_KEY (if using)
   \`\`\`

### Monitoring

1. **Email Delivery**
   - Check Resend dashboard for delivery status
   - Monitor failed sends
   - Review email logs

2. **M-Pesa Transactions**
   - Monitor callback logs in application
   - Verify transactions in Daraja portal
   - Track payment status

3. **Error Tracking**
   - Set up error monitoring (Sentry recommended)
   - Review API error logs
   - Monitor response times

---

## Support & Troubleshooting

### Common Issues

**Resend Email Not Sending**
- Verify API key is correct
- Check Resend dashboard for errors
- Ensure domain is verified for production
- Check recipient email addresses

**M-Pesa Callback Not Received**
- Verify callback URL is publicly accessible
- Ensure HTTPS is working
- Check API credentials
- Verify shortcode matches

**Environment Variables Not Loaded**
- Verify .env.local exists and is readable
- Check variable names match exactly
- Restart development server after changes
- In production, verify Netlify environment settings

### Contact Information

- **Daraja Support**: https://developer.safaricom.co.ke/support
- **Resend Support**: https://resend.com/support
- **Stripe Support**: https://support.stripe.com

---

## API Endpoints

### Contact Form
- **POST** `/api/forms/investment-enquiry`
- Sends inquiry email via Resend
- Accepts JSON payload

### M-Pesa STK Push
- **POST** `/api/mpesa`
- Initiates M-Pesa STK push
- Returns CheckoutRequestID

### M-Pesa Callback
- **POST** `/api/mpesa/callback`
- Receives payment notifications
- Sends email confirmation via Resend

---

Last Updated: 2026-02-04
