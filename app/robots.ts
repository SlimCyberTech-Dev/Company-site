import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Do not disallow /_next/: it blocks `/_next/image` and `/_next/static/*`, which breaks
        // Google’s resource checks and can interfere with rendering. `/api/` stays disallowed.
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://slimcybertech.com/sitemap.xml",
    host: "https://slimcybertech.com",
  };
}
