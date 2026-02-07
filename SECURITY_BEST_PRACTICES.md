# Security Best Practices for Oxic M-Pesa Payment System

## 1. Rate Limiting Protection

All payment endpoints implement rate limiting:
- **5 requests per minute per IP address**
- Prevents brute force and DDoS attacks
- Returns 429 (Too Many Requests) when limit exceeded

### Implementation
\`\`\`typescript
// Automatic rate limiting in /lib/security.ts
const rateLimiter = new RateLimiter()
if (rateLimiter.isLimited(clientIp)) {
  return 429 Too Many Requests
}
\`\`\`

## 2. Request Validation

### Phone Number Validation
- Accepts: +254, 0, or 254 prefix formats
- Validates Kenyan-specific patterns
- Rejects obviously invalid formats

### Amount Validation
- Minimum: KES 1
- Maximum: KES 150,000
- Prevents unrealistic amounts

### Origin/CORS Validation
- Only allows requests from trusted domains:
  - https://oxicinternational.co.ke
  - https://www.oxicinternational.co.ke
  - Localhost (development only)
- Rejects requests from unauthorized origins

## 3. Suspicious Activity Detection

The system detects and logs:
- Amounts exceeding KES 100,000 (flagged for review)
- Invalid phone number formats
- Rapid repeated requests
- Requests from non-whitelisted origins
- Failed authentication attempts

### Security Logging
\`\`\`
[v0] SECURITY: 2026-02-04T14:09:24.453Z RATE_LIMIT_EXCEEDED ip: 192.168.1.1
[v0] SECURITY: 2026-02-04T14:09:25.123Z INVALID_ORIGIN origin: https://malicious.com
[v0] SECURITY: 2026-02-04T14:09:26.456Z SUSPICIOUS_ACTIVITY reason: Amount exceeds typical
\`\`\`

## 4. Environment Variable Security

### Protected Credentials (Netlify Only)
- MPESA_CONSUMER_KEY
- MPESA_CONSUMER_SECRET
- MPESA_PASSKEY
- SENDGRID_API_KEY
- DATABASE_URL

### Never in Client Code
- Credentials extracted only on server-side
- API routes use environment variables
- Frontend never receives API keys

### Local Development
- Use `.env.local` (git-ignored)
- Create from `.env.example`
- Never commit actual credentials

## 5. Security Headers

All responses include:

\`\`\`
X-Content-Type-Options: nosniff
  → Prevents MIME sniffing attacks

X-Frame-Options: DENY
  → Prevents clickjacking

X-XSS-Protection: 1; mode=block
  → Blocks reflected XSS

Referrer-Policy: strict-origin-when-cross-origin
  → Limits referrer exposure

Content-Security-Policy: [restrictive policy]
  → Prevents injection attacks

Permissions-Policy: geolocation=(), microphone=(), camera=()
  → Disables unnecessary APIs
\`\`\`

## 6. CORS Configuration

### Allowed Origins
\`\`\`
https://oxicinternational.co.ke
https://www.oxicinternational.co.ke
http://localhost:3000 (dev only)
\`\`\`

### Allowed Methods
- GET, POST, PUT, DELETE, OPTIONS

### Allowed Headers
- Content-Type
- Authorization

### Configuration
Located in `/middleware.ts` (or proxy.ts for Next.js 16+)

## 7. Transaction Security

### Transaction IDs
- Format: `OXIC-YYYYMMDD-XXXXXXXX-XXXX`
- Cryptographically random component
- SHA256 checksum for validation
- Never exposed in logs (only shown to authorized users)

### Transaction Records
- All transactions logged with full details
- Immutable audit trail
- Includes: phone, amount, timestamp, IP address, status
- Stored securely with encryption

## 8. API Request Security

### Request Signing (Production)
\`\`\`typescript
// All requests include:
- Valid Origin header
- Correct Content-Type
- No suspicious parameters
- Validated against rate limits
\`\`\`

### Timeout Protection
- 30-second timeout on M-Pesa callbacks
- Prevents hanging connections
- Automatic cleanup of stale requests

## 9. Payment Processing Security

### M-Pesa Communication
- Always HTTPS
- SSL certificate validation
- Callback URL validation (HTTPS only)
- Request body encryption

### Callback Verification
- Validate that callbacks come from Safaricom IPs
- Implement request signing where available
- Verify callback format matches M-Pesa specification
- Log all callbacks for audit trail

## 10. Data Protection

### Sensitive Data Handling
- Phone numbers masked in logs after first 4 digits
- Amount shown but never stored in logs
- Transaction IDs linked to data, not exposed directly
- Customer email only stored for invoice purposes

### Data Minimization
- Only collect required information
- Delete old transaction logs after regulatory period (7 years minimum)
- Implement data retention policies

## 11. Error Handling Security

### Don't Expose System Details
- Generic error messages to users
- Detailed errors only in server logs
- Never return stack traces to client
- Don't reveal database errors

### Example
\`\`\`typescript
// ❌ Bad - exposes system details
error: "Database connection failed to 192.168.1.1:5432"

// ✅ Good - generic message
error: "Payment processing failed. Please try again later."
\`\`\`

## 12. Monitoring & Alerts

### Critical Events to Monitor
- Failed authentication attempts
- Rate limit exceeded
- Invalid requests
- Large transactions
- Callback failures
- Database errors

### Alerting Thresholds
- 10+ rate limit hits in 1 minute → Alert
- 5+ failed authentications in 5 minutes → Block IP
- Any transaction > KES 100,000 → Review
- Callback failure → Retry and alert

## 13. Regular Security Audits

### Weekly
- Review security logs
- Check for anomalies
- Verify rate limiting working

### Monthly
- Audit transaction records
- Check for suspicious patterns
- Review CORS and header configuration
- Verify rate limits not too restrictive

### Quarterly
- Security penetration testing
- Code review for vulnerabilities
- Update dependencies
- Review access logs

## 14. Incident Response

### If Breach Suspected
1. Isolate affected systems
2. Enable enhanced logging
3. Alert security team immediately
4. Notify users if personal data exposed
5. Preserve logs for forensics
6. Document incident timeline

### If Rate Limits Triggered
1. Check IP address pattern
2. Determine if legitimate traffic spike or attack
3. Whitelist known APIs if needed
4. Consider temporary block if malicious

## 15. Compliance

### GDPR (If handling EU data)
- Privacy policy updated
- Data processing agreement in place
- Right to be forgotten implemented
- Data breach notification plan

### Kenya Data Protection Act
- Customer consent for payment processing
- Data stored securely
- Regular audits conducted
- Breach notification timeline: 30 days

### PCI DSS (Payment Card Industry)
- Not applicable for M-Pesa only
- But follow principles for other payment methods:
  - Never store card numbers
  - Use tokenization
  - Encrypt sensitive data
  - Restrict access

## 16. Production Deployment Checklist

- [ ] All environment variables set in Netlify (production values)
- [ ] SSL certificate valid and non-self-signed
- [ ] Rate limiting enabled
- [ ] CORS restricted to production domains
- [ ] Security headers enabled
- [ ] Monitoring and alerting configured
- [ ] Database backups automated
- [ ] Audit logging enabled
- [ ] Error tracking configured (Sentry/similar)
- [ ] Access logs retained (minimum 90 days)
- [ ] Incident response plan documented
- [ ] Team trained on security procedures
- [ ] Regular security audits scheduled

## 17. Useful Resources

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- M-Pesa Security: https://developer.safaricom.co.ke/docs
- Next.js Security: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
- CSP Generator: https://csp-evaluator.withgoogle.com/
