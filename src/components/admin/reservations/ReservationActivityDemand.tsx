import type { ReservationRecord } from "@/components/admin/reservations/types";
import { summarizeActivityDemand } from "@/components/admin/reservations/utils";

type ReservationActivityDemandProps = {
  reservations: ReservationRecord[];
};

export function ReservationActivityDemand({
  reservations,
}: ReservationActivityDemandProps) {
  const demand = summarizeActivityDemand(reservations);

  return (
    <section className="rounded-2xl border border-brand-aqua/15 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-aqua">
            Activity demand
          </p>
          <h2 className="mt-1 text-xl font-bold text-brand-navy">
            Confirmed and pending guests
          </h2>
        </div>
        <p className="text-sm text-brand-navy/55">
          Based on the selected reservation day
        </p>
      </div>

      {demand.length > 0 ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {demand.map((item) => (
            <article
              key={item.activityName}
              className="rounded-2xl border border-brand-aqua/10 bg-[#f7fbfd] p-4"
            >
              <p className="font-bold text-brand-navy">{item.activityName}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-white px-3 py-2">
                  <p className="text-brand-navy/45">Confirmed</p>
                  <p className="text-lg font-bold text-brand-navy">
                    {item.confirmedGuests}
                  </p>
                </div>
                <div className="rounded-xl bg-white px-3 py-2">
                  <p className="text-brand-navy/45">Pending</p>
                  <p className="text-lg font-bold text-brand-navy">
                    {item.pendingGuests}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-[#f7fbfd] px-4 py-3 text-sm text-brand-navy/60">
          No confirmed or pending activity demand for this day.
        </p>
      )}
    </section>
  );
}
