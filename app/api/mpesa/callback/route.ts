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
    // Send email notification to both company emails
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = require("@sendgrid/mail")
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      const subject = isSuccess
        ? `✓ M-Pesa Payment Received - KES ${paymentDetails.amount}`
        : "M-Pesa Payment Failed"

      const htmlContent = isSuccess
        ? `
          <h2>Payment Received Successfully</h2>
          <p>Thank you! We have received your M-Pesa payment.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Receipt Number:</strong> ${paymentDetails.mpesaReceiptNumber}</p>
            <p><strong>Amount:</strong> KES ${paymentDetails.amount.toLocaleString()}</p>
            <p><strong>Phone:</strong> ${paymentDetails.phoneNumber}</p>
            <p><strong>Transaction Date:</strong> ${new Date(
              paymentDetails.transactionDate
            ).toLocaleString()}</p>
          </div>
          <p>Your investment journey is progressing. Our team will contact you shortly to confirm next steps.</p>
        `
        : `
          <h2>Payment Transaction Failed</h2>
          <p>We encountered an issue processing your M-Pesa payment.</p>
          <div style="background-color: #fff5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Error:</strong> ${errorMessage || "Unknown error"}</p>
            <p><strong>Phone:</strong> ${paymentDetails.phoneNumber}</p>
          </div>
          <p>Please contact our support team for assistance: +254 748 992 777</p>
        `

      await sgMail.send({
        to: ["oxicgroupltd@group.com", "Info@oxicinternational.co.ke"],
        from: "notifications@oxicinternational.co.ke",
        subject,
        html: htmlContent,
      })

      console.log("[v0] Payment notification sent successfully")
    }
  } catch (error) {
    console.error("[v0] Failed to send payment notification:", error)
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

        // Send success notification
        await sendPaymentNotification(paymentDetails, true)

        // TODO: Implement additional business logic:
        // 1. Save payment record to database
        // 2. Update investment application status
        // 3. Trigger account activation/services
        // 4. Send SMS confirmation to customer
        // 5. Create invoice or receipt
      } catch (error) {
        console.error("[v0] Error processing successful payment:", error)
      }
    } else {
      // Payment failed or cancelled
      console.log("[v0] Payment failed:", resultDesc)

      // Create minimal details for failed transaction
      const failedPaymentDetails: MpesaPaymentDetails = {
        amount: 0,
        mpesaReceiptNumber: "N/A",
        transactionDate: new Date().toISOString(),
        phoneNumber: stkCallback.PhoneNumber || "Unknown",
      }

      // Send failure notification
      await sendPaymentNotification(failedPaymentDetails, false, resultDesc)

      // TODO: Log failed transaction attempt for analysis
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
