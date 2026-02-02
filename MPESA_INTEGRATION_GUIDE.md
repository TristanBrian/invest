# M-Pesa Integration Guide

This guide covers the setup and configuration of M-Pesa (Safaricom's payment platform) integration for The Oxic International Group investment platform.

## Overview

The M-Pesa integration enables investors to make payments directly from their mobile phones using the STK Push (Lipa Na M-Pesa Online) method. Payments are processed through Safaricom's Daraja API and confirmed via callbacks.

## Prerequisites

- Active M-Pesa Business Account (Paybill/Till number)
- Safaricom Daraja API credentials
- SendGrid API key (for email notifications)
- Valid SSL certificate on production domain

## Environment Variables

Add these variables to your `.env.local` (development) and Vercel deployment environment variables:

\`\`\`
# M-Pesa Credentials
MPESA_CONSUMER_KEY=your_daraja_consumer_key
MPESA_CONSUMER_SECRET=your_daraja_consumer_secret
MPESA_PASSKEY=your_lipa_na_mpesa_online_passkey
MPESA_SHORTCODE=your_paybill_or_till_number
MPESA_ENV=sandbox  # Use "sandbox" for testing, "production" for live

# Optional: Custom callback URL
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback

# Email Notifications
SENDGRID_API_KEY=your_sendgrid_api_key
\`\`\`

## Getting Your M-Pesa Credentials

### 1. Register on Safaricom Daraja

1. Visit [Safaricom Daraja Portal](https://developer.safaricom.co.ke)
2. Create a new account or login
3. Create a new application for "Express" or "Online Checkout"
4. Note your **Consumer Key** and **Consumer Secret**

### 2. Get Your Business Shortcode & Passkey

1. Log in to your M-Pesa Business Account portal
2. Navigate to Settings → Lipa Na M-Pesa Online
3. Generate or retrieve your:
   - **Business Shortcode** (Paybill/Till number)
   - **Lipa Na M-Pesa Online Passkey**

### 3. Configure Callback URL

1. In the Daraja portal, set your callback URL to:
   \`\`\`
   https://yourdomain.com/api/mpesa/callback
   \`\`\`
2. This URL will receive payment confirmations from M-Pesa

## Implementation

### Payment Flow

1. **User initiates payment** → Provides phone number and amount
2. **STK Push sent** → M-Pesa prompt appears on user's phone
3. **User completes payment** → Enters M-Pesa PIN
4. **Callback received** → Server receives payment confirmation
5. **Email notification** → Both team emails receive payment details
6. **Business logic triggered** → Update investor status, send confirmation

### API Endpoints

#### POST `/api/mpesa/route.ts`
Initiates an M-Pesa payment request.

**Request:**
\`\`\`json
{
  "phoneNumber": "254700000000",
  "amount": "1000",
  "accountReference": "INV-001",
  "transactionDesc": "Investment Payment"
}
\`\`\`

**Response (Success):**
\`\`\`json
{
  "success": true,
  "message": "STK push sent successfully",
  "checkoutRequestID": "..."
}
\`\`\`

#### POST `/api/mpesa/callback`
Receives payment confirmations from M-Pesa. Automatically sends emails to both company recipients.

## Testing (Sandbox)

### Test Credentials

- **Business Shortcode:** 174379
- **Passkey:** bfb279f9aa9bdbcf158e97dd1a503b6015e5f29f59f2e97981d0cead05957e54
- **Test Phone:** 254700000000

### Testing Payment

1. Set `MPESA_ENV=sandbox`
2. Call `/api/mpesa` with test credentials
3. Check your phone for STK prompt (in sandbox, use test credentials)
4. Verify callback is received at `/api/mpesa/callback`

## Email Notifications

Payment notifications are automatically sent to:
- `oxicgroupltd@group.com` (Primary)
- `Info@oxicinternational.co.ke` (Secondary)

**Email includes:**
- Payment status (success/failure)
- Receipt number
- Amount
- Phone number
- Transaction date/time

## Error Handling

Common error codes and meanings:

| Code | Meaning | Action |
|------|---------|--------|
| 0 | Success | Payment processed successfully |
| 1 | Insufficient Funds | User has insufficient balance |
| 2 | Less than minimum transaction allowed | Amount too small (minimum KES 1) |
| 1001 | Unable to lock subscriber | User phone locked |
| 1002 | Subscriber not found | Invalid phone number |
| 9001 | Processing error | Safaricom system error |
| 9999 | User cancelled | User cancelled the prompt |

## Security Considerations

1. **HTTPS Only:** Always use HTTPS in production
2. **IP Whitelisting:** Safaricom may provide IP addresses to whitelist
3. **Timeout Handling:** Implement timeout checks for long-running transactions
4. **Logging:** All payments are logged to console (remove in production)
5. **Database:** Store payment records in a database for audit trails
6. **Rate Limiting:** Implement rate limiting on payment endpoints

## Next Steps / TODO

- [ ] Implement database storage for payment records
- [ ] Add SMS notifications to customers
- [ ] Create admin dashboard for payment reconciliation
- [ ] Set up payment retry logic for failed transactions
- [ ] Integrate with accounting system
- [ ] Implement refund/reversal logic
- [ ] Add phone number validation and formatting
- [ ] Create webhook signature verification
- [ ] Set up monitoring/alerting for failed payments

## Troubleshooting

### "API credentials not configured"
- Verify all env variables are set correctly
- Check for typos in credentials
- Ensure values don't have trailing spaces

### "Invalid phone number"
- Phone must be in format: 254XXXXXXXXX
- Remove leading 0 if present
- Ensure phone is active M-Pesa account

### Callback not received
- Verify callback URL is accessible from internet
- Check firewall/security group allows incoming requests
- Ensure SSL certificate is valid
- Verify callback URL in Daraja portal matches deployment URL

## Support

For technical support:
- Email: oxicgroupltd@group.com
- Phone: +254 748 992 777
- Safaricom Daraja Support: support@safaricom.co.ke

## Resources

- [Safaricom Daraja API Documentation](https://developer.safaricom.co.ke/documentation)
- [M-Pesa Integration Best Practices](https://developer.safaricom.co.ke/docs)
- [Lipa Na M-Pesa Online API](https://developer.safaricom.co.ke/apis/lipa-na-m-pesa-online)
