import type { NavigationLink } from "@/types";

export const siteConfig = {
  name: "Graquamarine",
  domain: "http://graquamarine.com/",
  location: "Hurghada, Egypt",
  description:
    "Graquamarine offers diving, snorkeling, island trips, and private boat activities in Hurghada, Egypt.",
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Activities", href: "/activities" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavigationLink[],
};
