import type { MetadataRoute } from "next";
import { getServiceSlugs } from "@/lib/data";

const SITE_URL = "https://ikasarenovations.ca";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const serviceSlugs = await getServiceSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/gallery`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/testimonials`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/booking`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
