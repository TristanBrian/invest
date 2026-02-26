// app/api/forms/investment-enquiry/route.ts
export const runtime = "edge"; // Resend works in Edge runtime
import { NextRequest, NextResponse } from "next/server";

interface FormSubmission {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  interest?: string;
  message: string;
}

export async function POST(req: NextRequest) {
  console.log("[v0] Investment enquiry received");

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

    // Recipients
    const recipients = [
      "oxicgroupltd@gmail.com",
      "info@oxicinternational.co.ke",
    ];

    // Send emails to team
    const emailPromises = recipients.map((to) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "info@oxicinternational.co.ke",
          to,
          subject: `New Investment Enquiry from ${name}`,
          html: `
            <h2>New Investment Enquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
            ${organization ? `<p><strong>Organization:</strong> ${organization}</p>` : ""}
            ${interest ? `<p><strong>Interest:</strong> ${interest}</p>` : ""}
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
          reply_to: email,
        }),
      })
    );

    // Send auto-responder to the sender
    const autoResponder = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "info@oxicinternational.co.ke",
        to: email,
        subject: "We received your investment enquiry",
        html: `
          <p>Hi ${name},</p>
          <p>Thank you for reaching out to Oxic International. We have received your enquiry and our team will contact you shortly.</p>
          <p>Best regards,<br/>Oxic International Team</p>
        `,
      }),
    });

    // Wait for all emails to finish
    const results = await Promise.allSettled([...emailPromises, autoResponder]);

    // Prepare email status report
    const emailStatus = results.map((r, idx) => ({
      recipient:
        idx < recipients.length ? recipients[idx] : email,
      status: r.status,
      reason: r.status === "rejected" ? (r as PromiseRejectedResult).reason : null,
    }));

    console.log("[v0] Email results:", emailStatus);

    return NextResponse.json({
      message: "Form submission received. Emails processed.",
      submissionId: `OXIC-${Date.now()}`,
      emailStatus: {
        totalEmails: results.length,
        emailsSent: results.filter((r) => r.status === "fulfilled").length,
        emailsFailed: results.filter((r) => r.status === "rejected").length,
        results: emailStatus,
      },
    });
  } catch (error) {
    console.error("[v0] Error processing enquiry:", error);
    return NextResponse.json(
      { error: "Failed to process form submission" },
      { status: 500 }
    );
  }
}
