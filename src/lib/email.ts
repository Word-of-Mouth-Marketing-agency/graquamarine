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
