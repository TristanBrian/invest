import { NextRequest, NextResponse } from "next/server"
import { getStripeClient, validateStripeConfig } from "@/lib/stripe-config"

/**
 * Get Stripe Connect account status and requirements
 * GET /api/stripe/connect/account-status?accountId=acct_1234567890
 *
 * Response:
 * {
 *   "success": true,
 *   "accountId": "acct_1234567890",
 *   "displayName": "Business Name",
 *   "status": "complete" | "pending" | "incomplete",
 *   "onboardingComplete": true,
 *   "readyForPayments": true,
 *   "requirements": {
 *     "currentlyDue": [...],
 *     "pastDue": [...],
 *     "eventuallyDue": [...]
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Validate Stripe is configured
    validateStripeConfig()
    const stripe = getStripeClient()

    // Get accountId from query parameters
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get("accountId")

    if (!accountId) {
      return NextResponse.json({ success: false, error: "accountId query parameter is required" }, { status: 400 })
    }

    console.log("[v0] Fetching account status for:", accountId)

    // Retrieve account with all requirements and configuration details
    const account = (await stripe.v2.core.accounts.retrieve(accountId, {
      include: ["configuration.recipient", "requirements"],
    } as any)) as any

    // Determine onboarding status from requirements summary
    const requirementsSummary = account.requirements?.summary
    const requirementsStatus = requirementsSummary?.minimum_deadline?.status

    // Extract requirements lists - these may be on the summary object or the requirements object directly
    const currentlyDue = requirementsSummary?.currently_due || account.requirements?.currently_due || []
    const pastDue = requirementsSummary?.past_due || account.requirements?.past_due || []
    const eventuallyDue = requirementsSummary?.eventually_due || account.requirements?.eventually_due || []

    const onboardingComplete = requirementsStatus !== "currently_due" && requirementsStatus !== "past_due"

    // Check if account is ready to receive payments
    const recipientConfig = account.configuration?.recipient
    const stripeBalanceCapability = recipientConfig?.capabilities?.stripe_balance
    const readyForPayments = stripeBalanceCapability?.stripe_transfers?.status === "active"

    const status = readyForPayments ? "complete" : onboardingComplete ? "pending" : "incomplete"

    console.log("[v0] Account status:", {
      accountId,
      status,
      onboardingComplete,
      readyForPayments,
      currentlyDue: currentlyDue.length,
    })

    return NextResponse.json({
      success: true,
      accountId,
      displayName: account.display_name,
      email: account.contact_email,
      status,
      onboardingComplete,
      readyForPayments,
      capabilities: {
        stripeBalance: stripeBalanceCapability?.stripe_transfers?.status || "inactive",
      },
      requirements: {
        currentlyDue,
        pastDue,
        eventuallyDue,
        minimumDeadline: requirementsSummary?.minimum_deadline?.date
          ? new Date(requirementsSummary.minimum_deadline.date * 1000).toISOString()
          : null,
      },
    })
  } catch (error) {
    console.error("[v0] Account status fetch error:", error)

    if (error instanceof Error) {
      if (error.message.includes("STRIPE_SECRET_KEY")) {
        return NextResponse.json(
          { success: false, error: "Payment system not configured" },
          { status: 503 }
        )
      }

      if (error.message.includes("No such connected account")) {
        return NextResponse.json(
          { success: false, error: "Connected account not found" },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to fetch account status" }, { status: 500 })
  }
}
