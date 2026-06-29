"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import type { AdminIdentity, HeroSlideData } from "@/types";

type HeroSlidesManagerProps = {
  initialSlides: HeroSlideData[];
  admin: AdminIdentity;
  initialError?: string;
};

function HeroPreview({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === src;

  if (!src || failed) {
    return (
      <div className="flex h-full min-h-44 w-full items-center justify-center rounded-lg border border-dashed border-brand-aqua/30 bg-brand-aqua/5 text-center text-xs font-semibold uppercase tracking-wide text-brand-navy/45">
        Hero image
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailedSrc(src)}
      className="h-full w-full rounded-lg object-cover object-center"
    />
  );
}

export function HeroSlidesManager({
  initialSlides,
  admin,
  initialError = "",
}: HeroSlidesManagerProps) {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlideData[]>(initialSlides);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState(initialError);
  const [success, setSuccess] = useState("");

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/hero-slides");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not load hero images.");
      }

      setSlides(data.slides);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Could not load hero images."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/hero-slides", {
        method: "POST",
        body: formData,
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not upload hero image.");
        return;
      }

      setSlides((current) => [...current, data.slide]);
      setSuccess("Hero image uploaded.");
    } catch {
      setError("Could not upload hero image.");
    } finally {
      setUploading(false);
    }
  }

  async function saveOrder(nextSlides: HeroSlideData[]) {
    setSlides(nextSlides);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/hero-slides/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: nextSlides.map((slide) => slide.id) }),
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not update image order.");
        await fetchSlides();
        return;
      }

      setSlides(data.slides);
      setSuccess("Hero image order updated.");
    } catch {
      setError("Could not update image order.");
      await fetchSlides();
    }
  }

  function moveSlide(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= slides.length) return;

    const nextSlides = [...slides];
    const currentSlide = nextSlides[index];
    nextSlides[index] = nextSlides[nextIndex];
    nextSlides[nextIndex] = currentSlide;
    void saveOrder(nextSlides);
  }

  async function removeSlide(slide: HeroSlideData) {
    if (slides.length <= 1) {
      setError("Keep at least one hero image.");
      return;
    }

    setUpdatingId(slide.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/hero-slides/${slide.id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Could not remove hero image.");
        return;
      }

      setSlides(data.slides);
      setSuccess("Hero image removed.");
    } catch {
      setError("Could not remove hero image.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminShell
      title="Hero Images"
      subtitle="Upload and reorder the images that rotate in the homepage hero."
      admin={admin}
      countLabel={`${slides.length} image${slides.length !== 1 ? "s" : ""}`}
      actions={
        <button
          type="button"
          onClick={fetchSlides}
          disabled={loading}
          className="rounded-full border border-brand-aqua/30 px-4 py-2 text-sm font-medium text-brand-aqua transition hover:bg-brand-aqua hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      }
    >
      <div className="mb-5 rounded-xl border border-brand-aqua/15 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">
              Add a hero image
            </h2>
            <p className="mt-1 text-sm leading-6 text-brand-navy/60">
              Choose a wide, high-quality photo. JPG, PNG, WebP, and GIF images up to 8 MB are supported.
            </p>
          </div>
          <div>
            <input
              id="heroImageUpload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={uploadImage}
              disabled={uploading}
            />
            <label
              htmlFor="heroImageUpload"
              className={`inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-semibold transition sm:w-auto ${
                uploading
                  ? "cursor-not-allowed bg-brand-navy/10 text-brand-navy/35"
                  : "cursor-pointer bg-brand-aqua text-white hover:bg-brand-navy"
              }`}
            >
              {uploading ? "Uploading..." : "Upload image"}
            </label>
          </div>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </p>
      )}

      {slides.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-aqua/25 bg-white py-16 text-center">
          <p className="font-semibold text-brand-navy">No hero images found.</p>
          <p className="mt-1 text-sm text-brand-navy/55">
            Upload one image to start the slideshow.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {slides.map((slide, index) => (
            <article
              key={slide.id}
              className="overflow-hidden rounded-xl border border-brand-aqua/15 bg-white shadow-sm"
            >
              <div className="aspect-[16/9] bg-brand-navy/5">
                <HeroPreview src={slide.imageUrl} alt={slide.alt} />
              </div>
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-aqua">
                    Slide {index + 1}
                  </p>
                  <p className="mt-1 text-sm text-brand-navy/55">
                    Display position {index + 1}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => moveSlide(index, -1)}
                    disabled={index === 0 || loading || uploading}
                    className="rounded-full border border-brand-navy/15 px-3 py-2 text-xs font-semibold text-brand-navy/65 transition hover:bg-brand-navy/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSlide(index, 1)}
                    disabled={index === slides.length - 1 || loading || uploading}
                    className="rounded-full border border-brand-navy/15 px-3 py-2 text-xs font-semibold text-brand-navy/65 transition hover:bg-brand-navy/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Move down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSlide(slide)}
                    disabled={updatingId === slide.id || slides.length <= 1}
                    className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
