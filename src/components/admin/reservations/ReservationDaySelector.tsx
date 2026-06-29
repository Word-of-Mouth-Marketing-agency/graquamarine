import {
  formatDate,
  getTodayDateKey,
  getTomorrowDateKey,
} from "@/components/admin/reservations/utils";

type ReservationDaySelectorProps = {
  selectedDate: string;
  reservationCount: number;
  onChange: (date: string) => void;
};

export function ReservationDaySelector({
  selectedDate,
  reservationCount,
  onChange,
}: ReservationDaySelectorProps) {
  const today = getTodayDateKey();
  const tomorrow = getTomorrowDateKey();

  const quickDays = [
    { label: "Today", value: today },
    { label: "Tomorrow", value: tomorrow },
  ];

  return (
    <section className="rounded-2xl border border-brand-aqua/15 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-aqua">
            Reservation day
          </p>
          <h2 className="mt-1 text-2xl font-bold text-brand-navy">
            {formatDate(selectedDate)}
          </h2>
          <p className="mt-1 text-sm text-brand-navy/55">
            {reservationCount} reservation{reservationCount !== 1 ? "s" : ""} for
            this day
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex rounded-full bg-brand-navy/5 p-1">
            {quickDays.map((day) => {
              const active = selectedDate === day.value;
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => onChange(day.value)}
                  className={`h-10 rounded-full px-5 text-sm font-bold transition ${
                    active
                      ? "bg-brand-navy text-white shadow-sm"
                      : "text-brand-navy/65 hover:bg-white hover:text-brand-navy"
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>

          <label className="text-sm font-semibold text-brand-navy">
            Pick date
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => onChange(event.target.value)}
              className="mt-1 h-11 rounded-full border border-brand-navy/15 bg-white px-4 text-sm font-semibold text-brand-navy outline-none transition focus:border-brand-aqua focus:ring-4 focus:ring-brand-aqua/10"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
