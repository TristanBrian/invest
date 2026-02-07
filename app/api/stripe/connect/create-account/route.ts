import { NextRequest, NextResponse } from "next/server"
import { getStripeClient, validateStripeConfig } from "@/lib/stripe-config"

/**
 * Create a new Stripe Connect account for a seller
 * POST /api/stripe/connect/create-account
 *
 * Body:
 * {
 *   "displayName": "Business Name",
 *   "contactEmail": "owner@business.com",
 *   "country": "us"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "accountId": "acct_1234567890",
 *   "status": "new"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate Stripe is configured
    validateStripeConfig()

    const stripe = getStripeClient()
    const { displayName, contactEmail, country = "us" } = await request.json()

    // Validate required fields
    if (!displayName || !contactEmail) {
      return NextResponse.json(
        { success: false, error: "displayName and contactEmail are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
    }

    console.log("[v0] Creating Stripe Connect account for:", displayName)

    // Create connected account using V2 API
    // The platform (us) handles fees and payments collection
    const account = await stripe.v2.core.accounts.create({
      display_name: displayName,
      contact_email: contactEmail,
      identity: {
        country: country,
      },
      dashboard: "express",
      defaults: {
        responsibilities: {
          fees_collector: "application", // Platform collects fees
          losses_collector: "application", // Platform handles chargebacks
        },
      },
      configuration: {
        recipient: {
          capabilities: {
            stripe_balance: {
              stripe_transfers: {
                requested: true, // Enable payouts
              },
            },
          },
        },
      },
    } as Parameters<typeof stripe.v2.core.accounts.create>[0])

    console.log("[v0] Created Stripe Connect account:", account.id)

    return NextResponse.json({
      success: true,
      accountId: account.id,
      displayName: account.display_name,
      status: "created",
    })
  } catch (error) {
    console.error("[v0] Stripe Connect account creation error:", error)

    if (error instanceof Error) {
      // Handle Stripe-specific errors
      if (error.message.includes("STRIPE_SECRET_KEY")) {
        return NextResponse.json(
          { success: false, error: "Payment system not configured" },
          { status: 503 }
        )
      }

      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create account" }, { status: 500 })
  }
}
