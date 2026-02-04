import { NextRequest, NextResponse } from "next/server"

// Types for M-Pesa callback
interface CallbackItem {
  Name: string
  Value: any
}

interface MpesaPaymentDetails {
  amount: number
  mpesaReceiptNumber: string
  transactionDate: string
  phoneNumber: string
}

async function sendPaymentNotification(
  paymentDetails: MpesaPaymentDetails,
  isSuccess: boolean,
  errorMessage?: string
) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.warn("[v0] Resend API key not configured - payment notification not sent via email")
      return { success: false }
    }

    const contactEmail = process.env.CONTACT_EMAIL_TO || "oxicgroupltd@gmail.com"

    if (isSuccess) {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a5f3f; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">Payment Received Successfully</h2>
          
          <div style="background-color: #f0f9f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a5f3f;">
            <p><strong>Payment Amount:</strong> KES ${paymentDetails.amount.toLocaleString()}</p>
            <p><strong>M-Pesa Receipt:</strong> ${paymentDetails.mpesaReceiptNumber}</p>
            <p><strong>Phone Number:</strong> ${paymentDetails.phoneNumber}</p>
            <p><strong>Transaction Date:</strong> ${new Date(paymentDetails.transactionDate).toLocaleString()}</p>
          </div>

          <p style="color: #666; margin-top: 20px;">
            The payment has been received and is being processed. You will receive a confirmation SMS shortly.
          </p>
        </div>
      `

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "noreply@oxicinternational.co.ke",
          to: contactEmail.split(",").map(e => e.trim()),
          subject: `Payment Received - KES ${paymentDetails.amount.toLocaleString()} from ${paymentDetails.phoneNumber}`,
          html: emailHtml,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send success notification")
      }
    } else {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #c41e3a; border-bottom: 2px solid #c41e3a; padding-bottom: 10px;">Payment Failed</h2>
          
          <div style="background-color: #fef0f0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #c41e3a;">
            <p><strong>Phone Number:</strong> ${paymentDetails.phoneNumber}</p>
            <p><strong>Error:</strong> ${errorMessage}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <p style="color: #666; margin-top: 20px;">
            The payment attempt was unsuccessful. Please verify the details and try again.
          </p>
        </div>
      `

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "noreply@oxicinternational.co.ke",
          to: contactEmail.split(",").map(e => e.trim()),
          subject: `Payment Failed - ${paymentDetails.phoneNumber}`,
          html: emailHtml,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send failure notification")
      }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Failed to send payment notification:", error)
    return { success: false }
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log("[v0] M-Pesa Callback received:", JSON.stringify(data, null, 2))

    const { Body } = data
    const { stkCallback } = Body

    if (!stkCallback) {
      console.error("[v0] Invalid callback structure")
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const resultCode = stkCallback.ResultCode
    const resultDesc = stkCallback.ResultDesc || "Unknown result"

    if (resultCode === 0) {
      // Payment successful
      try {
        const { CallbackMetadata } = stkCallback
        const items = CallbackMetadata.Item

        const paymentDetails: MpesaPaymentDetails = {
          amount: items.find((item: CallbackItem) => item.Name === "Amount")?.Value || 0,
          mpesaReceiptNumber:
            items.find((item: CallbackItem) => item.Name === "MpesaReceiptNumber")?.Value ||
            "N/A",
          transactionDate:
            items.find((item: CallbackItem) => item.Name === "TransactionDate")?.Value ||
            new Date().toISOString(),
          phoneNumber: items.find((item: CallbackItem) => item.Name === "PhoneNumber")?.Value || "N/A",
        }

        console.log("[v0] Payment successful:", paymentDetails)

        // Send success notification via email
        await sendPaymentNotification(paymentDetails, true)

        // TODO: Production business logic:
        // 1. Save payment record to database with status "completed"
        // 2. Match payment to investment application by phone number
        // 3. Update investment application status to "paid"
        // 4. Trigger account activation/services provisioning
        // 5. Send SMS confirmation to customer via M-Pesa API
        // 6. Generate and send invoice/receipt PDF
        // 7. Create transaction record for accounting
      } catch (error) {
        console.error("[v0] Error processing successful payment:", error)
      }
    } else {
      // Payment failed or cancelled
      console.log("[v0] Payment failed:", resultDesc)

      const failedPaymentDetails: MpesaPaymentDetails = {
        amount: 0,
        mpesaReceiptNumber: "N/A",
        transactionDate: new Date().toISOString(),
        phoneNumber: stkCallback.PhoneNumber || "Unknown",
      }

      // Send failure notification
      await sendPaymentNotification(failedPaymentDetails, false, resultDesc)

      // TODO: Log failed transaction attempt for analysis and retry logic
    }

    // Always return success to M-Pesa to acknowledge receipt
    return NextResponse.json({
      success: true,
      message: "Callback received and processed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] M-Pesa Callback Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process callback",
      },
      { status: 500 }
    )
  }
}
