import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  budget?: string;
  message?: string;
};

const gmailUser = process.env.GMAIL_USER ?? process.env.SMTP_USER ?? process.env.EMAIL_USER;
const gmailAppPassword =
  process.env.GMAIL_APP_PASSWORD ?? process.env.SMTP_APP_PASSWORD ?? process.env.EMAIL_APP_PASSWORD;
const recipientEmails =
  process.env.CONTACT_RECIPIENTS ?? process.env.CONTACT_TO_EMAILS ?? process.env.CONTACT_EMAILS;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseRecipients(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  if (!gmailUser || !gmailAppPassword) {
    return NextResponse.json(
      { error: "Missing email credentials. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env." },
      { status: 500 },
    );
  }

  const body = (await request.json().catch(() => null)) as ContactPayload | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const firstName = body.firstName?.trim() || "";
  const lastName = body.lastName?.trim() || "";
  const email = body.email?.trim() || "";
  const phone = body.phone?.trim() || "";
  const subject = body.subject?.trim() || "";
  const budget = body.budget?.trim() || "";
  const message = body.message?.trim() || "";

  if (!firstName || !lastName || !email || !subject || !message) {
    return NextResponse.json({ error: "Missing required form fields." }, { status: 400 });
  }

  const recipients = parseRecipients(recipientEmails);
  if (recipients.length === 0) {
    return NextResponse.json(
      { error: "Missing recipient emails. Set CONTACT_RECIPIENTS in .env." },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  const emailSubject = `${subject || "Website Inquiry"} - ${firstName} ${lastName}`.trim();
  const textBody = [
    `Name: ${firstName} ${lastName}`.trim(),
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Service: ${subject}`,
    `Budget: ${budget || "Not specified"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin: 0 0 16px;">New Contact Message</h2>
      <p><strong>Name:</strong> ${escapeHtml(`${firstName} ${lastName}`.trim())}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
      <p><strong>Service:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Budget:</strong> ${escapeHtml(budget || "Not specified")}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `SlimCyberTech Website <${gmailUser}>`,
      to: recipients.join(", "),
      replyTo: email,
      subject: emailSubject,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Message delivery failed. Please try again later." },
      { status: 500 },
    );
  }
}
