import { readFile } from "node:fs/promises";
import crypto from "node:crypto";
import { promisify } from "node:util";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const scryptAsync = promisify(crypto.scrypt);
const PASSWORD_KEY_LENGTH = 64;
const defaultServices = JSON.parse(
  await readFile(new URL("../src/data/default-services.json", import.meta.url), "utf8")
);
const defaultHeroSlides = JSON.parse(
  await readFile(new URL("../src/data/default-hero-slides.json", import.meta.url), "utf8")
);
const defaultGalleryImages = JSON.parse(
  await readFile(new URL("../src/data/default-gallery-images.json", import.meta.url), "utf8")
);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt, PASSWORD_KEY_LENGTH);
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

async function seedAdminUser() {
  const existingAdminCount = await prisma.adminUser.count();
  if (existingAdminCount > 0) return;

  const name = String(process.env.ADMIN_NAME || "Graquamarine Admin").trim();
  const email = normalizeEmail(
    process.env.ADMIN_EMAIL || "admin@graquamarine.local"
  );
  const password = String(process.env.ADMIN_PASSWORD || "");

  if (name.length < 2) {
    throw new Error("ADMIN_NAME must be at least 2 characters.");
  }

  if (!email || !email.includes("@")) {
    throw new Error("ADMIN_EMAIL must be a valid email address.");
  }

  if (password.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD must be set to at least 8 characters before seeding the first admin."
    );
  }

  await prisma.adminUser.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
    },
  });
}

async function main() {
  await seedAdminUser();

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

  for (const [index, slide] of defaultHeroSlides.entries()) {
    await prisma.heroSlide.upsert({
      where: { id: `hero_slide_${index + 1}` },
      update: {},
      create: {
        id: `hero_slide_${index + 1}`,
        imageUrl: slide.imageUrl,
        alt: slide.alt,
        sortOrder: index,
        isActive: true,
      },
    });
  }

  for (const [index, image] of defaultGalleryImages.entries()) {
    await prisma.galleryImage.upsert({
      where: { id: `gallery_image_${index + 1}` },
      update: {},
      create: {
        id: `gallery_image_${index + 1}`,
        imageUrl: image.imageUrl,
        alt: image.alt,
        sortOrder: index,
        isActive: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
