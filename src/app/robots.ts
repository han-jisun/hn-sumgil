import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/data', '/api/'],
    },
    sitemap: 'https://hn-sumgil.vercel.app/sitemap.xml',
  };
}
