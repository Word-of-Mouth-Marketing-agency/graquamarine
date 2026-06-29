import type { ReservationStatus } from "@/components/admin/reservations/types";
import { statusMeta } from "@/components/admin/reservations/utils";

type StatusBadgeProps = {
  status: ReservationStatus;
  className?: string;
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const meta = statusMeta[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ${meta.badgeClass} ${className}`}
    >
      {meta.label}
    </span>
  );
}
