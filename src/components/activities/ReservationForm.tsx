"use client";

import { useState } from "react";
import { activities } from "@/lib/activities";

const inputClass =
  "mt-1 w-full rounded-lg border border-brand-navy/20 px-3 py-2.5 text-brand-navy placeholder:text-brand-navy/40 transition focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-brand-navy/[0.03] disabled:text-brand-navy/40";

const labelClass = "block text-sm font-medium text-brand-navy";

export function ReservationForm() {
  const [activity, setActivity] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("");
  const [hotelLocation, setHotelLocation] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity,
          preferredDate,
          fullName,
          phone,
          guests: Number(guests),
          hotelLocation,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      setActivity("");
      setPreferredDate("");
      setFullName("");
      setPhone("");
      setGuests("");
      setHotelLocation("");
      setMessage("");
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-navy">
          Reservation request sent
        </h3>
        <p className="mx-auto mt-2 max-w-md text-brand-navy/70">
          Thank you. The Graquamarine team will contact you shortly to confirm
          your activity.
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
      {/* TODO: Connect this form to the reservation backend/email workflow. */}
      <div>
        <label className={labelClass} htmlFor="activity">
          Activity <span className="text-brand-aqua">*</span>
        </label>
        <select
          id="activity"
          name="activity"
          className={inputClass}
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          required
          disabled={submitting}
        >
          <option value="" disabled>
            Select an activity
          </option>
          {activities.map((a) => (
            <option key={a.slug} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="preferredDate">
            Preferred date <span className="text-brand-aqua">*</span>
          </label>
          <input
            id="preferredDate"
            name="preferredDate"
            type="date"
            className={inputClass}
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="guests">
            Number of guests <span className="text-brand-aqua">*</span>
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min="1"
            className={inputClass}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="fullName">
            Full name <span className="text-brand-aqua">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
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
            name="phone"
            type="tel"
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="pickupLocation">
          Hotel / pickup location
        </label>
        <input
          id="pickupLocation"
          name="pickupLocation"
          type="text"
          className={inputClass}
          value={hotelLocation}
          onChange={(e) => setHotelLocation(e.target.value)}
          disabled={submitting}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="message">
          Message / notes
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={inputClass}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
        className="w-fit rounded-full bg-brand-aqua px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send reservation request"}
      </button>
    </form>
  );
}
