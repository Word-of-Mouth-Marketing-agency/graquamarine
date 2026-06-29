"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import type { AdminIdentity, ServiceCardData } from "@/types";

type ServicesManagerProps = {
  initialServices: ServiceCardData[];
  admin: AdminIdentity;
  initialError?: string;
};

type ServiceFormValues = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  highlights: string[];
  isActive: boolean;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-brand-navy/15 bg-white px-3 py-2.5 text-sm text-brand-navy placeholder:text-brand-navy/35 transition focus:border-brand-aqua focus:ring-2 focus:ring-brand-aqua/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-brand-navy/[0.03] disabled:text-brand-navy/40";

const labelClass = "block text-sm font-semibold text-brand-navy";
const MAX_HIGHLIGHTS = 8;

function serviceToForm(service: ServiceCardData): ServiceFormValues {
  return {
    name: service.name,
    description: service.description,
    price: String(service.price),
    imageUrl: service.imageUrl,
    highlights: service.highlights.length > 0 ? service.highlights : [""],
    isActive: service.isActive,
  };
}

function cleanHighlights(highlights: string[]): string[] {
  return highlights.map((highlight) => highlight.trim()).filter(Boolean);
}

function validateForm(values: ServiceFormValues): string | null {
  const price = Number(values.price);
  const highlights = cleanHighlights(values.highlights);

  if (!values.name.trim()) return "Service name is required.";
  if (!values.description.trim()) return "Description is required.";
  if (!values.imageUrl.trim()) return "Choose an image for this service.";
  if (highlights.length === 0) return "Add at least one checklist point.";
  if (highlights.length > MAX_HIGHLIGHTS) {
    return `Use ${MAX_HIGHLIGHTS} checklist points or fewer.`;
  }
  if (highlights.some((highlight) => highlight.length > 120)) {
    return "Checklist points must be shorter.";
  }
  if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(price)) {
    return "Price must be a positive whole number.";
  }

  return null;
}

