import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';

const BASE_URL = 'https://cairn58.com';

interface PeakRow {
  slug: string;
  updated_at: string;
  range: string;
  routes: Array<{ slug: string; updated_at: string }>;
}

export const GET: RequestHandler = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);

  // Fetch all peaks and routes
  const { data } = await supabase.from('peaks').select(`
      slug,
      updated_at,
      range,
      routes (
        slug,
        updated_at
      )
    `);

  const peaks = (data || []) as PeakRow[];

  // Get unique ranges
  const ranges = [...new Set(peaks.map(p => p.range))];

  const urls: Array<{ loc: string; priority: string; lastmod?: string }> = [
    { loc: '/', priority: '1.0' },
    { loc: '/peaks', priority: '0.9' },
    { loc: '/ranges', priority: '0.9' },
    { loc: '/map', priority: '0.8' }
  ];

  // Add range URLs
  ranges.forEach((range) => {
    const slug = range.toLowerCase().replace(/\s+/g, '-');
    urls.push({
      loc: `/ranges/${slug}`,
      priority: '0.8'
    });
  });

  // Add peak and route URLs
  peaks.forEach((peak) => {
    urls.push({
      loc: `/peaks/${peak.slug}`,
      priority: '0.8',
      lastmod: peak.updated_at
    });

    peak.routes?.forEach((route) => {
      urls.push({
        loc: `/peaks/${peak.slug}/${route.slug}`,
        priority: '0.7',
        lastmod: route.updated_at
      });
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    <priority>${url.priority}</priority>${url.lastmod ? `\n    <lastmod>${new Date(url.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600'
    }
  });
};
