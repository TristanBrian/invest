# Production Go-Live Guide - Oxic International Group

## Pre-Launch Requirements (1 Week Before)

### Environment Setup
- Configure production domain (oxicinternational.co.ke)
- Set up SSL certificate (Let's Encrypt/paid)
- Configure DNS records (A, CNAME, MX)
- Set up CDN (Vercel built-in or Cloudflare)
- Configure database backups (automated daily)
- Set up monitoring (Vercel Analytics, Sentry)
- Configure logging (application + server)

### Environment Variables
```
NEXT_PUBLIC_API_URL=https://oxicinternational.co.ke
RESEND_API_KEY=re_xxxxxxxxxxxxx
MPESA_CONSUMER_KEY=xxxxxxxxxxxxx
MPESA_CONSUMER_SECRET=xxxxxxxxxxxxx
MPESA_SHORTCODE=xxxxx
MPESA_CALLBACK_URL=https://oxicinternational.co.ke/api/mpesa/callback
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
DATABASE_URL=postgresql://user:pass@host/db
NODE_ENV=production
```

### Third-Party Integrations
- [ ] Resend email account active with domain verified
- [ ] Safaricom M-Pesa production credentials obtained
- [ ] Stripe production account activated
- [ ] Database hosted and backed up
- [ ] Analytics account created
- [ ] Error tracking (Sentry) configured
- [ ] Email domain (oxicinternational.co.ke) configured

## Deployment Process

### Step 1: Final Verification (24 Hours Before)
```bash
# Run full test suite
npm run build
npm run test

# Check for type errors
npx tsc --noEmit

# Verify all environment variables
node scripts/verify-env.js

# Performance check
npm run lighthouse
```

### Step 2: Staging Deployment
- Deploy to staging environment first
- Run full QA test suite
- Test all payment methods (use test cards)
- Verify email notifications
- Check performance metrics
- Monitor for 2-4 hours

### Step 3: Production Deployment to Vercel
```bash
# Push to production branch
git checkout main
git pull origin main
git push origin main

# Vercel auto-deploys or trigger manually:
# https://vercel.com/dashboard/deployments
```

### Step 4: Post-Deployment Verification
```
✓ Site loads without errors
✓ All pages accessible
✓ Payment forms display
✓ Contact form works
✓ Images load correctly
✓ Logo displays properly
✓ Dark mode functional
✓ Mobile responsive
✓ No console errors
✓ Analytics tracking
```

## Monitoring Checklist

### Real-Time Monitoring (First 24 Hours)
- [ ] Vercel dashboard open for logs
- [ ] Sentry error tracking active
- [ ] Google Analytics real-time view
- [ ] Payment API health check
- [ ] Database connection stable
- [ ] Email service healthy
- [ ] SSL certificate valid
- [ ] DNS resolving correctly

### Performance Metrics
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] No 5xx errors
- [ ] API response time < 500ms
- [ ] Error rate < 0.1%
- [ ] Uptime = 100%

### User Experience
- [ ] Contact form submissions working
- [ ] Payment flows completing
- [ ] Emails delivering
- [ ] No broken links
- [ ] Navigation responsive
- [ ] Forms validating correctly

## Troubleshooting During Launch

### Common Issues & Fixes

**Issue**: Site not loading
```
→ Check Vercel deployment status
→ Verify DNS records propagated
→ Clear browser cache (Ctrl+Shift+Del)
→ Check SSL certificate validity
```

**Issue**: Emails not sending
```
→ Verify RESEND_API_KEY in environment
→ Check Resend domain verification
→ Review Resend logs for bounces
→ Test with test email first
```

**Issue**: M-Pesa not working
```
→ Verify MPESA_CONSUMER_KEY/SECRET
→ Check callback URL accessible
→ Test STK push manually
→ Review M-Pesa logs for errors
```

**Issue**: Forms not submitting
```
→ Check browser console errors
→ Verify form validation
→ Check backend API response
→ Test CORS configuration
```

**Issue**: Database connection failing
```
→ Verify DATABASE_URL
→ Check database credentials
→ Test connection from server
→ Verify SSL/TLS certificates
```

## Database Management

### Pre-Launch
- [ ] Create production database
- [ ] Run all migrations
- [ ] Create backup user with limited permissions
- [ ] Set up automated backups (daily)
- [ ] Test restore procedure
- [ ] Document connection string

### Post-Launch
- [ ] Verify daily backups running
- [ ] Test restore from backup weekly
- [ ] Monitor disk usage
- [ ] Monitor query performance
- [ ] Archive old logs
- [ ] Update database statistics

## Backup & Disaster Recovery

