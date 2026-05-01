import type { MetadataRoute } from "next";

/** Fully static so crawlers always get plain XML from the build (no runtime surprises). */
export const dynamic = "force-static";

const baseUrl = "https://slimcybertech.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Single-page site: one canonical URL. Fragment URLs (#section) are not separate pages in
  // Google's index and can confuse sitemap parsers; in-page anchors are still crawlable from HTML.
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
