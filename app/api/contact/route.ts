
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations/contact";
import { checkRateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/data/site";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const CONTACT_TO = process.env.CONTACT_EMAIL ?? siteConfig.email;
const CONTACT_FROM =
  process.env.RESEND_FROM_EMAIL ?? `Portfolio Bot <hello@dhossain.com>`;

export async function POST(request: Request) {
  const identifier = getClientIdentifier(request);
  const rateLimit = checkRateLimit(identifier);

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Too many requests. Please try again shortly.",
      },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter ?? 60) } },
    );
  }

  try {
    const body = await request.json();
    const payload = contactSchema.parse(body);

    if (!resend) {
      console.warn("RESEND_API_KEY not configured. Message will not be sent.");
      return NextResponse.json({ success: true, preview: true });
    }

    await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      subject: `New portfolio inquiry from ${payload.name}`,
      replyTo: payload.email,
      text: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        "",
        payload.message,
      ].join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Unable to send message right now.";

    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

function getClientIdentifier(request: Request) {
  const forwarded =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";

  return forwarded.split(",")[0]?.trim() ?? "unknown";
}
