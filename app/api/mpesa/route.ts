import { NextRequest, NextResponse } from "next/server"
import {
  validateMpesaConfig,
  initiateMpesaStkPush,
  getMpesaConfig,
} from "@/lib/mpesa"
import transactionManager from "@/lib/transaction-manager"
import emailService from "@/lib/email-service"
import {
  getClientIp,
  isValidOrigin,
  validatePaymentRequest,
  addSecurityHeaders,
  addCorsHeaders,
  logSecurityEvent,
  detectSuspiciousActivity,
  rateLimiter,
} from "@/lib/security"

/**
 * M-Pesa STK Push API Route with Security & Transaction Management
 * POST /api/mpesa
 *
 * Request body:
 * {
 *   phoneNumber: string (e.g., "0712345678")
 *   amount: number (KES, 1-150,000)
 *   accountReference?: string
 *   transactionDesc?: string
 *   customerEmail?: string (for invoice)
 *   customerName?: string (for invoice)
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request)
    console.log("[v0] M-Pesa API: Request from", clientIp)

    // Security: Rate limiting
    if (rateLimiter.isLimited(clientIp)) {
      logSecurityEvent("RATE_LIMIT_EXCEEDED", { ip: clientIp })
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Too many requests. Please try again in a minute.",
          },
          { status: 429 }
        )
      )
    }

    // Security: Origin validation
    if (!isValidOrigin(request)) {
      logSecurityEvent("INVALID_ORIGIN", {
        origin: request.headers.get("origin"),
        ip: clientIp,
      })
      return addSecurityHeaders(
        NextResponse.json(
          { success: false, error: "Request origin not allowed" },
          { status: 403 }
        )
      )
    }

    // Parse and validate request
    let body
    try {
      body = await request.json()
    } catch {
      return addSecurityHeaders(
        NextResponse.json(
          { success: false, error: "Invalid JSON in request body" },
          { status: 400 }
        )
      )
    }

    // Validate payment parameters
    const validation = validatePaymentRequest(body)
    if (!validation.isValid) {
      return addSecurityHeaders(
        NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        )
      )
    }

    const phoneNumber = validation.phoneNumber!
    const amount = validation.amount!
    const accountReference = body.accountReference || "OXIC"
    const transactionDesc = body.transactionDesc || "Payment"
    const customerEmail = body.customerEmail
    const customerName = body.customerName

    // Security: Detect suspicious activity
    const suspicion = detectSuspiciousActivity(phoneNumber, amount, clientIp)
    if (suspicion.isSuspicious) {
      logSecurityEvent("SUSPICIOUS_ACTIVITY", {
        reason: suspicion.reason,
        ip: clientIp,
        phoneNumber: phoneNumber.slice(-4),
        amount,
      })
    }

    // Validate M-Pesa configuration
    const configCheck = validateMpesaConfig()
    if (!configCheck.isValid) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: configCheck.error,
          },
          { status: 503 }
        )
      )
    }

    const config = getMpesaConfig()

    if (!config.callbackUrl) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "M-Pesa callback URL not configured",
          },
          { status: 503 }
        )
      )
    }

    // Create transaction record
    const transaction = await initiateMpesaStkPush(
      phoneNumber,
      amount,
      accountReference,
      transactionDesc,
      config.callbackUrl
    )

    if (transaction.success) {
      // Generate professional transaction ID
      const txRecord = transactionManager.createTransaction(
        transaction.merchantRequestID || "",
        transaction.checkoutRequestID || "",
        phoneNumber,
        amount,
        accountReference,
        transactionDesc
      )

      logSecurityEvent("PAYMENT_INITIATED", {
        transactionId: txRecord.transactionId,
        amount,
        ip: clientIp,
      })

      const response = addSecurityHeaders(
        NextResponse.json({
          success: true,
          message: "STK push sent. Please enter M-Pesa PIN on your phone.",
          transactionId: txRecord.transactionId,
          checkoutRequestID: transaction.checkoutRequestID,
          merchantRequestID: transaction.merchantRequestID,
        })
      )

      return addCorsHeaders(response, request)
    } else {
      logSecurityEvent("PAYMENT_FAILED", {
        error: transaction.error,
        amount,
        ip: clientIp,
      })

      const response = addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: transaction.error,
          },
          { status: 400 }
        )
      )

      return addCorsHeaders(response, request)
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] M-Pesa API Error:", errorMsg)

    const response = addSecurityHeaders(
      NextResponse.json(
        {
          success: false,
          error: "Payment processing failed. Please try again.",
        },
        { status: 500 }
      )
    )

    return addCorsHeaders(response, request)
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = addSecurityHeaders(
    NextResponse.json({}, { status: 200 })
  )
  return addCorsHeaders(response, request)
}
