import {
  RESERVATION_STATUSES,
  type ActivityItem,
  type ReservationFilters,
  type ReservationRecord,
  type ReservationStatus,
} from "@/components/admin/reservations/types";

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;

export const statusMeta: Record<
  ReservationStatus,
  {
    label: string;
    badgeClass: string;
    accentClass: string;
    softClass: string;
  }
> = {
  PENDING: {
    label: "Pending",
    badgeClass: "bg-brand-aqua/10 text-brand-navy ring-brand-aqua/20",
    accentClass: "border-l-brand-aqua",
    softClass: "bg-brand-aqua/10 text-brand-navy ring-brand-aqua/20",
  },
  CONFIRMED: {
    label: "Confirmed",
    badgeClass: "bg-brand-aqua/15 text-brand-navy ring-brand-aqua/30",
    accentClass: "border-l-brand-aqua",
    softClass: "bg-brand-aqua/15 text-brand-navy ring-brand-aqua/30",
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass: "bg-slate-100 text-slate-600 ring-slate-200",
    accentClass: "border-l-brand-aqua",
    softClass: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

export function isReservationStatus(value: unknown): value is ReservationStatus {
  return (
    typeof value === "string" &&
    RESERVATION_STATUSES.includes(value as ReservationStatus)
  );
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function readNullableString(
  record: Record<string, unknown>,
  key: string
): string | null {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : null;
}

function readNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function normalizeReservationRecord(
  value: unknown
): ReservationRecord | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const status = isReservationStatus(record.status) ? record.status : "PENDING";

  return {
    id: readString(record, "id"),
    activity: readString(record, "activity"),
    activities: readString(record, "activities"),
    preferredDate: readString(record, "preferredDate"),
    fullName: readString(record, "fullName"),
    phone: readString(record, "phone"),
    guests: readNumber(record, "guests"),
    message: readNullableString(record, "message"),
    totalPrice: readNumber(record, "totalPrice"),
    adminNote: readNullableString(record, "adminNote"),
    status,
    createdAt: readString(record, "createdAt"),
    updatedAt: readString(record, "updatedAt"),
  };
}

export function normalizeReservationList(value: unknown): ReservationRecord[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(normalizeReservationRecord)
    .filter((record): record is ReservationRecord => Boolean(record?.id));
}

export function parseActivities(
  raw: string | null,
  fallbackGuestCount = 1
): ActivityItem[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item): ActivityItem | null => {
        if (!item || typeof item !== "object") return null;
        const record = item as Record<string, unknown>;
        const activityId =
          typeof record.activity_id === "string"
            ? record.activity_id
            : typeof record.activityId === "string"
              ? record.activityId
              : "";
        const activityNameSnapshot =
          typeof record.activity_name_snapshot === "string"
            ? record.activity_name_snapshot
            : typeof record.activityNameSnapshot === "string"
              ? record.activityNameSnapshot
              : typeof record.name === "string"
                ? record.name
                : "";
        if (!activityNameSnapshot) return null;

        const unitPriceAtBooking = readSnapshotNumber(
          record,
          "unit_price_at_booking",
          "unitPriceAtBooking",
          "price"
        );
        const pricingMode =
          typeof record.pricing_mode === "string"
            ? record.pricing_mode
            : typeof record.pricingMode === "string"
              ? record.pricingMode
              : typeof record.mode === "string"
                ? record.mode
                : "perPerson";
        const hasStoredGuestCount =
          typeof record.guest_count === "number" ||
          typeof record.guestCount === "number";
        const guestCount = hasStoredGuestCount
          ? Math.max(
              1,
              readSnapshotNumber(record, "guest_count", "guestCount")
            )
          : pricingMode === "flat"
            ? 1
            : Math.max(1, fallbackGuestCount);
        const lineTotal = readSnapshotNumber(
          record,
          "line_total",
          "lineTotal"
        );

        return {
          activityId,
          activityNameSnapshot,
          unitPriceAtBooking,
          guestCount,
          lineTotal:
            lineTotal > 0 ? lineTotal : unitPriceAtBooking * guestCount,
          pricingMode,
        };
      })
      .filter((item): item is ActivityItem => Boolean(item));
  } catch {
    return [];
  }
}

function readSnapshotNumber(
  record: Record<string, unknown>,
  ...keys: string[]
): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return 0;
}

export function formatPricingMode(mode: string): string {
  return mode === "flat" ? "flat" : "per guest";
}

export function formatMoney(value: number): string {
  return moneyFormatter.format(value || 0);
}

export function formatDate(value: string | null): string {
  if (!value) return "-";
  const key = getReservationDateKey(value);
  const date = key ? new Date(`${key}T12:00:00`) : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return dateFormatter.format(date);
}

export function toDateKey(value: Date): string {
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
}

