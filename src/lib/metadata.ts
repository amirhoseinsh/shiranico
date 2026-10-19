import type { Metadata } from "next";
import { content, siteUrl, type Locale } from "./content";

export function createMetadata(locale: Locale): Metadata {
  const copy = content[locale];
  const url = locale === "fa" ? siteUrl : `${siteUrl}/en`;
  return {
    metadataBase: new URL(siteUrl),
    title: copy.title,
    description: copy.description,
    applicationName: "SHIRANI",
    alternates: {
      canonical: url,
      languages: { fa: siteUrl, en: `${siteUrl}/en`, "x-default": siteUrl },
    },
    icons: { icon: "/icon.svg", apple: "/brand/apple-touch-icon.png" },
    openGraph: {
      type: "website",
      siteName: "SHIRANI",
      title: copy.title,
      description: copy.description,
      url,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? "en_US" : "fa_IR",
      images: [{ url: `/brand/og-${locale}.png`, width: 1200, height: 630, alt: copy.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [`/brand/og-${locale}.png`],
    },
  };
}
