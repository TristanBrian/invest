import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log("M-Pesa Callback received:", JSON.stringify(data, null, 2))

    const { Body } = data
    const { stkCallback } = Body

    if (stkCallback.ResultCode === 0) {
      // Payment successful
      const { CallbackMetadata } = stkCallback
      const items = CallbackMetadata.Item

      const paymentDetails = {
        amount: items.find((item: any) => item.Name === "Amount")?.Value,
        mpesaReceiptNumber: items.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value,
        transactionDate: items.find((item: any) => item.Name === "TransactionDate")?.Value,
        phoneNumber: items.find((item: any) => item.Name === "PhoneNumber")?.Value,
      }

      console.log("Payment successful:", paymentDetails)
      
      // Here you would typically:
      // 1. Save to database
      // 2. Send confirmation email/SMS
      // 3. Update order status
      
    } else {
      // Payment failed
      console.log("Payment failed:", stkCallback.ResultDesc)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("M-Pesa Callback Error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
