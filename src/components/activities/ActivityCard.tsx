import type { Activity } from "@/types";

type ActivityCardProps = {
  activity: Activity;
};

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <article className="rounded border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold">{activity.name}</h2>
        <p className="shrink-0 text-sm font-medium text-slate-700">
          From ${activity.basePriceUsd}
        </p>
      </div>
      <p className="mt-3 text-slate-600">{activity.summary}</p>
    </article>
  );
}
