# Professional Standards Guide - Oxic International Group

## Brand Standards

### Color System (Consistent Everywhere)
- **Primary Blue**: #1e40af (oklch 0.28 0.06 252) - Navy blue for headers, CTAs
- **Secondary Gold**: #d4a574 (oklch 0.65 0.12 75) - Gold accents, highlights
- **Text Primary**: #1e293b - Navy for body text
- **Text Secondary**: #64748b - Muted gray for secondary text
- **Backgrounds**: #ffffff (white), #f8fafc (off-white)
- **Borders**: #e2e8f0 - Light gray borders
- **Success**: #16a34a - Green for confirmations
- **Error**: #dc2626 - Red for errors
- **Warning**: #ea580c - Amber for warnings

### Typography System
- **Font Stack**: Inter, Geist, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
- **Heading 1**: 32px-48px, Bold (700), navy blue
- **Heading 2**: 24px-32px, Bold (700), navy blue
- **Heading 3**: 20px-24px, Semi-bold (600), navy blue
- **Body**: 14px-16px, Regular (400), dark navy
- **Small**: 12px-13px, Regular (400), muted gray
- **Code**: Geist Mono, 12px-14px

### Logo Standards
- **Primary Logo**: `/public/images/oxic-logo.png` (500x150px)
- **Sizes**: 
  - Header: 112px height (h-28) on desktop, scales down on mobile
  - Footer: 112px height (h-28)
  - Invoice: 48px height (h-12)
- **Spacing**: Minimum 16px clear space around logo
- **Colors**: Navy blue + gold (as designed)

## Responsive Design Standards

### Breakpoints (Tailwind Mobile-First)
- **Mobile**: 0-640px (sm)
- **Tablet**: 641-1024px (md)
- **Desktop**: 1025px+ (lg)

### Padding/Margins Standards
- **Mobile**: px-4 (16px sides)
- **Tablet**: px-6 (24px sides)  
- **Desktop**: px-8 (32px sides)
- **Container Max**: max-w-7xl (1280px)

### Section Spacing
- Mobile: py-8 (32px) to py-12 (48px)
- Tablet: py-12 (48px) to py-16 (64px)
- Desktop: py-16 (64px) to py-20 (80px)

### Grid Standards
- **Mobile**: 1 column
- **Tablet**: 2 columns (gap-6)
- **Desktop**: 3-4 columns (gap-6 to gap-8)

## Component Standards

### Buttons
- Height: 40px (minimum touch target 44px)
- Padding: px-4 py-2 to px-6 py-2
- Border Radius: rounded-lg (0.625rem)
- Text: 14-16px, Semi-bold (600)
- States: Default, Hover (opacity), Active, Disabled
- Always include hover transitions (200-300ms)

### Cards
- Background: white/card color
- Border: 1px border with border color
- Border Radius: rounded-lg to rounded-xl
- Shadow: shadow-sm to shadow-md
- Padding: p-6 to p-8
- Hover: Subtle shadow increase, slight scale (1.02x)

### Forms
- Label: 12-14px, Semi-bold, muted gray
- Input: 40px height, px-3 py-2, rounded-md
- Border: 1px border-input, focus with ring
- Error: Red text below field + red border
- Help Text: 12px, muted gray below field
- Spacing: gap-4 between fields

### Modals/Dialogs
- Overlay: Dark with 50% opacity
- Container: White card with rounded corners
- Close Button: Always visible, top-right
- Padding: p-6 to p-8
- Shadow: shadow-lg or shadow-xl
- Focus: Trap focus within modal

## Performance Standards

### Image Optimization
- Use Next.js Image component with:
  - Proper width/height (aspect ratio)
  - quality={85-90} for content images
  - quality={100} for logos
  - sizes prop for responsive loading
  - lazy loading where appropriate
  - WebP/AVIF modern formats

### Code Standards
- Functional components only (React 18+)
- Use hooks for state management
- Proper error boundaries
- Suspense for code splitting
- PropTypes or TypeScript for type safety
- Component isolation and reusability
- No inline styles (use Tailwind)
- Semantic HTML elements

### CSS Standards
- Tailwind CSS v4 only
- Design token CSS variables
- Mobile-first responsive design
- No arbitrary values (use design system)
- Smooth transitions (200-300ms)
- Accessible color contrast (WCAG AA)

## Accessibility Standards

### Color Contrast
- Text on backgrounds: 4.5:1 for regular, 3:1 for large
- No color-only information indicators
- Support for dark mode

### Text & Readability
- Minimum font size: 14px
- Line height: 1.5-1.6 (relaxed)
- Max line length: 60-80 characters
- Proper heading hierarchy (h1 → h6)

### Interactive Elements
- Minimum touch target: 44x44px
- Focus visible states (outline-ring)
- Keyboard navigation fully supported
- Screen reader compatible
- Alt text on all images
- Semantic HTML (<button>, <nav>, <main>)

### Forms
- Associated labels for all inputs
- Clear error messages
- Required field indicators
- Placeholder not as label
- Form validation feedback

## Cross-Platform Testing

### Mobile Devices
- iPhone SE (375px)
- iPhone 12/13/14 (390px)
- iPhone Pro Max (430px)
- Android phones (360px-412px)
- Test in portrait + landscape

### Tablets
- iPad (768px)
- iPad Air (820px)
- iPad Pro (1024px-1366px)
- Android tablets (600px+)

### Browsers
- Chrome/Chromium (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- Mobile Safari
- Mobile Chrome

### Testing Checklist
- [ ] All pages load without errors
- [ ] Navigation works on all devices
- [ ] Forms are fully functional
- [ ] Payment flows tested end-to-end
- [ ] Images display correctly
- [ ] Responsive breakpoints working
- [ ] Touch/tap targets adequate
- [ ] No horizontal scrolling
- [ ] Dark mode functional
- [ ] Print styles working

## Production Deployment

### Pre-Launch Checklist
- [ ] All links working (internal + external)
- [ ] No 404 errors
- [ ] No console errors/warnings
- [ ] Images optimized and loaded
- [ ] Forms submitting correctly
- [ ] Email notifications sending
- [ ] Payment systems tested
- [ ] Analytics tracking
- [ ] SEO metadata complete
- [ ] Sitemap.xml generated
- [ ] robots.txt configured
- [ ] SSL certificate valid
- [ ] CDN configured
- [ ] Cache headers set
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] Error pages (404, 500) styled
- [ ] Legal pages present (Privacy, Terms)

### Performance Targets
- Lighthouse Performance: >90
- Lighthouse Accessibility: >95
- Lighthouse Best Practices: >90
- Lighthouse SEO: >95
- Page Load Time: <3 seconds
- Time to Interactive: <4 seconds
- Cumulative Layout Shift: <0.1

### Security Standards
- HTTPS enabled (let's Encrypt)
- Security headers configured
- CSRF protection enabled
- Rate limiting implemented
- Input validation on all forms
- SQL injection prevention
- XSS protection
- CORS properly configured
- API keys secured (env vars)
- Database backups automated

## Maintenance Standards

### Regular Tasks
- Weekly: Check error logs
- Weekly: Monitor performance
- Monthly: Update dependencies
- Monthly: Review security
- Quarterly: Full backup test
- Annually: Security audit

### Update Policy
- Security patches: Immediately
- Bug fixes: Within 1 week
- Feature updates: As planned
- Dependencies: Monthly reviews
- Content: As needed
