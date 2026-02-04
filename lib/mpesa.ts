/**
 * M-Pesa Daraja API Utilities
 * Clean, modular helpers for M-Pesa STK Push integration with Netlify
 */

export interface MpesaConfig {
  consumerKey: string
  consumerSecret: string
  passkey: string
  shortcode: string
  env: "sandbox" | "production"
  callbackUrl: string
}

export interface MpesaResponse {
  success: boolean
  message?: string
  error?: string
  checkoutRequestID?: string
  merchantRequestID?: string
  responseCode?: string
}

/**
 * Get M-Pesa configuration from environment variables
 * Called at request time to ensure Netlify env vars are available
 */
export function getMpesaConfig(): MpesaConfig {
  const consumerKey = process.env.MPESA_CONSUMER_KEY?.trim() || ""
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET?.trim() || ""
  const passkey = process.env.MPESA_PASSKEY?.trim() || ""
  const shortcode = process.env.MPESA_SHORTCODE?.trim() || ""
  const env = (process.env.MPESA_ENV || "production") as "sandbox" | "production"
  const callbackUrl = process.env.MPESA_CALLBACK_URL?.trim() || ""

  // Log config status (without exposing secrets)
  console.log("[v0] M-Pesa Config Status:", {
    consumerKeyLength: consumerKey.length,
    consumerSecretLength: consumerSecret.length,
    passkeyLength: passkey.length,
    shortcodeLength: shortcode.length,
    env,
    callbackUrlPresent: !!callbackUrl,
  })

  return {
    consumerKey,
    consumerSecret,
    passkey,
    shortcode,
    env,
    callbackUrl,
  }
}

/**
 * Validate M-Pesa configuration
 * Returns missing credentials for debugging
 * Note: MPESA_PASSKEY is optional for testing with sandbox/demo accounts
 */
export function validateMpesaConfig(): {
  isValid: boolean
  missing: string[]
  error?: string
} {
  const config = getMpesaConfig()
  const missing: string[] = []

  // Required credentials for authentication and STK push
  if (!config.consumerKey || config.consumerKey.length === 0) {
    missing.push("MPESA_CONSUMER_KEY")
  }
  if (!config.consumerSecret || config.consumerSecret.length === 0) {
    missing.push("MPESA_CONSUMER_SECRET")
  }
  if (!config.shortcode || config.shortcode.length === 0) {
    missing.push("MPESA_SHORTCODE")
  }

  // PASSKEY is optional - some test accounts may not require it
  // Production accounts should have it configured

  if (missing.length > 0) {
    console.error(
      "[v0] M-Pesa Configuration Validation Failed:",
      missing
    )
    return {
      isValid: false,
      missing,
      error: `Missing M-Pesa credentials: ${missing.join(", ")}. Add these to Netlify environment variables.`,
    }
  }

  console.log("[v0] M-Pesa Configuration Validation: PASSED")
  return { isValid: true, missing: [] }
}

/**
 * Get M-Pesa API base URL
 */
export function getMpesaBaseUrl(): string {
  const config = getMpesaConfig()
  const baseUrl = config.env === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke"
  console.log("[v0] M-Pesa Base URL:", baseUrl)
  return baseUrl
}

/**
 * Get OAuth access token from Safaricom
 * Uses consumer key and secret for authentication
 */
export async function getMpesaAccessToken(): Promise<string> {
  const config = getMpesaConfig()

  // Create Basic auth header
  const credentials = `${config.consumerKey}:${config.consumerSecret}`
  const base64Credentials = Buffer.from(credentials).toString("base64")

  console.log("[v0] M-Pesa Access Token Request:", {
    env: config.env,
    consumerKeyLength: config.consumerKey.length,
    base64Length: base64Credentials.length,
  })

  const url = `${getMpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] M-Pesa Access Token Response Status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] M-Pesa Access Token Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      throw new Error(
        `Access token request failed with status ${response.status}: ${response.statusText}`
      )
    }

    const data = await response.json()

    if (!data.access_token) {
      console.error("[v0] M-Pesa: No access_token in response")
      throw new Error("No access_token in M-Pesa response")
    }

    console.log("[v0] M-Pesa: Access token obtained successfully")
    return data.access_token
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("[v0] M-Pesa Access Token Error:", errorMsg)
    throw error
  }
}

/**
 * Generate M-Pesa timestamp in required format: YYYYMMDDHHmmss
 */
export function generateMpesaTimestamp(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`
  console.log("[v0] M-Pesa Timestamp Generated:", timestamp)
  return timestamp
}

