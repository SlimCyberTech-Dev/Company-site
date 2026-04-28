import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
    .map((e) => e.trim())
    .filter(Boolean);
}

/**
 * Reads the company logo from the public folder and returns a Base64 data URI.
 * Embedding as Base64 ensures the image renders in ALL email clients without
 * needing an external HTTP request (which many clients block by default).
 * Falls back to null so the template can render a styled text logo instead.
 */
function getLogoDataUri(): string | null {
  const candidates = [
    path.join(process.cwd(), "public", "images", "Logo.jpeg"),
    path.join(process.cwd(), "public", "images", "Logo.jpg"),
    path.join(process.cwd(), "public", "images", "Logo.png"),
    path.join(process.cwd(), "public", "images", "logo.jpeg"),
    path.join(process.cwd(), "public", "images", "logo.jpg"),
    path.join(process.cwd(), "public", "images", "logo.png"),
  ];

  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const buffer = fs.readFileSync(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const mimeType = ext === ".png" ? "image/png" : "image/jpeg";
        return `data:${mimeType};base64,${buffer.toString("base64")}`;
      }
    } catch {
      // try next candidate
    }
  }
  return null;
}

/**
 * Converts raw message text into clean HTML.
 * - Splits on blank lines to create paragraphs
 * - Preserves intentional single line breaks within paragraphs
 * - Handles both short one-liners and long multi-paragraph messages
 */
