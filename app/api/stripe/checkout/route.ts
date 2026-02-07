import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

const CURRENCY_MINIMUMS: Record<string, number> = {
  usd: 0.50,
  eur: 0.50,
  gbp: 0.30,
  kes: 50,
}

const SUPPORTED_CURRENCIES = ["usd", "eur", "gbp", "kes"]

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "usd", description, customerEmail, customerName } = await request.json()

    // Validate Stripe configuration
    if (!STRIPE_SECRET_KEY) {
      console.error("[v0] Stripe: STRIPE_SECRET_KEY environment variable not configured")
      return NextResponse.json(
        {
          success: false,
          error: "Payment processing is not configured. Please contact support to enable Stripe payments.",
          debug: "STRIPE_SECRET_KEY not set in environment variables",
        },
        { status: 503 }
      )
    }

    // Validate amount first
    const normalizedCurrency = currency.toLowerCase()
    if (!SUPPORTED_CURRENCIES.includes(normalizedCurrency)) {
      return NextResponse.json(
        { success: false, error: `Currency not supported. Supported: ${SUPPORTED_CURRENCIES.join(", ").toUpperCase()}` },
        { status: 400 }
      )
    }

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
        { success: false, error: "Amount exceeds maximum limit of 999,999" },
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

    // Initialize Stripe client
    let stripe: Stripe
    try {
      stripe = new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: "2025-12-15.clover",
      })
    } catch (stripeInitError) {
      console.error("[v0] Stripe client initialization failed:", stripeInitError)
      return NextResponse.json(
        { success: false, error: "Payment system initialization failed. Please try again." },
        { status: 503 }
      )
    }

    // Build URLs
    const origin = request.nextUrl.origin
    const successUrl = `${origin}?payment=success&session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${origin}?payment=cancelled`

    // Create checkout session
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
              images: [`${origin}/images/oxic-logo.png`],
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

    console.log("[v0] Stripe session created successfully:", { sessionId: session.id, amount: numAmount, currency: normalizedCurrency })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: unknown) {
    const stripeError = error as Stripe.errors.StripeError
    
    console.error("[v0] Stripe checkout error:", {
      message: stripeError.message,
      type: stripeError.type,
      code: (stripeError as any).code,
    })

    // Specific Stripe error handling
    if (stripeError.type === "StripeCardError") {
      return NextResponse.json(
        { success: false, error: "Card was declined. Please try another payment method." },
        { status: 400 }
      )
    }

    if (stripeError.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        { success: false, error: "Invalid payment request. Please verify your details and try again." },
        { status: 400 }
      )
    }

    if (stripeError.type === "StripeAuthenticationError") {
      console.error("[v0] Stripe authentication failed - check STRIPE_SECRET_KEY")
      return NextResponse.json(
        { success: false, error: "Payment system authentication failed. Please contact support." },
        { status: 503 }
      )
    }

    // Generic error
    return NextResponse.json(
      { success: false, error: "Payment processing encountered an error. Please try again in a moment." },
      { status: 500 }
    )
  }
}
