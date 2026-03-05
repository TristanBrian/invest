# KCB STK Push - Quick Reference Guide

## Setup (5 minutes)

### 1. Set Environment Variables
```bash
# Netlify Settings > Build & Deploy > Environment
KCB_CLIENT_ID=your_client_id
KCB_CLIENT_SECRET=your_client_secret
KCB_ORG_SHORTCODE=your_org_shortcode
KCB_ORG_PASSKEY=your_org_passkey
KCB_ENV=sandbox                          # Start with sandbox
KCB_CALLBACK_URL=https://yourdomain.com/api/kcb/callback
```

### 2. Test Configuration
```bash
# Run this to verify config is loaded correctly
curl -X GET https://yourdomain.com/api/kcb
# Response: { "service": "KCB STK Push Payment API", "version": "1.0.0", "status": "operational" }
```

## API Usage

### Initiate KCB Payment
```bash
curl -X POST https://yourdomain.com/api/kcb \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "0712345678",
    "amount": 1000,
    "customerEmail": "user@example.com",
    "customerName": "John Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "STK Push initiated. Check your phone for prompt.",
  "transactionId": "OXIC-20260305-a7f2b3c1-5d8e"
}
```

### Phone Number Formats (All Accepted)
- `0712345678` → normalized to `254712345678`
- `+254712345678` → normalized to `254712345678`
- `254712345678` → already correct

### Amount Validation
- Minimum: 1 KES
- Maximum: 150,000 KES
- Decimal: Not supported (integer only)

## Frontend Integration

### Import Components
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Navigate to payment pages
<a href="/payment">View All Payments</a>
<a href="/payment/kcb">KCB Payment</a>
<a href="/payment/mpesa">M-Pesa Payment</a>
```

### Make KCB Payment (Client-side)
```tsx
const response = await fetch("/api/kcb", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    phoneNumber: "0712345678",
    amount: 1000,
    customerEmail: "user@example.com",
    customerName: "John Doe",
  })
})

const data = await response.json()
if (data.success) {
  console.log("Transaction ID:", data.transactionId)
  // User will receive STK prompt
} else {
  console.error("Payment failed:", data.error)
}
```

## Transaction Tracking

### Get Transaction
```tsx
import transactionManager from "@/lib/transaction-manager"

// By transaction ID
const tx = transactionManager.getTransaction("OXIC-20260305-a7f2b3c1-5d8e")

// By merchant request ID (from callback)
const tx = transactionManager.getTransactionByMerchantId("KCB_1234567890_xyz")

// Get logs
const logs = transactionManager.getTransactionLogs("OXIC-20260305-a7f2b3c1-5d8e")

// Export for invoice
const invoice = transactionManager.exportTransactionForInvoice("OXIC-20260305-a7f2b3c1-5d8e")
```

### Transaction Statuses
```
INITIATED  → Just created, waiting for callback
WAITING    → STK Push sent, awaiting user input
COMPLETED  → Payment successful
FAILED     → Payment declined or error occurred
CANCELLED  → User cancelled the transaction
```

## Callback Handling

### Callback Flow
1. User enters PIN on their phone
2. KCB processes payment
3. KCB sends webhook to `/api/kcb/callback`
4. System updates transaction status
5. Email notification sent

### Manual Callback Testing
```bash
curl -X POST https://yourdomain.com/api/kcb/callback \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "KCB_123456",
    "merchantRequestId": "KCB_1234567890_xyz",
    "resultCode": 0,
    "resultDescription": "Success",
    "amount": 1000,
    "phoneNumber": "254712345678",
    "mpesaReceiptNumber": "KCB123456789"
  }'
