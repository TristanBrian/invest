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

interface EmailResult {
  success: boolean
  emailId?: string
  reason?: string
}

/**
 * Professional HTML email template for inquiry to internal team
 */
function generateInquiryEmailHTML(data: FormSubmission & { timestamp: string; ipAddress: string }): string {
  const formattedDate = new Date(data.timestamp).toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Investment Enquiry - Oxic International</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; color: #333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">OXIC INTERNATIONAL GROUP</h1>
              <p style="margin: 8px 0 0 0; color: #b8d4e8; font-size: 14px; font-weight: 500;">Investment Advisory Services</p>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background-color: #e8f4fd; border-left: 4px solid #1e3a5f; padding: 20px 30px;">
              <h2 style="margin: 0 0 8px 0; color: #1e3a5f; font-size: 18px; font-weight: 600;">New Investment Enquiry Received</h2>
              <p style="margin: 0; color: #666; font-size: 13px;">Submitted on ${formattedDate}</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Inquiry Details Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 14px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">Name</td>
                  <td style="padding: 14px 0 14px 20px; border-bottom: 1px solid #e5e5e5; color: #1a1a1a; font-size: 14px; font-weight: 500;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
                  <td style="padding: 14px 0 14px 20px; border-bottom: 1px solid #e5e5e5; color: #1a1a1a; font-size: 14px;"><a href="mailto:${data.email}" style="color: #1e3a5f; text-decoration: none; font-weight: 500;">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 14px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Phone</td>
                  <td style="padding: 14px 0 14px 20px; border-bottom: 1px solid #e5e5e5; color: #1a1a1a; font-size: 14px;">${data.phone || "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Organization</td>
                  <td style="padding: 14px 0 14px 20px; border-bottom: 1px solid #e5e5e5; color: #1a1a1a; font-size: 14px;">${data.organization || "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 0; color: #666; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Investment Interest</td>
                  <td style="padding: 14px 0 14px 20px; color: #1a1a1a; font-size: 14px;">
                    <span style="background-color: #1e3a5f; color: #ffffff; padding: 6px 14px; border-radius: 4px; font-size: 12px; font-weight: 600; display: inline-block;">${data.interest}</span>
                  </td>
                </tr>
              </table>

              <!-- Message Section -->
              <div style="margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #1e3a5f; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Inquiry Message</h3>
                <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #1e3a5f; border-radius: 4px; color: #333; line-height: 1.7; font-size: 14px; white-space: pre-wrap;">
${data.message}
                </div>
              </div>

              <!-- Action Required -->
              <div style="background-color: #fff8e6; border: 1px solid #ffe0a3; border-radius: 6px; padding: 16px 20px; margin-bottom: 30px;">
                <p style="margin: 0; color: #8a6d3b; font-size: 13px; line-height: 1.6;">
                  <strong>Action Required:</strong> Please review and respond to this enquiry within 24 hours to maintain our service standards.
                </p>
              </div>

              <!-- Reply Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${data.email}" style="display: inline-block; background-color: #1e3a5f; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Reply to Inquiry</a>
                  </td>
                </tr>
              </table>

              <!-- Metadata -->
              <div style="border-top: 1px solid #e5e5e5; padding-top: 20px; margin-top: 30px;">
                <p style="margin: 0 0 6px 0; color: #999; font-size: 12px;">
                  <strong>Inquiry Reference ID:</strong> OXIC-${Math.random().toString(36).substring(2, 9).toUpperCase()}
                </p>
                <p style="margin: 0 0 6px 0; color: #999; font-size: 12px;">
                  <strong>Date & Time:</strong> ${formattedDate}
                </p>
                <p style="margin: 0; color: #999; font-size: 12px;">
                  <strong>Submitted from IP:</strong> ${data.ipAddress}
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; border-top: 1px solid #e5e5e5; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 12px; line-height: 1.6;">
                © 2026 OXIC International Group. All rights reserved.<br/>
                This is an automated message. Do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * Professional auto-reply HTML template for customer
 */
function generateAutoReplyHTML(customerName: string): string {
  const currentDate = new Date().toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We Received Your Inquiry - Oxic International</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; color: #333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">OXIC INTERNATIONAL GROUP</h1>
              <p style="margin: 8px 0 0 0; color: #b8d4e8; font-size: 14px; font-weight: 500;">Investment Advisory Services</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <h2 style="margin: 0 0 10px 0; color: #1e3a5f; font-size: 22px; font-weight: 600;">Thank You for Contacting Us</h2>
              <p style="margin: 0 0 30px 0; color: #666; font-size: 14px; line-height: 1.6;">
                Hello <strong>${customerName}</strong>,
              </p>

              <!-- Message Content -->
              <div style="background-color: #e8f4fd; border-left: 4px solid #1e3a5f; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
                <p style="margin: 0; color: #1e3a5f; font-size: 14px; line-height: 1.7;">
                  We have successfully received your investment inquiry. Our team is reviewing your message and will respond to you within <strong>24 hours</strong> with personalized investment recommendations.
                </p>
              </div>

              <!-- Next Steps -->
              <h3 style="margin: 25px 0 15px 0; color: #1e3a5f; font-size: 16px; font-weight: 600;">What Happens Next?</h3>
              <ol style="margin: 0 0 30px 0; padding-left: 20px; color: #333; font-size: 14px; line-height: 1.8;">
                <li style="margin-bottom: 10px;">Our investment specialists will review your inquiry</li>
                <li style="margin-bottom: 10px;">We'll analyze your investment interests and goals</li>
                <li style="margin-bottom: 10px;">A dedicated advisor will contact you with tailored recommendations</li>
                <li>We'll schedule a consultation at your convenience</li>
              </ol>

              <!-- Contact Information -->
              <div style="background-color: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                <h4 style="margin: 0 0 15px 0; color: #1e3a5f; font-size: 14px; font-weight: 600;">If You Have Urgent Questions</h4>
                <p style="margin: 0 0 10px 0; color: #333; font-size: 14px;">
                  Feel free to reach out directly:
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 12px;">
                  <tr>
                    <td style="padding: 8px 0; color: #1e3a5f; font-size: 14px;">
                      <strong>Email:</strong> <a href="mailto:Info@oxicinternational.co.ke" style="color: #1e3a5f; text-decoration: none;">Info@oxicinternational.co.ke</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #1e3a5f; font-size: 14px;">
                      <strong>Phone:</strong> <a href="tel:+254748992777" style="color: #1e3a5f; text-decoration: none;">+254 748 992 777</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #1e3a5f; font-size: 14px;">
                      <strong>Website:</strong> <a href="https://www.oxicinternational.co.ke" style="color: #1e3a5f; text-decoration: none;">www.oxicinternational.co.ke</a>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Closing -->
              <p style="margin: 0 0 20px 0; color: #333; font-size: 14px; line-height: 1.7;">
                We're excited to help you explore investment opportunities in East Africa. Our team looks forward to connecting with you soon.
              </p>

              <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.7;">
                Best regards,<br/>
                <strong>The OXIC International Group Team</strong><br/>
                <span style="color: #666; font-size: 13px;">Empowering Investments in East Africa</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; border-top: 1px solid #e5e5e5; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 12px; line-height: 1.6;">
                © 2026 OXIC International Group. All rights reserved.<br/>
                This is an automated confirmation message.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * Send email via Resend API with comprehensive debugging
 */
async function sendEmailViaResend(
  to: string,
  subject: string,
  html: string,
  replyTo: string
): Promise<EmailResult> {
  const resendApiKey = process.env.RESEND_API_KEY
  
  console.log("[v0] ===== EMAIL SEND START =====")
  console.log("[v0] Recipient:", to)
  console.log("[v0] Subject:", subject)
  console.log("[v0] Reply-To:", replyTo)
  console.log("[v0] API Key present:", !!resendApiKey)
  console.log("[v0] API Key length:", resendApiKey?.length || 0)
  console.log("[v0] API Key starts with 're_':", resendApiKey?.startsWith("re_") || false)
  
  if (!resendApiKey) {
    console.error("[v0] ❌ CRITICAL: RESEND_API_KEY not found in environment variables")
    console.error("[v0] Available env vars:", Object.keys(process.env).filter(k => k.includes("RESEND") || k.includes("API")).join(", ") || "NONE")
    return { success: false, reason: "RESEND_API_KEY not configured in environment" }
  }

  try {
    console.log("[v0] Preparing Resend API request...")
    const requestBody = {
      from: "inquiries@oxicinternational.co.ke",
      to,
      subject,
      html,
      reply_to: replyTo,
    }
    
    console.log("[v0] Request payload size:", JSON.stringify(requestBody).length, "bytes")
    console.log("[v0] Sending request to Resend API...")
    
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    console.log("[v0] Response status:", response.status, response.statusText)
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error(`[v0] ❌ Resend API error for ${to}:`, errorData)
      console.error("[v0] Full error response:", JSON.stringify(errorData, null, 2))
      return { success: false, reason: `API Error ${response.status}: ${errorData.message || "Unknown error"}` }
    }

    const result = await response.json()
    console.log(`[v0] ✅ Email sent successfully to ${to}`)
    console.log("[v0] Email ID:", result.id)
    console.log("[v0] ===== EMAIL SEND SUCCESS =====")
    return { success: true, emailId: result.id }
  } catch (error) {
    console.error(`[v0] ❌ Email sending exception for ${to}:`, error)
    console.error("[v0] Error type:", error instanceof Error ? error.name : typeof error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Full error:", error)
    return { success: false, reason: `Exception: ${error instanceof Error ? error.message : String(error)}` }
  }
}

/**
 * Send inquiry emails to both team addresses with independent fallback logic
 */
async function sendInquiryEmail(data: FormSubmission & { timestamp: string; ipAddress: string }): Promise<{
  teamEmailsSent: number
  autoReplySent: boolean
  teamResults: { email: string; success: boolean; emailId?: string }[]
}> {
  console.log("[v0] ===== INQUIRY EMAIL DISTRIBUTION START =====")
  console.log("[v0] Generating email templates...")
  
  const inquiryHTML = generateInquiryEmailHTML(data)
  const autoReplyHTML = generateAutoReplyHTML(data.name)
  
  console.log("[v0] Inquiry HTML template size:", inquiryHTML.length, "bytes")
  console.log("[v0] Auto-reply HTML template size:", autoReplyHTML.length, "bytes")
  
  const teamEmails = [
    "oxicgroupltd@gmail.com",
    "Info@oxicinternational.co.ke",
  ]
  
  console.log("[v0] Team email recipients:", teamEmails.join(", "))
  console.log("[v0] Customer email (for auto-reply):", data.email)

  console.log("[v0] Sending inquiry emails to team...")
  const teamResults = await Promise.all(
    teamEmails.map(async (email) => {
      console.log(`[v0] Processing team email to: ${email}`)
      const result = await sendEmailViaResend(
        email,
        `Investment Enquiry from ${data.name}`,
        inquiryHTML,
        data.email
      )
      console.log(`[v0] Team email result for ${email}:`, result.success ? "✅ SUCCESS" : "❌ FAILED")
      return {
        email,
        success: result.success,
        emailId: result.emailId,
      }
    })
  )

  console.log("[v0] Team email distribution complete")
  console.log("[v0] Team results:", teamResults.map(r => `${r.email}: ${r.success ? "✅" : "❌"}`).join(", "))

  // Send auto-reply to customer
  console.log("[v0] Sending auto-reply to customer...")
  const autoReplyResult = await sendEmailViaResend(
    data.email,
    "We Received Your Investment Inquiry - Oxic International",
    autoReplyHTML,
    "Info@oxicinternational.co.ke"
  )
  console.log("[v0] Auto-reply result:", autoReplyResult.success ? "✅ SUCCESS" : "❌ FAILED")

  const teamEmailsSent = teamResults.filter((r) => r.success).length
  
  console.log("[v0] ===== INQUIRY EMAIL DISTRIBUTION COMPLETE =====")
  console.log("[v0] SUMMARY:", {
    teamEmailsSent,
    teamEmailsFailed: teamResults.length - teamEmailsSent,
    autoReplySent: autoReplyResult.success,
    totalSuccess: autoReplyResult.success && teamEmailsSent > 0,
  })

  return {
    teamEmailsSent,
    autoReplySent: autoReplyResult.success,
    teamResults,
  }
}

export async function POST(request: NextRequest) {
  console.log("[v0] ===== INVESTMENT ENQUIRY REQUEST START =====")
  console.log("[v0] Received POST request to /api/forms/investment-enquiry")
  console.log("[v0] Request method:", request.method)
  console.log("[v0] Request URL:", request.url)
  
  try {
    console.log("[v0] Parsing request JSON...")
    const body = await request.json() as FormSubmission
    console.log("[v0] Request body keys:", Object.keys(body).join(", "))
    console.log("[v0] Form data received:", {
      name: body.name ? `✓ ${body.name.substring(0, 20)}...` : "✗ missing",
      email: body.email ? `✓ ${body.email}` : "✗ missing",
      organization: body.organization ? `✓ provided` : "✗ optional",
      phone: body.phone ? `✓ provided` : "✗ optional",
      interest: body.interest ? `✓ ${body.interest}` : "✗ missing",
      message: body.message ? `✓ ${body.message.length} chars` : "✗ missing",
      consent: body.consent ? "✓ yes" : "✗ no",
    })

    // Validate required fields
    if (!body.name || !body.email || !body.interest || !body.message || !body.consent) {
      console.error("[v0] ❌ Validation failed: Missing required fields")
      return NextResponse.json(
        {
          success: false,
          message: "Missing required form fields",
        },
        { status: 400 }
      )
    }

    console.log("[v0] All required fields present ✓")
    
    // Sanitize and prepare submission data
    const data = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      organization: (body.organization || "Not provided").trim(),
      phone: (body.phone || "Not provided").trim(),
      interest: body.interest.trim(),
      message: body.message.trim(),
      consent: body.consent,
      timestamp: new Date().toISOString(),
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown",
    }
    
    console.log("[v0] Data sanitized and prepared")
    console.log("[v0] Submission timestamp:", data.timestamp)
    console.log("[v0] Client IP address:", data.ipAddress)

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    console.log("[v0] Validating email format:", data.email)
    if (!emailRegex.test(data.email)) {
      console.error("[v0] ❌ Email validation failed:", data.email)
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address format",
        },
        { status: 400 }
      )
    }
    console.log("[v0] Email validation passed ✓")

    // Log the submission (with privacy protection)
    const maskedEmail = data.email.substring(0, 3) + "***" + data.email.substring(data.email.lastIndexOf("@"))
    console.log("[v0] Investment enquiry ready to send:", {
      name: data.name,
      email: maskedEmail,
      organization: data.organization,
      interest: data.interest,
      timestamp: data.timestamp,
    })

    // Send email notifications (to team and auto-reply to customer)
    console.log("[v0] Calling sendInquiryEmail function...")
    const emailResult = await sendInquiryEmail(data)
    console.log("[v0] Email send function returned")

    // Determine response based on email delivery status
    const emailsSent = emailResult.teamEmailsSent + (emailResult.autoReplySent ? 1 : 0)
    const allSuccess = emailResult.teamEmailsSent >= 1 && emailResult.autoReplySent
    
    console.log("[v0] Email results:", {
      teamEmailsSent: emailResult.teamEmailsSent,
      autoReplySent: emailResult.autoReplySent,
      totalEmailsSent: emailsSent,
      allSuccess: allSuccess,
    })
    
    const submissionId = `OXIC-${new Date(data.timestamp).getTime()}-${Math.random().toString(36).substring(2, 9)}`.toUpperCase()
    
    console.log("[v0] ===== INVESTMENT ENQUIRY REQUEST COMPLETE =====")
    console.log("[v0] Response status: 200 OK")
    console.log("[v0] Submission ID:", submissionId)
    
    return NextResponse.json(
      {
        success: true,
        message: allSuccess
          ? "Thank you for your enquiry. We have received your message and sent a confirmation email. Our team will contact you within 24 hours."
          : emailResult.teamEmailsSent >= 1
            ? "Your enquiry has been submitted successfully. Please check your email for confirmation."
            : "Your enquiry has been recorded. We will contact you shortly.",
        emailStatus: {
          teamNotificationsSent: emailResult.teamEmailsSent,
          confirmationEmailSent: emailResult.autoReplySent,
          totalEmailsSent: emailsSent,
        },
        submissionId: submissionId,
        debug: {
          allEmailsDelivered: allSuccess,
          hasTeamEmails: emailResult.teamEmailsSent > 0,
          hasAutoReply: emailResult.autoReplySent,
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[v0] ===== FORM SUBMISSION ERROR =====")
    console.error("[v0] Error type:", error instanceof Error ? error.name : typeof error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Stack trace:", error instanceof Error ? error.stack : "No stack trace")
    console.error("[v0] Full error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your submission. Please try again or contact us directly at Info@oxicinternational.co.ke",
        error: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined,
      },
      { status: 500 }
    )
  }
}
