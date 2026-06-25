"use client";

import { activities } from "@/lib/activities";

export function ReservationForm() {
  return (
    <form className="mt-8 grid gap-4 rounded border border-slate-200 p-4">
      {/* TODO: Connect this form to the reservation backend/email workflow. */}
      <div>
        <label className="block text-sm font-medium" htmlFor="activity">
          Activity
        </label>
        <select
          id="activity"
          name="activity"
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium" htmlFor="preferredDate">
            Preferred date
          </label>
          <input
            id="preferredDate"
            name="preferredDate"
            type="date"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="guests">
            Number of guests
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min="1"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium" htmlFor="fullName">
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="phone">
            WhatsApp / phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="pickupLocation">
          Hotel / pickup location
        </label>
        <input
          id="pickupLocation"
          name="pickupLocation"
          type="text"
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="message">
          Message / notes
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
        />
      </div>

      <button
        type="button"
        className="w-fit rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        Reservation backend pending
      </button>
    </form>
  );
}
