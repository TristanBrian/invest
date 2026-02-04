# M-Pesa Development Guide

## Overview

The M-Pesa integration now supports both development and production modes:

- **Development Mode** (v0 preview, local dev): Simulates M-Pesa responses without credentials
- **Production Mode** (Netlify): Uses real M-Pesa Daraja API with your credentials

## How It Works

### Development Mode (No Credentials Required)

When you use the M-Pesa payment form WITHOUT credentials configured:

1. Frontend validates phone number and amount
2. Backend detects missing credentials
3. Backend returns a mock successful response with development flag
4. Frontend displays helpful message about setting up production credentials

**What You See:**
```
"Development Mode: M-Pesa credentials not configured. When deployed to production 
with credentials, real payments will work. See NETLIFY_ENV_SETUP.md for setup instructions."
```

**Phone Number Format:** 
- Use any Kenyan format: `07XXXXXXXX`, `01XXXXXXXX`, `+254712345678`, or `2547XXXXXXXX`

**Transaction ID:**
- Generated automatically as `DEV_[timestamp]_[random]` for testing

### Production Mode (Credentials Required)

When deployed to Netlify with credentials configured:

1. Frontend validates form data (same as development)
2. Backend validates credentials are present
3. Backend calls real M-Pesa Daraja API
4. Backend returns actual STK push response
5. User sees M-Pesa prompt on their phone

## Setting Up for Production

### Step 1: Get M-Pesa Credentials

You need 4 credentials from Safaricom Daraja:

1. **MPESA_CONSUMER_KEY** - Your application consumer key
2. **MPESA_CONSUMER_SECRET** - Your application consumer secret
3. **MPESA_SHORTCODE** - Your business shortcode (Paybill/Till number)
4. **MPESA_PASSKEY** - Your Lipa Na M-Pesa Online passkey

Get these from: https://developer.safaricom.co.ke/

### Step 2: Add to Netlify

See `NETLIFY_ENV_SETUP.md` for step-by-step instructions on adding these variables to Netlify.

### Step 3: Test in Production

1. Deploy to Netlify with credentials
2. Try M-Pesa payment with a valid Kenyan phone number
3. You'll receive an STK push on your phone
4. Complete the payment on your M-Pesa phone prompt

## Error Handling

### Development Errors

- **Missing Phone Number:** "Please enter phone number and amount"
- **Invalid Phone Format:** "Invalid Kenyan phone number. Use format: 07XXXXXXXX or 01XXXXXXXX"
- **Invalid Amount:** "Amount must be between KES 1 and 150,000"

### Production Errors

- **Invalid Credentials:** "M-Pesa service unavailable. Please contact support..."
- **Phone Number Issues:** "Invalid Kenyan phone number. Use format: 07XXXXXXXX or 01XXXXXXXX"
- **API Errors:** Detailed error from M-Pesa Daraja API

## Testing Checklist

### Development Testing (v0 Preview)

- [x] Form validation works (phone number, amount)
- [x] Development mode message displays when credentials missing
- [x] Transaction IDs generated for testing
- [x] Error messages helpful and accurate

### Production Testing (After Netlify Deployment)

- [ ] Credentials added to Netlify environment variables
- [ ] Form accepts valid Kenyan phone numbers
- [ ] STK push sent to configured Safaricom number
- [ ] Payment completion triggers callback
- [ ] Email notification sent for successful payment
- [ ] Callback URL correctly set in Netlify environment

## Troubleshooting

### M-Pesa Payment Not Working After Deployment

1. **Check Netlify Environment Variables:**
   - Go to Site Settings > Build & Deploy > Environment
   - Verify all 4 credentials are set
   - Check spelling: MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_PASSKEY, MPESA_SHORTCODE

2. **Check Credentials Are Valid:**
   - Log in to Safaricom Daraja console
   - Verify keys haven't expired
   - Confirm shortcode is correct (Paybill/Till number)

3. **Check Callback URL:**
   - Should be: `https://yourdomain.com/api/mpesa/callback`
   - Go to Daraja console > configure callback URL
   - This must be publicly accessible

4. **Check Phone Number:**
   - Must be valid Kenyan number starting with 07 or 01
   - Must be associated with the shortcode account (for testing)

## Local Development Setup

To test with real M-Pesa calls locally:

1. Create `.env.local` file in project root:
   ```
   MPESA_CONSUMER_KEY=your_key
   MPESA_CONSUMER_SECRET=your_secret
   MPESA_SHORTCODE=your_shortcode
   MPESA_PASSKEY=your_passkey
   MPESA_ENV=sandbox
   ```

2. Run `npm run dev`
3. Test M-Pesa payments with sandbox credentials
4. Check console for detailed logs

## Files Modified

- `/app/api/mpesa/route.ts` - Added development mode detection
- `/components/payment-methods-section.tsx` - Improved error handling
- `/NETLIFY_ENV_SETUP.md` - Deployment instructions
- This file: Development guide

## Support

For issues:
1. Check this guide first
2. See `NETLIFY_ENV_SETUP.md` for setup
3. Review console logs for detailed error messages
4. Check Safaricom Daraja documentation at https://developer.safaricom.co.ke/
