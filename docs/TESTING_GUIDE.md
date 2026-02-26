# Complete Testing Guide - Email & Invoice System

## Pre-Deployment Testing Checklist

This guide walks you through testing the inquiry form and invoice system before deploying to Netlify.

### Environment Setup

1. **Verify RESEND_API_KEY in Netlify**
   - Go to Netlify Dashboard > Your Project > Site Settings > Build & Deploy > Environment
   - Confirm `RESEND_API_KEY` is set with your Resend API key
   - The key should start with `re_` 

2. **Local Testing (v0 Preview)**
   - The v0 preview environment may not have RESEND_API_KEY configured
   - **This is normal** - emails will fail in preview but work in production
   - Full testing will happen after Netlify deployment

---

## Test 1: Investment Inquiry Form

### What This Tests
- Form submission to `/api/forms/investment-enquiry`
- Email delivery to both: `oxicgroupltd@gmail.com` and `Info@oxicinternational.co.ke`
- Auto-reply to customer
- Professional HTML email templates

### Steps to Test (After Netlify Deployment)

1. **Navigate to Contact Section**
   - Go to your deployed site
   - Scroll to "Investment Inquiry" or contact section

2. **Fill Out Form**
   ```
   Name: John Doe
   Email: test@example.com
   Organization: Test Company
   Phone: +254 700 123456
   Investment Interest: Real Estate
   Message: I'm interested in learning more about your real estate investment opportunities in Kenya.
   Consent: Check the checkbox
   ```

3. **Submit Form**
   - Click "Submit Inquiry"
   - Should see success message: "Thank you for your enquiry. We have received your message..."

4. **Verify Email Delivery**
   
   **Check Inbox 1: oxicgroupltd@gmail.com**
   - Subject: "Investment Enquiry from John Doe"
   - Contains full inquiry details in professional template
   - Shows client info, investment interest, message content
   - Includes action button "Reply to Inquiry"

   **Check Inbox 2: Info@oxicinternational.co.ke**
   - Same inquiry details as Inbox 1
   - Confirms redundant email delivery working

   **Check Inbox 3: test@example.com (Customer)**
   - Subject: "We Received Your Investment Inquiry - Oxic International"
   - Professional auto-reply with next steps
   - Lists contact information
   - Confirms inquiry was received

5. **Expected Behavior**
   - ✅ All 3 emails received (or at least 2 if one fails)
   - ✅ Professional HTML formatting
   - ✅ Reply-to set correctly
   - ✅ Company branding and contact info present
   - ✅ Unique submission ID generated

---

## Test 2: Invoice Generation & Sending

### What This Tests
- Invoice creation with line items and calculations
- Professional invoice HTML template
- Email delivery to client
- Email delivery to team (both emails)
- Tax calculations
- Multi-currency support

### Steps to Test (After Netlify Deployment)

#### Option A: Using Browser Console (Simple Test)

1. **Open Browser DevTools**
   - Press `F12` or right-click > Inspect > Console tab

2. **Create and Send Test Invoice**
   ```javascript
   const invoiceRequest = {
     client: {
       name: "ABC Solutions Ltd",
       email: "client@example.com",
       phone: "+254 700 987654",
       organization: "ABC Solutions",
       address: "123 Business Park",
       city: "Nairobi",
       country: "Kenya"
     },
     lineItems: [
       {
         description: "Investment Advisory Consultation - Q1 2026",
         quantity: 1,
         unitPrice: 50000
       },
       {
         description: "Portfolio Management Services (3 months)",
         quantity: 3,
         unitPrice: 15000
       },
       {
         description: "Risk Assessment Report",
         quantity: 1,
         unitPrice: 25000
       }
     ],
     details: {
       invoiceNumber: "INV-2026-001",
       invoiceDate: new Date().toISOString(),
       dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
       currency: "KES",
       taxRate: 16,
       paymentTerms: "Net 30 days - Bank Transfer",
       notes: "Thank you for your business. Payment to OXIC International Group bank account."
     }
   };

   // Send invoice
   fetch('/api/invoices/send', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(invoiceRequest)
   })
   .then(r => r.json())
   .then(data => console.log('Invoice Response:', data))
   .catch(err => console.error('Error:', err));
   ```

