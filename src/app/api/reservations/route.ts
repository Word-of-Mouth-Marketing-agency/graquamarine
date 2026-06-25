import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { activities } from "@/lib/activities";

const ALLOWED_ACTIVITIES = activities.map((a) => a.name);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      activity,
      preferredDate,
      fullName,
      phone,
      guests,
      hotelLocation,
      message,
    } = body;

    const errors: string[] = [];

    if (!activity || typeof activity !== "string") {
      errors.push("Activity is required.");
    } else if (!ALLOWED_ACTIVITIES.includes(activity.trim())) {
      errors.push("Invalid activity selection.");
    }

    if (!preferredDate) {
      errors.push("Preferred date is required.");
    } else {
      const date = new Date(preferredDate);
      if (isNaN(date.getTime())) {
        errors.push("Invalid preferred date.");
      }
    }

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      errors.push("Full name is required.");
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      errors.push("Phone is required.");
    }

    const guestCount = Number(guests);
    if (!guests || isNaN(guestCount) || guestCount < 1 || !Number.isInteger(guestCount)) {
      errors.push("Number of guests must be a positive whole number.");
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        activity: activity.trim(),
        preferredDate: new Date(preferredDate),
        fullName: fullName.trim(),
        phone: phone.trim(),
        guests: guestCount,
        hotelLocation: hotelLocation?.trim() || null,
        message: message?.trim() || null,
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
          subject: `New Reservation: ${reservation.activity}`,
          text: [
            `Activity: ${reservation.activity}`,
            `Date: ${reservation.preferredDate.toISOString().split("T")[0]}`,
            `Name: ${reservation.fullName}`,
            `Phone: ${reservation.phone}`,
            `Guests: ${reservation.guests}`,
            reservation.hotelLocation
              ? `Hotel/Pickup: ${reservation.hotelLocation}`
              : null,
            reservation.message ? `Message: ${reservation.message}` : null,
            `Created: ${reservation.createdAt.toISOString()}`,
          ]
            .filter(Boolean)
            .join("\n"),
        });
      } catch {
        // Email notification failed silently — reservation was still saved
      }
    }

    return NextResponse.json(
      { success: true, id: reservation.id },
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
