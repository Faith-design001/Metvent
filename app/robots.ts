import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.SITE_URL || 'https://metvent.vercel.app';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/organiser/', '/event/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
