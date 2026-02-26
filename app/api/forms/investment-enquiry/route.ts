// app/api/forms/investment-enquiry/route.ts
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

/* ---------------- TYPES ---------------- */

interface FormSubmission {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  interest?: string;
  message: string;
}

/* ---------------- CONFIG ---------------- */

const RESEND_API_URL = "https://api.resend.com/emails";

// TEMP sender (SAFE + WORKING)
const FROM_EMAIL = "Oxic International <onboarding@resend.dev>";

const INTERNAL_RECIPIENTS = [
  "oxicgroupltd@gmail.com",
  "info@oxicinternational.co.ke",
];

/* ---------------- EMAIL TEMPLATES ---------------- */

function emailWrapper(content: string) {
  return `
  <div style="background:#f4f6f8;padding:30px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:8px;overflow:hidden;font-family:Arial,sans-serif;color:#222;">
            ${content}
          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
}

function header() {
  return `
  <tr>
    <td style="background:#0f172a;padding:20px 30px;">
      <h1 style="margin:0;color:#ffffff;font-size:20px;">
        Oxic International
      </h1>
      <p style="margin:4px 0 0;color:#cbd5f5;font-size:13px;">
        Investment & Technology Solutions
      </p>
    </td>
  </tr>
  `;
}

function footer() {
  return `
  <tr>
    <td style="padding:20px 30px;background:#f8fafc;color:#64748b;font-size:12px;">
      © ${new Date().getFullYear()} Oxic International. All rights reserved.
    </td>
  </tr>
  `;
}

function buildInternalEmailHTML(data: FormSubmission) {
  const { name, email, phone, organization, interest, message } = data;

  return emailWrapper(`
    ${header()}
    <tr>
      <td style="padding:30px;">
        <h2 style="margin-top:0;">📩 New Investment Enquiry</h2>

        <table cellpadding="6" cellspacing="0" width="100%"
          style="border-collapse:collapse;font-size:14px;">
          <tr><td width="30%"><strong>Name</strong></td><td>${name}</td></tr>
          <tr><td><strong>Email</strong></td><td>${email}</td></tr>
          ${phone ? `<tr><td><strong>Phone</strong></td><td>${phone}</td></tr>` : ""}
          ${organization ? `<tr><td><strong>Organization</strong></td><td>${organization}</td></tr>` : ""}
          ${interest ? `<tr><td><strong>Interest</strong></td><td>${interest}</td></tr>` : ""}
        </table>

        <p style="margin-top:20px;"><strong>Message</strong></p>
        <div style="padding:15px;background:#f1f5f9;border-radius:6px;">
          ${message.replace(/\n/g, "<br/>")}
        </div>
      </td>
    </tr>
    ${footer()}
  `);
}

function buildAutoReplyHTML(name: string) {
  return emailWrapper(`
    ${header()}
    <tr>
      <td style="padding:30px;font-size:14px;">
        <p>Hi <strong>${name}</strong>,</p>

        <p>
          Thank you for contacting <strong>Oxic International</strong>.
          We have successfully received your investment enquiry.
        </p>

        <p>
          One of our team members will review your message and get back to you shortly.
        </p>

        <p style="margin-top:30px;">
          Warm regards,<br/>
          <strong>Oxic International Team</strong>
        </p>
      </td>
    </tr>
    ${footer()}
  `);
}

/* ---------------- EMAIL SENDER ---------------- */

async function sendEmail(payload: any) {
  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
}

/* ---------------- HANDLER ---------------- */

export async function POST(req: NextRequest) {
  console.log("[v0] ===== FORM SUBMISSION START =====");

  try {
    const body: FormSubmission = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const internalHTML = buildInternalEmailHTML(body);

    const teamEmails = INTERNAL_RECIPIENTS.map((to) =>
      sendEmail({
        from: FROM_EMAIL,
        to,
        subject: `New Investment Enquiry – ${name}`,
        html: internalHTML,
        reply_to: email,
      })
    );

    const autoResponder = sendEmail({
      from: FROM_EMAIL,
      to: email,
      subject: "We’ve received your enquiry",
      html: buildAutoReplyHTML(name),
    });

    const results = await Promise.allSettled([
      ...teamEmails,
      autoResponder,
    ]);

    const sent = results.filter(r => r.status === "fulfilled").length;
    const failed = results.filter(r => r.status === "rejected").length;

    return NextResponse.json({
      message: "Form submission received. Emails processed.",
      submissionId: `OXIC-${Date.now()}`,
      emailStatus: { total: results.length, sent, failed },
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
