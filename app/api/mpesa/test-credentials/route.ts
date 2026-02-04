import { NextResponse } from "next/server"
import { getMpesaConfig, getMpesaBaseUrl } from "@/lib/mpesa"

/**
 * M-Pesa Credentials Test Endpoint
 * GET /api/mpesa/test-credentials
 *
 * This endpoint tests if M-Pesa credentials are valid by attempting
 * to get an access token. Returns detailed debugging information.
 *
 * WARNING: Only use for testing. Delete before production.
 */

export async function GET() {
  try {
    console.log("[v0] M-Pesa Credentials Test: Starting diagnostic...")

    // Get configuration
    const config = getMpesaConfig()

    // Step 1: Verify credentials are present
    console.log("[v0] Step 1: Checking credentials presence")
    const diagnostics: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      environment: config.env,
      credentials: {
        consumerKeyPresent: !!config.consumerKey,
        consumerKeyLength: config.consumerKey.length,
        consumerKeyPrefix: config.consumerKey.substring(0, 5),
        consumerKeyEnd: config.consumerKey.substring(
          Math.max(0, config.consumerKey.length - 5)
        ),
        consumerSecretPresent: !!config.consumerSecret,
        consumerSecretLength: config.consumerSecret.length,
        consumerSecretPrefix: config.consumerSecret.substring(0, 5),
        consumerSecretEnd: config.consumerSecret.substring(
          Math.max(0, config.consumerSecret.length - 5)
        ),
        shortcodePresent: !!config.shortcode,
        shortcode: config.shortcode,
      },
    }

    if (!config.consumerKey || !config.consumerSecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing credentials",
          diagnostics,
        },
        { status: 400 }
      )
    }

    // Step 2: Create Base64 encoded credentials
    console.log("[v0] Step 2: Encoding credentials")
    const credentials = `${config.consumerKey}:${config.consumerSecret}`
    const base64Credentials = Buffer.from(credentials).toString("base64")

    diagnostics.encoding = {
      credentialsStringLength: credentials.length,
      base64EncodedLength: base64Credentials.length,
      base64First20Chars: base64Credentials.substring(0, 20),
      base64Last20Chars: base64Credentials.substring(
        Math.max(0, base64Credentials.length - 20)
      ),
    }

    // Step 3: Attempt OAuth request
    console.log("[v0] Step 3: Attempting OAuth token request")
    const oauthUrl = `${getMpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`

    diagnostics.oauthRequest = {
      url: oauthUrl,
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Credentials.substring(0, 10)}...`,
        "Content-Type": "application/json",
      },
    }

    const response = await fetch(oauthUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json",
      },
    })

    diagnostics.oauthResponse = {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
    }

    const responseData = await response.json()

    diagnostics.oauthResponseBody = responseData

    // Step 4: Check for access token
    console.log("[v0] Step 4: Validating access token")

    if (response.ok && responseData.access_token) {
      diagnostics.result = {
        success: true,
        message: "Credentials are valid! Access token obtained.",
        tokenLength: responseData.access_token.length,
        tokenPrefix: responseData.access_token.substring(0, 10),
        expiresIn: responseData.expires_in,
      }

      return NextResponse.json(diagnostics)
    } else {
      diagnostics.result = {
        success: false,
        error: "Failed to obtain access token",
        message: responseData.error || responseData.errorMessage || "Unknown error",
        details: responseData,
      }

      return NextResponse.json(diagnostics, { status: 400 })
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined

    console.error("[v0] M-Pesa Credentials Test Error:", errorMsg, error)

    return NextResponse.json(
      {
        success: false,
        error: "Test failed with exception",
        message: errorMsg,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    )
  }
}
