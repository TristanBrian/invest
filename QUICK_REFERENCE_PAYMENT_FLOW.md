# Quick Reference: Professional M-Pesa Payment Flow

## 5 States at a Glance

### 1️⃣ FORM
**Purpose:** Collect payment details
```
┌─────────────────────────────┐
│   M-Pesa Payment Form       │
├─────────────────────────────┤
│ Phone: 0712345678           │
│ Amount: [10000]             │
│ Presets: [1K] [5K] [10K]   │
│ ┌──────────────────────┐   │
│ │ Pay with M-Pesa      │   │
│ └──────────────────────┘   │
└─────────────────────────────┘
```
**User Action:** Submit form
**Next State:** Processing

---

### 2️⃣ PROCESSING ⭐ NEW
**Purpose:** Show payment is being sent
```
┌──────────────────────────────┐
│  ⟳ ⭳ Processing Payment    │
│                              │
│      ╱────╲                 │
│    ╱        ╲               │
│   │  ☎  📱   │              │
│    ╲        ╱               │
│      ╲────╱                 │
│   ▓▓▓▓▓░░░░░░░░░░ 80%      │
│   118s remaining            │
│                              │
│ KES 10,000 | Phone: 071...  │
│ TX ID: OXIC-20260204-...    │
│                              │
│ ✓ M-Pesa prompt coming      │
│ ✓ Enter your PIN            │
│ ✓ SMS confirmation soon     │
│                              │
│ [    Cancel    ]            │
└──────────────────────────────┘
```
**Duration:** 1-120 seconds (auto or API)
**User Actions:** Wait or Cancel
**Next States:** 
- API Success → Waiting
- API Error → Error
- Timeout → Waiting
- Cancel → Error

---

### 3️⃣ WAITING
**Purpose:** Waiting for user to enter PIN
```
┌──────────────────────────────┐
│  ⟳ Awaiting Your PIN        │
│                              │
│      ┌──────┐               │
│      │  ☎ 📱 │ (rotating)   │
│      └──────┘               │
│                              │
│ Check your phone and        │
│ enter your M-Pesa PIN       │
│                              │
│ ┌─────────────────────────┐ │
│ │ KES 10,000             │ │
│ │ Phone: 0712345678      │ │
│ │ Ref: OXIC-20260204-... │ │
│ └─────────────────────────┘ │
│                              │
│ Steps:                       │
│ 1. See M-Pesa prompt       │
│ 2. Enter 4-digit PIN       │
│ 3. Wait for SMS            │
│ 4. Auto-update here        │
│                              │
│ [Cancel] [✓ Confirm]       │
└──────────────────────────────┘
```
**Duration:** Max 2-3 minutes (M-Pesa timeout)
**User Actions:** Enter PIN or Cancel
**Next States:**
- PIN Entered → Success (callback)
- User Cancels → Error
- M-Pesa Timeout → Error

---

### 4️⃣ SUCCESS ✅
**Purpose:** Confirm payment received
```
┌──────────────────────────────┐
│          ✓ ✓ ✓             │
│                              │
│ Payment Confirmed!           │
│ Your payment was received    │
│ and is being processed.      │
│                              │
│ ┌─────────────────────────┐ │
│ │ Amount: KES 10,000     │ │
│ │ Phone: 0712345678      │ │
│ │ TX ID: OXIC-20260204.. │ │
│ │                         │ │
│ │ Note: Invoice emailed   │ │
│ └─────────────────────────┘ │
│                              │
│ [Download Receipt]          │
│ [      Close      ]         │
└──────────────────────────────┘
```
**Duration:** User closes or auto-close
**User Actions:** Download receipt or close
**Next States:** Back to Home/Form

---

### 5️⃣ ERROR ❌
**Purpose:** Show what went wrong
```
┌──────────────────────────────┐
│          ⚠ Error            │
│                              │
│ Payment Failed               │
│ Network error - Try again    │
│ later                         │
│                              │
│ ┌─────────────────────────┐ │
│ │ Ref: OXIC-20260204-..  │ │
│ │ Keep for records        │ │
│ └─────────────────────────┘ │
│                              │
│ What you can do:            │
│ • Check internet            │
│ • Add M-Pesa balance        │
│ • Try different amount      │
│ • Wait & retry              │
│ • Contact support           │
│                              │
│ [Try Again] [Close]        │
└──────────────────────────────┘
```
**Duration:** User chooses action
**User Actions:** Try Again or Close
**Next States:** Form (clean) or Home

---

## Visual Hierarchy Summary

