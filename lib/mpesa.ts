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
  const consumerKey = process.env.MPESA_CONSUMER_KEY || ""
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET || ""
  const passkey = process.env.MPESA_PASSKEY || ""
  const shortcode = process.env.MPESA_SHORTCODE || ""
  const env = (process.env.MPESA_ENV || "production") as "sandbox" | "production"
  const callbackUrl = process.env.MPESA_CALLBACK_URL || ""

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
 */
export function validateMpesaConfig(): {
  isValid: boolean
  missing: string[]
  error?: string
} {
  const config = getMpesaConfig()
  const missing: string[] = []

  if (!config.consumerKey) missing.push("MPESA_CONSUMER_KEY")
  if (!config.consumerSecret) missing.push("MPESA_CONSUMER_SECRET")
  if (!config.passkey) missing.push("MPESA_PASSKEY")
  if (!config.shortcode) missing.push("MPESA_SHORTCODE")

  if (missing.length > 0) {
    return {
      isValid: false,
      missing,
      error: `Missing M-Pesa credentials: ${missing.join(", ")}. Add these to Netlify environment variables.`,
    }
  }

  return { isValid: true, missing: [] }
}

/**
 * Get M-Pesa API base URL
 */
export function getMpesaBaseUrl(): string {
  const config = getMpesaConfig()
  return config.env === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke"
}

/**
 * Get OAuth access token from Safaricom
 * Uses consumer key and secret for authentication
 */
export async function getMpesaAccessToken(): Promise<string> {
  const config = getMpesaConfig()
  const auth = Buffer.from(
    `${config.consumerKey}:${config.consumerSecret}`
  ).toString("base64")

  const response = await fetch(
    `${getMpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `Failed to get access token: ${response.statusText} - ${JSON.stringify(errorData)}`
    )
  }

  const data = await response.json()
  if (!data.access_token) {
    throw new Error("No access token in response")
  }

  return data.access_token
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

  return `${year}${month}${day}${hours}${minutes}${seconds}`
}

/**
 * Generate M-Pesa password: Base64(Shortcode + Passkey + Timestamp)
 */
export function generateMpesaPassword(timestamp: string): string {
  const config = getMpesaConfig()
  const str = `${config.shortcode}${config.passkey}${timestamp}`
  return Buffer.from(str).toString("base64")
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
    return {
      isValid: false,
      error: "Invalid phone number. Use format 07XXXXXXXX or 01XXXXXXXX",
    }
  }

  return {
    isValid: true,
    formatted: cleaned,
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
    const finalCallbackUrl = callbackUrl || config.callbackUrl

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

    // Send STK Push
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

    const data = await response.json()

    // Check for success
    if (data.ResponseCode === "0") {
      return {
        success: true,
        message: "STK Push sent successfully",
        checkoutRequestID: data.CheckoutRequestID,
        merchantRequestID: data.MerchantRequestID,
      }
    }

    // Handle M-Pesa errors
    const errorMsg =
      data.errorMessage ||
      data.ResponseDescription ||
      "STK Push failed without specific error"

    return {
      success: false,
      error: errorMsg,
      responseCode: data.ResponseCode,
    }
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown error occurred"
    console.error("[v0] M-Pesa STK Push Error:", errorMsg)

    return {
      success: false,
      error: errorMsg,
    }
  }
}
