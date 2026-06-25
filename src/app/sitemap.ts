import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const routes = ["", "/about", "/activities", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.domain.replace(/\/$/, "");

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
