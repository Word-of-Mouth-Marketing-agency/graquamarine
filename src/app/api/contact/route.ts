import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/email";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`contact:${clientIp}`, {
      limit: RATE_LIMIT_MAX,
      windowMs: RATE_LIMIT_WINDOW_MS,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();
    const { name, phone, email, message, website } = body;

    if (typeof website === "string" && website.trim()) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const errors: string[] = [];

    if (!name || typeof name !== "string" || !name.trim()) {
      errors.push("Name is required.");
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      errors.push("Phone is required.");
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      errors.push("Message is required.");
    }

    if (email && typeof email === "string" && email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errors.push("Please provide a valid email address.");
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    const trimmedEmail = email?.trim() || null;

    const emailResult = await sendContactNotification({
      name: name.trim(),
      phone: phone.trim(),
      email: trimmedEmail,
      message: message.trim(),
    });

    if (emailResult.skipped) {
      return NextResponse.json(
        {
          error:
            "Contact email is not configured. Please try again later or use WhatsApp.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
