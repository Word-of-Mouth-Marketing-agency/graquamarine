import type { Activity } from "@/types";
import defaultServices from "@/data/default-services.json";

type DefaultService = (typeof defaultServices)[number];

const defaultServiceBySlug = new Map(
  defaultServices.map((service) => [service.slug, service])
);

function getDefaultService(slug: string): DefaultService {
  const service = defaultServiceBySlug.get(slug);
  if (!service) {
    throw new Error(`Missing default service data for ${slug}.`);
  }
  return service;
}

const introDiving = getDefaultService("intro-diving");
const professionalDiving = getDefaultService("professional-diving");
const snorkeling = getDefaultService("snorkeling");
const paradiseIsland = getDefaultService("paradise-island");
const openWaterDiverCourse = getDefaultService("open-water-diver-course");
const advancedOpenWaterDiverCourse = getDefaultService(
  "advanced-open-water-diver-course"
);
const privateBoat = getDefaultService("private-boat");
const orangeBay = getDefaultService("orange-bay");

export const activities: Activity[] = [
  {
    slug: introDiving.slug,
    name: introDiving.name,
    basePriceUsd: introDiving.price,
    pricingMode: "perPerson",
    shortDescription: "Your first breath underwater",
    detailedDescription:
      "A safe and exciting introduction to scuba diving in the Red Sea. No prior experience required — our team guides you step by step from the briefing to your first underwater moments. Perfect for beginners who want to try diving in shallow, clear water with full instructor support.",
    summary: introDiving.description,
    category: "Diving",
    highlights: introDiving.highlights,
    image: introDiving.imageUrl,
    isActive: true,
  },
  {
    slug: professionalDiving.slug,
    name: professionalDiving.name,
    basePriceUsd: professionalDiving.price,
    pricingMode: "perPerson",
    shortDescription: "Guided dives for certified divers",
    detailedDescription:
      "Explore the best dive sites Hurghada has to offer with an experienced guide. Designed for certified divers who want to experience the Red Sea's vibrant reefs, walls, and marine life. Each trip is planned around conditions and guest experience level.",
    summary: professionalDiving.description,
    category: "Diving",
    highlights: professionalDiving.highlights,
    image: professionalDiving.imageUrl,
    isActive: true,
  },
  {
    slug: snorkeling.slug,
    name: snorkeling.name,
    basePriceUsd: snorkeling.price,
    pricingMode: "perPerson",
    shortDescription: "Easy Red Sea snorkeling day",
    detailedDescription:
      "A relaxed snorkeling trip built for families, couples, and groups who want to enjoy the Red Sea from the surface. Visit shallow reefs with clear visibility, swim alongside colorful fish, and enjoy a full day on the water with snacks and support.",
    summary: snorkeling.description,
    category: "Snorkeling",
    highlights: snorkeling.highlights,
    image: snorkeling.imageUrl,
    isActive: true,
  },
  {
    slug: paradiseIsland.slug,
    name: paradiseIsland.name,
    basePriceUsd: paradiseIsland.price,
    pricingMode: "perPerson",
    shortDescription: "Island day with beach and sea",
    detailedDescription:
      "Spend a full day on Paradise Island — a famous Red Sea sand island with crystal-clear water, soft sand, and plenty of space to relax. Includes boat transfer, beach time, snorkeling stops, and lunch. Ideal for families, couples, and groups looking for a classic island escape.",
    summary: paradiseIsland.description,
    category: "Island Trip",
    highlights: paradiseIsland.highlights,
    image: paradiseIsland.imageUrl,
    isActive: true,
  },
  {
    slug: openWaterDiverCourse.slug,
    name: openWaterDiverCourse.name,
    basePriceUsd: openWaterDiverCourse.price,
    pricingMode: "perPerson",
    shortDescription: "Start your diving journey",
    detailedDescription:
      "An entry-level training course that teaches the fundamentals of scuba diving through classroom sessions, confined-water practice, and open-water dives. By the end of the course you will have the skills and confidence to dive independently with a buddy.",
    summary: openWaterDiverCourse.description,
    category: "Course",
    highlights: openWaterDiverCourse.highlights,
    image: openWaterDiverCourse.imageUrl,
    isActive: true,
  },
  {
    slug: advancedOpenWaterDiverCourse.slug,
    name: advancedOpenWaterDiverCourse.name,
    basePriceUsd: advancedOpenWaterDiverCourse.price,
    pricingMode: "perPerson",
    shortDescription: "Build your diving skills",
    detailedDescription:
      "Take your diving to the next level with advanced training that covers deeper dives, underwater navigation, and specialty skills. Designed for certified divers who want to expand their comfort zone and explore more challenging sites.",
    summary: advancedOpenWaterDiverCourse.description,
    category: "Course",
    highlights: advancedOpenWaterDiverCourse.highlights,
    image: advancedOpenWaterDiverCourse.imageUrl,
    isActive: true,
  },
  {
    slug: privateBoat.slug,
    name: privateBoat.name,
    basePriceUsd: privateBoat.price,
    pricingMode: "flat",
    shortDescription: "Your own boat for the day",
    detailedDescription:
      "Reserve a private boat for your group and design your own Red Sea day. Choose your stops — diving, snorkeling, island visits, or simply cruising. Ideal for families, celebrations, and small groups who want privacy and flexibility on the water.",
    summary: privateBoat.description,
    category: "Private Trip",
    highlights: privateBoat.highlights,
    image: privateBoat.imageUrl,
    isActive: true,
  },
  {
    slug: orangeBay.slug,
    name: orangeBay.name,
    basePriceUsd: orangeBay.price,
    pricingMode: "perPerson",
    shortDescription: "Relaxing island-style Red Sea trip",
    detailedDescription:
      "A chilled-out island trip to Orange Bay with its shallow turquoise water, wooden pier, and relaxed beach vibe. Includes boat transfer, beach access, soft drinks, and time to swim, sunbathe, or simply enjoy the view.",
    summary: orangeBay.description,
    category: "Island Trip",
    highlights: orangeBay.highlights,
    image: orangeBay.imageUrl,
    isActive: true,
  },
];
