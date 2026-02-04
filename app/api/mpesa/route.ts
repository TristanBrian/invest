import { NextRequest, NextResponse } from "next/server"

// M-Pesa Daraja API Configuration
// Environment variables required:
// - MPESA_CONSUMER_KEY: Your Daraja API consumer key
// - MPESA_CONSUMER_SECRET: Your Daraja API consumer secret  
// - MPESA_PASSKEY: Your Lipa Na M-Pesa Online passkey
// - MPESA_SHORTCODE: Your business shortcode (Paybill/Till number)
// - MPESA_ENV: "sandbox" for testing, "production" for live
// - MPESA_CALLBACK_URL: URL for payment confirmations (optional, auto-generated if not set)

// Read environment variables at request time to ensure they're loaded from Netlify
function getConfig() {
  return {
    MPESA_CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY || "",
    MPESA_CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET || "",
    MPESA_PASSKEY: process.env.MPESA_PASSKEY || "",
    MPESA_SHORTCODE: process.env.MPESA_SHORTCODE || "",
    MPESA_ENV: process.env.MPESA_ENV || "production",
    MPESA_CALLBACK_URL: process.env.MPESA_CALLBACK_URL || ""
  }
}

const getBaseUrl = () => {
  const env = process.env.MPESA_ENV || "production"
  return env === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke"
}

// Validate configuration
function validateConfig(): { valid: boolean; error?: string; missing?: string[] } {
  const config = getConfig()
  const missing: string[] = []
  
  if (!config.MPESA_CONSUMER_KEY) missing.push("MPESA_CONSUMER_KEY")
  if (!config.MPESA_CONSUMER_SECRET) missing.push("MPESA_CONSUMER_SECRET")
  if (!config.MPESA_PASSKEY) missing.push("MPESA_PASSKEY")
  if (!config.MPESA_SHORTCODE) missing.push("MPESA_SHORTCODE")
  
  if (missing.length > 0) {
    console.error("[v0] M-Pesa Configuration Error - Missing credentials:", missing)
    console.error("[v0] Environment check:", {
      MPESA_CONSUMER_KEY: config.MPESA_CONSUMER_KEY ? "SET" : "MISSING",
      MPESA_CONSUMER_SECRET: config.MPESA_CONSUMER_SECRET ? "SET" : "MISSING",
      MPESA_PASSKEY: config.MPESA_PASSKEY ? "SET" : "MISSING",
      MPESA_SHORTCODE: config.MPESA_SHORTCODE ? "SET" : "MISSING",
    })
    return {
      valid: false,
      error: `M-Pesa credentials not configured. Missing: ${missing.join(", ")}`,
      missing
    }
  }
  
  console.log("[v0] M-Pesa Configuration: All credentials loaded successfully")
  return { valid: true }
}

async function getAccessToken(): Promise<string> {
  const config = getConfig()
  const auth = Buffer.from(`${config.MPESA_CONSUMER_KEY}:${config.MPESA_CONSUMER_SECRET}`).toString("base64")
  
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
  const config = getConfig()
  const str = `${config.MPESA_SHORTCODE}${config.MPESA_PASSKEY}${timestamp}`
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
      console.error("[v0] M-Pesa Configuration Error:", configCheck.error)
      console.error("[v0] Missing required credentials:", configCheck.missing)
      
      // IMPORTANT: Even in production on Netlify, if credentials are missing, return clear error
      // The application code handles development vs production distinction
      return NextResponse.json(
        { 
          success: false, 
          error: `M-Pesa configuration incomplete. Missing: ${configCheck.missing?.join(", ")}. Please add these to Netlify environment variables.`,
          missingCredentials: configCheck.missing,
          setupGuide: "1. Go to Netlify Site Settings > Build & Deploy > Environment\n2. Add MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_PASSKEY, MPESA_SHORTCODE\n3. Trigger a new deployment"
        },
        { status: 503 }
      )
    }

    // All credentials present - proceed with M-Pesa API call
    console.log("[v0] M-Pesa: All credentials verified, processing payment...")
    
    try {
      const config = getConfig()
      
      // Get access token from Safaricom
      console.log("[v0] M-Pesa: Requesting access token...")
      const accessToken = await getAccessToken()
      console.log("[v0] M-Pesa: Access token obtained successfully")
      
      const timestamp = generateTimestamp()
      const password = generatePassword(timestamp)

      // Get callback URL
      const callbackUrl = config.MPESA_CALLBACK_URL || `${request.nextUrl.origin}/api/mpesa/callback`
      console.log("[v0] M-Pesa: Using callback URL:", callbackUrl)

      // Prepare STK Push request body
      const requestBody = {
        BusinessShortCode: config.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: config.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: accountReference || "TheOxicGroup",
        TransactionDesc: transactionDesc || "Investment Payment",
      }

      console.log("[v0] M-Pesa: Sending STK push request...", {
        Amount: amount,
        Phone: formattedPhone,
        ShortCode: config.MPESA_SHORTCODE
      })

      // Send STK Push request
      const stkPushResponse = await fetch(`${getBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const stkPushData = await stkPushResponse.json()
      console.log("[v0] M-Pesa: Response received:", stkPushData.ResponseCode)

      if (stkPushData.ResponseCode === "0") {
        console.log("[v0] M-Pesa: STK push successful")
        return NextResponse.json({
          success: true,
          message: "STK push sent successfully. Please check your phone to complete the payment.",
          checkoutRequestID: stkPushData.CheckoutRequestID,
          merchantRequestID: stkPushData.MerchantRequestID,
        })
      } else {
        const errorMsg = stkPushData.errorMessage || stkPushData.ResponseDescription || "Failed to initiate payment"
        console.error("[v0] M-Pesa: STK push failed:", errorMsg)
        return NextResponse.json(
          {
            success: false,
            error: errorMsg,
            responseCode: stkPushData.ResponseCode
          },
          { status: 400 }
        )
      }
    } catch (apiError) {
      console.error("[v0] M-Pesa API Error:", apiError)
      const errorMsg = apiError instanceof Error ? apiError.message : "Unknown error"
      return NextResponse.json(
        { 
          success: false,
          error: "Failed to contact M-Pesa service. " + errorMsg,
          hint: "Check Netlify function logs for details"
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
