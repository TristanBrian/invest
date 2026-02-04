import { NextRequest, NextResponse } from "next/server"

interface FormSubmission {
  name: string
  email: string
  organization?: string
  phone?: string
  interest: string
  message: string
  consent: boolean
}

/**
 * Investment enquiry form submission handler
 * Accepts JSON POST requests and sends email via Resend
 */
async function sendInquiryEmail(data: FormSubmission & { timestamp: string; ipAddress: string }) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.warn("[v0] Resend API key not configured - inquiry logged but email not sent")
      return { success: false, reason: "Email service not configured" }
    }

    const contactEmails = (process.env.CONTACT_EMAIL_TO || "oxicgroupltd@gmail.com").split(",").map(e => e.trim())

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a5f3f; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">New Investment Enquiry</h2>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
          <p><strong>Organization:</strong> ${data.organization || "Not provided"}</p>
          <p><strong>Interest:</strong> ${data.interest}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: white; padding: 15px; border-left: 4px solid #d4a574; margin: 10px 0;">
            ${data.message.replace(/\n/g, "<br/>")}
          </p>
        </div>

        <div style="color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <p>Submitted: ${data.timestamp}</p>
          <p>IP Address: ${data.ipAddress}</p>
        </div>
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
        to: contactEmails,
        subject: `Investment Enquiry from ${data.name}`,
        html: emailHtml,
        reply_to: data.email,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Resend API error:", error)
      return { success: false, reason: "Failed to send email" }
    }

    const result = await response.json()
    console.log("[v0] Email sent successfully:", result.id)
    return { success: true, emailId: result.id }
  } catch (error) {
    console.error("[v0] Email sending error:", error)
    return { success: false, reason: String(error) }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as FormSubmission

    // Validate required fields
    if (!body.name || !body.email || !body.interest || !body.message || !body.consent) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required form fields",
        },
        { status: 400 }
      )
    }

    // Prepare submission data
    const data = {
      name: body.name,
      email: body.email,
      organization: body.organization || "Not provided",
      phone: body.phone || "Not provided",
      interest: body.interest,
      message: body.message,
      consent: body.consent,
      timestamp: new Date().toISOString(),
      ipAddress: request.headers.get("x-forwarded-for") || "Unknown",
    }

    // Log the submission
    console.log("[v0] Investment enquiry received:", {
      name: data.name,
      email: data.email.substring(0, 3) + "***" + data.email.substring(data.email.lastIndexOf("@")),
      organization: data.organization,
      interest: data.interest,
      timestamp: data.timestamp,
    })

    // Send email notification
    const emailResult = await sendInquiryEmail(data)

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your enquiry. We will contact you within 24 hours.",
        emailSent: emailResult.success,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[v0] Form submission error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your submission. Please try again.",
      },
      { status: 500 }
    )
  }
}