3. **Check Console Output**
   - Should see success response with invoiceId and message
   - Status should be 200 (full success) or 207 (partial success)

#### Option B: Using cURL Command

```bash
curl -X POST https://your-site.netlify.app/api/invoices/send \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
      "name": "XYZ Investments",
      "email": "contact@xyzcorp.com",
      "phone": "+254 708 555000",
      "organization": "XYZ Corp",
      "address": "456 Commerce Street",
      "city": "Mombasa",
      "country": "Kenya"
    },
    "lineItems": [
      {
        "description": "Capital Investment Advisory",
        "quantity": 1,
        "unitPrice": 100000
      },
      {
        "description": "Quarterly Review & Rebalancing",
        "quantity": 4,
        "unitPrice": 25000
      }
    ],
    "details": {
      "invoiceNumber": "INV-2026-002",
      "invoiceDate": "2026-02-26T00:00:00Z",
      "dueDate": "2026-03-28T00:00:00Z",
      "currency": "KES",
      "taxRate": 16,
      "paymentTerms": "Net 30 days",
      "notes": "Invoice for advisory services"
    }
  }'
```

### Verify Invoice Email Delivery

1. **Check Client Email (contact@xyzcorp.com)**
   - Subject: "Your Invoice INV-2026-002 - OXIC International"
   - Shows professional invoice layout
   - Contains:
     - ✅ Company header with logo
     - ✅ Invoice number and dates
     - ✅ Client information
     - ✅ Line items table with description, qty, price, amount
     - ✅ Subtotal, Tax calculation, Total Due
     - ✅ Payment terms and notes
     - ✅ Company contact footer

2. **Check Team Email 1 (oxicgroupltd@gmail.com)**
   - Subject: "Invoice Sent: INV-2026-002 - XYZ Investments"
   - Contains invoice summary for team
   - Shows client name, email, invoice total
   - Indicates invoice status

3. **Check Team Email 2 (Info@oxicinternational.co.ke)**
   - Same as Team Email 1
   - Confirms both team emails received copy

### Expected Response Format

**Success (200 status):**
```json
{
  "success": true,
  "invoiceId": "invoice_1708965912345_abc1234de",
  "invoiceNumber": "INV-2026-002",
  "message": "Invoice successfully sent to client and all team members",
  "emailStatus": {
    "clientEmailSent": true,
    "teamEmailsSent": 2
  }
}
```

**Partial Success (207 status):**
```json
{
  "success": false,
  "invoiceId": "invoice_1708965912345_abc1234de",
  "invoiceNumber": "INV-2026-002",
  "message": "Invoice sent to client and 1 of 2 team members",
  "emailStatus": {
    "clientEmailSent": true,
    "teamEmailsSent": 1
  },
  "errors": ["Team email (Info@oxicinternational.co.ke): API Error"]
}
```

---

## Test 3: Error Handling

### Test Invalid Invoice Data

```javascript
// Missing required field
fetch('/api/invoices/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    client: { name: "Test" }, // Missing email
    lineItems: [{ description: "Item", quantity: 1, unitPrice: 100 }],
    details: {
      invoiceDate: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      currency: "KES"
    }
  })
})
.then(r => r.json())
.then(data => console.log('Error Response:', data));
```

**Expected Response (400 status):**
```json
{
  "success": false,
  "message": "Client name and email are required"
}
```

### Test Invalid Form Submission

