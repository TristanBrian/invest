# Netlify Forms Configuration Guide

## Overview
The contact form has been configured to use **Netlify Forms** instead of SendGrid. This eliminates the need for API keys and provides automatic email notifications to both company recipients.

## How It Works

### Contact Form Integration
- Form name: `investment-enquiry`
- Submission method: `POST` to Netlify
- All form data is automatically captured and stored in Netlify
- Email notifications sent to both configured addresses

### Automatic Email Notifications
When a form is submitted, Netlify automatically sends notifications to:
- `oxicgroupltd@group.com`
- `Info@oxicinternational.co.ke`

## Deployment Requirements

### Step 1: Connect to Netlify
Ensure your site is connected to Netlify:
1. Go to [Netlify](https://netlify.com)
2. Connect your GitHub/GitLab repository
3. Build and deploy your Next.js project

### Step 2: Configure Form Notifications
1. Go to your Netlify site dashboard
2. Navigate to **Forms** section
3. Find the **"investment-enquiry"** form
4. Click **Settings** and configure email notifications:
   - **Notification emails**: `oxicgroupltd@group.com`, `Info@oxicinternational.co.ke`
   - **From email**: `noreply@example.netlify.app` (Netlify default)

### Step 3: Enable Built-in Netlify Features
In your Netlify site settings:
1. **Build & deploy** → **Build settings**
2. Ensure **Node version** is set to `20.11.0`
3. **Functions** tab → Enable Netlify Functions if needed

### Step 4: Test the Form
1. Visit your deployed site
2. Fill out the contact form
3. Submit
4. Check both email addresses for notification

## Features

✓ **No API Keys Required** - No SendGrid setup needed
✓ **Automatic Email Notifications** - Sent to both company emails
✓ **Built-in Spam Protection** - Netlify honeypot field included
✓ **Form Submissions Dashboard** - View all submissions in Netlify UI
✓ **Conditional Notifications** - Can be customized per form
✓ **GDPR Compliant** - Data handling follows regulations

## Form Configuration

### Form Attributes
```jsx
<form
  name="investment-enquiry"
  method="POST"
  netlify-honeypot="bot-field"
  data-netlify="true"
>
  <input type="hidden" name="form-name" value="investment-enquiry" />
  {/* form fields */}
</form>
```

### Hidden Fields
- `form-name`: Must match the form's `name` attribute
- `bot-field`: Honeypot spam protection (hidden input)

## Managing Form Submissions

### View Submissions
1. Netlify Dashboard → Forms
2. Click "investment-enquiry" form
3. Browse all submissions with:
   - Submission date/time
   - Form data
   - Spam status
   - IP address

### Export Data
1. Forms → investment-enquiry
2. Use export function to download submissions as CSV

### Delete Old Submissions
1. Forms → investment-enquiry
2. Select submissions
3. Click delete

## Troubleshooting

### Forms Not Appearing in Netlify UI
**Problem**: Form shows as "Unverified"
**Solution**: 
1. Ensure `name` attribute matches `form-name` hidden input
2. Redeploy site
3. Submit test form through deployed site (not local)

### Emails Not Being Received
**Problem**: No notifications arriving
**Solution**:
1. Check notification email addresses in Forms settings
2. Verify recipient email isn't in spam folder
3. Test with a confirmation email first
4. Check Netlify logs for errors

### Form Data Not Capturing
**Problem**: Submissions not appearing in dashboard
**Solution**:
1. Ensure `data-netlify="true"` is present
2. Verify form is deployed to Netlify (not localhost)
3. Check browser console for JavaScript errors
4. Ensure form has `method="POST"`

## Production Checklist

- [ ] Form name set to `investment-enquiry`
- [ ] Hidden fields included (form-name, bot-field)
- [ ] Email notifications configured in Netlify
- [ ] Both company emails added as recipients
- [ ] Form tested on deployed site
- [ ] Submissions visible in Forms dashboard
- [ ] Notification emails received at both addresses

## Support

For issues with Netlify Forms:
1. Check [Netlify Forms Documentation](https://docs.netlify.com/forms/setup/)
2. Review Netlify Function logs
3. Contact Netlify support through dashboard
