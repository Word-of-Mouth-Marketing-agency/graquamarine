"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation must match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not reset password.");
      }

      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not reset password."
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
            Reset password
          </h1>
          <p className="mt-2 text-sm leading-6 text-brand-navy/60">
            Choose a new password for your admin account.
          </p>
        </div>

        {!token ? (
          <div className="mt-8 space-y-5">
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-brand-navy/70">
              Reset link is missing or invalid.
            </p>
            <Link
              href="/admin/forgot-password"
              className="flex h-12 w-full items-center justify-center rounded-full bg-brand-aqua px-5 text-sm font-bold text-white transition hover:bg-brand-navy"
            >
              Request a new link
            </Link>
          </div>
        ) : success ? (
          <div className="mt-8 space-y-5 text-center">
            <p className="rounded-2xl border border-brand-aqua/20 bg-brand-aqua/10 px-4 py-3 text-sm font-semibold text-brand-navy">
              Password updated successfully. You can now log in.
            </p>
            <Link
              href="/admin/login"
              className="flex h-12 w-full items-center justify-center rounded-full bg-brand-aqua px-5 text-sm font-bold text-white transition hover:bg-brand-navy"
            >
              Go to login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-sm font-semibold text-brand-navy"
                htmlFor="newPassword"
              >
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="mt-2 h-12 w-full rounded-xl border border-brand-navy/15 bg-white px-4 text-brand-navy outline-none transition placeholder:text-brand-navy/35 focus:border-brand-aqua focus:ring-4 focus:ring-brand-aqua/10"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label
                className="block text-sm font-semibold text-brand-navy"
                htmlFor="confirmPassword"
              >
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="mt-2 h-12 w-full rounded-xl border border-brand-navy/15 bg-white px-4 text-brand-navy outline-none transition placeholder:text-brand-navy/35 focus:border-brand-aqua focus:ring-4 focus:ring-brand-aqua/10"
                placeholder="Repeat the new password"
              />
            </div>

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
              {loading ? "Updating..." : "Reset password"}
            </button>
          </form>
        )}

        {!success && (
          <p className="mt-6 text-center text-xs font-semibold text-brand-navy/45">
            <Link
              href="/admin/login"
              className="transition hover:text-brand-aqua"
            >
              Back to login
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
