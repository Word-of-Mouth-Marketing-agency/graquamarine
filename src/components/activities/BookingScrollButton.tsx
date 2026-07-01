"use client";

import type { ReactNode } from "react";

type BookingScrollButtonProps = {
  children?: ReactNode;
  className?: string;
};

export function BookingScrollButton({
  children = "Booking",
  className,
}: BookingScrollButtonProps) {
  const handleClick = () => {
    const reservationSection = document.getElementById("reservation");

    if (!reservationSection) return;

    reservationSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
