import { NextRequest, NextResponse } from "next/server"

// M-Pesa Daraja API Configuration
// Environment variables required:
// - MPESA_CONSUMER_KEY: Your Daraja API consumer key
// - MPESA_CONSUMER_SECRET: Your Daraja API consumer secret  
// - MPESA_PASSKEY: Your Lipa Na M-Pesa Online passkey
// - MPESA_SHORTCODE: Your business shortcode (Paybill/Till number)
// - MPESA_ENV: "sandbox" for testing, "production" for live
// - MPESA_CALLBACK_URL: URL for payment confirmations (optional, auto-generated if not set)

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || ""
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || ""
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || ""
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || ""
const MPESA_ENV = process.env.MPESA_ENV || "sandbox"

const getBaseUrl = () => {
  return MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke"
}

// Validate configuration
function validateConfig(): { valid: boolean; error?: string; missing?: string[] } {
  const missing: string[] = []
  
  if (!MPESA_CONSUMER_KEY) missing.push("MPESA_CONSUMER_KEY")
  if (!MPESA_CONSUMER_SECRET) missing.push("MPESA_CONSUMER_SECRET")
  if (!MPESA_PASSKEY) missing.push("MPESA_PASSKEY")
  if (!MPESA_SHORTCODE) missing.push("MPESA_SHORTCODE")
  
  if (missing.length > 0) {
    return {
      valid: false,
      error: `M-Pesa credentials not configured. Missing: ${missing.join(", ")}`,
      missing
    }
  }
  
  return { valid: true }
}

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64")
  
  const response = await fetch(`${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to get M-Pesa access token")
  }

  const data = await response.json()
  return data.access_token
}

function generateTimestamp(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")
  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

function generatePassword(timestamp: string): string {
  const str = `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
  return Buffer.from(str).toString("base64")
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, amount, accountReference, transactionDesc } = await request.json()

    // Validate required fields
    if (!phoneNumber || !amount) {
      return NextResponse.json(
        { success: false, error: "Phone number and amount are required" },
        { status: 400 }
      )
    }

    // Validate amount
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount < 1 || numAmount > 150000) {
      return NextResponse.json(
        { success: false, error: "Amount must be between KES 1 and KES 150,000" },
        { status: 400 }
      )
    }

    // Format and validate phone number (Kenyan format: 254XXXXXXXXX)
    let formattedPhone = phoneNumber.toString().replace(/\s/g, "").replace(/^0/, "254").replace(/^\+/, "")
    if (!formattedPhone.startsWith("254")) {
      formattedPhone = `254${formattedPhone}`
    }
    
    // Validate phone number format (should be 12 digits for Kenya)
    if (!/^254[17]\d{8}$/.test(formattedPhone)) {
      return NextResponse.json(
        { success: false, error: "Invalid Kenyan phone number format. Use 07XXXXXXXX or 01XXXXXXXX" },
        { status: 400 }
      )
    }

    // Check configuration - this is crucial for production
    const configCheck = validateConfig()
    if (!configCheck.valid) {
      // In development, provide helpful message
      if (process.env.NODE_ENV !== "production") {
        console.warn("[v0] M-Pesa Development Mode: Credentials not configured")
        console.warn("[v0] Missing credentials:", configCheck.missing)
        
        // Return mock response for development/testing
        return NextResponse.json({
          success: true,
          message: "DEV MODE: M-Pesa payment simulation. In production, add credentials to Netlify environment variables.",
          checkoutRequestID: `DEV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          merchantRequestID: `DEV_MERCHANT_${Date.now()}`,
          development: true,
          missingCredentials: configCheck.missing,
          setupGuide: "See NETLIFY_ENV_SETUP.md for deployment instructions",
        })
      }
      
      // In production, return proper error
      console.error("[v0] M-Pesa Configuration Error: Production deployment missing credentials")
      console.error("[v0] Missing credentials:", configCheck.missing)
      return NextResponse.json(
        { 
          success: false, 
          error: "M-Pesa is not configured. Contact administrator to set up credentials.",
          setupGuide: "Credentials must be added to Netlify environment variables for production"
        },
        { status: 503 }
      )
    }

    // Production mode - make actual M-Pesa API call
    try {
      // Get access token
      const accessToken = await getAccessToken()
      const timestamp = generateTimestamp()
      const password = generatePassword(timestamp)

      // Get callback URL from environment or construct from request
      const callbackUrl = process.env.MPESA_CALLBACK_URL || `${request.nextUrl.origin}/api/mpesa/callback`

      // STK Push request
      const stkPushResponse = await fetch(`${getBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(amount),
          PartyA: formattedPhone,
          PartyB: MPESA_SHORTCODE,
          PhoneNumber: formattedPhone,
          CallBackURL: callbackUrl,
          AccountReference: accountReference || "TheOxicGroup",
          TransactionDesc: transactionDesc || "Investment Payment",
        }),
      })

      const stkPushData = await stkPushResponse.json()

      if (stkPushData.ResponseCode === "0") {
        return NextResponse.json({
          success: true,
          message: "STK push sent successfully. Please check your phone to complete the payment.",
          checkoutRequestID: stkPushData.CheckoutRequestID,
          merchantRequestID: stkPushData.MerchantRequestID,
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            error: stkPushData.errorMessage || stkPushData.ResponseDescription || "Failed to initiate payment",
          },
          { status: 400 }
        )
      }
    } catch (apiError) {
      console.error("[v0] M-Pesa API Error:", apiError)
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to contact M-Pesa service. Please try again.",
          details: apiError instanceof Error ? apiError.message : "Unknown error"
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[v0] M-Pesa Request Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process payment request" },
      { status: 500 }
    )
  }
}
