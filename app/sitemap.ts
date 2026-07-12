import type { MetadataRoute } from "next";

/**
 * Static routes only for now. Once the sync job is live, extend this to
 * pull published listing slugs from the local DB (lib/db) and append them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://realestateinparaguay.com";
  const staticRoutes = [
    "",
    "/properties",
    "/new-developments",
    "/guides",
    "/why-paraguay",
    "/about",
    "/contact",
    "/apartments-for-sale-asuncion",
    "/houses-for-sale-paraguay",
    "/land-for-sale-paraguay",
  ];

  return staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
