"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const GENERIC_MESSAGE = "If this email exists, we sent a password reset link.";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLocalDevelopment = process.env.NODE_ENV !== "production";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setDevResetUrl("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not send reset link.");
      }

      setMessage(data.message || GENERIC_MESSAGE);
      setDevResetUrl(
        isLocalDevelopment && typeof data.devResetUrl === "string"
          ? data.devResetUrl
          : ""
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not send reset link."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7fbfd] px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-brand-aqua/15 bg-white p-6 shadow-xl shadow-brand-navy/5 sm:p-8">
        <div className="text-center">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-wide text-brand-aqua"
          >
            Graquamarine
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-brand-navy">
            Forgot password?
          </h1>
          <p className="mt-2 text-sm leading-6 text-brand-navy/60">
            Enter your admin email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-sm font-semibold text-brand-navy"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="mt-2 h-12 w-full rounded-xl border border-brand-navy/15 bg-white px-4 text-brand-navy outline-none transition placeholder:text-brand-navy/35 focus:border-brand-aqua focus:ring-4 focus:ring-brand-aqua/10"
              placeholder="admin@graquamarine.local"
            />
          </div>

          {message && (
            <p
              className="rounded-2xl border border-brand-aqua/20 bg-brand-aqua/10 px-4 py-3 text-sm font-semibold text-brand-navy"
              role="status"
            >
              {message}
            </p>
          )}

          {isLocalDevelopment && devResetUrl && (
            <div className="rounded-2xl border border-brand-aqua/25 bg-[#f7fbfd] p-4 text-left">
              <p className="text-sm font-bold text-brand-navy">
                Local development reset link
              </p>
              <p className="mt-1 text-sm leading-6 text-brand-navy/60">
                Email is not configured, so use this link to test password reset
                locally.
              </p>
              <a
                href={devResetUrl}
                className="mt-4 inline-flex h-10 items-center rounded-full bg-brand-navy px-4 text-sm font-bold text-white transition hover:bg-brand-aqua"
              >
                Open reset link
              </a>
            </div>
          )}

          {error && (
            <p
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-brand-navy/70"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-full bg-brand-aqua px-5 text-sm font-bold text-white transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-55"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs font-semibold text-brand-navy/45">
          <Link
            href="/admin/login"
            className="transition hover:text-brand-aqua"
          >
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
}
