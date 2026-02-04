# Quick Start Guide - Setup & Deployment

## Local Development

### 1. Clone & Install
```bash
git clone https://github.com/TristanBrian/invest.git
cd invest
npm install
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env.local

# Edit and add your API keys
nano .env.local
```

**Required for local testing:**
- `RESEND_API_KEY` - From https://resend.com/api-keys
- `MPESA_CONSUMER_KEY` - From https://developer.safaricom.co.ke
- `MPESA_CONSUMER_SECRET` - From https://developer.safaricom.co.ke
- `MPESA_PASSKEY` - From Daraja Lipa Na M-Pesa Online
- `MPESA_SHORTCODE` - Your M-Pesa Paybill/Till number

### 3. Run Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Deployment to Netlify

### 1. Connect Repository
- Log in to Netlify
- Click "New site from Git"
- Select your GitHub repository
- Authorize Netlify

### 2. Configure Build Settings
```
Build command: npm run build
Publish directory: .next
Node version: 20.11.0
```

### 3. Set Environment Variables
In Netlify Dashboard → Site Settings → Build & deploy → Environment:

Add all variables from `.env.example`:
```
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL_TO=oxicgroupltd@gmail.com,Info@oxicinternational.co.ke
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_PASSKEY=...
MPESA_SHORTCODE=...
MPESA_ENV=production
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
```

### 4. Configure Domain
- Go to Domain settings
- Add your custom domain: `oxicinternational.co.ke`
- Update DNS records as instructed
- Enable HTTPS (automatic with Netlify)

### 5. Deploy
```bash
# Push to GitHub - Netlify automatically deploys
git add .
git commit -m "Production deployment"
git push origin main
```

## Features Configured

✅ **Contact Form**
- Investment inquiry form with validation
- Email notifications via Resend
- JSON API submission

✅ **M-Pesa Integration**
- STK push payment initiation
- Automatic payment callbacks
- Email notifications for transactions
- Production-ready configuration

✅ **Stripe Support**
- Optional payment gateway
- Environment variables configured
- Ready for production setup

✅ **Email Service**
- Resend integration
- Transparent logo display
- Professional email templates
- Multiple recipient support

## Important Notes

### Security
- Never commit `.env.local` to repository
- Keep API keys secret
- Use HTTPS in production
- Enable domain verification for email

### M-Pesa Testing
```json
{
  "phoneNumber": "254748992777",
  "amount": 10,
  "accountReference": "TEST",
  "transactionDesc": "Test Payment"
}
```

### Email Testing
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "organization": "Test",
  "phone": "254748992777",
  "interest": "Investment",
  "message": "Test inquiry",
  "consent": true
}
```

## Troubleshooting

### Build Fails
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check Node version: `node -v` (should be 20.11.0)

### Emails Not Sending
- Verify Resend API key in environment
- Check Resend dashboard for errors
- Ensure domain is verified (production)

### M-Pesa Callback Issues
- Verify callback URL is publicly accessible
- Check Daraja credentials
- Monitor callback logs in terminal

### Deployment Issues
- Check Netlify build logs
- Verify all environment variables are set
- Ensure GitHub branch is connected

## Support Resources

- **Resend Docs**: https://resend.com/docs
- **Daraja API**: https://developer.safaricom.co.ke
- **Stripe Docs**: https://stripe.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Next.js Docs**: https://nextjs.org/docs

## Full Integration Guide

See [INTEGRATION_SETUP.md](./INTEGRATION_SETUP.md) for detailed setup instructions for each service.

---

Ready to deploy? Follow the steps above and you'll be live in minutes!
