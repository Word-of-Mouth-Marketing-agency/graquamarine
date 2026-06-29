"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid email or password.");
      }
    } catch {
      setError("Network error. Please try again.");
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
            Admin Login
          </h1>
          <p className="mt-2 text-sm leading-6 text-brand-navy/60">
            Sign in to manage reservations and services.
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

          <div>
            <div className="flex items-center justify-between gap-3">
              <label
                className="block text-sm font-semibold text-brand-navy"
                htmlFor="password"
              >
                Password
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-xs font-bold text-brand-aqua transition hover:text-brand-navy"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="mt-2 h-12 w-full rounded-xl border border-brand-navy/15 bg-white px-4 text-brand-navy outline-none transition placeholder:text-brand-navy/35 focus:border-brand-aqua focus:ring-4 focus:ring-brand-aqua/10"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p
              className="rounded-2xl border border-brand-aqua/20 bg-brand-aqua/10 px-4 py-3 text-sm font-semibold text-brand-navy"
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
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs font-semibold text-brand-navy/45">
          <Link href="/" className="transition hover:text-brand-aqua">
            Back to website
          </Link>
        </p>
      </section>
    </main>
  );
}
