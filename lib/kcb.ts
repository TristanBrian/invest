/**
 * KCB STK Push Integration
 * OAuth2-based payment initiation for Kenya Commercial Bank
 * Follows same patterns as M-Pesa for consistency
 */

export interface KcbConfig {
  clientId: string
  clientSecret: string
  orgShortCode: string
  orgPassKey: string
  env: "sandbox" | "production"
  callbackUrl: string
}

export interface KcbTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  generated_at: number
}

export interface KcbResponse {
  success: boolean
  message?: string
  error?: string
  transactionId?: string
  responseCode?: string
  callbackUrl?: string
}

/**
 * Get KCB configuration from environment variables
 * Called at request time to ensure env vars are available
 */
export function getKcbConfig(): KcbConfig {
  const clientId = (process.env.KCB_CLIENT_ID || "")
    .trim()
    .replace(/[\n\r\t]/g, "")
  const clientSecret = (process.env.KCB_CLIENT_SECRET || "")
    .trim()
    .replace(/[\n\r\t]/g, "")
  const orgShortCode = (process.env.KCB_ORG_SHORTCODE || "")
    .trim()
    .replace(/[\n\r\t]/g, "")
  const orgPassKey = (process.env.KCB_ORG_PASSKEY || "")
    .trim()
    .replace(/[\n\r\t]/g, "")
  const env = (process.env.KCB_ENV || "production") as "sandbox" | "production"
  const callbackUrl = (process.env.KCB_CALLBACK_URL || "")
    .trim()
    .replace(/[\n\r\t]/g, "")

  const debugConfig = {
    clientIdLength: clientId.length,
    clientIdStart: clientId.substring(0, 4),
    clientIdEnd: clientId.substring(Math.max(0, clientId.length - 4)),
    clientSecretLength: clientSecret.length,
    clientSecretStart: clientSecret.substring(0, 4),
    clientSecretEnd: clientSecret.substring(Math.max(0, clientSecret.length - 4)),
    orgShortCode,
    env,
    callbackUrlPresent: !!callbackUrl,
  }

  console.log("[v0] KCB Config Debug:", debugConfig)

  return {
    clientId,
    clientSecret,
    orgShortCode,
    orgPassKey,
    env,
    callbackUrl,
  }
}

/**
 * Validate KCB configuration
 * Returns missing credentials for debugging
 */
export function validateKcbConfig(): {
  isValid: boolean
  missing: string[]
  error?: string
} {
  const config = getKcbConfig()
  const missing: string[] = []

  if (!config.clientId || config.clientId.length === 0) {
    missing.push("KCB_CLIENT_ID")
  }
  if (!config.clientSecret || config.clientSecret.length === 0) {
    missing.push("KCB_CLIENT_SECRET")
  }
  if (!config.orgShortCode || config.orgShortCode.length === 0) {
    missing.push("KCB_ORG_SHORTCODE")
  }
  if (!config.orgPassKey || config.orgPassKey.length === 0) {
    missing.push("KCB_ORG_PASSKEY")
  }
  if (!config.callbackUrl || config.callbackUrl.length === 0) {
    missing.push("KCB_CALLBACK_URL")
  }

  if (missing.length > 0) {
    const error = `KCB Configuration Error: Missing credentials: ${missing.join(", ")}`
    console.error("[v0]", error)
    return {
      isValid: false,
      missing,
      error,
    }
  }

  return { isValid: true, missing: [] }
}

/**
 * Get KCB OAuth2 Access Token
 * Uses client_credentials grant type
 */
export async function getKcbAccessToken(
  forceRefresh = false
): Promise<{ token: string; expiresIn: number } | null> {
  const config = getKcbConfig()

  // In a production app, you'd cache this in Redis
  // For now, we get a fresh token per request
  try {
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString(
      "base64"
    )

    const tokenUrl =
      config.env === "sandbox"
        ? "https://accounts.buni.kcbgroup.com/oauth2/token"
        : "https://accounts.buni.kcbgroup.com/oauth2/token"

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] KCB Token Error:", response.status, errorText)
      return null
    }

    const data = (await response.json()) as KcbTokenResponse

    console.log("[v0] KCB Token acquired successfully")

    return {
      token: data.access_token,
      expiresIn: data.expires_in,
    }
  } catch (error) {
    console.error("[v0] KCB Token fetch failed:", error)
    return null
  }
}

/**
 * Validate Kenyan phone number
 * Accepts: 0712345678, +254712345678, 254712345678
 * Returns normalized: 254712345678
 */
