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
 * Generate HTML email for internal team
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
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Investment Enquiry - Oxic International</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f5f5f5;color:#333;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
<tr><td align="center" style="padding:20px 0;">
<table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:8px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#2d5a87 100%);padding:40px 30px;text-align:center;">
<h1 style="margin:0;color:#fff;font-size:28px;">OXIC INTERNATIONAL GROUP</h1>
<p style="margin:8px 0 0 0;color:#b8d4e8;font-size:14px;">Investment Advisory Services</p>
</td></tr>

<tr><td style="background-color:#e8f4fd;border-left:4px solid #1e3a5f;padding:20px 30px;">
<h2 style="margin:0 0 8px 0;color:#1e3a5f;font-size:18px;">New Investment Enquiry Received</h2>
<p style="margin:0;color:#666;font-size:13px;">Submitted on ${formattedDate}</p>
</td></tr>

<tr><td style="padding:40px 30px;">
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:30px;border-collapse:collapse;">
<tr><td style="padding:14px 0;border-bottom:1px solid #e5e5e5;color:#666;font-size:13px;font-weight:600;width:120px;">Name</td>
<td style="padding:14px 0 14px 20px;border-bottom:1px solid #e5e5e5;color:#1a1a1a;font-size:14px;">${data.name}</td></tr>
<tr><td style="padding:14px 0;border-bottom:1px solid #e5e5e5;color:#666;font-size:13px;font-weight:600;">Email</td>
<td style="padding:14px 0 14px 20px;border-bottom:1px solid #e5e5e5;color:#1a1a1a;font-size:14px;"><a href="mailto:${data.email}" style="color:#1e3a5f;text-decoration:none;">${data.email}</a></td></tr>
<tr><td style="padding:14px 0;border-bottom:1px solid #e5e5e5;color:#666;font-size:13px;font-weight:600;">Phone</td>
<td style="padding:14px 0 14px 20px;border-bottom:1px solid #e5e5e5;color:#1a1a1a;font-size:14px;">${data.phone || "Not provided"}</td></tr>
<tr><td style="padding:14px 0;border-bottom:1px solid #e5e5e5;color:#666;font-size:13px;font-weight:600;">Organization</td>
<td style="padding:14px 0 14px 20px;border-bottom:1px solid #e5e5e5;color:#1a1a1a;font-size:14px;">${data.organization || "Not provided"}</td></tr>
<tr><td style="padding:14px 0;color:#666;font-size:13px;font-weight:600;">Investment Interest</td>
<td style="padding:14px 0 14px 20px;color:#1a1a1a;font-size:14px;"><span style="background-color:#1e3a5f;color:#fff;padding:6px 14px;border-radius:4px;font-size:12px;font-weight:600;display:inline-block;">${data.interest}</span></td></tr>
</table>

<div style="margin-bottom:30px;">
<h3 style="margin:0 0 15px 0;color:#1e3a5f;font-size:13px;font-weight:600;">Inquiry Message</h3>
<div style="background-color:#f9f9f9;padding:20px;border-left:4px solid #1e3a5f;border-radius:4px;color:#333;line-height:1.7;font-size:14px;white-space:pre-wrap;">
${data.message}
</div>
</div>

<div style="border-top:1px solid #e5e5e5;padding-top:20px;margin-top:30px;">
<p style="margin:0 0 6px 0;color:#999;font-size:12px;"><strong>Inquiry Reference ID:</strong> OXIC-${Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
<p style="margin:0 0 6px 0;color:#999;font-size:12px;"><strong>Date & Time:</strong> ${formattedDate}</p>
<p style="margin:0;color:#999;font-size:12px;"><strong>Submitted from IP:</strong> ${data.ipAddress}</p>
</div>

</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
`
}

/**
 * Auto-reply HTML for customer
 */
function generateAutoReplyHTML(customerName: string): string {
  const currentDate = new Date().toLocaleDateString("en-KE", { year:"numeric", month:"long", day:"numeric" })

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>We Received Your Inquiry - Oxic International</title></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f5f5f5;color:#333;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;">
<tr><td align="center" style="padding:20px 0;">
<table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:8px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#2d5a87 100%);padding:40px 30px;text-align:center;">
<h1 style="margin:0;color:#fff;font-size:28px;">OXIC INTERNATIONAL GROUP</h1>
<p style="margin:8px 0 0 0;color:#b8d4e8;font-size:14px;">Investment Advisory Services</p>
</td></tr>

<tr><td style="padding:40px 30px;">
<h2 style="margin:0 0 10px 0;color:#1e3a5f;font-size:22px;font-weight:600;">Thank You for Contacting Us</h2>
<p style="margin:0 0 30px 0;color:#666;font-size:14px;line-height:1.6;">Hello <strong>${customerName}</strong>,</p>
<div style="background-color:#e8f4fd;border-left:4px solid #1e3a5f;padding:20px;border-radius:4px;margin-bottom:30px;">
<p style="margin:0;color:#1e3a5f;font-size:14px;line-height:1.7;">We have successfully received your investment inquiry. Our team will respond within <strong>24 hours</strong>.</p>
</div>
<p style="margin:0;color:#333;font-size:14px;line-height:1.7;">Best regards,<br/><strong>The OXIC International Team</strong></p>
</td></tr>
</table></td></tr></table>
</body>
</html>
`
}

