"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const galleryImages = [
  { src: "/images/gallery/gallery1.jpg", alt: "Graquamarine Red Sea gallery image 1" },
  { src: "/images/gallery/gallery2.jpg", alt: "Graquamarine Red Sea gallery image 2" },
  { src: "/images/gallery/gallery3.jpg", alt: "Graquamarine Red Sea gallery image 3" },
  { src: "/images/gallery/gallery4.jpg", alt: "Graquamarine Red Sea gallery image 4" },
  { src: "/images/gallery/gallery5.jpg", alt: "Graquamarine Red Sea gallery image 5" },
];

const AUTOPLAY_MS = 4000;

export function GalleryCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? galleryImages.length - 1 : c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % galleryImages.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [next]);

  return (
    <div className="relative mx-auto mt-10 max-w-4xl">
      <div className="relative h-[320px] overflow-hidden rounded-xl shadow-md sm:h-[400px]">
        {galleryImages.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            className={`object-cover object-center transition-opacity duration-700 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        ))}
      </div>

      <button
        onClick={prev}
        aria-label="Previous gallery image"
        className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brand-navy shadow-md transition hover:bg-white hover:text-brand-aqua focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-aqua sm:left-4"
      >
        <FaChevronLeft aria-hidden="true" className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next gallery image"
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-brand-navy shadow-md transition hover:bg-white hover:text-brand-aqua focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-aqua sm:right-4"
      >
        <FaChevronRight aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
}
