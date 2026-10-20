import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";
import { portfolioIds } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", ...portfolioIds.map(id => `/portfolio/${id}`)].flatMap(path => ["", "/en"].map(language => ({
    url: `${siteUrl}${language}${path}`,
    alternates: { languages: { fa: `${siteUrl}${path}`, en: `${siteUrl}/en${path}` } },
  })));
}
