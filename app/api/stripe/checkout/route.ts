import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Stripe API Configuration
// Environment variables required:
// - STRIPE_SECRET_KEY: Your Stripe secret key (starts with sk_test_ or sk_live_)

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

// Supported currencies with minimum amounts
const CURRENCY_MINIMUMS: Record<string, number> = {
  usd: 0.50,
  eur: 0.50,
  gbp: 0.30,
  kes: 50,
}

const SUPPORTED_CURRENCIES = ["usd", "eur", "gbp", "kes"]

export async function POST(request: NextRequest) {
  try {
    // Validate Stripe configuration
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: "Payment system not configured. Please contact support." },
        { status: 503 }
      )
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
    })

    const { amount, currency = "usd", description, customerEmail, customerName } = await request.json()

    // Validate currency
    const normalizedCurrency = currency.toLowerCase()
    if (!SUPPORTED_CURRENCIES.includes(normalizedCurrency)) {
      return NextResponse.json(
        { success: false, error: `Currency not supported. Supported currencies: ${SUPPORTED_CURRENCIES.join(", ").toUpperCase()}` },
        { status: 400 }
      )
    }

    // Validate amount
    const numAmount = parseFloat(amount)
    const minAmount = CURRENCY_MINIMUMS[normalizedCurrency] || 0.50
    if (isNaN(numAmount) || numAmount < minAmount) {
      return NextResponse.json(
        { success: false, error: `Minimum amount is ${minAmount} ${normalizedCurrency.toUpperCase()}` },
        { status: 400 }
      )
    }

    if (numAmount > 999999) {
      return NextResponse.json(
        { success: false, error: "Amount exceeds maximum limit" },
        { status: 400 }
      )
    }

    // Validate email format
    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address format" },
        { status: 400 }
      )
    }

    // Build success and cancel URLs
    const origin = request.nextUrl.origin
    const successUrl = `${origin}?payment=success&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${origin}?payment=cancelled`

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: normalizedCurrency,
            product_data: {
              name: "The Oxic International Group",
              description: description || "Investment Advisory Services - East Africa",
              images: [`${origin}/images/logo1.png`],
            },
            unit_amount: Math.round(numAmount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail || undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      billing_address_collection: "required",
      metadata: {
        source: "oxic-website",
        description: description || "Investment Advisory Payment",
        customerName: customerName || "Not provided",
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: unknown) {
    const stripeError = error as Stripe.errors.StripeError
    console.error("Stripe Checkout Error:", stripeError.message)
    
    // Return user-friendly error messages
    if (stripeError.type === "StripeCardError") {
      return NextResponse.json(
        { success: false, error: "Card was declined. Please try another payment method." },
        { status: 400 }
      )
    }
    
    if (stripeError.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        { success: false, error: "Invalid payment request. Please check your details." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: "Payment processing failed. Please try again later." },
      { status: 500 }
    )
  }
}
