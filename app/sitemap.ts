export const dynamic = "force-static"

import type { MetadataRoute } from "next"
import { getBaseUrl } from "@/utils/static-export-helper"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()

  // Use a fixed date for static export to avoid build differences
  const lastMod = new Date("2023-01-01").toISOString()

  return [
    {
      url: baseUrl,
      lastModified: lastMod,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/transform`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/revolution`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/social-preview`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]
}
