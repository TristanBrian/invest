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

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_API_KEY = process.env.BREVO_API_KEY!;

// Use a VERIFIED OR FREE sender while waiting for propagation
const FROM_EMAIL = "oxicgroupltd@gmail.com";
const FROM_NAME = "Oxic International";

const INTERNAL_RECIPIENTS = [
  "oxicgroupltd@gmail.com",
  "info@oxicinternational.co.ke",
];

/* ---------------- HELPERS ---------------- */

function validateSubmission(data: FormSubmission) {
  if (!data.name || !data.email || !data.message) {
    throw new Error("Missing required fields");
  }
}

async function sendEmail(payload: any) {
  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
}

/* ---------------- EMAIL TEMPLATES ---------------- */

function internalEmailHTML(data: FormSubmission) {
  const { name, email, phone, organization, interest, message } = data;

  return `
  <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:20px">
    <div style="max-width:600px;margin:auto;background:#fff;padding:25px;border-radius:8px">
      <h2>📩 New Investment Enquiry</h2>
      <hr/>

      <table style="width:100%">
        <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
        ${phone ? `<tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>` : ""}
        ${organization ? `<tr><td><strong>Organization:</strong></td><td>${organization}</td></tr>` : ""}
        ${interest ? `<tr><td><strong>Interest:</strong></td><td>${interest}</td></tr>` : ""}
      </table>

      <hr/>
      <p><strong>Message:</strong></p>
      <div style="background:#f9f9f9;padding:15px;border-radius:6px">
        ${message.replace(/\n/g, "<br/>")}
      </div>

      <p style="font-size:12px;color:#777;margin-top:20px">
        Submitted on ${new Date().toLocaleString()}
      </p>
    </div>
  </div>
  `;
}

function autoResponderHTML(name: string) {
  return `
  <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:20px">
    <div style="max-width:600px;margin:auto;background:#fff;padding:25px;border-radius:8px">
      <h2>Thank You for Contacting Oxic International</h2>

      <p>Hi ${name},</p>

      <p>
        We have received your investment enquiry and our team will review it shortly.
      </p>

      <p>
        If your request is urgent, you may reply directly to this email.
      </p>

      <p>
        Kind regards,<br/>
        <strong>Oxic International Team</strong>
      </p>

      <hr/>
      <p style="font-size:12px;color:#777">
        This is an automated confirmation email.
      </p>
    </div>
  </div>
  `;
}

/* ---------------- ROUTE ---------------- */

export async function POST(req: NextRequest) {
  console.log("[v0] ===== FORM SUBMISSION START =====");

  try {
    const body: FormSubmission = await req.json();
    validateSubmission(body);

    /* ---- Internal Emails ---- */
    const internalPromises = INTERNAL_RECIPIENTS.map((to) =>
      sendEmail({
        sender: { email: FROM_EMAIL, name: FROM_NAME },
        to: [{ email: to }],
        subject: "New Investment Enquiry",
        htmlContent: internalEmailHTML(body),
        replyTo: { email: body.email },
      })
    );

    /* ---- Auto-responder ---- */
    const autoResponderPromise = sendEmail({
      sender: { email: FROM_EMAIL, name: FROM_NAME },
      to: [{ email: body.email }],
      subject: "We received your investment enquiry",
      htmlContent: autoResponderHTML(body.name),
    });

    const results = await Promise.allSettled([
      ...internalPromises,
      autoResponderPromise,
    ]);

    const successCount = results.filter(r => r.status === "fulfilled").length;
    const failureCount = results.filter(r => r.status === "rejected").length;

    console.log("[v0] Email results:", results);

    return NextResponse.json({
      message: "Form submission received. Emails processed.",
      submissionId: `OXIC-${Date.now()}`,
      emailStatus: {
        total: results.length,
        sent: successCount,
        failed: failureCount,
      },
    });

  } catch (error: any) {
    console.error("[v0] Error:", error.message);

    return NextResponse.json(
      { error: "Failed to process enquiry" },
      { status: 500 }
    );
  } finally {
    console.log("[v0] ===== FORM SUBMISSION END =====");
  }
}