/**
 * Send email via Resend with debug logs
 */
async function sendEmailViaResend(to: string, subject: string, html: string, replyTo: string): Promise<EmailResult> {
  const resendApiKey = process.env.RESEND_API_KEY
  console.log(`[DEBUG] Preparing to send email to ${to}`)
  console.log(`[DEBUG] API key exists: ${!!resendApiKey}`)
  
  if (!resendApiKey) return { success: false, reason: "RESEND_API_KEY not configured" }

  try {
    const requestBody = { from: "oxicgroupltd@gmail.com", to, subject, html, reply_to: replyTo }
    console.log(`[DEBUG] Request body:`, requestBody)

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendApiKey}` },
      body: JSON.stringify(requestBody),
    })

    console.log(`[DEBUG] Resend API response status: ${response.status}`)

    if (!response.ok) {
      const errorData = await response.json()
      console.error(`[DEBUG] Failed to send email to ${to}:`, errorData)
      return { success: false, reason: errorData.message || "Unknown API error" }
    }

    const result = await response.json()
    console.log(`[DEBUG] Email successfully sent to ${to}, ID: ${result.id}`)
    return { success: true, emailId: result.id }
  } catch (error) {
    console.error(`[DEBUG] Exception sending email to ${to}:`, error)
    return { success: false, reason: String(error) }
  }
}

/**
 * Send inquiry emails and auto-reply with debug
 */
async function sendInquiryEmail(data: FormSubmission & { timestamp: string; ipAddress: string }) {
  const inquiryHTML = generateInquiryEmailHTML(data)
  const autoReplyHTML = generateAutoReplyHTML(data.name)

  const teamEmails = ["oxicgroupltd@gmail.com", "Info@oxicinternational.co.ke"]
  const teamResults = await Promise.all(
    teamEmails.map(async email => {
      const res = await sendEmailViaResend(email, `Investment Enquiry from ${data.name}`, inquiryHTML, data.email)
      console.log(`[DEBUG] Team email to ${email}: success=${res.success}, id=${res.emailId}, reason=${res.reason}`)
      return res
    })
  )

  const autoReplyResult = await sendEmailViaResend(data.email, "We Received Your Investment Inquiry - Oxic International", autoReplyHTML, "oxicgroupltd@gmail.com")
  console.log(`[DEBUG] Auto-reply to ${data.email}: success=${autoReplyResult.success}, reason=${autoReplyResult.reason}`)

  return {
    teamEmailsSent: teamResults.filter(r => r.success).length,
    autoReplySent: autoReplyResult.success,
    teamResults,
  }
}

/**
 * API route
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FormSubmission
    if (!body.name || !body.email || !body.interest || !body.message || !body.consent) {
      return NextResponse.json({ success: false, message: "Missing required form fields" }, { status: 400 })
    }

    const data = {
      ...body,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      organization: (body.organization || "Not provided").trim(),
      phone: (body.phone || "Not provided").trim(),
      interest: body.interest.trim(),
      message: body.message.trim(),
      timestamp: new Date().toISOString(),
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown",
    }

    console.log(`[DEBUG] Incoming submission from ${data.email}`)

    const emailResult = await sendInquiryEmail(data)
    const submissionId = `OXIC-${new Date(data.timestamp).getTime()}-${Math.random().toString(36).substring(2, 9)}`.toUpperCase()

    console.log(`[DEBUG] Submission ID: ${submissionId}, TeamEmailsSent=${emailResult.teamEmailsSent}, AutoReplySent=${emailResult.autoReplySent}`)

    return NextResponse.json({
      success: true,
      message:
        emailResult.teamEmailsSent >= 1 && emailResult.autoReplySent
          ? "Thank you for your enquiry. We have received your message and sent a confirmation email. Our team will contact you within 24 hours."
          : "Your enquiry has been recorded. We will contact you shortly.",
      emailStatus: {
        teamNotificationsSent: emailResult.teamEmailsSent,
        confirmationEmailSent: emailResult.autoReplySent,
        totalEmailsSent: emailResult.teamEmailsSent + (emailResult.autoReplySent ? 1 : 0),
      },
      submissionId,
    })
  } catch (error) {
    console.error(`[DEBUG] Form submission error:`, error)
    return NextResponse.json(
      { success: false, message: "An error occurred while processing your submission. Please try again or contact us directly at oxicgroupltd@gmail.com" },
      { status: 500 }
    )
  }
}
