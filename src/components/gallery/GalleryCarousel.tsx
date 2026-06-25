"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [disableTransition, setDisableTransition] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const visibleCountRef = useRef(1);

  const measure = useCallback(() => {
    if (!viewportRef.current || !trackRef.current) return;
    const firstSlide = trackRef.current.firstElementChild as HTMLElement | null;
    if (!firstSlide) return;
    const sw = firstSlide.offsetWidth;
    const gap = 16;
    const vw = viewportRef.current.clientWidth;
    const count = Math.max(1, Math.floor((vw + gap) / (sw + gap)));
    setSlideWidth(sw);
    if (count !== visibleCountRef.current) {
      visibleCountRef.current = count;
      setVisibleCount(count);
      setDisableTransition(true);
      setCurrentIndex(count);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setDisableTransition(false);
        });
      });
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const startIndex = visibleCount;
  const realCount = galleryImages.length;
  const appendTrigger = startIndex + realCount;

  const extendedImages = useMemo(() => {
    const prepend = galleryImages.slice(-visibleCount);
    const append = galleryImages.slice(0, visibleCount);
    return [...prepend, ...galleryImages, ...append];
  }, [visibleCount]);

  const extendedMaxIndex = Math.max(0, extendedImages.length - visibleCount);

  const goNext = useCallback(() => {
    setCurrentIndex((c) => Math.min(c + 1, extendedMaxIndex));
  }, [extendedMaxIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((c) => Math.max(c - 1, 0));
  }, []);

  useEffect(() => {
    if (currentIndex >= appendTrigger) {
      const snapTo = currentIndex - realCount;
      const timer = setTimeout(() => {
        setDisableTransition(true);
        requestAnimationFrame(() => {
          setCurrentIndex(snapTo);
          requestAnimationFrame(() => {
            setDisableTransition(false);
          });
        });
      }, 500);
      return () => clearTimeout(timer);
    }
    if (currentIndex < startIndex) {
      const snapTo = currentIndex + realCount;
      const timer = setTimeout(() => {
        setDisableTransition(true);
        requestAnimationFrame(() => {
          setCurrentIndex(snapTo);
          requestAnimationFrame(() => {
            setDisableTransition(false);
          });
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, startIndex, appendTrigger, realCount]);

  useEffect(() => {
    const id = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [goNext]);

  const translateX = currentIndex * (slideWidth + 16);

  const firstVisibleImageIndex = (currentIndex - startIndex + realCount) % realCount;

  return (
    <div className="mx-auto mt-8 max-w-5xl">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={goPrev}
          type="button"
          aria-label="Previous gallery images"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-aqua text-white shadow-lg transition hover:scale-105 hover:bg-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-aqua active:scale-95 sm:h-12 sm:w-12"
        >
          <FaChevronLeft aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <div
          ref={viewportRef}
          className="min-w-0 flex-1 overflow-hidden rounded-xl p-1"
        >
          <div
            ref={trackRef}
            className={`flex gap-4 ${disableTransition ? "" : "transition-transform duration-500 ease-in-out"}`}
            style={{
              transform:
                translateX > 0
                  ? `translateX(-${translateX}px)`
                  : undefined,
            }}
          >
            {extendedImages.map((img, i) => (
              <div
                key={`slide-${i}`}
                className="relative h-72 w-full shrink-0 overflow-hidden rounded-xl shadow-md sm:h-80 sm:w-1/2 lg:h-96 lg:w-1/3"
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
        </div>

        <button
          onClick={goNext}
          type="button"
          aria-label="Next gallery images"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-aqua text-white shadow-lg transition hover:scale-105 hover:bg-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-aqua active:scale-95 sm:h-12 sm:w-12"
        >
          <FaChevronRight aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>

      {realCount > 0 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: realCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to gallery group ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                i === firstVisibleImageIndex
                  ? "bg-brand-aqua"
                  : "bg-brand-navy/20 hover:bg-brand-navy/40"
              }`}
              onClick={() => {
                setDisableTransition(true);
                setCurrentIndex(i + startIndex);
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    setDisableTransition(false);
                  });
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
