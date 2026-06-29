export const RESERVATION_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export type ActivityItem = {
  activityId: string;
  activityNameSnapshot: string;
  unitPriceAtBooking: number;
  guestCount: number;
  lineTotal: number;
  pricingMode: string;
};

export type ReservationRecord = {
  id: string;
  activity: string;
  activities: string;
  preferredDate: string;
  fullName: string;
  phone: string;
  guests: number;
  message: string | null;
  totalPrice: number;
  adminNote: string | null;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
};

export type StatusFilter = "ALL" | ReservationStatus;
export type SortKey =
  | "NEWEST"
  | "OLDEST"
  | "PREFERRED_DATE"
  | "HIGHEST_TOTAL";

export type ReservationFilters = {
  search: string;
  status: StatusFilter;
  sort: SortKey;
};

export const defaultReservationFilters: ReservationFilters = {
  search: "",
  status: "ALL",
  sort: "NEWEST",
};