function ServiceImagePreview({
  src,
  alt,
  compact = false,
}: {
  src: string;
  alt: string;
  compact?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = failedSrc === src;

  if (!src || failed) {
    return (
      <div
        className={`flex h-full min-h-36 w-full items-center justify-center rounded-lg border border-dashed border-brand-aqua/30 bg-brand-aqua/5 text-center text-xs font-semibold uppercase tracking-wide text-brand-navy/45 ${
          compact ? "min-h-28" : ""
        }`}
      >
        Image preview
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailedSrc(src)}
      className="h-full min-h-36 w-full rounded-lg object-cover object-center"
    />
  );
}

function ServiceEditorCard({
  service,
  onEdit,
}: {
  service: ServiceCardData;
  onEdit: (service: ServiceCardData) => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-brand-aqua/15 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-aqua/35 hover:shadow-xl">
      <div className="h-44 overflow-hidden bg-brand-navy/5">
        <ServiceImagePreview src={service.imageUrl} alt={service.name} compact />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-brand-navy">{service.name}</h2>
          <span className="shrink-0 rounded-full bg-brand-aqua/10 px-3 py-1 text-sm font-bold text-brand-aqua">
            ${service.price}
          </span>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-navy/65">
          {service.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-navy/35">
            #{service.sortOrder + 1}
          </p>
          <button
            type="button"
            onClick={() => onEdit(service)}
            className="rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-aqua focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-aqua focus-visible:ring-offset-2"
          >
            Edit
          </button>
        </div>
      </div>
    </article>
  );
}

function ServiceEditModal({
  service,
  saving,
  onClose,
  onSave,
}: {
  service: ServiceCardData;
  saving: boolean;
  onClose: () => void;
  onSave: (service: ServiceCardData, values: ServiceFormValues) => Promise<string | null>;
}) {
  const [values, setValues] = useState<ServiceFormValues>(() =>
    serviceToForm(service)
  );
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  function updateValue(field: keyof ServiceFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function updateBooleanValue(field: "isActive", value: boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function updateHighlight(index: number, value: string) {
    setValues((current) => ({
      ...current,
      highlights: current.highlights.map((highlight, highlightIndex) =>
        highlightIndex === index ? value : highlight
      ),
    }));
    setError("");
  }

  function addHighlight() {
    setValues((current) => {
      if (current.highlights.length >= MAX_HIGHLIGHTS) return current;
      return { ...current, highlights: [...current.highlights, ""] };
    });
    setError("");
  }

  function removeHighlight(index: number) {
    setValues((current) => {
      const nextHighlights = current.highlights.filter(
        (_highlight, highlightIndex) => highlightIndex !== index
      );
      return {
        ...current,
        highlights: nextHighlights.length > 0 ? nextHighlights : [""],
      };
    });
    setError("");
  }

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    setUploadingImage(true);
    setError("");

    try {
      const response = await fetch("/api/admin/services/images", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not upload image.");
        return;
      }

      updateValue("imageUrl", data.imageUrl);
    } catch {
      setError("Could not upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploadingImage) {
      setError("Wait for the image to finish uploading.");
      return;
    }

    const validationError = validateForm(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    const saveError = await onSave(service, values);
    if (saveError) {
      setError(saveError);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-brand-navy/55 px-4 py-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-edit-title"
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="border-b border-brand-aqua/15 bg-brand-navy px-5 py-5 text-white sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-aqua">
            Editing service card
          </p>
          <h2 id="service-edit-title" className="mt-1 text-2xl font-bold">
            {service.name}
          </h2>
        </div>

        <div className="grid gap-6 px-5 pb-8 pt-6 sm:grid-cols-[0.9fr_1.1fr] sm:px-6 sm:pb-10">
          <div className="space-y-4">
            <div className="h-72 overflow-hidden rounded-lg bg-brand-navy/5 sm:h-80">
              <ServiceImagePreview
                src={values.imageUrl}
                alt={values.name || service.name}
              />
            </div>
            <p className="text-xs leading-5 text-brand-navy/50">
              Choose a clear photo from the computer. JPG, PNG, WebP, and GIF images up to 5 MB are supported.
            </p>
            <div>
              <input
                id="serviceImageUpload"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handleImageChange}
                disabled={saving || uploadingImage}
              />
              <label
                htmlFor="serviceImageUpload"
                className={`inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition ${
                  saving || uploadingImage
                    ? "cursor-not-allowed bg-brand-navy/10 text-brand-navy/35"
                    : "cursor-pointer bg-brand-aqua text-white hover:bg-brand-navy"
                }`}
              >
                {uploadingImage ? "Uploading image..." : "Choose image"}
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-brand-navy/[0.03] p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-brand-navy">
                    Available on website
                  </p>
                  <p className="mt-1 text-xs leading-5 text-brand-navy/50">
                    Turn this off when the service is not available.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateBooleanValue("isActive", !values.isActive)}
                  disabled={saving}
                  className={`relative h-8 w-14 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    values.isActive ? "bg-brand-aqua" : "bg-brand-navy/20"
                  }`}
                  aria-pressed={values.isActive}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition ${
                      values.isActive ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="serviceName">
                Service name
              </label>
              <input
                id="serviceName"
                value={values.name}
                onChange={(event) => updateValue("name", event.target.value)}
                className={inputClass}
                maxLength={120}
                disabled={saving}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <label className={labelClass} htmlFor="serviceHighlight0">
                  Checklist points
                </label>
                <button
                  type="button"
                  onClick={addHighlight}
                  disabled={saving || values.highlights.length >= MAX_HIGHLIGHTS}
                  className="rounded-full border border-brand-aqua/30 px-3 py-1 text-xs font-semibold text-brand-aqua transition hover:bg-brand-aqua hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add point
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {values.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      id={index === 0 ? "serviceHighlight0" : undefined}
                      value={highlight}
                      onChange={(event) =>
                        updateHighlight(index, event.target.value)
                      }
                      className={inputClass}
                      maxLength={120}
                      disabled={saving}
                      placeholder={`Point ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      disabled={saving}
                      className="mt-1 h-[42px] rounded-full border border-brand-navy/15 px-3 text-xs font-semibold text-brand-navy/55 transition hover:bg-brand-navy/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="serviceDescription">
                Description
              </label>
              <textarea
                id="serviceDescription"
                value={values.description}
                onChange={(event) =>
                  updateValue("description", event.target.value)
                }
                className={inputClass}
                rows={5}
                maxLength={500}
                disabled={saving}
                required
              />
            </div>

            <div>
              <div>
                <label className={labelClass} htmlFor="servicePrice">
                  Price
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-navy/45">
                    $
                  </span>
                  <input
                    id="servicePrice"
                    type="number"
                    min="1"
                    step="1"
                    value={values.price}
                    onChange={(event) => updateValue("price", event.target.value)}
                    className={`${inputClass} pl-7`}
                    disabled={saving}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 px-5 pb-6 pt-1 sm:flex-row sm:justify-end sm:px-6 sm:pb-7">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex h-11 items-center justify-center rounded-full border border-brand-navy/15 px-5 text-sm font-semibold text-brand-navy/65 transition hover:bg-brand-navy/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand-aqua px-5 text-sm font-semibold text-white transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ServicesManager({
  initialServices,
  admin,
  initialError = "",
}: ServicesManagerProps) {
  const router = useRouter();
  const [services, setServices] = useState<ServiceCardData[]>(initialServices);
  const [editingService, setEditingService] = useState<ServiceCardData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState(initialError);
  const [success, setSuccess] = useState("");

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/services");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not load services.");
      }
      setServices(data.services);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Could not load services."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  async function saveService(
    service: ServiceCardData,
    values: ServiceFormValues
  ): Promise<string | null> {
    const validationError = validateForm(values);
    if (validationError) return validationError;

    setSavingId(service.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          description: values.description.trim(),
          price: Number(values.price),
          imageUrl: values.imageUrl.trim(),
          highlights: cleanHighlights(values.highlights),
          isActive: values.isActive,
        }),
      });

      if (response.status === 401) {
        router.push("/admin/login");
        return "Please sign in again.";
      }

      const data = await response.json();
      if (!response.ok) {
        return data.error || "Could not save service.";
      }

      setServices((current) =>
        current.map((item) =>
          item.id === service.id ? data.service : item
        )
      );
      setEditingService(null);
      setSuccess(`${data.service.name} was updated.`);
      return null;
    } catch {
      return "Network error. Please try again.";
    } finally {
      setSavingId(null);
    }
  }

  return (
    <AdminShell
      title="Services"
      subtitle="Edit the service cards shown on the public website. Changes appear after saving."
      admin={admin}
      countLabel={`${services.length} service${services.length !== 1 ? "s" : ""}`}
      actions={
        <button
          type="button"
          onClick={fetchServices}
          disabled={loading}
          className="rounded-full border border-brand-aqua/30 px-4 py-2 text-sm font-medium text-brand-aqua transition hover:bg-brand-aqua hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      }
    >
      <div className="mb-5 rounded-xl border border-brand-aqua/15 bg-white px-5 py-4 text-sm text-brand-navy/65 shadow-sm">
        Keep the slug/order stable for the public website. Edit the visible name,
        short description, checklist points, price, image, and availability for each card.
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

      {loading && services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-aqua/25 bg-white py-16 text-center text-brand-navy/55">
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-aqua/25 bg-white py-16 text-center">
          <p className="font-semibold text-brand-navy">No services found.</p>
          <p className="mt-1 text-sm text-brand-navy/55">
            Refresh to seed the default Graquamarine service cards.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceEditorCard
              key={service.id}
              service={service}
              onEdit={setEditingService}
            />
          ))}
        </div>
      )}

      {editingService && (
        <ServiceEditModal
          service={editingService}
          saving={savingId === editingService.id}
          onClose={() => setEditingService(null)}
          onSave={saveService}
        />
      )}
    </AdminShell>
  );
}