```javascript
// Missing consent
const formData = {
  name: "John Doe",
  email: "john@example.com",
  interest: "Real Estate",
  message: "Test message",
  consent: false // Missing or false
};

fetch('/api/forms/investment-enquiry', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
.then(r => r.json())
.then(data => console.log('Error Response:', data));
```

**Expected Response (400 status):**
```json
{
  "success": false,
  "message": "Missing required form fields"
}
```

---

## Test 4: API Health Checks

### Check Invoice API Status
```bash
curl https://your-site.netlify.app/api/invoices/send
```

**Expected Response:**
```json
{
  "status": "operational",
  "service": "Invoice API",
  "endpoints": {
    "send": "POST /api/invoices/send"
  }
}
```

### Check Inquiry Form API
The inquiry form doesn't have a GET endpoint, only POST accepts submissions.

---

## Common Issues & Solutions

### Issue: "RESEND_API_KEY not configured"
**Cause:** Environment variable not set in Netlify
**Solution:**
1. Go to Netlify Dashboard > Site Settings > Build & Deploy > Environment
2. Add `RESEND_API_KEY` with your Resend API key
3. Trigger a new deployment or manually redeploy

### Issue: Emails not received
**Causes:**
- Check spam/junk folder
- Verify RESEND_API_KEY is correct (should start with `re_`)
- Check Resend dashboard for failed deliveries
- Verify email addresses are correct in submission

### Issue: Partial email delivery (207 status)
**Expected behavior:** At least one email was sent
- If client email sent but team emails failed: check team email addresses
- If team email sent but client failed: check client email format
- System is designed for resilience - at least one always succeeds

### Issue: Invoice line items not calculating correctly
**Solution:** Ensure:
- `quantity` is a number > 0
- `unitPrice` is a number >= 0
- System auto-calculates: `total = quantity * unitPrice`
- Tax calculated as: `tax = subtotal * (taxRate / 100)`

---

## Deployment Checklist

Before deploying to Netlify:

- [ ] All files created successfully:
  - [ ] `/lib/invoice-types.ts`
  - [ ] `/lib/invoice-template.tsx`
  - [ ] `/lib/invoice-service.ts`
  - [ ] `/lib/use-invoice.ts`
  - [ ] `/app/api/invoices/send/route.ts`
  - [ ] `/app/api/forms/investment-enquiry/route.ts` (updated)

- [ ] Environment variables configured:
  - [ ] `RESEND_API_KEY` set in Netlify

- [ ] Email addresses verified:
  - [ ] `oxicgroupltd@gmail.com` is correct
  - [ ] `Info@oxicinternational.co.ke` is correct

- [ ] Tests ready to run:
  - [ ] Test inquiry form submission
  - [ ] Test invoice generation and sending
  - [ ] Verify all email deliveries

---

## Post-Deployment Testing Steps

1. Deploy to Netlify
2. Wait 2-3 minutes for build to complete
3. Test inquiry form with test email address
4. Check all 3 emails (2 team + 1 auto-reply)
5. Test invoice API using console or cURL
6. Verify invoice emails received by client and team
7. Check email formatting and content

---

## Support & Debugging

**Enable detailed logging:**
- All operations log to browser console (client-side) or Netlify Functions dashboard (server-side)
- Look for `[v0]` prefix in logs for v0-specific messages

**Check Resend Dashboard:**
- Go to resend.com > Dashboard
- View all sent emails and delivery status
- Check for bounce/spam reports

**Netlify Function Logs:**
- Netlify Dashboard > Functions > Choose function > Logs
- View real-time server-side logs
- Helpful for debugging API errors

---

## Next Steps After Successful Testing

1. ✅ Confirm all emails deliver correctly
2. ✅ Test with real client and team emails
3. ✅ Document any custom configurations
4. ✅ Train team on invoice generation workflow
5. ✅ Set up email forwarding rules if needed
6. ✅ Create backup email notification system if required

---

**Created:** 2026-02-26
**Last Updated:** 2026-02-26
**Status:** Ready for Production Testing
