# Netlify Environment Variables Setup

## Overview
This guide helps you add all required environment variables to Netlify so your production site works seamlessly with Resend emails and M-Pesa payments.

## Steps to Configure on Netlify

### 1. Access Netlify Site Settings
1. Log in to [Netlify Dashboard](https://app.netlify.com)
2. Select your site "The Oxic International Group"
3. Go to **Site Settings** → **Build & Deploy** → **Environment**
4. Click **Edit variables**

### 2. Add Environment Variables

Add each variable from `.env.example`:

#### Resend Email Service
\`\`\`
Key: RESEND_API_KEY
Value: re_YOUR_ACTUAL_API_KEY
\`\`\`
Get from: https://resend.com/api-keys

\`\`\`
Key: CONTACT_EMAIL_TO
Value: oxicgroupltd@gmail.com,Info@oxicinternational.co.ke
\`\`\`

#### M-Pesa Configuration
\`\`\`
Key: MPESA_CONSUMER_KEY
Value: AT3v8w7wmzz43hpZnLUC1WKk1gV8FmjQAJBaWzAUX4XFJ4kE
\`\`\`

\`\`\`
Key: MPESA_CONSUMER_SECRET
Value: THSlclQfdy8zsHM7GbtXzRaGSOCP6RiYLSRlTlFTaiVjz318qz2MMlxtMldrWGQG
\`\`\`

\`\`\`
Key: MPESA_SHORTCODE
Value: 174379
\`\`\`

\`\`\`
Key: MPESA_PASSKEY
Value: YOUR_LIPA_NA_MPESA_PASSKEY
\`\`\`
Get from: https://developer.safaricom.co.ke → Lipa Na M-Pesa Online

\`\`\`
Key: MPESA_ENV
Value: sandbox
\`\`\`
Change to `production` when going live

\`\`\`
Key: MPESA_CALLBACK_URL
Value: https://yourdomain.com/api/mpesa/callback
\`\`\`
Replace `yourdomain.com` with your actual domain

#### Site Configuration
\`\`\`
Key: NEXT_PUBLIC_SITE_URL
Value: https://yourdomain.com
\`\`\`

\`\`\`
Key: NODE_ENV
Value: production
\`\`\`

### 3. Verify Configuration

After adding variables:
1. Click **Save** 
2. Go to **Deployments** → Trigger new deploy
3. Wait for build to complete
4. Test M-Pesa: Try initiating a payment
   - Should show STK push dialog
   - If credentials missing, will show specific error

### 4. Testing M-Pesa on Netlify

When you add credentials and redeploy:

1. Navigate to payment section
2. Click "Mobile Money" payment type
3. Enter test phone: `0712345678` or `254712345678`
4. Enter amount: `100`
5. Click "Pay with M-Pesa"

Expected flow:
- ✅ STK push dialog appears on phone
- ✅ Payment confirmation email sent
- ✅ Callback received and logged

### Troubleshooting

**Error: "M-Pesa credentials not configured"**
- Verify all MPESA_* variables are added on Netlify
- Check for typos in variable names
- Redeploy after adding variables
- Check deployment logs for missing variables

**Error: "Failed to get M-Pesa access token"**
- Verify MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET are correct
- Check if credentials are still valid at https://developer.safaricom.co.ke
- Ensure you're using sandbox credentials for MPESA_ENV=sandbox

**Payment not sending STK push**
- Verify MPESA_SHORTCODE is correct
- Check MPESA_PASSKEY is valid
- Ensure phone number is in correct format (254XXXXXXXXX)
- Check M-Pesa account is active

### Production Deployment Checklist

Before going live:

- [ ] All MPESA_* variables added to Netlify
- [ ] MPESA_ENV changed to `production`
- [ ] MPESA_CONSUMER_KEY and SECRET are production credentials
- [ ] MPESA_CALLBACK_URL points to production domain
- [ ] RESEND_API_KEY is valid production key
- [ ] Test payment works end-to-end
- [ ] Confirmation emails received
- [ ] Domain SSL certificate is active
- [ ] Callback endpoint accessible from internet

### Security Notes

Never commit sensitive variables to GitHub:
- `.env.example` contains only placeholder values
- `.env.local` is in `.gitignore` (not committed)
- All actual credentials stay in Netlify environment

### Support

If you encounter issues:
1. Check Netlify deployment logs for error messages
2. Verify all variable names match exactly (case-sensitive)
3. Ensure values don't have extra spaces
4. Test credentials at their respective services first
