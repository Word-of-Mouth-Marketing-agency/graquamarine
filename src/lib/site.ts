import type { NavigationLink } from "@/types";

export const siteConfig = {
  name: "Graquamarine",
  domain: "http://graquamarine.com/",
  displayDomain: "graquamarine.com",
  location: "Hurghada, Egypt",
  description:
    "Graquamarine offers diving, snorkeling, island trips, and private boat activities in Hurghada, Egypt.",
  phonePlaceholders: ["+20 XXX XXX XXXX", "+20 XXX XXX XXXX"],
  socialPlaceholders: ["Facebook", "Instagram", "TikTok"],
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Activities", href: "/activities" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavigationLink[],
};
