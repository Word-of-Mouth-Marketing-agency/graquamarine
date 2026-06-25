"use client";

import { activities } from "@/lib/activities";

const inputClass =
  "mt-1 w-full rounded-lg border border-brand-navy/20 px-3 py-2.5 text-brand-navy placeholder:text-brand-navy/40 transition focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua/20 focus:outline-none";

const labelClass = "block text-sm font-medium text-brand-navy";

export function ReservationForm() {
  return (
    <form
      className="mt-8 grid gap-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-aqua/20 sm:p-8"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* TODO: Connect this form to the reservation backend/email workflow. */}
      <div>
        <label className={labelClass} htmlFor="activity">
          Activity
        </label>
        <select
          id="activity"
          name="activity"
          className={inputClass}
          defaultValue=""
          required
        >
          <option value="" disabled>
            Select an activity
          </option>
          {activities.map((activity) => (
            <option key={activity.slug} value={activity.slug}>
              {activity.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="preferredDate">
            Preferred date
          </label>
          <input
            id="preferredDate"
            name="preferredDate"
            type="date"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="guests">
            Number of guests
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min="1"
            className={inputClass}
            required
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            WhatsApp / phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={inputClass}
            required
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
        />
      </div>

      <button
        type="button"
        className="w-fit cursor-not-allowed rounded-full bg-brand-aqua/60 px-6 py-3 text-sm font-semibold text-white"
      >
        Reservation backend pending
      </button>
    </form>
  );
}
