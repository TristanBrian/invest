import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { validateStripeConfig } from "@/lib/stripe-config"

/**
 * Stripe Webhook Handler
 * POST /api/webhooks/stripe
 *
 * Handles:
 * - checkout.session.completed
 * - payment_intent.succeeded
 * - account.updated
 * - account.external_account.created
 */

export async function POST(request: NextRequest) {
  try {
    // Get webhook signature from headers
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      console.error("[v0] Webhook error: No signature header")
      return NextResponse.json({ success: false, error: "No signature" }, { status: 400 })
    }

    // Validate webhook secret is configured
    const config = validateStripeConfig()
    if (!config.webhookSecret) {
      console.error("[v0] Webhook error: STRIPE_WEBHOOK_SECRET not configured")
      return NextResponse.json(
        { success: false, error: "Webhook not configured" },
        { status: 503 }
      )
    }

    // Get raw body for signature verification
    const body = await request.text()

    // Initialize Stripe client for webhook verification
    const stripe = new Stripe(config.secretKey, {
      apiVersion: "2025-12-15.clover",
    })

    let event: Stripe.Event

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(body, signature, config.webhookSecret)
    } catch (error) {
      console.error("[v0] Webhook signature verification failed:", error)
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 403 })
    }

    console.log("[v0] Webhook received:", event.type, "at", new Date().toISOString())

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        console.log("[v0] Checkout session completed:", session.id, "Amount:", session.amount_total)

        // TODO: Update order status in database
        // TODO: Send confirmation email
        // TODO: Trigger fulfillment

        return NextResponse.json({ success: true, processed: "checkout.session.completed" })
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(
          "[v0] Payment intent succeeded:",
          paymentIntent.id,
          "Amount:",
          paymentIntent.amount
        )

        // TODO: Log payment
        // TODO: Update customer account
        // TODO: Send receipt

        return NextResponse.json({ success: true, processed: "payment_intent.succeeded" })
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account
        console.log("[v0] Connected account updated:", account.id)

        // Check if requirements changed
        if (event.data.previous_attributes?.requirements?.currently_due) {
          console.log("[v0] Requirements changed for account:", account.id)

          // TODO: Notify seller about requirement changes
          // TODO: Update onboarding status in database
        }

        return NextResponse.json({ success: true, processed: "account.updated" })
      }

      case "account.external_account.created": {
        const externalAccount = event.data.object as Stripe.BankAccount | Stripe.Card
        const accountId = event.account as string

        console.log("[v0] External account created for:", accountId)

        // TODO: Update seller's bank/card information
        // TODO: Enable payouts if not already

        return NextResponse.json({ success: true, processed: "account.external_account.created" })
      }

      default:
        console.log("[v0] Unhandled webhook type:", event.type)
        return NextResponse.json({ success: true, processed: "unknown" })
    }
  } catch (error) {
    console.error("[v0] Webhook handler error:", error)

    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