export function validateKcbPhoneNumber(
  phoneNumber: string
): { isValid: boolean; normalized?: string; error?: string } {
  let normalized = phoneNumber.trim()

  // Remove spaces and dashes
  normalized = normalized.replace(/[\s-]/g, "")

  // Handle different formats
  if (normalized.startsWith("0")) {
    normalized = "254" + normalized.substring(1)
  } else if (normalized.startsWith("+254")) {
    normalized = normalized.substring(1)
  } else if (!normalized.startsWith("254")) {
    return {
      isValid: false,
      error: "Invalid phone format. Use 0712345678, +254712345678, or 254712345678",
    }
  }

  // Validate length: 254XXXXXXXXX (12 digits)
  if (normalized.length !== 12) {
    return {
      isValid: false,
      error: "Invalid phone number length",
    }
  }

  // Validate it's all digits
  if (!/^\d+$/.test(normalized)) {
    return {
      isValid: false,
      error: "Phone number must contain only digits",
    }
  }

  // Validate KE network operators (7 or 1 as second digit after 254)
  const secondDigit = normalized.substring(3, 4)
  if (!["1", "7"].includes(secondDigit)) {
    return {
      isValid: false,
      error: "Invalid Kenya mobile network number",
    }
  }

  return { isValid: true, normalized }
}

/**
 * Initiate KCB STK Push
 */
export async function initiateKcbStkPush(
  phoneNumber: string,
  amount: number,
  invoiceNumber: string,
  description: string
): Promise<KcbResponse> {
  // Validate config first
  const configValidation = validateKcbConfig()
  if (!configValidation.isValid) {
    return {
      success: false,
      error: configValidation.error,
    }
  }

  // Validate phone
  const phoneValidation = validateKcbPhoneNumber(phoneNumber)
  if (!phoneValidation.isValid) {
    return {
      success: false,
      error: phoneValidation.error,
    }
  }

  // Validate amount (KES, 1-150,000)
  if (amount < 1 || amount > 150000) {
    return {
      success: false,
      error: "Amount must be between 1 and 150,000 KES",
    }
  }

  // Get access token
  const tokenResult = await getKcbAccessToken()
  if (!tokenResult) {
    return {
      success: false,
      error: "Failed to acquire KCB access token",
    }
  }

  const config = getKcbConfig()
  const normalizedPhone = phoneValidation.normalized!

  try {
    const apiUrl =
      config.env === "sandbox"
        ? "https://uat.buni.kcbgroup.com/mm/api/request/1.0.0/stkpush"
        : "https://prod.buni.kcbgroup.com/mm/api/request/1.0.0/stkpush"

    const payload = {
      phoneNumber: normalizedPhone,
      amount: amount.toString(),
      invoiceNumber,
      sharedShortCode: false,
      orgShortCode: config.orgShortCode,
      orgPassKey: config.orgPassKey,
      callbackUrl: config.callbackUrl,
      transactionDescription: description,
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenResult.token}`,
        "Content-Type": "application/json",
        "routeCode": "207",
        "operation": "STKPush",
        "messageId": `MSG_${Date.now()}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] KCB STK Push Error:", response.status, errorText)
      return {
        success: false,
        error: `KCB API Error: ${response.status}`,
      }
    }

    const data = await response.json()

    console.log("[v0] KCB STK Push initiated successfully")

    return {
      success: true,
      message: "STK Push initiated. Check your phone for prompt.",
      transactionId: data.transactionId || `KCB_${Date.now()}`,
      responseCode: data.responseCode || "0",
      callbackUrl: config.callbackUrl,
    }
  } catch (error) {
    console.error("[v0] KCB STK Push request failed:", error)
    return {
      success: false,
      error: "Failed to initiate STK Push. Please try again.",
    }
  }
}

/**
 * Revoke KCB OAuth2 Token
 * Called after successful payment or on error cleanup
 */
export async function revokeKcbToken(accessToken: string): Promise<boolean> {
  const config = getKcbConfig()

  try {
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString(
      "base64"
    )

    const revokeUrl = "https://accounts.buni.kcbgroup.com/oauth2/revoke"

    const response = await fetch(revokeUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `token=${accessToken}`,
    })

    if (!response.ok) {
      console.warn("[v0] KCB Token revocation failed:", response.status)
      return false
    }

    console.log("[v0] KCB Token revoked successfully")
    return true
  } catch (error) {
    console.error("[v0] KCB Token revocation error:", error)
    return false
  }
}
