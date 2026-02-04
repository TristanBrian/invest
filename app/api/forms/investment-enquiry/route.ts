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
 * Accepts JSON POST requests and logs/processes form data
 */
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

    // Log the submission (in production, integrate with email service or CRM)
    console.log("[v0] Investment enquiry received:", {
      name: data.name,
      email: data.email.substring(0, 3) + "***" + data.email.substring(data.email.lastIndexOf("@")),
      organization: data.organization,
      interest: data.interest,
      timestamp: data.timestamp,
    })

    // TODO: Send email notification or store in database
    // - Send to oxicgroupltd@group.com
    // - Send to Info@oxicinternational.co.ke
    // - Store in database for follow-up

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your enquiry. We will contact you within 24 hours.",
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
