# ✅ Stripe Integration - Deployment Checklist

## 📋 Pre-Deployment Tasks

### **Phase 1: Stripe Account Setup** (15 min)
- [ ] Create Stripe account at https://stripe.com
- [ ] Verify email address
- [ ] Complete account details
- [ ] Agree to terms of service
- [ ] Activate test mode (default)

### **Phase 2: Get API Keys** (5 min)
- [ ] Go to https://dashboard.stripe.com/apikeys
- [ ] Copy Secret Key (sk_test_...)
  - [ ] Save in secure location
  - [ ] Do NOT share this key
- [ ] Copy Publishable Key (pk_test_...)
  - [ ] Safe to use in frontend
  - [ ] Can commit to code if needed

### **Phase 3: Create Webhook Endpoint** (5 min)
- [ ] Go to https://dashboard.stripe.com/webhooks
- [ ] Click "+ Add endpoint"
- [ ] Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
  - [ ] Replace yourdomain.com with your actual domain
  - [ ] Use HTTPS (required)
  - [ ] Exact path: `/api/webhooks/stripe`
- [ ] Select events:
  - [ ] `checkout.session.completed`
  - [ ] `payment_intent.succeeded`
  - [ ] `account.updated`
  - [ ] `account.external_account.created`
- [ ] Copy Signing Secret (whsec_...)
  - [ ] Save in secure location
  - [ ] Do NOT share this key

