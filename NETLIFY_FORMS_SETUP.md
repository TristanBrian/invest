# Netlify Forms Setup Guide

This document provides step-by-step instructions to configure Netlify Forms for the contact enquiry form.

## Overview

The contact enquiry form is now configured to use **Netlify Forms** - a built-in feature that handles form submissions without requiring backend API calls. Submissions are automatically received in your Netlify dashboard and can be forwarded to your email.

## Prerequisites

- Your site is deployed on Netlify
- You have access to the Netlify dashboard
- Form detection is enabled (it is by default)

## Setup Steps

### Step 1: Deploy Your Updated Code

Push the latest code changes to your Git repository. Netlify will automatically redeploy your site. Once deployed, Netlify will detect the form automatically due to the `data-netlify="true"` attribute.

### Step 2: Verify Form Detection

1. Go to your Netlify Dashboard
2. Select your site: **oxicinternational.co.ke**
3. Navigate to **Forms** in the left sidebar
4. You should see **"contact-enquiry"** form listed
5. Confirm the message: **"Form detection is enabled"**

If the form doesn't appear:
- Check that your site has been deployed (check **Deploys** tab)
- Wait 2-3 minutes for form detection
- Clear your browser cache and refresh

### Step 3: Configure Email Notifications

#### For Each Email Address:

1. In the Forms section, click on **contact-enquiry** form
2. Click **Add notification** button
3. Select **Email notification**
4. Fill in the following:

   **Notification 1 - Admin Notification**
   - **To:** accounts@oxicgroupltd.com (or your preferred admin email)
   - **From:** noreply@oxicgroup.netlify.app (Netlify's default)
   - **Subject:** New Investment Enquiry Submission
   - **Reply-to:** {% raw %}{{ email }}{% endraw %} (Auto-inserts submitter's email)

   **Notification 2 - Client Confirmation (Optional)**
   - **To:** {% raw %}{{ email }}{% endraw %} (Auto-sends to form submitter)
   - **From:** noreply@oxicgroup.netlify.app
   - **Subject:** We Received Your Enquiry
   - **Body Template:**
     \`\`\`
     Thank you for your enquiry!
     
     We appreciate your interest in The Oxic International Group.
     Our team has received your submission and will review it carefully.
     
     You can expect to hear from us within 24 hours.
     
     Best regards,
     The Oxic International Group
     \`\`\`

### Step 4: Test the Form

1. Go to your live site: **https://oxicinternational.co.ke**
2. Scroll to the "Get In Touch" section
3. Fill in all required fields:
   - Name
   - Email
   - Phone (optional)
   - Organization (optional)
   - Investment Interest
   - Message
   - Check the consent checkbox
4. Click **Submit Enquiry**

### Step 5: Verify Submission

1. Check your email inbox (both admin and client if configured)
2. Return to Netlify Dashboard → Forms → contact-enquiry
3. You should see the submission listed with:
   - Submission date/time
   - All form fields captured
   - Submission number

## Form Field Reference

The form captures the following fields:

| Field Name | Type | Required | Description |
|---|---|---|---|
| `name` | Text | Yes | Full name of enquirer |
| `email` | Email | Yes | Contact email address |
| `organization` | Text | No | Company/organization name |
| `phone` | Tel | No | Contact phone number |
| `interest` | Select | Yes | Investment interest area |
| `message` | Textarea | Yes | Detailed message/enquiry |
| `consent` | Checkbox | Yes | Privacy consent confirmation |

## Spam Protection

The form includes **Honeypot protection** (the `bot-field`) which automatically filters out spam submissions. This is a common anti-spam technique that:
- Is invisible to real users
- Traps spam bots that fill all fields
- Requires no configuration

## Email Customization (Advanced)

You can customize email templates by adding a custom notification webhook or using Netlify's template syntax:

**Available Template Variables:**
\`\`\`
{{ email }}      - Submitter's email
{{ name }}       - Submitter's name
{{ message }}    - Message content
{{ interest }}   - Investment interest selection
{{ created_at }} - Submission date/time
{{ number }}     - Submission number
\`\`\`

## Troubleshooting

### Form Not Being Detected
- **Solution:** Ensure the form has `data-netlify="true"` attribute
- Check that the site has been redeployed after code changes
- Wait 5+ minutes and refresh the page

### Not Receiving Email Notifications
- Verify notification is enabled in Forms settings
- Check spam folder for emails
- Verify email address is correct
- Test with a different email address

### Spam Submissions
- Netlify automatically filters most spam
- You can manually delete spam submissions in dashboard
- Consider enabling reCAPTCHA integration (advanced)

## Limits & Pricing

- **Free Plan:** 100 form submissions/month
- **Pro Plan:** Unlimited submissions
- Extra submissions: $0.50 per submission

Check your current plan on the Netlify dashboard under **Billing**.

## Additional Resources

- [Netlify Forms Documentation](https://docs.netlify.com/forms/setup/)
- [Form Configuration Reference](https://docs.netlify.com/forms/setup/#html-forms)
- [Email Notifications Guide](https://docs.netlify.com/forms/notifications/)

---

**Last Updated:** January 2026
**Status:** Ready for Production
