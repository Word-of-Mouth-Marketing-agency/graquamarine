export type NavigationLink = {
  label: string;
  href: string;
};

export type PricingMode = "perPerson" | "flat";

export type Activity = {
  slug: string;
  name: string;
  basePriceUsd: number;
  pricingMode: PricingMode;
  shortDescription: string;
  detailedDescription: string;
  summary: string;
  category: string;
  highlights: string[];
  image: string;
  isActive: boolean;
};

export type ServiceCardData = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  highlights: string[];
  sortOrder: number;
  isActive: boolean;
};

export type HeroSlideData = {
  id: string;
  imageUrl: string;
  alt: string;
  sortOrder: number;
  isActive: boolean;
};

export type GalleryImageData = {
  id: string;
  imageUrl: string;
  alt: string;
  sortOrder: number;
  isActive: boolean;
};

export type AdminIdentity = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};
