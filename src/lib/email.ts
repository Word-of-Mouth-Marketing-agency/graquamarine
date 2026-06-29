type PasswordResetEmailInput = {
  to: string;
  name: string;
  resetUrl: string;
};

type PasswordResetEmailResult = {
  sent: boolean;
  skipped: boolean;
};

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: PasswordResetEmailInput): Promise<PasswordResetEmailResult> {
  if (!process.env.RESEND_API_KEY?.trim()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`Password reset link for ${to}: ${resetUrl}`);
    } else {
      console.warn("Password reset email skipped: RESEND_API_KEY is not set.");
    }

    return { sent: false, skipped: true };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Graquamarine <onboarding@resend.dev>",
    to,
    subject: "Reset your Graquamarine admin password",
    text: [
      `Hello ${name},`,
      "",
      "We received a request to reset your Graquamarine admin password.",
      "",
      "Click the link below to set a new password:",
      resetUrl,
      "",
      "This link expires in 30 minutes.",
      "",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
  });

  return { sent: true, skipped: false };
}

type ReservationNotificationInput = {
  reservationId: string;
  activityNames: string;
  activityBreakdown: string[];
  guestCount: number;
  preferredDate: string;
  fullName: string;
  phone: string;
  hotelLocation: string | null;
  message: string | null;
  totalPrice: number;
  status: string;
  createdAt: string;
};

type ReservationNotificationResult = {
  sent: boolean;
  skipped: boolean;
  error?: string;
};

function buildReservationTextHtml(input: ReservationNotificationInput) {
  const hotel = input.hotelLocation || "Not provided";
  const notes = input.message || "Not provided";
  const adminUrl = "https://graquamarine.com/admin";

  const text = [
    `New Graquamarine Reservation`,
    `================================`,
    ``,
    `Reservation ID: ${input.reservationId}`,
    `Status: ${input.status}`,
    ``,
    `---- Guest ----`,
    `Name: ${input.fullName}`,
    `Phone: ${input.phone}`,
    `Guests: ${input.guestCount}`,
    `Preferred date: ${input.preferredDate}`,
    `Hotel / pickup: ${hotel}`,
    ``,
    `---- Activities ----`,
    ...input.activityBreakdown.map((line) => `  ${line}`),
    ``,
    `Total: $${input.totalPrice}`,
    ``,
    `---- Notes ----`,
    notes,
    ``,
    `Submitted: ${input.createdAt}`,
    ``,
    `View and manage this reservation: ${adminUrl}`,
    ``,
    `-- Graquamarine Admin Notification`,
  ].join("\n");

  const html = [
    `<div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; background: #ffffff;">`,
    `<h2 style="color: #282262; margin: 0 0 4px;">New Graquamarine Reservation</h2>`,
    `<p style="color: #666; font-size: 13px; margin: 0 0 24px;">`,
    `Reservation ${input.reservationId} &middot; ${input.status}`,
    `</p>`,
    ``,
    `<table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">`,
    `<tr>`,
    `<td colspan="2" style="padding: 8px 12px; background: #f4f4f4; font-weight: 600; color: #282262; border-radius: 4px 4px 0 0;">Guest</td>`,
    `</tr>`,
    `<tr><td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #eee; width: 140px;">Name</td><td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #eee;">${escapeHtml(input.fullName)}</td></tr>`,
    `<tr><td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #eee;">Phone</td><td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #eee;">${escapeHtml(input.phone)}</td></tr>`,
    `<tr><td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #eee;">Guests</td><td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #eee;">${input.guestCount}</td></tr>`,
    `<tr><td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #eee;">Preferred date</td><td style="padding: 8px 12px; color: #333; border-bottom: 1px solid #eee;">${escapeHtml(input.preferredDate)}</td></tr>`,
    `<tr><td style="padding: 8px 12px; color: #333;">Hotel / pickup</td><td style="padding: 8px 12px; color: #333;">${escapeHtml(hotel)}</td></tr>`,
    `</table>`,
    ``,
    `<table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">`,
    `<tr>`,
    `<td colspan="2" style="padding: 8px 12px; background: #f4f4f4; font-weight: 600; color: #282262; border-radius: 4px 4px 0 0;">Activities</td>`,
    `</tr>`,
    ...input.activityBreakdown.map(
      (line) =>
        `<tr><td colspan="2" style="padding: 8px 12px; color: #333; border-bottom: 1px solid #eee;">${escapeHtml(line)}</td></tr>`
    ),
    `</table>`,
    ``,
    `<p style="font-size: 18px; font-weight: 700; color: #01A3CB; margin: 0 0 24px;">Total: $${input.totalPrice}</p>`,
    ``,
    `<table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">`,
    `<tr><td style="padding: 8px 12px; background: #f4f4f4; font-weight: 600; color: #282262; border-radius: 4px 4px 0 0;">Notes</td></tr>`,
    `<tr><td style="padding: 8px 12px; color: #333;">${escapeHtml(notes)}</td></tr>`,
    `</table>`,
    ``,
    `<p style="color: #888; font-size: 12px;">Submitted: ${escapeHtml(input.createdAt)}</p>`,
    ``,
    `<a href="${adminUrl}" style="display: inline-block; background: #01A3CB; color: #fff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px;">View in Admin Dashboard</a>`,
    ``,
    `<hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 12px;" />`,
    `<p style="color: #999; font-size: 11px;">Graquamarine Admin Notification &middot; ${escapeHtml(input.preferredDate)}</p>`,
    `</div>`,
  ].join("\n");

  return { text, html };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendReservationNotification(
  input: ReservationNotificationInput
): Promise<ReservationNotificationResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const emailTo = process.env.RESERVATION_EMAIL_TO?.trim();

  if (!apiKey || !emailTo) {
    console.info("Reservation email skipped: missing email configuration.");
    return { sent: false, skipped: true };
  }

  const { text, html } = buildReservationTextHtml(input);

  const subject = `New Graquamarine Reservation - ${input.fullName}`;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Graquamarine <onboarding@resend.dev>",
      to: emailTo,
      subject,
      text,
      html,
    });

    return { sent: true, skipped: false };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown email error";
    console.error("Reservation email failed:", message);
    return { sent: false, skipped: false, error: message };
  }
}