```
    FORM
     │
     ↓ Submit
 PROCESSING ← API Response / Timeout
     │            ↓
     ↓      Auto-Advances
   WAITING ← or User Cancels → ERROR
     │                   ↑
     ├─ PIN Entered ─────┘
     ├─ Timeout ────────→ ERROR
     │
     ↓
  SUCCESS
     │
     ↓
   HOME
```

---

## State Indicators

| State | Icon | Color | Animation |
|-------|------|-------|-----------|
| Form | 📱 | Green | Static |
| Processing | ⟳ | Green | Triple-spin |
| Waiting | ⟳ | Amber | Rotating |
| Success | ✓ | Green | Static |
| Error | ⚠ | Red | Static |

---

## Animations Explained

### Processing State Spinner
```
Layer 1: Outer ring
  - Rotates clockwise continuously
  - Green color (border-t-green-500, border-r-green-500)
  - Speed: 2 seconds per rotation

Layer 2: Middle ring
  - Pulses (opacity: 0.2 → 1.0)
  - Green-200 color
  - Speed: 2 seconds per cycle

Layer 3: Icon
  - Bounces up/down
  - Phone emoji
  - Speed: 1 second per bounce
```

### Progress Bar
```
Width: 0% → 100% over 120 seconds
Color: Green → Emerald gradient
Transition: Smooth 300ms updates
```

---

## User Messaging

### Processing
- **Main:** "Processing Payment"
- **Sub:** "Sending STK push to your phone..."
- **Tip:** Lists what happens next

### Waiting
- **Main:** "Awaiting Your PIN"
- **Sub:** "Please complete the transaction on your phone"
- **Tip:** Step-by-step instructions

### Success
- **Main:** "Payment Confirmed"
- **Sub:** "Your payment has been received and is being processed"
- **Action:** Download receipt, note invoice coming

### Error
- **Main:** "Payment Failed"
- **Sub:** [Specific error message]
- **Tip:** 5 troubleshooting suggestions

---

## Button States

### Processing State
- Cancel (always active)

### Waiting State
- Cancel Transaction (red)
- Confirm Payment (green)

### Success State
- Download Receipt (green)
- Close (outline)

### Error State
- Try Again (outline)
- Close (green)

---

## Response Times

| Action | Typical Time |
|--------|--------------|
| Form → Processing | Instant |
| Processing API Call | 1-3 seconds |
| Processing Timer | 120 seconds |
| Processing → Waiting | Auto when API responds |
| User enters PIN | 10-30 seconds |
| M-Pesa Timeout | 2-3 minutes |
| Waiting → Success | On PIN entry or callback |

---

## Mobile Responsiveness

✓ Full screen on mobile
✓ Touch-friendly buttons (h-10+ for targets)
✓ Readable text at any size
✓ Spinner centered and large
✓ Cards stack vertically
✓ No horizontal scrolling
✓ Visible at viewport 320px and up

---

## Professional Details

- **Fonts:** System sans-serif
- **Color Scheme:** Green (success), Amber (waiting), Red (error)
- **Spacing:** 16px-32px padding/margins
- **Border Radius:** 8-12px on cards
- **Shadows:** Subtle elevation for depth
- **Contrast:** WCAG AA compliant throughout

---

## Testing Scenarios

### Happy Path
1. Form → Enter valid phone & amount
2. Processing → Animates, shows countdown
3. Waiting → Shows PIN prompt (auto or manual)
4. User enters PIN
5. Success → Shows confirmation

### Cancellation Path
1. Form → Submit
2. Processing → User clicks Cancel
3. Error → Shows "Payment cancelled"
4. Try Again → Returns to clean form

### Error Path
1. Form → Submit invalid phone
2. Form → Shows validation error
3. Try with valid phone
4. Processing → API fails
5. Error → Shows specific error
6. Try Again or Close

### Timeout Path
1. Form → Submit
2. Processing → 120s countdown
3. Processing → Timer expires
4. Waiting → Auto-advances
5. M-Pesa timeout occurs
6. Error → Shows timeout message

---

## Key Features Summary

✅ Beautiful triple-ring spinner animation
✅ Countdown timer with progress bar
✅ Professional gradient color scheme
✅ Clear, actionable error messages
✅ Receipt download capability
✅ Mobile-first responsive design
✅ Transaction reference tracking
✅ Accessible to all users
✅ Enterprise-grade appearance
✅ Production-ready code

---

This professional payment flow delivers a world-class user experience suitable for fintech, banking, and premium e-commerce applications.
