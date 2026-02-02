import { NextRequest, NextResponse } from "next/server"

// SendGrid API Configuration
// Environment variable required: SENDGRID_API_KEY

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const FROM_EMAIL = "noreply@oxicinternational.co.ke"
const TO_EMAILS = [
  "oxicgroupltd@group.com",
  "Info@oxicinternational.co.ke"
]

interface EmailRequest {
  type: "enquiry" | "invoice"
  data: Record<string, string | number>
}

export async function POST(request: NextRequest) {
  try {
    const { type, data }: EmailRequest = await request.json()

    if (!SENDGRID_API_KEY) {
      console.error("SendGrid API key not configured")
      return NextResponse.json(
        { success: false, error: "Email service not configured" },
        { status: 503 }
      )
    }

    let subject = ""
    let htmlContent = ""

    if (type === "enquiry") {
      subject = `New Investment Enquiry from ${data.name}`
      htmlContent = generateEnquiryEmail(data)
    } else if (type === "invoice") {
      subject = `Invoice Request: ${data.invoiceNumber} - ${data.companyName}`
      htmlContent = generateInvoiceEmail(data)
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid email type" },
        { status: 400 }
      )
    }

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: TO_EMAILS.map(email => ({ email })),
            subject: subject,
          },
        ],
        from: { email: FROM_EMAIL, name: "The Oxic International Group" },
        reply_to: { email: data.email as string || TO_EMAILS[0] },
        content: [
          {
            type: "text/html",
            value: htmlContent,
          },
        ],
      }),
    })

    if (response.ok || response.status === 202) {
      return NextResponse.json({ success: true, message: "Email sent successfully" })
    } else {
      const errorText = await response.text()
      console.error("SendGrid error:", errorText)
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process email request" },
      { status: 500 }
    )
  }
}

