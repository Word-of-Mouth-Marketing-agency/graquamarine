"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type ActivityReserveLinkProps = {
  slug: string;
  children: ReactNode;
  className?: string;
};

const STORAGE_KEY = "graquamarine:selectedActivitySlug";

export function ActivityReserveLink({
  slug,
  children,
  className,
}: ActivityReserveLinkProps) {
  const handleClick = () => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, slug);
    } catch {
      // Ignore storage errors safely.
    }
  };

  return (
    <Link href="/activities" onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}

export { STORAGE_KEY };