/**
 * Generate M-Pesa password: Base64(Shortcode + Passkey + Timestamp)
 * If passkey is not available, uses shortcode + timestamp
 * (Some test/sandbox accounts may work without passkey)
 */
export function generateMpesaPassword(timestamp: string): string {
  const config = getMpesaConfig()

  // If passkey is configured, use it (production)
  if (config.passkey && config.passkey.length > 0) {
    const str = `${config.shortcode}${config.passkey}${timestamp}`
    const password = Buffer.from(str).toString("base64")
    console.log("[v0] M-Pesa Password: Generated with passkey")
    return password
  }

  // If passkey is not configured, warn and use shortcode + timestamp only
  // This is for testing with sandbox/demo accounts
  console.warn(
    "[v0] M-Pesa: MPESA_PASSKEY not configured. Using shortcode + timestamp only for password generation."
  )

  const str = `${config.shortcode}${timestamp}`
  const password = Buffer.from(str).toString("base64")
  console.log("[v0] M-Pesa Password: Generated without passkey (test mode)")
  return password
}

/**
 * Format and validate Kenyan phone number
 * Accepts: 0712345678, +254712345678, 254712345678, 712345678
 * Returns: 254712345678
 */
export function formatKenyanPhoneNumber(phone: string): {
  isValid: boolean
  formatted?: string
  error?: string
} {
  // Remove all spaces
  let cleaned = phone.replace(/\s/g, "")

  // Convert + prefix to country code
  if (cleaned.startsWith("+")) {
    cleaned = cleaned.substring(1)
  }

  // Convert 0 prefix to country code
  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.substring(1)
  }

  // If no country code, add it
  if (!cleaned.startsWith("254")) {
    cleaned = "254" + cleaned
  }

  // Validate format: 254 followed by 1 or 7, then 8 more digits = 12 total
  if (!/^254[17]\d{8}$/.test(cleaned)) {
    console.warn("[v0] Invalid phone format:", phone)
    return {
      isValid: false,
      error: "Invalid phone number. Use format 07XXXXXXXX or 01XXXXXXXX",
    }
  }

  console.log("[v0] Phone number formatted:", cleaned)
  return {
    isValid: true,
    formatted: cleaned,
  }
}

/**
 * Validate and format callback URL for M-Pesa
 * M-Pesa requires: https://, valid domain, no trailing slash
 */
export function validateMpesaCallbackUrl(url: string): {
  isValid: boolean
  formatted?: string
  error?: string
} {
  if (!url || url.trim().length === 0) {
    return {
      isValid: false,
      error: "Callback URL is required. Set MPESA_CALLBACK_URL in Netlify environment variables.",
    }
  }

  // Trim whitespace
  let formatted = url.trim()

  // Must start with https://
  if (!formatted.startsWith("https://")) {
    return {
      isValid: false,
      error: "Callback URL must use HTTPS. Example: https://yourdomain.com/api/mpesa/callback",
    }
  }

  // Remove trailing slash if present
  if (formatted.endsWith("/")) {
    formatted = formatted.slice(0, -1)
  }

  // Ensure it ends with /api/mpesa/callback
  if (!formatted.includes("/api/mpesa/callback")) {
    formatted = `${formatted}/api/mpesa/callback`
  }

  // Basic URL validation: must have a domain
  try {
    new URL(formatted)
  } catch {
    return {
      isValid: false,
      error: `Invalid callback URL format: ${formatted}`,
    }
  }

  console.log("[v0] M-Pesa Callback URL validated:", formatted)
  return {
    isValid: true,
    formatted,
  }
}

/**
 * Validate payment amount
 */
