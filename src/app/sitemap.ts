import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/en"].map((path) => ({
    url: `${siteUrl}${path}`,
    alternates: { languages: { fa: siteUrl, en: `${siteUrl}/en` } },
  }));
}