```

## Debugging

### Enable Debug Logging
All debug output is prefixed with `[v0]` for easy filtering:
```
[v0] KCB Config Debug: { clientIdLength: 45, ... }
[v0] KCB Token acquired successfully
[v0] KCB STK Push initiated successfully
[v0] KCB Callback received at 2026-03-05T10:30:45Z
[v0] KCB Payment SUCCESS for transaction: OXIC-20260305-a7f2b3c1-5d8e
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Missing credentials: KCB_CLIENT_ID` | Env var not set | Add to Netlify environment vars |
| `Invalid phone format` | Wrong phone number | Use format: 0712345678 or +254712345678 |
| `Amount must be between 1 and 150,000` | Out of range | Check amount value |
| `Failed to acquire KCB access token` | OAuth2 error | Verify client credentials |
| `Request origin not allowed` | CORS issue | Check origin configuration |
| `Too many requests` | Rate limit exceeded | Wait 60 seconds before retry |

### Enable Detailed Logging
Add to your code temporarily:
```tsx
console.log("[v0] Payment request:", { phoneNumber, amount })
const response = await fetch("/api/kcb", { /* ... */ })
console.log("[v0] Payment response:", response.json())
```

## Security Best Practices

### ✅ Do
- Use HTTPS for all callbacks
- Validate all inputs client-side and server-side
- Rate limit requests per IP
- Log all transactions
- Use environment variables for secrets
- Sanitize error messages in production
- Verify callback signatures if provided

### ❌ Don't
- Expose credentials in code
- Log sensitive data (full phone numbers, amounts)
- Trust client-side validation alone
- Make callback URLs public
- Use same credentials for sandbox/production
- Hardcode callback URLs

## Integration Checklist

- [ ] Environment variables configured
- [ ] Test endpoint responding (GET /api/kcb)
- [ ] M-Pesa payment still working
- [ ] Card payment still working
- [ ] Crypto payment still working
- [ ] Invoice functionality still working
- [ ] New payment hub page `/payment` loads
- [ ] Can navigate to `/payment/kcb`
- [ ] Form validates input correctly
- [ ] Can initiate test payment
- [ ] Callback endpoint accessible from public internet
- [ ] Email notifications working
- [ ] Transaction tracking functional
- [ ] Error messages user-friendly
- [ ] Mobile responsive design
- [ ] No console errors in browser

## URLs Reference

```
# Payment Hub
GET /payment                    # All payment methods
GET /payment/mpesa             # M-Pesa page
GET /payment/kcb               # KCB page
GET /payment/card              # Card info
GET /payment/bank              # Bank transfer info
GET /payment/crypto            # Crypto info
GET /payment/invoice           # Invoice info

# APIs
POST /api/kcb                  # Initiate payment
POST /api/kcb/callback         # Receive callback
POST /api/mpesa                # M-Pesa (existing)
POST /api/mpesa/callback       # M-Pesa callback (existing)
```

## Performance Targets

| Metric | Target | Actual |
|--------|--------|--------|
| Token request | <300ms | TBD |
| STK Push init | <700ms | TBD |
| Callback process | <100ms | TBD |
| Page load | <2s | TBD |
| Mobile response | <1s | TBD |

## Support

For KCB-specific issues:
- Check OAuth2 credentials
- Verify phone number format
- Check amount range (1-150,000 KES)
- Review callback URL accessibility
- Check firewall/security groups

For general payment issues:
- See `/payment` page Help section
- Contact support@oxic.co
- Check transaction logs via transaction manager

## Sandbox vs Production

### Switching to Production
```bash
# Update environment variable
KCB_ENV=production

# Update credentials to production values
KCB_CLIENT_ID=prod_client_id
KCB_CLIENT_SECRET=prod_client_secret

# Update callback URL if domain changed
KCB_CALLBACK_URL=https://prod.yourdomain.com/api/kcb/callback
```

### Testing in Sandbox
- Use test phone numbers provided by KCB
- No real money moves
- Instant STK prompts
- Test PIN always succeeds
- Great for integration testing

### Testing in Production
- Real money required
- Real phone numbers
- Real KCB network calls
- Real email notifications
- Use carefully with small amounts

## Next Steps

1. Set up KCB credentials
2. Configure environment variables
3. Test `/api/kcb` endpoint
4. Test payment pages
5. Monitor transaction logs
6. Set up email notifications
7. Train support team
8. Deploy to production
9. Monitor success rates
10. Gather user feedback

---

**Last Updated:** March 5, 2026
**Version:** 1.0.0
**Status:** Production Ready