export function validateMpesaAmount(amount: number): {
  isValid: boolean
  error?: string
} {
  const numAmount = parseFloat(String(amount))

  if (isNaN(numAmount)) {
    return { isValid: false, error: "Amount must be a valid number" }
  }

  if (numAmount < 1) {
    return { isValid: false, error: "Amount must be at least KES 1" }
  }

  if (numAmount > 150000) {
    return { isValid: false, error: "Amount cannot exceed KES 150,000" }
  }

  console.log("[v0] Amount validated:", numAmount)
  return { isValid: true }
}

/**
 * Initiate M-Pesa STK Push payment
 */
export async function initiateMpesaStkPush(
  phoneNumber: string,
  amount: number,
  accountReference: string = "OXIC",
  transactionDesc: string = "Payment",
  callbackUrl?: string
): Promise<MpesaResponse> {
  console.log("[v0] M-Pesa STK Push: Initiating payment process...")

  // Validate inputs
  const amountValidation = validateMpesaAmount(amount)
  if (!amountValidation.isValid) {
    return { success: false, error: amountValidation.error }
  }

  const phoneValidation = formatKenyanPhoneNumber(phoneNumber)
  if (!phoneValidation.isValid) {
    return { success: false, error: phoneValidation.error }
  }

  // Validate config
  const configValidation = validateMpesaConfig()
  if (!configValidation.isValid) {
    return { success: false, error: configValidation.error }
  }

  try {
    const config = getMpesaConfig()
    const timestamp = generateMpesaTimestamp()
    const password = generateMpesaPassword(timestamp)
    
    // Handle callback URL: parameter takes priority, then env var
    let finalCallbackUrl = callbackUrl || config.callbackUrl
    
    // Validate callback URL
    if (!finalCallbackUrl) {
      return {
        success: false,
        error: "Callback URL is required. Set MPESA_CALLBACK_URL in Netlify environment variables. Example: https://oxicinternational.co.ke/api/mpesa/callback",
      }
    }

    const callbackValidation = validateMpesaCallbackUrl(finalCallbackUrl)
    if (!callbackValidation.isValid) {
      return { success: false, error: callbackValidation.error }
    }

    finalCallbackUrl = callbackValidation.formatted!

    console.log("[v0] M-Pesa STK Push: Getting access token...")
    // Get access token
    const accessToken = await getMpesaAccessToken()

    // Prepare request
    const requestBody = {
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: phoneValidation.formatted,
      PartyB: config.shortcode,
      PhoneNumber: phoneValidation.formatted,
      CallBackURL: finalCallbackUrl,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    }

    console.log("[v0] M-Pesa STK Push Request Body:", {
      BusinessShortCode: requestBody.BusinessShortCode,
      Amount: requestBody.Amount,
      PartyA: requestBody.PartyA,
      Timestamp: requestBody.Timestamp,
      TransactionType: requestBody.TransactionType,
      CallBackURL: requestBody.CallBackURL,
    })

    // Send STK Push
    console.log("[v0] M-Pesa: Sending STK Push request...")
    const response = await fetch(
      `${getMpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    )

    console.log("[v0] M-Pesa STK Push Response Status:", response.status)

    const data = await response.json()
    console.log("[v0] M-Pesa STK Push Response Data:", {
      ResponseCode: data.ResponseCode,
      ResponseDescription: data.ResponseDescription,
    })

    // Check for success
    if (data.ResponseCode === "0") {
      console.log("[v0] M-Pesa: STK Push successful")
      return {
        success: true,
        message: "STK Push sent successfully",
        checkoutRequestID: data.CheckoutRequestID,
        merchantRequestID: data.MerchantRequestID,
      }
    }

    // Handle errors
    const errorMsg =
      data.errorMessage ||
      data.ResponseDescription ||
      "M-Pesa request failed"
    console.error("[v0] M-Pesa STK Push Error:", errorMsg)

    return {
      success: false,
      error: errorMsg,
      responseCode: data.ResponseCode,
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("[v0] M-Pesa STK Push Exception:", errorMsg)
    return {
      success: false,
      error: `Payment processing failed: ${errorMsg}`,
    }
  }
}
