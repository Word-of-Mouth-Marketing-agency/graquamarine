"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HeroSlideData } from "@/types";

const INTERVAL_MS = 4000;

type HeroSlideshowProps = {
  slides: HeroSlideData[];
};

export function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 -z-10">
      {slides.map((slide, i) => (
        <Image
          key={slide.id}
          src={slide.imageUrl}
          alt={slide.alt}
          fill
          priority={i === 0}
          className={`object-cover object-center transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          sizes="100vw"
        />
      ))}
      <div className="absolute inset-0 bg-brand-navy/40" />
    </div>
  );
}
