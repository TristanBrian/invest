# 🎯 Stripe Integration - Quick Reference Card

## ⚡ 5-Minute Setup

### 1. Get Keys (5 min)
```
https://dashboard.stripe.com/apikeys
Copy: Secret Key (sk_test_...)
Copy: Publishable Key (pk_test_...)

https://dashboard.stripe.com/webhooks
Click: + Add endpoint
URL: https://yourdomain.com/api/webhooks/stripe
Events: checkout.session.completed, payment_intent.succeeded, account.updated, account.external_account.created
Copy: Signing secret (whsec_...)
```

### 2. Add to Netlify (2 min)
```
Site Settings → Build & Deploy → Environment → Edit variables

STRIPE_SECRET_KEY = sk_test_...
STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
NEXT_PUBLIC_APP_URL = https://yourdomain.com
```

### 3. Redeploy (1 min)
- Push to git or manually redeploy on Netlify
- Wait for build to complete

### 4. Test (2 min)
```
Use card: 4242 4242 4242 4242
Any future date, any 3-digit CVC
Should see success in Stripe dashboard
```

---

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/stripe/checkout` | Process one-time payment |
| POST | `/api/stripe/connect/create-account` | Create seller account |
| POST | `/api/stripe/connect/account-link` | Generate onboarding URL |
| GET | `/api/stripe/connect/account-status?accountId=...` | Check seller status |
| POST | `/api/stripe/products` | Create product |
| GET | `/api/stripe/products` | List all products |
| POST | `/api/webhooks/stripe` | Receive Stripe events |

---

## 💰 Test Cards

```
Visa Success:     4242 4242 4242 4242
Visa Decline:     4000 0000 0000 0002
Mastercard:       5555 5555 5555 4444
Amex:             3782 822463 10005

Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
Postal: Any (e.g., 12345)
```

---

## 📝 Common Requests

### Create Seller Account
```bash
curl -X POST https://yourdomain.com/api/stripe/connect/create-account \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Coffee Shop",
    "contactEmail": "owner@coffee.com",
    "country": "us"
  }'
```

### Get Onboarding Link
```bash
curl -X POST https://yourdomain.com/api/stripe/connect/account-link \
  -H "Content-Type: application/json" \
  -d '{"accountId": "acct_..."}'
```

### Create Product
```bash
curl -X POST https://yourdomain.com/api/stripe/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Coffee",
    "description": "Freshly roasted",
    "priceInCents": 1299,
    "currency": "usd",
    "accountId": "acct_..."
  }'
```

### Check Seller Status
```bash
curl https://yourdomain.com/api/stripe/connect/account-status?accountId=acct_...
```

---

## 🐛 Debug Checklist

```
❌ 503 Payment system not configured
  ✓ Check STRIPE_SECRET_KEY in Netlify env vars
  ✓ Redeploy after adding vars
  ✓ Wait for build to complete

❌ Webhook returns 403 (Invalid signature)
  ✓ Verify STRIPE_WEBHOOK_SECRET matches Stripe dashboard
  ✓ Ensure webhook URL matches exactly
  ✓ Check timestamp (must be < 5 min old)

❌ Connected account creation fails
  ✓ Ensure country code is 2 chars (e.g., "us")
  ✓ Verify email format is valid
  ✓ Check Stripe account has Connect enabled

❌ Test card declines
  ✓ Use 4242 4242 4242 4242 (always succeeds)
  ✓ Use future date (e.g., 12/25)
  ✓ Use any 3-digit CVC
```

---

## 📱 Webhook Events

| Event | What Happens | Action |
|-------|--------------|--------|
| `checkout.session.completed` | Customer paid | Update order, send email |
| `payment_intent.succeeded` | Payment processed | Log transaction |
| `account.updated` | Seller account changed | Notify seller if requirements |
| `account.external_account.created` | Bank account linked | Enable payouts |

---

## 🚀 Go Live Checklist

```
Before switching to LIVE keys:

□ All test payments work
□ Webhooks receive events
□ Emails send on payment
□ Connected accounts onboard successfully
□ Seller receives payouts (test)

When ready:
□ Get live keys from Stripe dashboard
□ Update Netlify env vars (sk_live_, pk_live_, whsec_live_)
□ Update webhook endpoint for live
□ Create live webhook endpoint
□ Copy live webhook secret
□ Redeploy site
□ Test with real payment
□ Monitor dashboard for issues
```

---

## 📞 Support Links

- **Stripe Docs**: https://docs.stripe.com
- **API Reference**: https://docs.stripe.com/api
- **Dashboard**: https://dashboard.stripe.com
- **Test Cards**: https://docs.stripe.com/testing
- **Webhooks**: https://docs.stripe.com/webhooks
- **Connect**: https://docs.stripe.com/connect

---

## 🎯 Payment Flow Diagram

```
Customer                Platform              Stripe              Seller
   │                       │                    │                   │
   ├─ Click Buy ──────────>│                    │                   │
   │                       │                    │                   │
   │<──── Redirect to ──────┤──── Create ──────>│                   │
   │     Checkout Session   │    Session        │                   │
   │                       │                    │                   │
   │───── Enter Card ──────────────────────────>│                   │
   │                       │                    │                   │
   │                       │<───── Success ─────┤                   │
   │<──── Success Page ─────┤<─────────────────┘                   │
   │                       │                    │                   │
   │                       │    Webhook Event ──────────────────>  │
   │                       │    (Payment Complete)                 │
   │                       │                    │                   │
   │<──── Confirmation ─────┤    Email Sent      │   Payout Ready   │
   │      Email             │                    │    (after funds) │
   │                       │                    │                   │
```

---

## 🔐 Security Tips

✅ **DO:**
- Keep secret keys in env vars only
- Verify webhook signatures
- Use HTTPS only
- Rotate webhook secrets regularly
- Monitor Stripe dashboard logs

❌ **DON'T:**
- Commit keys to git
- Share secret keys
- Use test keys in production
- Skip webhook verification
- Ignore Stripe security alerts

---

## 💡 Quick Wins

1. **Fastest Setup**: 5 minutes, just 3 env vars
2. **Test Payments**: Use card 4242 4242 4242 4242
3. **Monitor**: Check Stripe dashboard for all events
4. **Webhooks**: Always verify signature (shown in code)
5. **Go Live**: Flip 3 test keys to 3 live keys

---

**Status: READY TO DEPLOY** ✅

All endpoints, validation, error handling, and security measures are in place. Just add keys and deploy!
