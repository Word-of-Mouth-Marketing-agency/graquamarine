import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;

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

    if (!process.env.RESEND_API_KEY || !process.env.RESERVATION_EMAIL_TO) {
      return NextResponse.json(
        {
          error:
            "Contact email is not configured. Please try again later or use WhatsApp.",
        },
        { status: 503 }
      );
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Graquamarine <contact@graquamarine.com>",
      to: process.env.RESERVATION_EMAIL_TO,
      subject: "New Graquamarine Contact Message",
      text: [
        `Name: ${name.trim()}`,
        `Phone: ${phone.trim()}`,
        trimmedEmail ? `Email: ${trimmedEmail}` : null,
        `Message: ${message.trim()}`,
        `Submitted: ${new Date().toISOString()}`,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
