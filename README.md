# The Oxic International Group - Investor Liaison Platform

A professional investor liaison platform for The Oxic International Group, designed to connect global investors with opportunities in Kenya and East Africa.

## About

The Oxic International Group is building a people-centric, ICT-driven investor liaison and execution platform designed to help global investors enter and scale in Kenya and East Africa with speed, confidence, and reduced risk.

### Our Mission

By combining deep local market intelligence, technology-enabled investor journey management, and hands-on stakeholder engagement, we remove the friction, opacity, and execution gaps that typically undermine investments in emerging markets.

### Services

- **Investment Due Diligence** - Comprehensive market research, regulatory guidance, and stakeholder mapping
- **Market Entry Strategy** - Tailored entry strategies leveraging local partnerships and compliance frameworks
- **Project Execution** - End-to-end project management, vendor coordination, and quality assurance
- **Growth & Scaling** - Strategic expansion support, talent acquisition, and operational optimization

### Founder

**Francis Kiame** - Founder & Managing Director

Positioned as a trusted on-the-ground partner, we bridge global capital with bankable opportunities, institutional partners, and scalable growth.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Language**: TypeScript
- **Deployment**: Netlify
- **Email Service**: Resend
- **Payment Gateway**: M-Pesa Daraja API + Stripe

## Features

- Responsive design optimized for all screen sizes
- Professional landing page with company overview
- Services showcase with detailed offerings
- Founder profile section
- Contact form with Resend email integration
- M-Pesa STK push payment integration
- Payment callbacks with email notifications
- Production-ready security and error handling

## Integrations

### Email Service (Resend)
- Automated contact form notifications
- Payment confirmation emails
- Delivery tracking and monitoring

### Payment Processing
- **M-Pesa**: STK push for mobile payments (Kenya)
- **Stripe**: Credit/debit card processing (Optional)

### Contact & Support

- **Email**: oxicgroupltd@gmail.com
- **Alternate Email**: Info@oxicinternational.co.ke
- **WhatsApp**: +254 748 992 777
- **Phone**: +254 748 992 777
- **Location**: Nairobi, Kenya

## Deployment

### Development
\`\`\`bash
npm run dev
\`\`\`

### Production (Netlify)

See [QUICK_START.md](./QUICK_START.md) for deployment instructions.

## Configuration

All API integrations require environment variables. See `.env.example` for the complete list.

### Required Variables
- `RESEND_API_KEY` - Email service
- `MPESA_CONSUMER_KEY` - M-Pesa Daraja API
- `MPESA_CONSUMER_SECRET` - M-Pesa Daraja API
- `MPESA_PASSKEY` - M-Pesa STK push
- `MPESA_SHORTCODE` - Business M-Pesa account

For detailed setup instructions, see [INTEGRATION_SETUP.md](./INTEGRATION_SETUP.md).

---

© 2026 The Oxic International Group. All rights reserved.
