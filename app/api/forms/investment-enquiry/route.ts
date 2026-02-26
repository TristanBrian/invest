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
const VERIFIED_FROM_EMAIL = "Oxic International <onboarding@resend.dev>"; // ✅ Use verified email
const LOGO_URL = "https://yourdomain.com/logo.png"; // Replace with your logo URL

// Helper to send emails via Resend
async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: VERIFIED_FROM_EMAIL,
        to,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[v0] Email send failed:", to, text);
      throw new Error(text);
    }
    console.log("[v0] Email sent:", to);
    return true;
  } catch (err) {
    console.error("[v0] Error sending email to", to, err);
    return false;
  }
}

// Build internal team email HTML with branding
function buildTeamEmailHTML(submission: FormSubmission) {
  const { name, email, phone, organization, interest, message } = submission;
  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${LOGO_URL}" alt="Oxic International" style="width: 150px;"/>
        <h2 style="color: #0d6efd; margin-top: 10px;">New Investment Enquiry</h2>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="font-weight: bold; padding: 4px; width: 150px;">Name:</td>
          <td style="padding: 4px;">${name}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 4px;">Email:</td>
          <td style="padding: 4px;">${email}</td>
        </tr>
        ${phone ? `<tr><td style="font-weight: bold; padding: 4px;">Phone:</td><td style="padding: 4px;">${phone}</td></tr>` : ""}
        ${organization ? `<tr><td style="font-weight: bold; padding: 4px;">Organization:</td><td style="padding: 4px;">${organization}</td></tr>` : ""}
        ${interest ? `<tr><td style="font-weight: bold; padding: 4px;">Interest:</td><td style="padding: 4px;">${interest}</td></tr>` : ""}
      </table>
      <div style="margin-top: 15px;">
        <strong>Message:</strong>
        <p style="background: #f7f7f7; padding: 10px; border-radius: 4px;">${message.replace(/\n/g, "<br/>")}</p>
      </div>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #666; text-align: center;">Oxic International | Confidential Enquiry</p>
    </div>
  `;
}

// Build client auto-responder HTML with branding
function buildClientAutoReplyHTML(name: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${LOGO_URL}" alt="Oxic International" style="width: 150px;"/>
        <h2 style="color: #0d6efd; margin-top: 10px;">Thank You for Your Enquiry</h2>
      </div>
      <p>Hi ${name},</p>
      <p>Thank you for contacting <strong>Oxic International</strong>. We have received your enquiry and our team will review it shortly.</p>
      <p>Best regards,<br/><strong>Oxic International Team</strong></p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #666; text-align: center;">This is an automated message. Please do not reply.</p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  console.log("[v0] ===== FORM SUBMISSION START =====");

  try {
    const body: FormSubmission = await req.json();
    console.log("[v0] Payload:", body);

    const { name, email, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const recipients = ["oxicgroupltd@gmail.com", "info@oxicinternational.co.ke"];

    // Send emails to internal team
    const teamEmailPromises = recipients.map((to) =>
      sendEmail(to, `New Investment Enquiry – ${name}`, buildTeamEmailHTML(body), email)
    );

    // Send auto-responder to client
    const autoResponderPromise = sendEmail(email, "We received your enquiry", buildClientAutoReplyHTML(name));

    const results = await Promise.allSettled([...teamEmailPromises, autoResponderPromise]);

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    console.log("[v0] Email results:", { sent, failed });

    return NextResponse.json({
      message: "Form submission received. Emails processed.",
      submissionId: `OXIC-${Date.now()}`,
      emailStatus: { total: results.length, sent, failed },
    });
  } catch (err) {
    console.error("[v0] Error:", err);
    return NextResponse.json({ error: "Failed to process form submission" }, { status: 500 });
  } finally {
    console.log("[v0] ===== FORM SUBMISSION END =====");
  }
}
