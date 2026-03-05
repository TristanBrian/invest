import { NextRequest, NextResponse } from "next/server"
import {
  validateKcbConfig,
  initiateKcbStkPush,
} from "@/lib/kcb"
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
 * KCB STK Push API Route with Security & Transaction Management
 * POST /api/kcb
 *
 * Request body:
 * {
 *   phoneNumber: string (e.g., "0712345678", "+254712345678", or "254712345678")
 *   amount: number (KES, 1-150,000)
 *   accountReference?: string (defaults to email if provided)
 *   transactionDesc?: string
 *   customerEmail?: string (for notification)
 *   customerName?: string (for invoice)
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   message?: string
 *   transactionId?: string
 *   error?: string
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request)
    console.log("[v0] KCB API: Request from", clientIp)

    // Security: Rate limiting
    if (rateLimiter.isLimited(clientIp)) {
      logSecurityEvent("RATE_LIMIT_EXCEEDED", { ip: clientIp, provider: "KCB" })
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
        provider: "KCB",
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

    // Validate required fields
    const validation = validatePaymentRequest(body)
    if (!validation.isValid) {
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: validation.error || "Invalid payment request",
          },
          { status: 400 }
        )
      )
    }

    const {
      phoneNumber,
      amount,
      accountReference = "OXIC-PAYMENT",
      transactionDesc = "Payment via KCB STK Push",
      customerEmail = "",
      customerName = "Customer",
    } = body

    // Security: Detect suspicious activity
    const suspicious = detectSuspiciousActivity({
      phoneNumber,
      amount,
      ip: clientIp,
    })
    if (suspicious.isSuspicious) {
      logSecurityEvent("SUSPICIOUS_ACTIVITY_KCB", {
        reason: suspicious.reason,
        ip: clientIp,
        phoneNumber: phoneNumber.substring(0, 5) + "***",
      })
      return addSecurityHeaders(
        NextResponse.json(
          { success: false, error: "Request could not be processed" },
          { status: 403 }
        )
      )
    }

    // Validate KCB configuration
    const configValidation = validateKcbConfig()
    if (!configValidation.isValid) {
      console.error("[v0] KCB Config Invalid:", configValidation.missing)
      logSecurityEvent("KCB_CONFIG_ERROR", {
        missing: configValidation.missing,
      })
      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: "Payment provider not configured. Please contact support.",
          },
          { status: 503 }
        )
      )
    }

    // Create transaction record (before initiating)
    const merchantRequestId = `KCB_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const transaction = transactionManager.createTransaction(
      merchantRequestId,
      `KCB_${Date.now()}`, // KCB doesn't have CheckoutRequestID like M-Pesa, so we generate one
      phoneNumber,
      amount,
      accountReference,
      transactionDesc
    )

    console.log("[v0] KCB Transaction created:", transaction.transactionId)

    // Initiate KCB STK Push
    const kcbResult = await initiateKcbStkPush(
      phoneNumber,
      amount,
      accountReference,
      transactionDesc
    )

    if (!kcbResult.success) {
      // Update transaction as failed
      transactionManager.updateTransactionStatus(transaction.transactionId, "FAILED")
      transactionManager.logTransaction(transaction.transactionId, "STK_PUSH_FAILED", {
        error: kcbResult.error,
      })

      return addSecurityHeaders(
        NextResponse.json(
          {
            success: false,
            error: kcbResult.error || "Failed to initiate payment",
          },
          { status: 400 }
        )
      )
    }

    // Update transaction as waiting for callback
    transactionManager.updateTransactionStatus(transaction.transactionId, "WAITING")
    transactionManager.logTransaction(transaction.transactionId, "STK_PUSH_INITIATED", {
      responseCode: kcbResult.responseCode,
      phoneNumber: phoneNumber.substring(0, 5) + "***",
      amount,
    })

    // Send confirmation email if provided
    if (customerEmail) {
      try {
        await emailService.sendPaymentNotification({
          email: customerEmail,
          name: customerName,
          amount,
          method: "KCB STK Push",
          transactionId: transaction.transactionId,
          status: "INITIATED",
        })
      } catch (error) {
        console.warn("[v0] Failed to send KCB notification email:", error)
        // Don't fail the payment because of email
      }
    }

    console.log("[v0] KCB STK Push successful for transaction:", transaction.transactionId)

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: true,
          message: "STK Push initiated. Check your phone for the payment prompt.",
          transactionId: transaction.transactionId,
        },
        { status: 200 }
      )
    )
  } catch (error) {
    console.error("[v0] KCB API Error:", error)
    logSecurityEvent("KCB_API_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    })

    return addSecurityHeaders(
      NextResponse.json(
        {
          success: false,
          error: "An error occurred while processing your payment. Please try again.",
        },
        { status: 500 }
      )
    )
  }
}

export async function GET() {
  return addSecurityHeaders(
    NextResponse.json(
      {
        service: "KCB STK Push Payment API",
        version: "1.0.0",
        status: "operational",
        methods: ["POST"],
      },
      { status: 200 }
    )
  )
}
