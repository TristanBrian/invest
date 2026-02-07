import { NextRequest, NextResponse } from "next/server"
import { getStripeClient, validateStripeConfig } from "@/lib/stripe-config"

/**
 * Create an account link for seller onboarding
 * POST /api/stripe/connect/account-link
 *
 * Body:
 * {
 *   "accountId": "acct_1234567890"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "url": "https://connect.stripe.com/...",
 *   "expiresAt": 1234567890
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate Stripe is configured
    const config = validateStripeConfig()
    const stripe = getStripeClient()

    const { accountId } = await request.json()

    if (!accountId) {
      return NextResponse.json({ success: false, error: "accountId is required" }, { status: 400 })
    }

    console.log("[v0] Creating account link for:", accountId)

    // Create account link for onboarding
    // This generates a secure URL where the seller can complete their onboarding
    const accountLink = await stripe.v2.core.accountLinks.create({
      account: accountId,
      use_case: {
        type: "account_onboarding",
        account_onboarding: {
          configurations: ["recipient"],
          refresh_url: `${config.appUrl}/stripe/onboarding?accountId=${accountId}`,
          return_url: `${config.appUrl}/stripe/onboarding?accountId=${accountId}&status=complete`,
        },
      },
    } as Parameters<typeof stripe.v2.core.accountLinks.create>[0])

    console.log("[v0] Account link created, expires at:", accountLink.expires_at)

    return NextResponse.json({
      success: true,
      url: accountLink.url,
      expiresAt: accountLink.expires_at,
      accountId: accountId,
    })
  } catch (error) {
    console.error("[v0] Account link creation error:", error)

    if (error instanceof Error) {
      if (error.message.includes("STRIPE_SECRET_KEY")) {
        return NextResponse.json(
          { success: false, error: "Payment system not configured" },
          { status: 503 }
        )
      }

      // Handle specific Stripe errors
      if (error.message.includes("No such connected account")) {
        return NextResponse.json(
          { success: false, error: "Connected account not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create account link" }, { status: 500 })
  }
}