### **Phase 4: Add to Netlify** (5 min)
- [ ] Open your Netlify site dashboard
- [ ] Site Settings → Build & Deploy → Environment
- [ ] Click "Edit variables"
- [ ] Add 4 environment variables:

  \`\`\`
  Variable 1:
  Key: STRIPE_SECRET_KEY
  Value: sk_test_YOUR_KEY
  Scope: All scopes
  
  Variable 2:
  Key: STRIPE_PUBLISHABLE_KEY
  Value: pk_test_YOUR_KEY
  Scope: All scopes
  
  Variable 3:
  Key: STRIPE_WEBHOOK_SECRET
  Value: whsec_YOUR_WEBHOOK_SECRET
  Scope: All scopes
  
  Variable 4:
  Key: NEXT_PUBLIC_APP_URL
  Value: https://yourdomain.com
  Scope: All scopes
  \`\`\`

- [ ] Verify all 4 variables are correct
- [ ] No typos in variable names
- [ ] Values exactly as copied from Stripe

### **Phase 5: Redeploy Site** (2 min)
- [ ] Git: Commit and push code
  - [ ] OR: Manual redeploy on Netlify
- [ ] Wait for build to complete
  - [ ] Check build logs for errors
  - [ ] Should see: "Build complete"

---

## 🧪 Testing Phase

### **Basic Connectivity Test**
- [ ] Open your site in browser
- [ ] Check browser console for errors
  - [ ] Should see no "STRIPE_SECRET_KEY" errors
  - [ ] Should see no missing variable errors

### **Test Payment**
- [ ] Navigate to payment section
- [ ] Enter test amount: $9.99
- [ ] Email: test@example.com
- [ ] Click "Pay Now"
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Expiry: 12/25 (any future date)
- [ ] CVC: 123 (any 3 digits)
- [ ] Postal: 12345 (any value)
- [ ] Click "Pay"
- [ ] Expected: "Payment successful" message
- [ ] Check Stripe Dashboard:
  - [ ] Go to https://dashboard.stripe.com/payments
  - [ ] Should see payment in list
  - [ ] Status: "Succeeded"

### **Webhook Test**
- [ ] Go to https://dashboard.stripe.com/webhooks
- [ ] Find your endpoint
- [ ] Scroll to "Events"
- [ ] Should see delivery:
  - [ ] Event type: `checkout.session.completed`
  - [ ] Status: "Delivered" (green checkmark)
  - [ ] Response: 200 OK

### **Stripe Connect Test**
- [ ] Go to API section
- [ ] Test creating connected account:
  \`\`\`bash
  curl -X POST https://yourdomain.com/api/stripe/connect/create-account \
    -H "Content-Type: application/json" \
    -d '{
      "displayName": "Test Business",
      "contactEmail": "test@business.com",
      "country": "us"
    }'
  \`\`\`
- [ ] Expected response:
  \`\`\`json
  {
    "success": true,
    "accountId": "acct_1234567890",
    "status": "created"
  }
  \`\`\`

### **Products Test**
- [ ] Test creating product:
  \`\`\`bash
  curl -X POST https://yourdomain.com/api/stripe/products \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test Product",
      "description": "Test",
      "priceInCents": 999,
      "currency": "usd",
      "accountId": "acct_1234567890"
    }'
  \`\`\`
- [ ] Should get back: productId, name, price
- [ ] Test listing products:
  \`\`\`bash
  curl https://yourdomain.com/api/stripe/products
  \`\`\`
- [ ] Should see products in response

---

## 🐛 Troubleshooting Checklist

### **If 503 "Payment system not configured"**
- [ ] Check Netlify env vars (Site Settings → Build & Deploy → Environment)
- [ ] Verify variable name: `STRIPE_SECRET_KEY` (exact spelling)
- [ ] Verify variable value starts with `sk_test_` or `sk_live_`
- [ ] Redeploy site (changes require redeploy)
- [ ] Wait 2-3 minutes for environment to update
- [ ] Clear browser cache and reload
- [ ] Check Netlify build log for errors

### **If Webhook returns 403 "Invalid signature"**
- [ ] Verify STRIPE_WEBHOOK_SECRET is correct:
  - [ ] Copy from: https://dashboard.stripe.com/webhooks
  - [ ] Should start with `whsec_`
  - [ ] Should be for YOUR endpoint
  - [ ] Not for a different endpoint
- [ ] Verify webhook URL matches exactly:
  - [ ] In Netlify: Endpoint URL in Stripe dashboard
  - [ ] In code: `/api/webhooks/stripe`
  - [ ] Protocol: Must be HTTPS
  - [ ] Domain: Must be your actual domain
- [ ] Redeploy site after any changes
- [ ] Test webhook in Stripe dashboard (click "Send test")

### **If test payment fails/declines**
- [ ] Use exact test card: `4242 4242 4242 4242`
- [ ] Expiry must be in FUTURE (e.g., 12/25)
- [ ] CVC: Any 3 digits (e.g., 123)
- [ ] Postal: Any value (e.g., 12345)
- [ ] Amount: Any amount > $0.50
- [ ] Check Stripe dashboard:
  - [ ] Look for payment attempt
  - [ ] Check error message
  - [ ] See if declined/requires action

### **If connected account fails to create**
- [ ] Check Stripe account has Connect enabled
  - [ ] Go to Settings → Account
  - [ ] Look for "Connect" section
  - [ ] Activate if needed
- [ ] Verify country code is 2 characters (e.g., "us" not "USA")
- [ ] Verify email format is valid
  - [ ] Should have @ symbol
  - [ ] Should have domain (e.g., .com)

### **If email not sending after payment**
- [ ] Verify RESEND_API_KEY is set in Netlify
- [ ] Check Resend dashboard (resend.com)
- [ ] Look for failed email deliveries
- [ ] Verify from email address is correct

### **If webhook not firing**
- [ ] Check endpoint URL in Stripe dashboard:
  - [ ] Should be exactly: `https://yourdomain.com/api/webhooks/stripe`
  - [ ] Must use your actual domain
  - [ ] Must use HTTPS (not HTTP)
- [ ] Check endpoint status:
  - [ ] Should show "Active"
  - [ ] Not "Disabled"
- [ ] Send test event from Stripe dashboard
- [ ] Check event delivery log in Stripe dashboard

---

## 🚀 Going Live Checklist

### **Before Switching to Live Keys**
- [ ] All test scenarios pass ✅
- [ ] Test payment works ✅
- [ ] Webhook receives events ✅
- [ ] Connected account works ✅
- [ ] Products API works ✅
- [ ] Email sends on payment ✅
- [ ] No console errors ✅

### **Getting Live Keys**
- [ ] Go to https://dashboard.stripe.com/apikeys
- [ ] Toggle to "Live keys" mode
- [ ] Copy Live Secret Key (sk_live_...)
- [ ] Copy Live Publishable Key (pk_live_...)

