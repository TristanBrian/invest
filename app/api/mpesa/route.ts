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

    // Get config - callback URL MUST be set in environment variables
    const config = getMpesaConfig()
    
    // Log what we're about to send
    console.log("[v0] M-Pesa API Route: Environment configuration:", {
      hasConsumerKey: !!config.consumerKey,
      hasConsumerSecret: !!config.consumerSecret,
      shortcode: config.shortcode,
      env: config.env,
      callbackUrlConfigured: !!config.callbackUrl,
      callbackUrlValue: config.callbackUrl || "NOT SET",
    })

    // Callback URL MUST be configured - no fallback to request.nextUrl.origin
    if (!config.callbackUrl) {
      console.error("[v0] M-Pesa API Route: MPESA_CALLBACK_URL not configured in Netlify")
      return NextResponse.json(
        {
          success: false,
          error: "M-Pesa callback URL not configured. Set MPESA_CALLBACK_URL in Netlify environment variables.",
          example: "https://oxicinternational.co.ke/api/mpesa/callback",
          setupUrl: "https://app.netlify.com/sites/YOUR_SITE/settings/build",
        },
        { status: 503 }
      )
    }

    console.log("[v0] M-Pesa API Route: Initiating STK Push with:", {
      phone: phoneNumber,
      amount,
      env: config.env,
      callbackUrl: config.callbackUrl,
    })

    // Initiate STK Push - callback URL is validated inside the function
    const result = await initiateMpesaStkPush(
      phoneNumber,
      amount,
      accountReference,
      transactionDesc,
      config.callbackUrl
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
      console.error("[v0] M-Pesa API Route: STK Push failed:", {
        error: result.error,
        responseCode: result.responseCode,
      })

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
    console.error("[v0] M-Pesa API Route: Caught exception:", {
      message: errorMsg,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : undefined,
    })

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
