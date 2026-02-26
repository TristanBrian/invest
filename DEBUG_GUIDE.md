# Email System Debugging Guide

## Problem: Enquiries Submit Successfully but No Emails Arrive

This guide helps you identify where emails are failing to send.

---

## Step 1: Check Browser Console

Open your browser's Developer Tools (F12) and submit an enquiry form.

### Look for this in the Console:

```
[v0] ===== INVESTMENT ENQUIRY REQUEST START =====
[v0] Received POST request to /api/forms/investment-enquiry
[v0] Request method: POST
[v0] Parsing request JSON...
[v0] Request body keys: name, email, organization, phone, interest, message, consent
[v0] Form data received: {
  name: ✓ Your Name...
  email: ✓ your@email.com
  organization: ✓ provided
  phone: ✓ provided
  interest: ✓ Real Estate
  message: ✓ XXXX chars
  consent: ✓ yes
}
[v0] All required fields present ✓
[v0] Data sanitized and prepared
[v0] Submission timestamp: 2026-02-26T...
[v0] Client IP address: XXX.XXX.XXX.XXX
[v0] Email validation passed ✓
[v0] Calling sendInquiryEmail function...
```

**If you see this:** ✅ Form is submitting correctly. Continue to Step 2.

**If you DON'T see this:** ❌ Form is not being submitted. Check:
- Form validation on page
- Network tab for POST request
- Check if form data is complete

---

## Step 2: Check Email Distribution in Console

Continue watching the console for email sending logs:

### Expected Output - Email to First Team Member:

```
[v0] ===== EMAIL SEND START =====
[v0] Recipient: oxicgroupltd@gmail.com
[v0] Subject: Investment Enquiry from Your Name
[v0] Reply-To: your@email.com
[v0] API Key present: true
[v0] API Key length: 48
[v0] API Key starts with 're_': true
[v0] Preparing Resend API request...
[v0] Request payload size: 1234 bytes
[v0] Sending request to Resend API...
[v0] Response status: 200 OK
[v0] ✅ Email sent successfully to oxicgroupltd@gmail.com
[v0] Email ID: re_xxxxxxxxxxxxxxxxxxxxx
[v0] ===== EMAIL SEND SUCCESS =====
```

### Troubleshoot by Error Message:

#### Error: "API Key present: false"
```
[v0] ❌ CRITICAL: RESEND_API_KEY not found in environment variables
[v0] Available env vars: (list of variables)
```

**Fix:** 
1. Go to Netlify → Site Settings → Build & Deploy → Environment
2. Add: `RESEND_API_KEY` = `re_xxxxxxxxxxxxx`
3. Redeploy

#### Error: "Response status: 401"
```
[v0] Resend API error for oxicgroupltd@gmail.com: { message: "Unauthorized" }
```

**Fix:** 
- Your API key is invalid or expired
- Go to https://resend.com/api-keys
- Generate a new API key
- Update Netlify environment variable

#### Error: "Response status: 400"
```
[v0] Resend API error for oxicgroupltd@gmail.com: { message: "Invalid from address" }
```

**Fix:**
- The "from" email address needs verification in Resend
- Go to https://resend.com/emails
- Add or verify "inquiries@oxicinternational.co.ke"

#### Error: Exception "fetch failed"
```
[v0] Email sending exception for oxicgroupltd@gmail.com: TypeError: fetch failed
```

**Fix:**
- Network connectivity issue
- Check your internet connection
- Verify Resend API is accessible: https://api.resend.com/

---

## Step 3: Check Final Summary

Look for the final summary in console:

```
[v0] ===== INQUIRY EMAIL DISTRIBUTION COMPLETE =====
[v0] SUMMARY: {
  teamEmailsSent: 2,
  teamEmailsFailed: 0,
  autoReplySent: true,
  totalSuccess: true,
}
```

### Good Signs:
- `teamEmailsSent: 2` - Both team emails sent ✅
- `autoReplySent: true` - Customer auto-reply sent ✅
- `totalSuccess: true` - Everything worked ✅

### Problem Signs:
- `teamEmailsSent: 0` - No team emails sent ❌
- `autoReplySent: false` - No auto-reply sent ❌

---

## Step 4: Check Frontend Response

The page should display:

