import { NextRequest, NextResponse } from "next/server"
import {
  validateMpesaConfig,
  initiateMpesaStkPush,
  getMpesaConfig,
} from "@/lib/mpesa"

/**
 * M-Pesa STK Push API Route
 * POST /api/mpesa
 *
 * Request body:
 * {
 *   phoneNumber: string (e.g., "0712345678" or "+254712345678")
 *   amount: number (KES, between 1-150,000)
 *   accountReference?: string (optional, defaults to "OXIC")
 *   transactionDesc?: string (optional, defaults to "Payment")
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   message?: string
 *   error?: string
 *   checkoutRequestID?: string
 *   merchantRequestID?: string
 * }
 */

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] M-Pesa API Route: Received POST request")

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("[v0] M-Pesa API Route: Request parsed successfully")
    } catch (error) {
      console.error("[v0] M-Pesa API Route: Failed to parse JSON", error)
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    const { phoneNumber, amount, accountReference, transactionDesc } = body

    console.log("[v0] M-Pesa API Route: Request parameters:", {
      phoneNumber,
      amount,
      accountReference: accountReference || "OXIC",
      transactionDesc: transactionDesc || "Payment",
    })

    // Validate request fields
    if (!phoneNumber) {
      console.warn("[v0] M-Pesa API Route: Phone number is missing")
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      )
    }

    if (amount === undefined || amount === null) {
      console.warn("[v0] M-Pesa API Route: Amount is missing")
      return NextResponse.json(
        { success: false, error: "Amount is required" },
        { status: 400 }
      )
    }

    // Validate M-Pesa configuration
    console.log("[v0] M-Pesa API Route: Validating M-Pesa configuration...")
    const configCheck = validateMpesaConfig()
    if (!configCheck.isValid) {
      console.error(
        "[v0] M-Pesa API Route: Configuration validation failed:",
        configCheck.missing
      )
      return NextResponse.json(
        {
          success: false,
          error: configCheck.error,
          missingCredentials: configCheck.missing,
          hint: "Add these to Netlify environment variables and redeploy",
        },
        { status: 503 }
      )
    }

    console.log("[v0] M-Pesa API Route: Configuration validated successfully")

    // Get config to determine callback URL
    const config = getMpesaConfig()
    const callbackUrl =
      config.callbackUrl || `${request.nextUrl.origin}/api/mpesa/callback`

    console.log("[v0] M-Pesa API Route: Initiating STK Push with:", {
      phone: phoneNumber,
      amount,
      env: config.env,
      callbackUrl,
    })

    // Initiate STK Push
    const result = await initiateMpesaStkPush(
      phoneNumber,
      amount,
      accountReference,
      transactionDesc,
      callbackUrl
    )

    if (result.success) {
      console.log("[v0] M-Pesa API Route: STK Push successful", {
        checkoutRequestID: result.checkoutRequestID,
      })

      return NextResponse.json({
        success: true,
        message:
          "STK push sent successfully. Please check your phone to complete the payment.",
        checkoutRequestID: result.checkoutRequestID,
        merchantRequestID: result.merchantRequestID,
      })
    } else {
      console.error("[v0] M-Pesa API Route: STK Push failed:", result.error)

      return NextResponse.json(
        {
          success: false,
          error: result.error,
          responseCode: result.responseCode,
        },
        { status: 400 }
      )
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] M-Pesa API Route: Unexpected error:", errorMsg, error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again later.",
        details: process.env.NODE_ENV === "development" ? errorMsg : undefined,
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  )
}
