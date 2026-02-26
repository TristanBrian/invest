// app/api/forms/investment-enquiry/route.ts
export const runtime = "edge"; // Resend works on Edge runtime
import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || "oxicgroupltd@gmail.com";
const RECIPIENT_EMAILS = (process.env.RECIPIENT_EMAILS || "oxicgroupltd@gmail.com,info@oxicinternational.co.ke")
  .split(",")
  .map((e) => e.trim());

interface FormSubmission {
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  interest?: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: FormSubmission = await req.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Construct email HTML
    const html = `
      <h2>New Investment Enquiry</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || "N/A"}</p>
      <p><strong>Organization:</strong> ${data.organization || "N/A"}</p>
      <p><strong>Interest:</strong> ${data.interest || "N/A"}</p>
      <p><strong>Message:</strong><br>${data.message.replace(/\n/g, "<br>")}</p>
    `;

    const sendResults = await Promise.allSettled(
      RECIPIENT_EMAILS.map((recipient) =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: SENDER_EMAIL,
            to: recipient,
            subject: `Investment Enquiry from ${data.name}`,
            html,
            reply_to: data.email,
          }),
        })
      )
    );

    // Log results for debugging
    sendResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`✅ Email sent to ${RECIPIENT_EMAILS[index]}`);
      } else {
        console.error(
          `❌ Failed to send email to ${RECIPIENT_EMAILS[index]}:`,
          result.reason
        );
      }
    });

    return NextResponse.json({
      message: "Form submission received. Emails processed.",
      emailResults: sendResults.map((r, i) => ({
        recipient: RECIPIENT_EMAILS[i],
        status: r.status,
      })),
    });
  } catch (error) {
    console.error("Error handling form submission:", error);
    return NextResponse.json(
      { error: "Failed to process form submission" },
      { status: 500 }
    );
  }
}