### Success Response:
```json
{
  "success": true,
  "message": "Thank you for your enquiry. We have received your message and sent a confirmation email. Our team will contact you within 24 hours.",
  "emailStatus": {
    "teamNotificationsSent": 2,
    "confirmationEmailSent": true,
    "totalEmailsSent": 3
  },
  "submissionId": "OXIC-1708945834000-a7k3m9q",
  "debug": {
    "allEmailsDelivered": true,
    "hasTeamEmails": true,
    "hasAutoReply": true
  }
}
```

**All green?** ✅ Emails should be in inboxes. Check spam folder.

### Partial Response:
```json
{
  "success": true,
  "message": "Your enquiry has been submitted successfully. Please check your email for confirmation.",
  "emailStatus": {
    "teamNotificationsSent": 1,
    "confirmationEmailSent": false,
    "totalEmailsSent": 1
  },
  "debug": {
    "allEmailsDelivered": false,
    "hasTeamEmails": true,
    "hasAutoReply": false
  }
}
```

**One or more failed?** Check the console logs above for which specific email failed.

---

## Step 5: Check Email Delivery Status

### In Browser Network Tab:

1. Open Developer Tools → Network tab
2. Submit enquiry form
3. Click on the POST request to `/api/forms/investment-enquiry`
4. Go to "Response" tab
5. Copy the response JSON and check:
   - `totalEmailsSent` count
   - Any error messages in response

### In Resend Dashboard:

1. Go to https://resend.com/emails
2. Look for emails from last 5 minutes
3. Check status:
   - ✅ Delivered
   - ⏳ Sent
   - ❌ Failed/Bounced

---

## Common Issues & Solutions

### Issue: "Enquiry says delivered but no email received"

**Cause:** Email is going to spam/junk folder

**Solution:**
1. Check spam folder in both email accounts
2. Mark as "Not Spam"
3. Add sender to contacts

### Issue: "Only one team email receives it"

**Cause:** The other team email address rejected it (spam filter, invalid address, etc.)

**Solution:**
- This is by design - one email failing doesn't block the other
- Check which email address is missing it
- Verify it's correct in code: `oxicgroupltd@gmail.com` and `Info@oxicinternational.co.ke`

### Issue: "Auto-reply not sent to customer"

**Cause:** Customer email address is invalid or rejected

**Solution:**
1. Verify the customer email format
2. Check if email has typo
3. Look for bounce message in Resend dashboard

### Issue: "All emails fail with 401 Unauthorized"

**Cause:** Invalid or expired API key

**Solution:**
1. Get new API key from https://resend.com/api-keys
2. Update Netlify environment: `RESEND_API_KEY`
3. Redeploy site

---

## Manual Testing with Console

To test without the form, open browser console and run:

```javascript
fetch('/api/forms/investment-enquiry', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Test User",
    email: "your-email@gmail.com",
    organization: "Test Company",
    phone: "+254700000000",
    interest: "Real Estate",
    message: "Testing the email system",
    consent: true
  })
})
.then(r => r.json())
.then(d => {
  console.log("===== RESPONSE =====");
  console.log(JSON.stringify(d, null, 2));
});
```

**Expected Output:**
- Status 200
- All debug flags true
- All emails sent count > 0

---

## Debug Log Checklist

Before contacting support, provide:

- [ ] Full browser console output (F12 → Console tab)
- [ ] Network response JSON
- [ ] Error messages (if any)
- [ ] Which emails were sent/failed
- [ ] Timestamp of the test
- [ ] Screenshot of Resend dashboard (emails received/failed)

---

## Verification Checklist

✅ **Before Declaring Success:**

1. Console shows all logs completing successfully
2. Response shows `"success": true`
3. Response shows `allEmailsDelivered: true`
4. Both team emails received the enquiry (check both inboxes)
5. Customer received auto-reply email
6. Email content is properly formatted (not truncated)
7. Email includes all form details
8. Customer can see submission reference ID in auto-reply

---

## Next Steps

If after following this guide emails still don't arrive:

1. **Check Resend Dashboard** - https://resend.com/emails
2. **Verify API Key** - https://resend.com/api-keys (make sure it's active)
3. **Check Netlify Logs** - Site Settings → Deployments → View logs
4. **Test with different email** - Try Gmail, Outlook, or corporate email
5. **Contact Resend Support** - If bounces show in their dashboard

---

**Last Updated:** 2026-02-26
**System:** OXIC International Investment Platform
