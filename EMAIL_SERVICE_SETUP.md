# Email Service Setup Guide

## Overview
The Oxic International Group website now has a fully integrated email service for sending enquiry notifications and invoices using SendGrid.

## What's Been Configured

### 1. Email Service Route (`/app/api/send-email/route.ts`)
- **From Email:** noreply@oxicinternational.co.ke
- **To Email (Enquiries):** info@oxicinternational.co.ke
- **Service:** SendGrid (premium email delivery)

### 2. Contact Form Integration
- The contact form now sends enquiries via SendGrid
- Fallback to Netlify Forms for backup data capture
- Professional HTML email templates with branding
- Includes enquiry details, contact information, and timestamps

### 3. Invoice Email System
- Generates professional invoices with company branding
- Includes bank transfer details:
  - **Bank:** KCB BANK (K) LIMITED
  - **Account Name:** THE OXIC INTERNATIONAL GROUP LIMITED
  - **Account Number:** 1316115194
  - **SWIFT Code:** KCBLKENX
  - **M-Pesa Paybill:** 522522

## Setup Instructions

### Step 1: Get SendGrid API Key
1. Go to https://sendgrid.com
2. Sign up for a free account (100 emails/day) or paid plan
3. Navigate to Settings → API Keys
4. Create a new API key with "Mail Send" permissions
5. Copy the API key

### Step 2: Add Environment Variable
Add to your `.env.local` file:
\`\`\`
SENDGRID_API_KEY=your_api_key_here
\`\`\`

### Step 3: Verify Sender Email
1. In SendGrid dashboard, go to Settings → Sender Authentication
2. Verify the email: noreply@oxicinternational.co.ke
3. Follow SendGrid's verification process (DNS or email confirmation)

### Step 4: Test the System
1. Fill out the contact form on the website
2. Submit the form
3. Check info@oxicinternational.co.ke for the enquiry email

## Email Templates

### Enquiry Email
- Professional header with company branding
- All contact details captured (name, email, organization, phone, interest)
- Full message content
- Action reminder for response within 24 hours

### Invoice Email
- Official invoice document with formatting
- Company logo and branding
- Line items and total amount due
- Bank transfer details
- Payment instructions
- Due date tracking

## Bank Details Configured
- **Account Name:** THE OXIC INTERNATIONAL GROUP LIMITED
- **Account Number:** 1316115194 (KES)
- **Bank:** KCB BANK (K) LIMITED
- **SWIFT Code:** KCBLKENX
- **M-Pesa Paybill:** 522522 (for M-Pesa deposits)
- **Contact:** info@oxicinternational.co.ke

## Troubleshooting

### Emails Not Sending
1. **Check API Key:** Verify SENDGRID_API_KEY is set correctly in environment
2. **Sender Verification:** Ensure noreply@oxicinternational.co.ke is verified in SendGrid
3. **Logs:** Check server logs for error messages from SendGrid API
4. **Rate Limits:** Free tier has 100 emails/day limit

### Bounced Emails
- Check if recipient email addresses are valid
- Verify your SendGrid account is not in restricted mode
- Check SendGrid's bounce/suppression list

### Missing Details in Email
- Ensure all form fields have proper name attributes
- Verify form validation is passing
- Check that the data object in the API call includes all fields

## Production Checklist

- [ ] SendGrid API key configured
- [ ] Sender email (noreply@oxicinternational.co.ke) verified
- [ ] Contact form tested and working
- [ ] Invoice system tested with real email
- [ ] Bank details reviewed and correct
- [ ] Error handling monitored
- [ ] Email quota monitored (if using free tier)

## Contact Information
- **Enquiries:** info@oxicinternational.co.ke
- **Business:** The Oxic International Group Limited, Nairobi, Kenya
