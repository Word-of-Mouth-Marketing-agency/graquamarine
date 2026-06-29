import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPublicActivities } from "@/lib/services";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendReservationNotification } from "@/lib/email";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

type ActivityItem = {
  activity_id: string;
  activity_name_snapshot: string;
  unit_price_at_booking: number;
  guest_count: number;
  line_total: number;
  pricing_mode: string;
  name: string;
  price: number;
  mode: string;
};

function normalizeOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`reservations:${clientIp}`, {
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
    const {
      selectedSlugs,
      guests,
      preferredDate,
      fullName,
      name,
      phone,
      hotelLocation,
      message,
      website,
    } = body;

    if (typeof website === "string" && website.trim()) {
      return NextResponse.json({ success: true }, { status: 201 });
    }

    const activities = await getPublicActivities();
    const availableActivities = activities.filter((a) => a.isActive);
    const allowedSlugs = new Set(availableActivities.map((a) => a.slug));
    const activityBySlug = new Map(activities.map((a) => [a.slug, a]));
    const errors: string[] = [];
    const selected: typeof activities = [];

    if (!Array.isArray(selectedSlugs) || selectedSlugs.length === 0) {
      errors.push("Select at least one activity.");
    } else {
      for (const slug of selectedSlugs) {
        const requestedActivity = activityBySlug.get(slug);
        if (requestedActivity && !requestedActivity.isActive) {
          errors.push(`${requestedActivity.name} is currently unavailable.`);
          continue;
        }
        if (!allowedSlugs.has(slug)) {
          errors.push(`Unknown activity: ${slug}`);
          continue;
        }
        const activity = availableActivities.find((a) => a.slug === slug)!;
        selected.push(activity);
      }
    }

    const guestCount = Number(guests);
    if (!guests || isNaN(guestCount) || guestCount < 1 || !Number.isInteger(guestCount)) {
      errors.push("Number of guests must be a positive whole number.");
    }

    const reservationName = typeof fullName === "string" ? fullName : name;

    if (!reservationName || typeof reservationName !== "string" || !reservationName.trim()) {
      errors.push("Full name is required.");
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      errors.push("Phone is required.");
    }

    const parsedPreferredDate =
      typeof preferredDate === "string" && preferredDate
        ? new Date(preferredDate)
        : null;

    if (!parsedPreferredDate || Number.isNaN(parsedPreferredDate.getTime())) {
      errors.push("Preferred date is required.");
    }

    const rawPreferredDate =
      typeof preferredDate === "string" ? preferredDate.trim() : "";

    if (rawPreferredDate && /^\d{4}-\d{2}-\d{2}$/.test(rawPreferredDate)) {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      if (rawPreferredDate < today) {
        errors.push("Preferred date cannot be in the past.");
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    let totalPrice = 0;
    const activityList: ActivityItem[] = [];

    for (const a of selected) {
      const activityGuestCount = a.pricingMode === "flat" ? 1 : guestCount;
      const lineTotal = a.basePriceUsd * activityGuestCount;
      totalPrice += lineTotal;
      activityList.push({
        activity_id: a.slug,
        activity_name_snapshot: a.name,
        unit_price_at_booking: a.basePriceUsd,
        guest_count: activityGuestCount,
        line_total: lineTotal,
        pricing_mode: a.pricingMode,
        name: a.name,
        price: a.basePriceUsd,
        mode: a.pricingMode,
      });
    }

    const reservation = await prisma.reservation.create({
      data: {
        activity: selected.map((a) => a.name).join(", "),
        activities: JSON.stringify(activityList),
        totalPrice,
        guests: guestCount,
        preferredDate: parsedPreferredDate!,
        fullName: reservationName.trim(),
        phone: phone.trim(),
        hotelLocation: normalizeOptionalString(hotelLocation),
        message: normalizeOptionalString(message),
        status: "PENDING",
      },
    });

    sendReservationNotification({
      reservationId: reservation.id,
      activityNames: selected.map((a) => a.name).join(", "),
      activityBreakdown: activityList.map(
        (a) =>
          `${a.activity_name_snapshot} — $${a.unit_price_at_booking} ${a.pricing_mode === "flat" ? "(flat boat price)" : "per guest"} x ${a.guest_count} = $${a.line_total}`
      ),
      guestCount,
      preferredDate: rawPreferredDate,
      fullName: reservationName.trim(),
      phone: phone.trim(),
      hotelLocation: normalizeOptionalString(hotelLocation),
      message: normalizeOptionalString(message),
      totalPrice,
      status: reservation.status,
      createdAt: reservation.createdAt.toISOString(),
    }).catch(() => {});

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
