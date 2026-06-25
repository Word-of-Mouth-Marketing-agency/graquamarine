import type { Metadata } from "next";
import { ActivityCard } from "@/components/activities/ActivityCard";
import { ReservationForm } from "@/components/activities/ReservationForm";
import { activities } from "@/lib/activities";

export const metadata: Metadata = {
  title: "Activities",
  description:
    "Browse Graquamarine diving, snorkeling, island trips, courses, and private boat activities in Hurghada.",
};

export default function ActivitiesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold">Activities</h1>
        <p className="max-w-3xl text-slate-600">
          Placeholder activity listing. Prices are base prices and can be
          refined later with seasonal rules, guest counts, and private requests.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {activities.map((activity) => (
          <ActivityCard key={activity.slug} activity={activity} />
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Reserve an activity</h2>
        <p className="mt-2 max-w-3xl text-slate-600">
          Frontend-only reservation placeholder for collecting the expected
          booking details before backend integration.
        </p>
        <ReservationForm />
      </section>
    </div>
  );
}