### **Creating Live Webhook**
- [ ] Go to https://dashboard.stripe.com/webhooks
- [ ] Create NEW webhook endpoint for live:
- [ ] URL: `https://yourdomain.com/api/webhooks/stripe`
- [ ] Events: Same as test (4 events)
- [ ] Copy Live Signing Secret (whsec_live_...)

### **Updating Netlify**
- [ ] Update 3 env vars with LIVE keys:
  \`\`\`
  STRIPE_SECRET_KEY = sk_live_YOUR_LIVE_KEY
  STRIPE_PUBLISHABLE_KEY = pk_live_YOUR_LIVE_KEY
  STRIPE_WEBHOOK_SECRET = whsec_live_YOUR_LIVE_WEBHOOK
  \`\`\`
- [ ] Verify values are correct (no copy/paste errors)
- [ ] DO NOT use old test keys
- [ ] Redeploy site

### **Live Testing**
- [ ] Wait for deployment to complete
- [ ] Open site in incognito window (clear cache)
- [ ] Process SMALL test payment ($1.00)
- [ ] Use REAL card (or small test amount)
- [ ] Watch Stripe dashboard in real-time
- [ ] Should see transaction appear
- [ ] Check webhook delivery

### **Monitoring**
- [ ] Check Stripe dashboard daily first week
- [ ] Monitor webhook deliveries
- [ ] Review payment list for issues
- [ ] Set up Stripe alerts (optional)
- [ ] Check email notifications working

---

## 📊 Status Tracking

\`\`\`
Phase               Status      Checkpoint
───────────────────────────────────────────────────
Stripe Account      ☐ TODO     Created & Verified
API Keys            ☐ TODO     Keys Copied
Webhook Setup       ☐ TODO     Endpoint Created
Netlify Config      ☐ TODO     Variables Added
Site Redeploy       ☐ TODO     Build Complete
Connectivity        ☐ TODO     No Errors
Test Payment        ☐ TODO     Payment Success
Webhook Test        ☐ TODO     Event Delivered
Connect Test        ☐ TODO     Account Created
Products Test       ☐ TODO     Product Listed
Documentation      ☐ TODO     Read All Guides
Ready for Review    ☐ TODO     QA Approved
Live Keys           ☐ TODO     Updated
Live Test           ☐ TODO     Payment Processed
Monitoring          ☐ TODO     24hr Review
\`\`\`

---

## 🎯 Success Criteria

✅ **DEPLOYMENT IS SUCCESSFUL WHEN:**
- [ ] Site loads without "Payment system not configured" error
- [ ] Test payment processes successfully
- [ ] Webhook event appears in Stripe dashboard
- [ ] Email confirmation sent after payment
- [ ] No console errors
- [ ] Connected account can be created
- [ ] Products can be listed
- [ ] Seller can complete onboarding

---

## 📞 Support Resources

### **If You Get Stuck:**
1. Check: **STRIPE_QUICK_REFERENCE.md** - Quick answers
2. Read: **STRIPE_SETUP_GUIDE.md** - Detailed steps
3. Reference: **NETLIFY_ENV_VARIABLES.md** - All variables
4. Deep dive: **STRIPE_COMPLETE_IMPLEMENTATION.md** - Technical details
5. Contact: https://support.stripe.com - Official support

### **Quick Links:**
- Stripe Dashboard: https://dashboard.stripe.com
- API Keys: https://dashboard.stripe.com/apikeys
- Webhooks: https://dashboard.stripe.com/webhooks
- Stripe Docs: https://docs.stripe.com
- Payments: https://dashboard.stripe.com/payments

---

## ⏱️ Timeline

\`\`\`
Estimate vs Actual:
├─ Stripe Setup: 15 min
├─ Getting Keys: 5 min
├─ Netlify Config: 5 min
├─ Redeploy: 2 min
├─ First Test: 5 min
├─ Full Testing: 30 min
├─ Troubleshooting: 15 min (if needed)
├─ Documentation Review: 20 min
└─ TOTAL: ~1.5 hours to production ready

Ready to Deploy: YES ✅
\`\`\`

---

## 🎉 You're Ready!

Follow this checklist in order and your Stripe integration will be live in **less than 2 hours**.

**Start now:** Get your Stripe keys and begin Phase 1! 🚀
