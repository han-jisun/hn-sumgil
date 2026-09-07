import { MetadataRoute } from 'next';
import islandsData from '@/app/data/islands.json';
import themeContents from '@/magazine/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hn-sumgil.vercel.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/theme`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const islandRoutes: MetadataRoute.Sitemap = (islandsData as { island: string }[]).map((item) => ({
    url: `${baseUrl}/explore/${encodeURIComponent(item.island)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const magazineRoutes: MetadataRoute.Sitemap = themeContents.map((magazine) => ({
    url: `${baseUrl}/theme?id=${magazine.id}`,
    lastModified: new Date(magazine.date),
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [...staticRoutes, ...islandRoutes, ...magazineRoutes];
}
