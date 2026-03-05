
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validations/contact";
import { checkRateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/data/site";
import { createClient } from "@/lib/supabase/server";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const CONTACT_TO = process.env.CONTACT_EMAIL ?? siteConfig.email;
const CONTACT_FROM =
  process.env.RESEND_FROM_EMAIL ?? `Portfolio Bot <hello@dhossain.com>`;

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

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
    
    // Check honeypot - reject silently if filled (pretend success)
    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }
    
    // Verify Turnstile token
    const turnstileToken = body.turnstileToken;
    if (!turnstileToken) {
      return NextResponse.json(
        { success: false, message: "Verification failed. Please try again." },
        { status: 400 }
      );
    }

    const ipAddress = getClientIP(request);
    const turnstileResult = await verifyTurnstile(turnstileToken, ipAddress);
    
    if (!turnstileResult.success) {
      console.error("Turnstile verification failed:", turnstileResult.error);
      return NextResponse.json(
        { success: false, message: "Verification failed. Please try again." },
        { status: 400 }
      );
    }
    
    const payload = contactSchema.parse(body);

    // Get client metadata
    const userAgent = request.headers.get("user-agent") ?? undefined;

    // Insert into database first
    const supabase = await createClient();
    
    const { data: insertData, error: insertError } = await supabase
      .from("contact_messages")
      .insert({
        name: payload.name,
        email: payload.email,
        message: payload.message,
        status: "unread",
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return NextResponse.json(
        { success: false, message: "Failed to save message. Please try again." },
        { status: 500 }
      );
    }

    const messageId = insertData.id;

    // Send email notification (best effort - don't fail if email fails)
    let emailSent = true;
    if (resend) {
      try {
        await resend.emails.send({
          from: CONTACT_FROM,
          to: CONTACT_TO,
          subject: `[${messageId.slice(0, 8)}] New portfolio inquiry from ${payload.name}`,
          replyTo: payload.email,
          text: [
            `ID: ${messageId}`,
            `Name: ${payload.name}`,
            `Email: ${payload.email}`,
            "",
            payload.message,
          ].join("\n"),
        });
      } catch (emailError) {
        console.error("Resend email error:", emailError);
        emailSent = false;
        // Still return success since message was saved
      }
    } else {
      console.warn("RESEND_API_KEY not configured. Email not sent.");
    }

    return NextResponse.json({ success: true, id: messageId });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Unable to send message right now.";

    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}

async function verifyTurnstile(token: string, ip?: string | null): Promise<{ success: boolean; error?: string }> {
  // If no secret key configured, skip verification (for dev/testing)
  if (!TURNSTILE_SECRET_KEY) {
    console.warn("TURNSTILE_SECRET_KEY not configured - skipping verification");
    return { success: true };
  }

  try {
    const formData = new FormData();
    formData.append("secret", TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    if (ip) {
      formData.append("remoteip", ip);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json() as TurnstileVerificationResponse;
    
    if (result.success) {
      return { success: true };
    }
    
    return { success: false, error: result["error-codes"]?.join(", ") };
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return { success: false, error: "Verification service unavailable" };
  }
}

interface TurnstileVerificationResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

function getClientIdentifier(request: Request) {
  const forwarded =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown";

  return forwarded.split(",")[0]?.trim() ?? "unknown";
}

function getClientIP(request: Request): string | null {
  const forwarded =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    null;

  if (!forwarded) return null;
  return forwarded.split(",")[0]?.trim() ?? null;
}
