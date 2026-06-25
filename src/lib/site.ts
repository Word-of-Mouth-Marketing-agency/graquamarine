import type { NavigationLink } from "@/types";

export const siteConfig = {
  name: "Graquamarine",
  domain: "https://graquamarine.com",
  displayDomain: "graquamarine.com",
  location: "Hurghada, Red Sea, Egypt",
  description:
    "Graquamarine offers diving, snorkeling, island trips, and private boat activities in Hurghada, Egypt.",
  phone: "+201002786616",
  displayPhone: "+20 10 02786616",
  whatsappHref: "https://wa.me/201002786616",
  facebookUrl: "https://www.facebook.com/profile.php?id=61565653692215",
  instagramUrl: "https://www.instagram.com/gr.aqua.marine.adventures",
  navigation: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Activities", href: "/activities" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavigationLink[],
};
