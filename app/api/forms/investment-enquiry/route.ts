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

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_EMAIL = "Oxic International <onboarding@resend.dev>"; // ✅ TEMP FIX

export async function POST(req: NextRequest) {
  console.log("[v0] ===== FORM SUBMISSION START =====");

  try {
    const body: FormSubmission = await req.json();
    console.log("[v0] Payload:", body);

    const { name, email, message, phone, organization, interest } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const recipients = [
      "oxicgroupltd@gmail.com",
      "info@oxicinternational.co.ke",
    ];

    const htmlContent = `
      <h2>New Investment Enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      ${organization ? `<p><strong>Organization:</strong> ${organization}</p>` : ""}
      ${interest ? `<p><strong>Interest:</strong> ${interest}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `;

    // Send to internal team
    const teamEmails = recipients.map((to) =>
      fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to,
          subject: `New Investment Enquiry – ${name}`,
          html: htmlContent,
          reply_to: email,
        }),
      })
    );

    // Auto-responder to client
    const autoResponder = fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: "We received your enquiry",
        html: `
          <p>Hi ${name},</p>
          <p>Thank you for contacting <strong>Oxic International</strong>.</p>
          <p>Our team has received your enquiry and will get back to you shortly.</p>
          <p>Regards,<br/>Oxic International Team</p>
        `,
      }),
    });

    const results = await Promise.allSettled([...teamEmails, autoResponder]);

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log("[v0] Email results:", { sent, failed });

    return NextResponse.json({
      message: "Form submission received. Emails sent successfully.",
      submissionId: `OXIC-${Date.now()}`,
      emailStatus: {
        total: results.length,
        sent,
        failed,
      },
    });
  } catch (error) {
    console.error("[v0] Error:", error);
    return NextResponse.json(
      { error: "Failed to process form submission" },
      { status: 500 }
    );
  } finally {
    console.log("[v0] ===== FORM SUBMISSION END =====");
  }
}
