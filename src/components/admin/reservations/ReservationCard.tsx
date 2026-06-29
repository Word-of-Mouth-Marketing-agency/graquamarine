import type { ReservationRecord } from "@/components/admin/reservations/types";
import { StatusBadge } from "@/components/admin/reservations/StatusBadge";
import {
  formatDate,
  formatMoney,
  getReservationTotal,
  statusMeta,
  summarizeActivities,
} from "@/components/admin/reservations/utils";

type ReservationCardProps = {
  reservation: ReservationRecord;
  isUpdating: boolean;
  onViewDetails: (reservation: ReservationRecord) => void;
};

export function ReservationCard({
  reservation,
  isUpdating,
  onViewDetails,
}: ReservationCardProps) {
  const meta = statusMeta[reservation.status];
  const reservationTotal = getReservationTotal(reservation);

  return (
    <article
      className={`rounded-2xl border border-brand-aqua/15 border-l-4 ${meta.accentClass} bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={reservation.status} />
            {isUpdating && (
              <span className="text-xs font-semibold text-brand-navy/45">
                Updating...
              </span>
            )}
          </div>
          <h2 className="mt-3 truncate text-2xl font-bold text-brand-navy">
            {reservation.fullName}
          </h2>
          <p className="mt-1 line-clamp-1 text-sm font-semibold text-brand-aqua">
            {summarizeActivities(reservation)}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:w-[520px]">
          <div className="rounded-2xl bg-[#f7fbfd] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-navy/40">
              Date
            </p>
            <p className="mt-1 font-semibold text-brand-navy">
              {formatDate(reservation.preferredDate)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#f7fbfd] px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-navy/40">
              Guests
            </p>
            <p className="mt-1 font-semibold text-brand-navy">
              {reservation.guests}
            </p>
          </div>
          <div className="rounded-2xl bg-brand-aqua/10 px-4 py-3 sm:text-right">
            <p className="text-xs font-bold uppercase tracking-wide text-brand-navy/45">
              Value
            </p>
            <p className="mt-1 text-xl font-bold text-brand-navy">
              {formatMoney(reservationTotal)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 justify-end">
          <button
            type="button"
            onClick={() => onViewDetails(reservation)}
            className="h-11 rounded-full bg-brand-navy px-5 text-sm font-semibold text-white transition hover:bg-brand-aqua"
          >
            View details
          </button>
        </div>
      </div>
    </article>
  );
}
