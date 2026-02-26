// app/api/forms/investment-enquiry/route.ts
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

interface FormSubmission {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  interest?: string;
  message: string;
}

/**
 * Send email via Brevo Transactional API
 */
async function sendBrevoEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY!,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "Oxic International",
        email: "info@oxicinternational.co.ke",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      replyTo: replyTo ? { email: replyTo } : undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo error: ${errorText}`);
  }

  return response.json();
}

export async function POST(req: NextRequest) {
  console.log("[Brevo] Investment enquiry received");

  try {
    const body: FormSubmission = await req.json();

    const { name, email, message, phone, organization, interest } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Team recipients
    const recipients = [
      "oxicgroupltd@gmail.com",
      "info@oxicinternational.co.ke",
    ];

    // Email content for team
    const teamHTML = `
      <h2>New Investment Enquiry Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      ${organization ? `<p><strong>Organization:</strong> ${organization}</p>` : ""}
      ${interest ? `<p><strong>Interest:</strong> ${interest}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `;

    // Send to internal team
    const teamEmailPromises = recipients.map((to) =>
      sendBrevoEmail({
        to,
        subject: `New Investment Enquiry from ${name}`,
        html: teamHTML,
        replyTo: email,
      })
    );

    // Auto-responder
    const autoResponderPromise = sendBrevoEmail({
      to: email,
      subject: "We received your investment enquiry",
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to Oxic International.</p>
        <p>We have received your enquiry and our team will contact you shortly.</p>
        <br/>
        <p>Best regards,<br/>Oxic International Team</p>
      `,
    });

    const results = await Promise.allSettled([
      ...teamEmailPromises,
      autoResponderPromise,
    ]);

    const emailsSent = results.filter((r) => r.status === "fulfilled").length;
    const emailsFailed = results.filter((r) => r.status === "rejected").length;

    console.log("[Brevo] Email results:", results);

    return NextResponse.json({
      message: "Form submission received. Emails processed.",
      submissionId: `OXIC-${Date.now()}`,
      emailStatus: {
        totalEmails: results.length,
        emailsSent,
        emailsFailed,
      },
    });
  } catch (error) {
    console.error("[Brevo] Error processing enquiry:", error);
    return NextResponse.json(
      { error: "Failed to process form submission" },
      { status: 500 }
    );
  }
}
