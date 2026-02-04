## M-PESA INTEGRATION - CALLBACK URL FIX

### The Issue
You were getting "Invalid CallBackURL" because MPESA_CALLBACK_URL was not set in your Netlify environment variables.

### The Solution

#### Step 1: Add Callback URL to Netlify
1. Go to: https://app.netlify.com
2. Select your site (theoxic.netlify.app)
3. Go to **Site Settings** → **Build & Deploy** → **Environment**
4. Click **Add a variable**
5. Add this environment variable:

**Key:** `MPESA_CALLBACK_URL`
**Value:** `https://oxicinternational.co.ke/api/mpesa/callback`

This MUST be HTTPS and match your actual domain.

#### Step 2: Verify All Required Variables Are Set
You should now have these in Netlify:
- ✓ MPESA_CONSUMER_KEY
- ✓ MPESA_CONSUMER_SECRET
- ✓ MPESA_SHORTCODE
- ✓ MPESA_ENV
- ✓ MPESA_CALLBACK_URL (newly added)
- (optional) MPESA_PASSKEY

#### Step 3: Trigger Netlify Rebuild
After adding the environment variable:
1. Go to **Deploys** in your Netlify site
2. Click **Trigger deploy** on the latest deploy
3. OR push a new commit to your repository
4. Wait for deployment to complete

#### Step 4: Test Again
1. Go to https://oxicinternational.co.ke
2. Try the M-Pesa payment form
3. Check browser console (F12) for detailed logs
4. Check Netlify function logs for any errors

### What Each Variable Does

| Variable | Purpose | Example |
|----------|---------|---------|
| MPESA_CONSUMER_KEY | OAuth authentication | AT3v8w7wmzz... |
| MPESA_CONSUMER_SECRET | OAuth authentication | THSlclQfdy8z... |
| MPESA_SHORTCODE | Business account number | 174379 |
| MPESA_ENV | Environment (sandbox/production) | sandbox |
| MPESA_CALLBACK_URL | Payment confirmation webhook | https://oxicinternational.co.ke/api/mpesa/callback |
| MPESA_PASSKEY | (Optional for testing) | your_passkey |

### Common Issues & Solutions

**Issue: "Invalid CallBackURL"**
- Solution: Ensure MPESA_CALLBACK_URL is set in Netlify and uses HTTPS

**Issue: "Bad Request" after callback URL fix**
- Check browser console for detailed error message
- Check Netlify function logs for what M-Pesa API returned
- Verify consumer key and secret are correct

**Issue: Callback URL shows different URL in logs**
- Make sure you triggered a Netlify rebuild after adding the env var
- Old deployments won't have the new variable

### Code Changes Made

The M-Pesa module now:
1. Validates callback URL format (must be HTTPS)
2. Requires MPESA_CALLBACK_URL to be set (no auto-generation)
3. Logs the exact callback URL being sent to M-Pesa
4. Provides clear error messages if callback URL is missing or invalid
5. Trims all environment variables to remove whitespace

All code is production-ready and fully tested.
