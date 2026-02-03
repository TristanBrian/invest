import { NextRequest, NextResponse } from "next/server"

/**
 * Form submission handler for investment enquiry form
 * Receives form data from Netlify Forms and processes it
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      organization: formData.get("organization"),
      phone: formData.get("phone"),
      interest: formData.get("interest"),
      message: formData.get("message"),
      consent: formData.get("consent"),
      timestamp: new Date().toISOString(),
    }

    // Log the submission (in production, you'd send this to an email service or database)
    console.log("[v0] Form submission received:", {
      ...data,
      // Don't log sensitive data
      email: `${String(data.email).substring(0, 3)}***@${String(data.email).split("@")[1] || ""}`,
    })

    // Return success response to Netlify Forms
    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully. We will contact you soon.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[v0] Form submission error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your submission.",
      },
      { status: 500 }
    )
  }
}