export function addDaysToDateKey(value: string, days: number): string {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function getTodayDateKey(): string {
  return toDateKey(new Date());
}

export function getTomorrowDateKey(): string {
  return addDaysToDateKey(getTodayDateKey(), 1);
}

export function getReservationDateKey(value: string | null): string {
  if (!value) return "";
  const match = value.match(ISO_DATE_PATTERN);
  if (match) return match[0];

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return toDateKey(date);
}

export function formatRelativeAge(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days <= 0) return "Created today";
  if (days === 1) return "Created yesterday";
  return `Created ${days} days ago`;
}

export function summarizeActivities(reservation: ReservationRecord): string {
  const items = parseActivities(reservation.activities, reservation.guests);
  if (items.length > 0) {
    return items.map((item) => item.activityNameSnapshot).join(" + ");
  }
  return reservation.activity || "Reservation";
}

export function getReservationTotal(reservation: ReservationRecord): number {
  const items = parseActivities(reservation.activities, reservation.guests);
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return total > 0 ? total : reservation.totalPrice;
}

export function buildWhatsAppUrl(reservation: ReservationRecord): string {
  const phone = reservation.phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (!phone) return "";

  const message = [
    `Hello ${reservation.fullName}, this is Graquamarine.`,
    `We received your reservation request for ${summarizeActivities(
      reservation
    )} on ${formatDate(reservation.preferredDate)}.`,
  ].join(" ");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildReservationSummary(reservation: ReservationRecord): string {
  return [
    `Reservation for ${reservation.fullName}`,
    `Activities: ${summarizeActivities(reservation)}`,
    `Date: ${formatDate(reservation.preferredDate)}`,
    `Guests: ${reservation.guests}`,
    `Phone: ${reservation.phone}`,
    `Total: ${formatMoney(getReservationTotal(reservation))}`,
    `Status: ${statusMeta[reservation.status].label}`,
  ].join("\n");
}

export function matchesSearch(
  reservation: ReservationRecord,
  search: string
): boolean {
  const query = search.trim().toLowerCase();
  if (!query) return true;

  const activities = parseActivities(reservation.activities, reservation.guests)
    .map((item) => item.activityNameSnapshot)
    .join(" ");

  const haystack = [
    reservation.fullName,
    reservation.phone,
    reservation.activity,
    activities,
    reservation.message || "",
    reservation.adminNote || "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function filterReservations(
  reservations: ReservationRecord[],
  filters: ReservationFilters
): ReservationRecord[] {
  return reservations.filter((reservation) => {
    if (!matchesSearch(reservation, filters.search)) return false;

    if (filters.status !== "ALL" && reservation.status !== filters.status) {
      return false;
    }

    return true;
  });
}

export function filterReservationsBySelectedDay(
  reservations: ReservationRecord[],
  selectedDate: string
): ReservationRecord[] {
  return reservations.filter(
    (reservation) =>
      getReservationDateKey(reservation.preferredDate) === selectedDate
  );
}

export function sortReservations(
  reservations: ReservationRecord[],
  sort: ReservationFilters["sort"]
): ReservationRecord[] {
  const next = [...reservations];

  next.sort((a, b) => {
    if (sort === "OLDEST") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    if (sort === "PREFERRED_DATE") {
      return (
        new Date(`${getReservationDateKey(a.preferredDate)}T12:00:00`).getTime() -
        new Date(`${getReservationDateKey(b.preferredDate)}T12:00:00`).getTime()
      );
    }

    if (sort === "HIGHEST_TOTAL") {
      return getReservationTotal(b) - getReservationTotal(a);
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return next;
}

export function hasActiveFilters(filters: ReservationFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.status !== "ALL" ||
    filters.sort !== "NEWEST"
  );
}

export function summarizeActivityDemand(reservations: ReservationRecord[]): Array<{
  activityName: string;
  confirmedGuests: number;
  pendingGuests: number;
}> {
  const demand = new Map<
    string,
    { activityName: string; confirmedGuests: number; pendingGuests: number }
  >();

  for (const reservation of reservations) {
    if (
      reservation.status !== "CONFIRMED" &&
      reservation.status !== "PENDING"
    ) {
      continue;
    }

    for (const item of parseActivities(
      reservation.activities,
      reservation.guests
    )) {
      const current =
        demand.get(item.activityNameSnapshot) ||
        {
          activityName: item.activityNameSnapshot,
          confirmedGuests: 0,
          pendingGuests: 0,
        };

      if (reservation.status === "CONFIRMED") {
        current.confirmedGuests += item.guestCount;
      } else {
        current.pendingGuests += item.guestCount;
      }

      demand.set(item.activityNameSnapshot, current);
    }
  }

  return Array.from(demand.values()).sort((a, b) =>
    a.activityName.localeCompare(b.activityName)
  );
}
