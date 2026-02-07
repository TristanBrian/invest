# Stripe on Netlify - Quick Setup Guide

## What You're Fixing
The 503 error occurs because `STRIPE_SECRET_KEY` is not configured in your environment. This guide shows you how to fix it in 3 steps.

## Step 1: Get Your Stripe Keys (2 minutes)

1. Go to https://dashboard.stripe.com
2. Sign in with your Stripe account
3. Click **"Developers"** in the top menu
4. Click **"API keys"** in the left sidebar
5. You'll see two keys - copy both:
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)

## Step 2: Add Keys to Netlify (2 minutes)

1. Go to your Netlify site dashboard: https://app.netlify.com
2. Click **"Site settings"** (top menu)
3. Click **"Build & deploy"** in left sidebar
4. Click **"Environment"**
5. Click **"Add environment variables"**
6. Add these 2 variables:

| Key | Value |
|-----|-------|
| `STRIPE_SECRET_KEY` | `sk_test_...` (from step 1) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` (from step 1) |

## Step 3: Redeploy (1 minute)

1. Go back to **"Deploys"** tab
2. Click **"Trigger deploy"** button
3. Select **"Clear cache and deploy site"**
4. Wait for deployment to complete (green checkmark)

## Test It

1. Go to your site
2. Scroll to "Card Payments" section
3. Enter test details:
   - Email: `test@example.com`
   - Amount: `50`
   - Name: `Test User`
4. Click **"Pay with Stripe"**
5. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits

## If Still Getting 503 Error

Check your Netlify logs:
1. Go to Netlify site dashboard
2. Click **"Deployments"**
3. Look for errors in the deploy log

Common issues:
- ✅ **Keys copied incorrectly** - Go back to Stripe dashboard and copy again (including the `sk_test_` prefix)
- ✅ **Variables not saved** - Make sure you clicked the "Save" button after adding each variable
- ✅ **Deploy not triggered** - You must redeploy after adding environment variables
- ✅ **Wrong key type** - Make sure you're using `sk_test_` (secret) not `pk_test_` (publishable)

## Questions?

If you're still seeing errors:
1. Check that all 3 keys are added to Netlify (not just the code)
2. Make sure the redeploy completed successfully
3. Clear your browser cache and try again
4. Check the browser console (F12) for additional error details

**After deployment, the Stripe payment method will be fully functional!**
