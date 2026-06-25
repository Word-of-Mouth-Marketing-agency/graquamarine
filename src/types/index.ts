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
};
