import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { activities } from "@/lib/activities";

const ALLOWED_SLUGS = new Set(activities.map((a) => a.slug));

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { selectedSlugs, guests, fullName, phone } = body;

    const errors: string[] = [];
    const selected: typeof activities = [];

    if (!Array.isArray(selectedSlugs) || selectedSlugs.length === 0) {
      errors.push("Select at least one activity.");
    } else {
      for (const slug of selectedSlugs) {
        if (!ALLOWED_SLUGS.has(slug)) {
          errors.push(`Unknown activity: ${slug}`);
          continue;
        }
        const activity = activities.find((a) => a.slug === slug)!;
        selected.push(activity);
      }
    }

    const guestCount = Number(guests);
    if (!guests || isNaN(guestCount) || guestCount < 1 || !Number.isInteger(guestCount)) {
      errors.push("Number of guests must be a positive whole number.");
    }

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      errors.push("Full name is required.");
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      errors.push("Phone is required.");
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    let totalPrice = 0;
    const activityList: { name: string; price: number; mode: string }[] = [];

    for (const a of selected) {
      const price = a.pricingMode === "flat" ? a.basePriceUsd : a.basePriceUsd * guestCount;
      totalPrice += price;
      activityList.push({ name: a.name, price: a.basePriceUsd, mode: a.pricingMode });
    }

    const reservation = await prisma.reservation.create({
      data: {
        activity: selected.map((a) => a.name).join(", "),
        activities: JSON.stringify(activityList),
        totalPrice,
        guests: guestCount,
        fullName: fullName.trim(),
        phone: phone.trim(),
        status: "PENDING",
      },
    });

    if (process.env.RESEND_API_KEY && process.env.RESERVATION_EMAIL_TO) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Graquamarine <reservations@graquamarine.com>",
          to: process.env.RESERVATION_EMAIL_TO,
          subject: `New Reservation — ${selected.length} activity(s)`,
          text: [
            `Activities:`,
            ...activityList.map(
              (a) => `  - ${a.name} ($${a.price} ${a.mode === "flat" ? "flat" : "per guest"})`
            ),
            `Guests: ${guestCount}`,
            `Total: $${totalPrice}`,
            `Name: ${fullName.trim()}`,
            `Phone: ${phone.trim()}`,
            `Created: ${reservation.createdAt.toISOString()}`,
          ].join("\n"),
        });
      } catch {
        // Email notification failed silently
      }
    }

    return NextResponse.json(
      { success: true, id: reservation.id, totalPrice },
      { status: 201 }
    );
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
