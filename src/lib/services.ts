import defaultServices from "@/data/default-services.json";
import { activities } from "@/lib/activities";
import { prisma } from "@/lib/prisma";
import type { Activity, ServiceCardData } from "@/types";

type PublicServiceData = Omit<ServiceCardData, "id"> & { id?: string };
type ServiceUpdateData = Pick<
  ServiceCardData,
  "name" | "description" | "price" | "imageUrl" | "highlights" | "isActive"
>;

type DatabaseService = ServiceCardData & {
  createdAt?: Date;
  updatedAt?: Date;
};

const activityBySlug = new Map(activities.map((activity) => [activity.slug, activity]));

export const fallbackServices: PublicServiceData[] = defaultServices.map(
  (service, index) => ({
    slug: service.slug,
    name: service.name,
    description: service.description,
    price: service.price,
    imageUrl: service.imageUrl,
    highlights: service.highlights,
    sortOrder: index,
    isActive: true,
  })
);

function toServiceCardData(service: DatabaseService): ServiceCardData {
  return {
    id: service.id,
    slug: service.slug,
    name: service.name,
    description: service.description,
    price: service.price,
    imageUrl: service.imageUrl,
    highlights: service.highlights,
    sortOrder: service.sortOrder,
    isActive: service.isActive,
  };
}

function serviceToActivity(service: PublicServiceData): Activity | null {
  const fallbackActivity = activityBySlug.get(service.slug);
  if (!fallbackActivity) return null;

  return {
    ...fallbackActivity,
    name: service.name,
    basePriceUsd: service.price,
    shortDescription: service.description,
    detailedDescription: service.description,
    summary: service.description,
    highlights:
      service.highlights.length > 0
        ? service.highlights
        : fallbackActivity.highlights,
    image: service.imageUrl,
    isActive: service.isActive,
  };
}

function isActivity(activity: Activity | null): activity is Activity {
  return activity !== null;
}

export async function ensureDefaultServices(): Promise<void> {
  for (const [index, service] of defaultServices.entries()) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        slug: service.slug,
        name: service.name,
        description: service.description,
        price: service.price,
        imageUrl: service.imageUrl,
        highlights: service.highlights,
        sortOrder: index,
        isActive: true,
      },
    });
  }
}

export async function getPublicServices(): Promise<PublicServiceData[]> {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    if (services.length === 0) {
      return fallbackServices;
    }

    return services.map(toServiceCardData);
  } catch {
    return fallbackServices;
  }
}

export async function getPublicActivities(): Promise<Activity[]> {
  const services = await getPublicServices();
  return services.map(serviceToActivity).filter(isActivity);
}

export async function getAdminServices(): Promise<ServiceCardData[]> {
  await ensureDefaultServices();

  const services = await prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return services.map(toServiceCardData);
}

export function parseServiceUpdatePayload(payload: unknown):
  | { data: ServiceUpdateData; error?: never }
  | { data?: never; error: string } {
  if (!payload || typeof payload !== "object") {
    return { error: "Request body is required." };
  }

  const record = payload as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const description =
    typeof record.description === "string" ? record.description.trim() : "";
  const imageUrl =
    typeof record.imageUrl === "string" ? record.imageUrl.trim() : "";
  const price = Number(record.price);
  const rawHighlights = Array.isArray(record.highlights)
    ? record.highlights
    : [];
  const highlights = rawHighlights
    .filter((highlight): highlight is string => typeof highlight === "string")
    .map((highlight) => highlight.trim())
    .filter(Boolean);
  const isActive =
    typeof record.isActive === "boolean" ? record.isActive : true;
  const errors: string[] = [];

  if (!name) errors.push("Service name is required.");
  if (!description) errors.push("Description is required.");
  if (!imageUrl) {
    errors.push("Choose an image for this service.");
  } else if (!imageUrl.startsWith("/") && !/^https?:\/\//i.test(imageUrl)) {
    errors.push("Choose a valid image for this service.");
  }

  if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(price)) {
    errors.push("Price must be a positive whole number.");
  }

  if (name.length > 120) errors.push("Service name is too long.");
  if (description.length > 500) errors.push("Description is too long.");
  if (imageUrl.length > 1000) errors.push("Image value is too long.");
  if (highlights.length === 0) {
    errors.push("Add at least one checklist point.");
  }
  if (highlights.length > 8) {
    errors.push("Use 8 checklist points or fewer.");
  }
  if (highlights.some((highlight) => highlight.length > 120)) {
    errors.push("Checklist points must be 120 characters or shorter.");
  }

  if (errors.length > 0) {
    return { error: errors.join(" ") };
  }

  return {
    data: {
      name,
      description,
      imageUrl,
      price,
      highlights,
      isActive,
    },
  };
}

export async function updateService(
  id: string,
  data: ServiceUpdateData
): Promise<ServiceCardData> {
  const updated = await prisma.service.update({
    where: { id },
    data,
  });

  return toServiceCardData(updated);
}
