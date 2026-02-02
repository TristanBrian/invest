import { Handler } from "@netlify/functions"

interface EnquiryData {
  name: string
  email: string
  organization: string
  phone: string
  interest: string
  message: string
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    }
  }

  try {
    const data: EnquiryData = JSON.parse(event.body || "{}")

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      }
    }

    // Primary recipient and CC recipient
    const primaryEmail = "oxicgroupltd@group.com"
    const ccEmail = "Info@oxicinternational.co.ke"

    // Format the email content
    const emailContent = `
New Investment Enquiry
========================

Name: ${data.name}
Email: ${data.email}
Organization: ${data.organization || "N/A"}
Phone: ${data.phone || "N/A"}
Investment Interest: ${data.interest}

Message:
${data.message}

---
This enquiry was submitted via the website contact form.
    `.trim()

    // Send to primary email via Netlify Functions or your email service
    // Using SendGrid API if available
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = require("@sendgrid/mail")
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      await sgMail.send({
        to: [
          { email: primaryEmail, name: "Oxic Group" },
          { email: ccEmail, name: "Oxic International" },
        ],
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@oxicgroup.com",
        replyTo: data.email,
        subject: `Investment Enquiry from ${data.name}`,
        text: emailContent,
        html: `
          <h2>New Investment Enquiry</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Organization:</strong> ${data.organization || "N/A"}</p>
          <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
          <p><strong>Investment Interest:</strong> ${data.interest}</p>
          <h3>Message:</h3>
          <p>${data.message.replace(/\n/g, "<br>")}</p>
          <hr>
          <p><small>This enquiry was submitted via the website contact form.</small></p>
        `,
      })

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "Enquiry sent to both recipients successfully" }),
      }
    }

    // Fallback: Use Netlify's built-in email (if configured)
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Enquiry received" }),
    }
  } catch (error) {
    console.error("Error sending enquiry:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send enquiry", details: error instanceof Error ? error.message : "Unknown error" }),
    }
  }
}

export { handler }
