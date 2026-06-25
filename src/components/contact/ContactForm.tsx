"use client";

import { useState } from "react";

const inputClass =
  "mt-1 w-full rounded-lg border border-brand-navy/20 px-3 py-2.5 text-brand-navy placeholder:text-brand-navy/40 transition focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-brand-navy/[0.03] disabled:text-brand-navy/40";

const labelClass = "block text-sm font-medium text-brand-navy";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, message, website }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setWebsite("");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-brand-aqua/20">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-7 w-7 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-navy">Message sent</h3>
        <p className="mx-auto mt-2 max-w-xs text-brand-navy/70">
          Thank you. The Graquamarine team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 rounded-full bg-brand-aqua px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      className="flex h-full flex-col justify-center gap-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-aqua/20 sm:p-8"
      onSubmit={handleSubmit}
    >
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contactWebsite">Website</label>
        <input
          id="contactWebsite"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contactName">
          Name <span className="text-brand-aqua">*</span>
        </label>
        <input
          id="contactName"
          name="name"
          type="text"
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={submitting}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contactPhone">
          Phone <span className="text-brand-aqua">*</span>
        </label>
        <input
          id="contactPhone"
          name="phone"
          type="tel"
          className={inputClass}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          disabled={submitting}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contactEmail">
          Email
        </label>
        <input
          id="contactEmail"
          name="email"
          type="email"
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="contactMessage">
          Message <span className="text-brand-aqua">*</span>
        </label>
        <textarea
          id="contactMessage"
          name="message"
          rows={4}
          className={inputClass}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={submitting}
        />
      </div>

      {error && (
        <div
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-brand-aqua px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
