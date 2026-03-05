import { NextRequest, NextResponse } from "next/server"
import transactionManager from "@/lib/transaction-manager"
import emailService from "@/lib/email-service"
import { addSecurityHeaders, logSecurityEvent } from "@/lib/security"

/**
 * KCB STK Push Callback Handler
 * Receives payment results from KCB/Buni
 *
 * Expected callback structure (based on KCB documentation):
 * {
 *   transactionId: string
 *   merchantRequestId: string
 *   resultCode: number (0 = success, others = failure)
 *   resultDescription: string
 *   amount: number
 *   phoneNumber: string
 *   mpesaReceiptNumber?: string (for successful transactions)
 * }
 */

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] KCB Callback received at", new Date().toISOString())

    // Get raw body for signature verification (if needed later)
    const body = await request.json()
    console.log("[v0] KCB Callback body keys:", Object.keys(body))

    // Extract callback data
    // KCB may wrap response in different structures, so check both direct and nested
    const callbackData = body.result || body || {}

    const {
      transactionId: kcbTransactionId,
      merchantRequestId,
      resultCode,
      resultDescription,
      amount,
      phoneNumber,
      mpesaReceiptNumber,
    } = callbackData

    console.log("[v0] KCB Callback - Transaction:", {
      kcbTransactionId,
      merchantRequestId,
      resultCode,
      amount,
      phonePhone: phoneNumber?.substring(0, 5) + "***",
    })

    // Validate required callback fields
    if (!merchantRequestId) {
      console.error("[v0] KCB Callback missing merchantRequestId")
      logSecurityEvent("KCB_CALLBACK_INVALID", {
        reason: "Missing merchantRequestId",
      })
      return addSecurityHeaders(
        NextResponse.json(
          { status: "invalid_request" },
          { status: 400 }
        )
      )
    }

    // Find transaction in our system
    const transaction = transactionManager.getTransactionByMerchantId(merchantRequestId)

    if (!transaction) {
      console.warn("[v0] KCB Callback: Transaction not found for ID:", merchantRequestId)
      logSecurityEvent("KCB_CALLBACK_TRANSACTION_NOT_FOUND", {
        merchantRequestId,
      })
      // Still return 200 to acknowledge receipt
      return addSecurityHeaders(
        NextResponse.json(
          { status: "acknowledged" },
          { status: 200 }
        )
      )
    }

    console.log("[v0] KCB Callback found transaction:", transaction.transactionId)

    // Check for duplicate processing (idempotency)
    const existingLog = transaction.status !== "WAITING"
    if (existingLog) {
      console.log("[v0] KCB Callback: Already processed, skipping:", transaction.transactionId)
      return addSecurityHeaders(
        NextResponse.json(
          { status: "acknowledged" },
          { status: 200 }
        )
      )
    }

    // Process callback based on result code
    const isSuccess = resultCode === 0 || resultCode === "0"

    if (isSuccess) {
      console.log("[v0] KCB Payment SUCCESS for transaction:", transaction.transactionId)

      // Update transaction
      transactionManager.updateTransactionStatus(transaction.transactionId, "COMPLETED")
      transactionManager.logTransaction(transaction.transactionId, "KCB_PAYMENT_SUCCESS", {
        kcbTransactionId,
        amount,
        receipt: mpesaReceiptNumber,
        timestamp: new Date().toISOString(),
      })

      // Send success email
      try {
        // Note: We don't have customer email in transaction, but you could add it
        await emailService.sendPaymentConfirmation({
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          method: "KCB STK Push",
          status: "SUCCESS",
        })
      } catch (error) {
        console.warn("[v0] Failed to send KCB success email:", error)
      }

      logSecurityEvent("KCB_PAYMENT_COMPLETED", {
        transactionId: transaction.transactionId,
        amount,
      })
    } else {
      console.log("[v0] KCB Payment FAILED for transaction:", transaction.transactionId)
      console.log("[v0] Result code:", resultCode, "Description:", resultDescription)

      // Update transaction
      transactionManager.updateTransactionStatus(transaction.transactionId, "FAILED")
      transactionManager.logTransaction(transaction.transactionId, "KCB_PAYMENT_FAILED", {
        resultCode,
        resultDescription,
        timestamp: new Date().toISOString(),
      })

      // Send failure email
      try {
        await emailService.sendPaymentFailureNotification({
          transactionId: transaction.transactionId,
          amount: transaction.amount,
          method: "KCB STK Push",
          reason: resultDescription || "Payment declined",
        })
      } catch (error) {
        console.warn("[v0] Failed to send KCB failure email:", error)
      }

      logSecurityEvent("KCB_PAYMENT_FAILED", {
        transactionId: transaction.transactionId,
        resultCode,
        amount,
      })
    }

    // Acknowledge receipt to KCB
    return addSecurityHeaders(
      NextResponse.json(
        {
          status: "acknowledged",
          transactionId: transaction.transactionId,
        },
        { status: 200 }
      )
    )
  } catch (error) {
    console.error("[v0] KCB Callback Error:", error)
    logSecurityEvent("KCB_CALLBACK_ERROR", {
      error: error instanceof Error ? error.message : String(error),
    })

    // Return 200 to prevent KCB from retrying
    return addSecurityHeaders(
      NextResponse.json(
        { status: "error_processed" },
        { status: 200 }
      )
    )
  }
}

export async function GET() {
  return addSecurityHeaders(
    NextResponse.json(
      {
        service: "KCB Callback Handler",
        version: "1.0.0",
        status: "ready",
      },
      { status: 200 }
    )
  )
}