### Backup Strategy
- **Frequency**: Automated daily
- **Retention**: 30 days local, 90 days offsite
- **Verification**: Weekly restore test
- **RPO**: 24 hours (acceptable data loss)
- **RTO**: 4 hours (recovery time objective)

### Restore Procedure
```
1. Identify the point in time needed
2. Download backup from storage
3. Stop production application
4. Restore database from backup
5. Verify data integrity
6. Restart application
7. Monitor for issues
```

## Security After Launch

### Week 1
- [ ] Run security audit
- [ ] Verify HTTPS everywhere
- [ ] Check security headers
- [ ] Test CORS configuration
- [ ] Verify rate limiting working
- [ ] Review access logs
- [ ] Monitor for attacks

### Ongoing
- [ ] Monthly security updates
- [ ] Quarterly penetration test
- [ ] Annual security audit
- [ ] Monitor vulnerability databases
- [ ] Keep dependencies updated

## Performance Optimization (Post-Launch)

### Week 1
- Analyze Lighthouse reports
- Optimize images if needed
- Check Core Web Vitals
- Review slowest pages
- Optimize database queries

### Monthly
- Review performance trends
- Update caching strategies
- Optimize critical paths
- Monitor API performance
- Review error logs

## Analytics & Reporting

### Setup
- [ ] Google Analytics configured
- [ ] Conversion tracking setup
- [ ] Payment tracking events
- [ ] Form submission tracking
- [ ] Error tracking active
- [ ] Custom events defined

### Daily Review (First Week)
- User sessions
- Page views
- Conversion rate
- Error rate
- Performance metrics
- Payment success rate

### Weekly Review
- Traffic trends
- Top pages
- Bounce rate
- User geography
- Device/browser breakdown
- Revenue/transactions

## Communication Plan

### Launch Day
**T-4 Hours**
- Final health check
- Team briefing
- Status page ready

**T-0 (Launch)**
- Monitor closely
- Have team on standby
- Prepare communication

**T+1 Hour**
- Send launch announcement
- Update status page
- Social media posts

**T+24 Hours**
- Post-launch report
- Performance summary
- Thank you message

## Support & Issue Management

### Support Setup
- [ ] Support email active
- [ ] Support team trained
- [ ] FAQ page prepared
- [ ] Help documentation ready
- [ ] Contact form monitored
- [ ] Response SLA: 4 hours

### Escalation Path
1. **Tier 1**: Email support team
2. **Tier 2**: Lead developer
3. **Tier 3**: Infrastructure team
4. **Tier 4**: Emergency procedures

## Go/No-Go Decision (24 Hours Before)

### Go-Live Approval Criteria
- [ ] All tests passing
- [ ] Staging verified
- [ ] Performance acceptable
- [ ] Security audited
- [ ] Team ready
- [ ] Support ready
- [ ] Backups tested
- [ ] Monitoring active
- [ ] Rollback plan ready
- [ ] Communications ready

### Decision Matrix
```
PASS (8-10/10): LAUNCH
CAUTION (6-8/10): PROCEED WITH CAUTION
STOP (< 6/10): DELAY LAUNCH
```

## Rollback Procedure (If Needed)

### Quick Rollback (< 30 minutes)
```
1. Revert DNS to previous IP
2. Revert code to previous commit on Vercel
3. Restore database from backup
4. Clear all caches
5. Verify all systems operational
6. Send status update
```

### Full Rollback (30+ minutes)
- Contact Vercel support if needed
- Restore database from backup
- Deploy previous stable version
- Conduct full verification
- Root cause analysis
- Plan re-launch

## Post-Launch Success Metrics

### Operational Excellence
- Uptime: 99.9%
- Error rate: < 0.1%
- Page load: < 3s
- Response time: < 500ms
- Support tickets: < 5 per day

### Business Success
- Payment conversion: > 5%
- Form completion: > 20%
- Return visitors: > 30%
- Support satisfaction: > 4.5/5

### User Experience
- Mobile friendly: 100%
- Accessibility: > 95%
- Performance score: > 90
- SEO score: > 95

## Launch Day Command Center

**Team**:
- Lead Developer: On-call
- DevOps: Monitoring infrastructure
- Support: Handling user issues
- Management: Communications

**Tools Active**:
- Vercel dashboard
- Sentry error tracking
- Google Analytics
- Performance monitoring
- Chat/Slack for team
- Status page

**Status Updates**:
- Every 30 minutes (first 4 hours)
- Every hour (4-24 hours)
- Daily thereafter

## Success Confirmation

After 48 hours of successful operation:
- [ ] All metrics green
- [ ] No critical issues
- [ ] Users satisfied
- [ ] Team rested
- [ ] Launch complete ✓
