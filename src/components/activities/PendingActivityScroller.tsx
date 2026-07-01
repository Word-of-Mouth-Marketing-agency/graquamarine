"use client";

import { useEffect } from "react";
import { STORAGE_KEY } from "@/components/activities/ActivityReserveLink";

export function PendingActivityScroller() {
  useEffect(() => {
    let selectedSlug: string | null = null;

    try {
      selectedSlug = window.sessionStorage.getItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      selectedSlug = null;
    }

    if (!selectedSlug) return;

    const scrollToActivity = () => {
      const element = document.getElementById(selectedSlug);

      if (!element) return;

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    // Wait for the page layout to finish before scrolling.
    window.requestAnimationFrame(() => {
      window.setTimeout(scrollToActivity, 100);
    });
  }, []);

  return null;
}
