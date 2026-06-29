// scripts/test-emails.mjs
// Tests contact and reservation email notifications with current env config.
// Usage: node scripts/test-emails.mjs
// Loads .env manually — no extra dependencies.

import { readFileSync } from "fs";
import { resolve } from "path";

// Simple .env parser
const envPath = resolve(process.cwd(), ".env");
try {
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
} catch {
  // .env not found — use existing env vars
}

const apiKey = process.env.RESEND_API_KEY?.trim();
const emailFrom =
  process.env.EMAIL_FROM?.trim() || "Graquamarine <onboarding@resend.dev>";
const emailTo = process.env.RESERVATION_EMAIL_TO?.trim();

if (!apiKey) {
  console.log("SKIP: RESEND_API_KEY is not set.");
  process.exit(0);
}

if (!emailTo) {
  console.log("SKIP: RESERVATION_EMAIL_TO is not set.");
  process.exit(0);
}

const { Resend } = await import("resend");
const resend = new Resend(apiKey);

// --- Test 1: Contact email ---
console.log("Sending test contact email...");
try {
  const r1 = await resend.emails.send({
    from: emailFrom,
    to: emailTo,
    subject: "[TEST] New Graquamarine Contact Message - Test User",
    text: [
      "This is a test contact form email.",
      "",
      "Name: Test User",
      "Phone: +201234567890",
      "Email: test@example.com",
      "Message: Hello from the Graquamarine test script.",
      `Submitted: ${new Date().toISOString()}`,
    ].join("\n"),
  });
  console.log(`  OK (${r1.data?.id || "no id"})`);
} catch (e) {
  console.log(`  FAIL — ${e.message}`);
}

// --- Test 2: Reservation email ---
console.log("Sending test reservation email...");
try {
  const r2 = await resend.emails.send({
    from: emailFrom,
    to: emailTo,
    subject: "[TEST] New Graquamarine Reservation - Test User",
    text: [
      "This is a test reservation notification.",
      "",
      "Reservation ID: test-reservation-001",
      "Status: PENDING",
      "",
      "Name: Test User",
      "Phone: +201234567890",
      "Guests: 3",
      "Preferred date: 2026-07-15",
      "Hotel / pickup: Test Hotel",
      "",
      "Activities:",
      "  Snorkeling — $40 per guest x 3 = $120",
      "  Private Boat — $500 (flat boat price) x 1 = $500",
      "",
      "Total: $620",
      "",
      "Notes: Test reservation from email test script.",
      `Submitted: ${new Date().toISOString()}`,
      "",
      "View: https://graquamarine.com/admin",
    ].join("\n"),
  });
  console.log(`  OK (${r2.data?.id || "no id"})`);
} catch (e) {
  console.log(`  FAIL — ${e.message}`);
}

console.log("Done.");
