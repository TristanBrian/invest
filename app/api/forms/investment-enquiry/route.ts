import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface FormSubmission {
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  interest: string;
  message: string;
  consent: boolean;
}

// Helper: Generate professional HTML for internal team
function generateInquiryEmailHTML(data: FormSubmission & { timestamp: string; ipAddress: string }) {
  const formattedDate = new Date(data.timestamp).toLocaleString("en-KE", { 
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });

  return `
    <h2>New Investment Enquiry</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
    <p><strong>Organization:</strong> ${data.organization || "Not provided"}</p>
    <p><strong>Investment Interest:</strong> ${data.interest}</p>
    <p><strong>Message:</strong><br/>${data.message.replace(/\n/g, "<br>")}</p>
    <p><strong>Submitted:</strong> ${formattedDate}</p>
    <p><strong>IP:</strong> ${data.ipAddress}</p>
  `;
}

// Helper: Generate HTML for auto-reply to customer
function generateAutoReplyHTML(customerName: string) {
  return `
    <h2>Thank you for contacting Oxic International</h2>
    <p>Hello <strong>${customerName}</strong>,</p>
    <p>We have received your investment enquiry. Our team will review it and get back to you within 24 hours.</p>
    <p>Best regards,<br/>Oxic International Team</p>
  `;
}

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      replyTo: replyTo || process.env.EMAIL_USER,
    });
    console.log(`[DEBUG] Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[ERROR] Failed to send email to ${to}:`, err);
    return { success: false, error: err };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as FormSubmission;

    // Basic validation
    if (!body.name || !body.email || !body.message || !body.interest || !body.consent) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const data = {
      ...body,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      organization: body.organization?.trim() || "Not provided",
      phone: body.phone?.trim() || "Not provided",
      message: body.message.trim(),
      timestamp: new Date().toISOString(),
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "Unknown",
    };

    // Send emails to team
    const teamEmails = [
      process.env.RECIPIENT_EMAIL_1!,
      process.env.RECIPIENT_EMAIL_2!,
    ];

    const teamResults = await Promise.all(
      teamEmails.map(email => sendEmail(email, `Investment Enquiry from ${data.name}`, generateInquiryEmailHTML(data), data.email))
    );

    // Send auto-reply to customer
    const autoReplyResult = await sendEmail(data.email, "We received your investment enquiry", generateAutoReplyHTML(data.name), process.env.EMAIL_USER);

    const teamEmailsSent = teamResults.filter(r => r.success).length;

    return NextResponse.json({
      success: true,
      message:
        teamEmailsSent >= 1 && autoReplyResult.success
          ? "Thank you for your enquiry. We have received your message and sent a confirmation email."
          : teamEmailsSent >= 1
            ? "Your enquiry has been submitted. Auto-reply to customer failed."
            : "Your enquiry was recorded, but we failed to notify the team. Contact Info@oxicinternational.co.ke.",
      emailStatus: {
        teamNotificationsSent: teamEmailsSent,
        confirmationEmailSent: autoReplyResult.success,
        totalEmailsSent: teamEmailsSent + (autoReplyResult.success ? 1 : 0),
      },
      teamResults,
      autoReplyResult,
    }, { status: 200 });
  } catch (err) {
    console.error("[ERROR] Form submission error:", err);
    return NextResponse.json({ success: false, message: "Failed to process submission" }, { status: 500 });
  }
}