function generateEnquiryEmail(data: Record<string, string | number>): string {
  const date = new Date().toLocaleDateString("en-US", {
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
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">THE OXIC INTERNATIONAL GROUP</h1>
      <p style="color: #b8d4e8; margin: 8px 0 0 0; font-size: 14px;">Investment Advisory Services</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <div style="background-color: #e8f4fd; border-left: 4px solid #1e3a5f; padding: 15px; margin-bottom: 25px;">
        <h2 style="color: #1e3a5f; margin: 0 0 5px 0; font-size: 18px;">New Investment Enquiry</h2>
        <p style="color: #666; margin: 0; font-size: 13px;">Received on ${date}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; width: 140px; font-size: 14px;">Name</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333; font-weight: 500; font-size: 14px;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Email</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px;"><a href="mailto:${data.email}" style="color: #1e3a5f; text-decoration: none;">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Organization</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333; font-size: 14px;">${data.organization || "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Phone</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px;">${data.phone ? `<a href="tel:${data.phone}" style="color: #1e3a5f; text-decoration: none;">${data.phone}</a>` : "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Investment Interest</td>
          <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333; font-size: 14px;">
            <span style="background-color: #1e3a5f; color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 12px;">${data.interest}</span>
          </td>
        </tr>
      </table>
      
      <div style="margin-top: 25px;">
        <h3 style="color: #1e3a5f; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message</h3>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; color: #333; line-height: 1.6; font-size: 14px;">
          ${(data.message as string).replace(/\n/g, "<br>")}
        </div>
      </div>
      
      <div style="margin-top: 30px; padding: 20px; background-color: #fff8e6; border-radius: 8px; border: 1px solid #ffe0a3;">
        <p style="margin: 0; color: #8a6d3b; font-size: 13px;">
          <strong>Action Required:</strong> Please respond to this enquiry within 24 hours.
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
      <p style="color: #666; margin: 0; font-size: 12px;">The Oxic International Group Ltd</p>
      <p style="color: #999; margin: 5px 0 0 0; font-size: 11px;">Nairobi, Kenya | oxicgroupltd@consultant.com</p>
    </div>
  </div>
</body>
</html>
  `
}

function generateInvoiceEmail(data: Record<string, string | number>): string {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px;">
      <table style="width: 100%;">
        <tr>
          <td>
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">THE OXIC INTERNATIONAL GROUP</h1>
            <p style="color: #b8d4e8; margin: 5px 0 0 0; font-size: 12px;">Investment Advisory Services</p>
          </td>
          <td style="text-align: right;">
            <div style="color: #ffffff; font-size: 24px; font-weight: 700;">INVOICE</div>
            <div style="color: #b8d4e8; font-size: 14px;">${data.invoiceNumber}</div>
          </td>
        </tr>
      </table>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <table style="width: 100%; margin-bottom: 25px;">
        <tr>
          <td style="vertical-align: top; width: 50%;">
            <p style="color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Bill To</p>
            <p style="color: #333; font-weight: 600; margin: 0; font-size: 16px;">${data.companyName}</p>
            <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">${data.companyAddress || ""}</p>
            <p style="color: #666; margin: 3px 0 0 0; font-size: 14px;">${data.contactPerson || ""}</p>
            <p style="color: #1e3a5f; margin: 3px 0 0 0; font-size: 14px;">${data.email}</p>
          </td>
          <td style="vertical-align: top; text-align: right;">
            <p style="color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Invoice Details</p>
            <p style="color: #333; margin: 0; font-size: 14px;"><strong>Date:</strong> ${date}</p>
            <p style="color: #333; margin: 3px 0 0 0; font-size: 14px;"><strong>Due:</strong> ${dueDate}</p>
            <p style="margin: 8px 0 0 0;"><span style="background-color: #fff3cd; color: #856404; padding: 4px 10px; border-radius: 4px; font-size: 12px;">Pending</span></p>
          </td>
        </tr>
      </table>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <thead>
          <tr>
            <th style="background-color: #f8f9fa; padding: 12px; text-align: left; font-size: 12px; color: #666; text-transform: uppercase; border-bottom: 2px solid #1e3a5f;">Description</th>
            <th style="background-color: #f8f9fa; padding: 12px; text-align: right; font-size: 12px; color: #666; text-transform: uppercase; border-bottom: 2px solid #1e3a5f;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 15px 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #333;">${data.description || "Investment Advisory Services"}</td>
            <td style="padding: 15px 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #333; text-align: right; font-weight: 500;">${data.currency} ${Number(data.amount).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: right;">
        <p style="color: #666; margin: 0; font-size: 14px;">Total Amount Due</p>
        <p style="color: #1e3a5f; margin: 5px 0 0 0; font-size: 32px; font-weight: 700;">${data.currency} ${Number(data.amount).toLocaleString()}</p>
      </div>
      
      <div style="margin-top: 30px; padding: 20px; background-color: #e8f4fd; border-radius: 8px;">
        <h3 style="color: #1e3a5f; margin: 0 0 15px 0; font-size: 14px;">Payment Instructions</h3>
        <table style="width: 100%; font-size: 13px;">
          <tr><td style="color: #666; padding: 3px 0;">Bank:</td><td style="color: #333;">Kenya Commercial Bank (KCB)</td></tr>
          <tr><td style="color: #666; padding: 3px 0;">Account Name:</td><td style="color: #333;">The Oxic International Group Ltd</td></tr>
          <tr><td style="color: #666; padding: 3px 0;">SWIFT Code:</td><td style="color: #333;">KCBLKENX</td></tr>
          <tr><td style="color: #666; padding: 3px 0;">Reference:</td><td style="color: #333; font-weight: 500;">${data.invoiceNumber}</td></tr>
        </table>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #1e3a5f; padding: 20px; text-align: center;">
      <p style="color: #b8d4e8; margin: 0; font-size: 12px;">Questions? Contact us at oxicgroupltd@consultant.com</p>
      <p style="color: #7a9dbd; margin: 8px 0 0 0; font-size: 11px;">The Oxic International Group Ltd | Nairobi, Kenya</p>
    </div>
  </div>
</body>
</html>
  `
}
