import {
  RESERVATION_STATUSES,
  type ReservationFilters as ReservationFiltersType,
  type SortKey,
  type StatusFilter,
} from "@/components/admin/reservations/types";
import {
  statusMeta,
  hasActiveFilters,
} from "@/components/admin/reservations/utils";

type ReservationFiltersProps = {
  filters: ReservationFiltersType;
  totalCount: number;
  visibleCount: number;
  onChange: (filters: ReservationFiltersType) => void;
  onClear: () => void;
};

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: "NEWEST", label: "Newest first" },
  { value: "OLDEST", label: "Oldest first" },
  { value: "PREFERRED_DATE", label: "Preferred date soonest" },
  { value: "HIGHEST_TOTAL", label: "Highest total" },
];

export function ReservationFilters({
  filters,
  totalCount,
  visibleCount,
  onChange,
  onClear,
}: ReservationFiltersProps) {
  const active = hasActiveFilters(filters);

  function update(next: Partial<ReservationFiltersType>) {
    onChange({ ...filters, ...next });
  }

  return (
    <section className="rounded-2xl border border-brand-aqua/15 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <label
            className="text-sm font-semibold text-brand-navy"
            htmlFor="reservationSearch"
          >
            Search reservations
          </label>
          <input
            id="reservationSearch"
            type="search"
            value={filters.search}
            onChange={(event) => update({ search: event.target.value })}
            placeholder="Search name, phone, activity, message, or note"
            className="mt-2 h-12 w-full rounded-xl border border-brand-navy/15 px-4 text-sm text-brand-navy outline-none transition placeholder:text-brand-navy/35 focus:border-brand-aqua focus:ring-4 focus:ring-brand-aqua/10"
          />
        </div>

        <div className="lg:w-[260px]">
          <label className="text-sm font-semibold text-brand-navy">
            Sort
            <select
              value={filters.sort}
              onChange={(event) =>
                update({ sort: event.target.value as SortKey })
              }
              className="mt-2 h-12 w-full rounded-xl border border-brand-navy/15 bg-white px-3 text-sm text-brand-navy outline-none transition focus:border-brand-aqua focus:ring-4 focus:ring-brand-aqua/10"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-brand-navy/10 pt-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update({ status: "ALL" })}
            className={`h-10 rounded-full px-4 text-sm font-semibold transition ${
              filters.status === "ALL"
                ? "bg-brand-navy text-white"
                : "bg-brand-navy/5 text-brand-navy/65 hover:bg-brand-navy/10"
            }`}
          >
            All
          </button>
          {RESERVATION_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => update({ status: status as StatusFilter })}
              className={`h-10 rounded-full px-4 text-sm font-semibold ring-1 transition ${
                filters.status === status
                  ? statusMeta[status].badgeClass
                  : "bg-white text-brand-navy/65 ring-brand-navy/10 hover:bg-brand-navy/5"
              }`}
            >
              {statusMeta[status].label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-brand-navy/60">
          <span>
            Showing{" "}
            <strong className="font-bold text-brand-navy">{visibleCount}</strong>{" "}
            of <strong className="font-bold text-brand-navy">{totalCount}</strong>{" "}
            reservations
          </span>
          {active && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-full border border-brand-aqua/30 px-3 py-1.5 text-sm font-semibold text-brand-aqua transition hover:bg-brand-aqua hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
