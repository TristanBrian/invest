# Netlify @netlify/plugin-nextjs@5 Migration Guide

## Overview

This document guides you through the migration to use @netlify/plugin-nextjs@5 with Netlify Forms support.

## Changes Made

### 1. **netlify.toml Configuration**

✅ Removed conflicting settings:
- Removed `functions = "netlify/functions"` (plugin handles this)
- Removed `[functions."api/**"]` configuration (plugin manages API routes)

✅ Added plugin configuration:
\`\`\`toml
[[plugins]]
  package = "@netlify/plugin-nextjs"

[plugins.inputs]
  cacheOnClient = true
\`\`\`

### 2. **next.config.mjs Configuration**

✅ Added experimental settings for better stability:
- Added `staticGenerationRetryCount: 1` to handle edge cases during builds

## Netlify Forms Setup (After Deployment)

Once your site deploys successfully, follow these steps to enable form notifications:

### Step 1: Verify Form Detection
1. Go to your Netlify Dashboard
2. Navigate to **Forms** in the left sidebar
3. You should see `contact-enquiry` form listed
4. The green checkmark indicates form detection is enabled

### Step 2: Configure Email Notifications
1. Click on the `contact-enquiry` form
2. Click **Settings** or **Form Settings**
3. Scroll to **Notifications** section
4. Click **Add notification**
5. Select **Email notification**
6. Enter recipient email: `info@oxicinternational.co.ke`
7. Save the notification

### Step 3: Test Form Submission
1. Go to your website at oxicinternational.co.ke
2. Fill out the contact enquiry form
3. Click "Submit Enquiry"
4. You should see success message: "Enquiry Acknowledged"
5. Check the email for the form submission

## What's Different?

| Aspect | Before | After |
|--------|--------|-------|
| Forms Support | Not configured | Native support enabled |
| API Routes | Manual function config | Plugin auto-manages |
| Build Command | Standard build | Plugin-optimized build |
| Form Submission | Manual API handling | Netlify Forms native |

## Troubleshooting

### Issue: Build still failing
- Clear Netlify cache: Dashboard → Deploys → Trigger redeploy
- Check environment variables are set
- Ensure Node 20+ is being used

### Issue: Form not appearing in Netlify dashboard
- Wait 5-10 minutes after deploy
- Check form has `name="contact-enquiry"` attribute
- Verify form has `data-netlify="true"` attribute

### Issue: Form not sending emails
- Check Email notification is configured in form settings
- Verify recipient email in notifications
- Check spam folder for test emails

## Next Steps

1. Push these changes to your repository
2. Netlify will automatically redeploy
3. Wait for successful build notification
4. Configure form notifications in Netlify dashboard
5. Test form submission from your website

## Resources

- [Netlify Next.js Plugin Migration Guide](https://ntl.fyi/next-runtime-forms-migration)
- [Netlify Forms Documentation](https://docs.netlify.com/forms/overview/)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
