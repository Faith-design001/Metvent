import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.SITE_URL;
  if (!siteUrl) {
    return [];
  }
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
    },
  ];
}
