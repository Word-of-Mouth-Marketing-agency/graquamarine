"use client";

import { useMemo, useState } from "react";
import { activities } from "@/lib/activities";
import type { PricingMode } from "@/types";

const inputClass =
  "mt-1 w-full rounded-lg border border-brand-navy/20 px-3 py-2.5 text-brand-navy placeholder:text-brand-navy/40 transition focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-brand-navy/[0.03] disabled:text-brand-navy/40";

const labelClass = "block text-sm font-medium text-brand-navy";

function pricingLabel(mode: PricingMode): string {
  return mode === "flat" ? "flat boat price" : "per guest";
}

export function ReservationForm() {
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [guests, setGuests] = useState("1");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const guestCount = Number(guests) || 1;

  const total = useMemo(() => {
    let sum = 0;
    for (const slug of selectedSlugs) {
      const a = activities.find((x) => x.slug === slug);
      if (!a) continue;
      sum += a.pricingMode === "flat" ? a.basePriceUsd : a.basePriceUsd * guestCount;
    }
    return sum;
  }, [selectedSlugs, guestCount]);

  function toggleSlug(slug: string) {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (selectedSlugs.size === 0) {
      setError("Select at least one activity.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedSlugs: Array.from(selectedSlugs),
          guests: guestCount,
          fullName,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      setSelectedSlugs(new Set());
      setGuests("1");
      setFullName("");
      setPhone("");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-brand-aqua/20">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-7 w-7 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-navy">Reservation request sent</h3>
        <p className="mx-auto mt-2 max-w-md text-brand-navy/70">
          Thank you. The Graquamarine team will contact you shortly to confirm
          {selectedSlugs.size > 0 ? " your activities" : ""}.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 rounded-full bg-brand-aqua px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy"
        >
          Make another reservation
        </button>
      </div>
    );
  }

  return (
    <form
      className="mt-8 grid gap-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-aqua/20 sm:p-8"
      onSubmit={handleSubmit}
    >
      <fieldset>
        <legend className={`${labelClass} mb-3`}>
          Select activities <span className="text-brand-aqua">*</span>
        </legend>
        <div className="space-y-2">
          {activities.map((a) => (
            <label
              key={a.slug}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                selectedSlugs.has(a.slug)
                  ? "border-brand-aqua bg-brand-aqua/5"
                  : "border-brand-navy/15 hover:border-brand-navy/30"
              } ${submitting ? "pointer-events-none opacity-60" : ""}`}
            >
              <input
                type="checkbox"
                checked={selectedSlugs.has(a.slug)}
                onChange={() => toggleSlug(a.slug)}
                className="h-4 w-4 shrink-0 accent-brand-aqua"
                disabled={submitting}
              />
              <div className="flex flex-1 items-center justify-between gap-2">
                <span className="text-sm font-medium text-brand-navy">
                  {a.name}
                </span>
                <span className="shrink-0 text-sm text-brand-navy/50">
                  ${a.basePriceUsd} <span className="text-xs">({pricingLabel(a.pricingMode)})</span>
                </span>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="guests">
          Number of guests <span className="text-brand-aqua">*</span>
        </label>
        <input
          id="guests"
          type="number"
          min="1"
          className={inputClass}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          required
          disabled={submitting}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="fullName">
            Full name <span className="text-brand-aqua">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            className={inputClass}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            WhatsApp / phone <span className="text-brand-aqua">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
      </div>

      {selectedSlugs.size > 0 && (
        <div className="rounded-lg bg-brand-navy/5 px-4 py-3 text-center">
          <span className="text-sm text-brand-navy/60">Total</span>
          <p className="text-2xl font-bold text-brand-navy">${total}</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || selectedSlugs.size === 0}
        className="w-full rounded-full bg-brand-aqua px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send reservation request"}
      </button>
    </form>
  );
}
