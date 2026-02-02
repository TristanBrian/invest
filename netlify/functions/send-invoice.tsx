import { Handler } from "@netlify/functions"

interface InvoiceData {
  invoiceNumber: string
  companyName: string
  companyAddress: string
  contactPerson: string
  email: string
  amount: string
  currency: string
  description: string
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    }
  }

  try {
    const data: InvoiceData = JSON.parse(event.body || "{}")

    // Validate required fields
    if (!data.companyName || !data.email || !data.amount || !data.invoiceNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      }
    }

    // Recipients for invoice notifications
    const primaryEmail = "oxicgroupltd@group.com"
    const ccEmail = "Info@oxicinternational.co.ke"

    // Format the invoice notification email
    const emailContent = `
Invoice Generated
=================

Invoice Number: ${data.invoiceNumber}
Bill To: ${data.companyName}
Contact: ${data.contactPerson}
Email: ${data.email}

Amount: ${data.currency} ${data.amount}
Description: ${data.description}

Company Address: ${data.companyAddress}

---
This invoice was generated via the website payment portal.
Payment instructions will be sent to the recipient.
    `.trim()

    // Send via SendGrid if available
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = require("@sendgrid/mail")
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)

      // Send to both internal recipients
      await sgMail.send({
        to: [
          { email: primaryEmail, name: "Oxic Group" },
          { email: ccEmail, name: "Oxic International" },
        ],
        from: process.env.SENDGRID_FROM_EMAIL || "noreply@oxicgroup.com",
        replyTo: data.email,
        subject: `Invoice ${data.invoiceNumber} Generated for ${data.companyName}`,
        text: emailContent,
        html: `
          <h2>Invoice Generated</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Invoice Number:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.invoiceNumber}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Bill To:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.companyName}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Contact Person:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.contactPerson}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Amount:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>${data.currency} ${data.amount}</strong></td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Description:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.description}</td>
            </tr>
            <tr style="background: #f8f9fa;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Company Address:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${data.companyAddress}</td>
            </tr>
          </table>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p><small style="color: #666;">This invoice was generated via the website payment portal.</small></p>
        `,
      })

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: "Invoice sent to both recipients successfully" }),
      }
    }

    // Fallback
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Invoice generated" }),
    }
  } catch (error) {
    console.error("Error sending invoice:", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send invoice", details: error instanceof Error ? error.message : "Unknown error" }),
    }
  }
}

export { handler }