function formatMessageHtml(raw: string): string {
  const paragraphs = raw
    .trim()
    .split(/\n{2,}/)
    .map((para) =>
      para
        .split(/\n/)
        .map((line) => escapeHtml(line))
        .join("<br />"),
    )
    .filter((p) => p.trim().length > 0);

  if (paragraphs.length === 0) return "";

  return paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;padding:0;font-size:15px;color:#1c2e44;line-height:1.85;word-break:break-word;word-wrap:break-word;">${p}</p>`,
    )
    .join("");
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

  const emailSubject = `${subject || "Website Inquiry"} — ${firstName} ${lastName}`.trim();

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

  // ── Logo: Base64 inline (renders in Gmail, Outlook, Apple Mail, etc.) ──
  const logoDataUri = getLogoDataUri();
  const logoHtml = logoDataUri
    ? `<img
         src="${logoDataUri}"
         alt="SlimCyberTech"
         width="130"
         height="auto"
         style="display:block;border:0;border-radius:5px;max-height:46px;object-fit:contain;"
       />`
    : `<span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.4px;
                    font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
         Slim<span style="color:#60b0ff;">Cyber</span>Tech
       </span>`;

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const messageHtml = formatMessageHtml(message);

  // Determine message length category for adaptive padding
  const isShortMessage = message.length < 120;

  const htmlBody = `
<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>New Contact Inquiry — SlimCyberTech</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#e6ecf5;
             font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
             -webkit-font-smoothing:antialiased;">

  <!-- OUTER WRAPPER -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#e6ecf5;padding:36px 12px 52px;">
    <tr>
      <td align="center">

        <!-- ╔══════════════════════════════════╗
             ║  CARD                            ║
             ╚══════════════════════════════════╝ -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;width:100%;border-radius:14px;overflow:hidden;
                 box-shadow:0 10px 40px rgba(6,17,42,0.14);">

          <!-- ▓▓ HEADER ▓▓ -->
          <tr>
            <td style="background:linear-gradient(150deg,#060f24 0%,#0c2558 40%,#1648a8 100%);
                       padding:26px 36px 24px;">

              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="vertical-align:middle;">
                    ${logoHtml}
                  </td>
                  <td style="text-align:right;vertical-align:middle;">
                    <span style="display:inline-block;
                                 background:rgba(96,176,255,0.14);
                                 color:#a8d4ff;
                                 font-size:9px;font-weight:800;letter-spacing:2px;
                                 text-transform:uppercase;
                                 padding:5px 13px;border-radius:20px;
                                 border:1px solid rgba(96,176,255,0.26);">
                      New Inquiry
                    </span>
                  </td>
                </tr>
              </table>

              <div style="margin-top:20px;padding-top:18px;border-top:1px solid rgba(255,255,255,0.09);">
                <h1 style="margin:0 0 6px;font-size:21px;font-weight:700;color:#ffffff;
                           line-height:1.25;letter-spacing:-0.2px;">
                  You have a new contact request
                </h1>
                <p style="margin:0;font-size:12.5px;color:#8ab4d8;line-height:1.5;">
                  Submitted via the SlimCyberTech website contact form
                </p>
              </div>
            </td>
          </tr>

          <!-- ▓▓ ACCENT BAR ▓▓ -->
          <tr>
            <td style="height:3px;
                       background:linear-gradient(90deg,#1648a8 0%,#60b0ff 50%,#1648a8 100%);">
            </td>
          </tr>

          <!-- ▓▓ BODY ▓▓ -->
          <tr>
            <td style="background:#ffffff;padding:28px 36px 30px;">

              <!-- ── Sender card ── -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                style="background:#f4f7fd;border-radius:10px;border:1px solid #dce7f5;
                       margin-bottom:18px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <!-- Avatar initials -->
                        <td style="vertical-align:middle;width:50px;padding-right:14px;">
                          <div style="width:48px;height:48px;border-radius:50%;
                                      background:linear-gradient(135deg,#1648a8 0%,#60b0ff 100%);
                                      text-align:center;line-height:48px;
                                      font-size:16px;font-weight:800;color:#ffffff;">
                            ${initials}
                          </div>
                        </td>
                        <!-- Name + email -->
                        <td style="vertical-align:middle;">
                          <div style="font-size:15px;font-weight:700;color:#06112a;
                                      margin-bottom:3px;line-height:1.3;">
                            ${escapeHtml(`${firstName} ${lastName}`.trim())}
                          </div>
                          <a href="mailto:${escapeHtml(email)}"
                            style="font-size:13px;color:#1648a8;text-decoration:none;font-weight:500;">
                            ${escapeHtml(email)}
                          </a>
                        </td>
                        ${
                          phone
                            ? `<td style="text-align:right;vertical-align:middle;padding-left:10px;">
                            <span style="display:inline-block;background:#e4eefb;color:#1648a8;
                                         font-size:11.5px;font-weight:600;padding:5px 11px;
                                         border-radius:20px;white-space:nowrap;
                                         border:1px solid #c2d8f5;">
                              &#128222;&nbsp;${escapeHtml(phone)}
                            </span>
                          </td>`
                            : ""
                        }
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- ── Service / Budget row ── -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                style="margin-bottom:18px;">
                <tr>
                  <td style="width:50%;padding-right:8px;vertical-align:top;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                      style="background:#eef4ff;border-radius:9px;
                             border:1px solid #ccddf5;border-left:4px solid #1648a8;">
                      <tr>
                        <td style="padding:13px 15px;">
                          <div style="font-size:9px;font-weight:800;letter-spacing:1.5px;
                                      text-transform:uppercase;color:#5a7fae;margin-bottom:6px;">
                            Service Requested
                          </div>
                          <div style="font-size:14px;font-weight:700;color:#06112a;line-height:1.4;">
                            ${escapeHtml(subject)}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width:50%;padding-left:8px;vertical-align:top;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                      style="background:#eef4ff;border-radius:9px;
                             border:1px solid #ccddf5;border-left:4px solid #60b0ff;">
                      <tr>
                        <td style="padding:13px 15px;">
                          <div style="font-size:9px;font-weight:800;letter-spacing:1.5px;
                                      text-transform:uppercase;color:#5a7fae;margin-bottom:6px;">
                            Budget Range
                          </div>
                          <div style="font-size:14px;font-weight:700;color:#06112a;line-height:1.4;">
                            ${escapeHtml(budget || "Not specified")}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- ── Message block ── -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                style="margin-bottom:26px;">
                <tr>
                  <td>
                    <!-- Label -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                      style="margin-bottom:9px;">
                      <tr>
                        <td>
                          <span style="font-size:9px;font-weight:800;letter-spacing:1.5px;
                                       text-transform:uppercase;color:#5a7fae;">
                            Message
                          </span>
                        </td>
                        <td style="text-align:right;">
                          <span style="font-size:10.5px;color:#9ab2cc;">
                            ${message.length} chars
                          </span>
                        </td>
                      </tr>
                    </table>

                    <!-- Message body container
                         min-height ensures short messages don't look sparse;
                         long messages expand naturally with no max-height cap. -->
                    <div style="background:#f7f9fc;border-radius:10px;
                                border:1px solid #dce7f5;border-left:4px solid #dce7f5;
                                padding:${isShortMessage ? "20px 22px 8px" : "20px 22px 6px"};">
                      ${messageHtml}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- ── Reply CTA ── -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent("Re: " + emailSubject)}"
                      style="display:inline-block;
                             background:linear-gradient(135deg,#1648a8 0%,#3a7ee8 100%);
                             color:#ffffff;font-size:14px;font-weight:700;
                             text-decoration:none;padding:13px 36px;border-radius:8px;
                             letter-spacing:0.2px;
                             box-shadow:0 4px 18px rgba(22,72,168,0.30);">
                      Reply to ${escapeHtml(firstName)}&nbsp;&nbsp;&#8594;
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ▓▓ FOOTER ▓▓ -->
          <tr>
            <td style="background:#f2f6fb;padding:16px 36px 20px;
                       border-top:1px solid #dce7f5;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="vertical-align:middle;">
                    <div style="font-size:12.5px;font-weight:700;color:#06112a;">SlimCyberTech</div>
                    <div style="font-size:11px;color:#7a96b4;margin-top:2px;">
                      Arua, West Nile &middot; Uganda
                    </div>
                  </td>
                  <td style="text-align:right;vertical-align:middle;">
                    <div style="font-size:11px;color:#8aa0ba;line-height:1.65;">
                      Sent from<br />
                      <a href="https://slimcybertech.com"
                        style="color:#1648a8;text-decoration:none;font-weight:600;">
                        slimcybertech.com
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- end card -->

        <!-- Bottom disclaimer -->
        <p style="margin:16px 0 0;font-size:11px;color:#8aa0b8;text-align:center;line-height:1.7;">
          Automated notification &mdash; do not reply directly to this email.<br />
          Use the <strong>Reply to ${escapeHtml(firstName)}</strong> button above to respond.
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
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