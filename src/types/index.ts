export type NavigationLink = {
  label: string;
  href: string;
};

export type Activity = {
  slug: string;
  name: string;
  basePriceUsd: number;
  summary: string;
  category: string;
  highlights: string[];
};
