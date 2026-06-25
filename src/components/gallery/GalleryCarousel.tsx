"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollPrev = useCallback(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: "smooth" });
  }, []);

  const scrollNext = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (container.scrollLeft + container.clientWidth >= maxScroll - 1) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft + container.clientWidth >= maxScroll - 1) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto mt-10 max-w-5xl">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden scroll-smooth"
      >
        {galleryImages.map((img) => (
          <div
            key={img.src}
            className="relative h-64 w-full shrink-0 overflow-hidden rounded-xl shadow-md sm:w-1/2 lg:w-1/3"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Previous gallery images"
        className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-md transition hover:bg-brand-aqua hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-aqua sm:left-4"
      >
        <FaChevronLeft aria-hidden="true" className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next gallery images"
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-md transition hover:bg-brand-aqua hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-aqua sm:right-4"
      >
        <FaChevronRight aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
}
