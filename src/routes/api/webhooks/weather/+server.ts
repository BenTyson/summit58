import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { createSupabaseServiceClient } from '$lib/server/supabase';
import { fetchWeatherForPeak, upsertConditions } from '$lib/server/conditions';

export const POST: RequestHandler = async ({ request }) => {
  // Verify webhook secret (check multiple header variations)
  const webhookSecret = env.WEBHOOK_SECRET;
  const secret = request.headers.get('x-webhook-secret')
    || request.headers.get('X-Webhook-Secret')
    || request.headers.get('X-WEBHOOK-SECRET');

  console.log('Webhook request received, secret present:', !!secret);

  if (!webhookSecret || secret !== webhookSecret) {
    console.warn('Unauthorized webhook attempt. Expected:', webhookSecret?.slice(0, 8) + '...', 'Got:', secret?.slice(0, 8) + '...');
    return new Response('Unauthorized', { status: 401 });
  }

  const startTime = Date.now();

  try {
    const supabase = createSupabaseServiceClient();

    // Get all peaks with coordinates
    const { data: peaks, error: peaksError } = await supabase
      .from('peaks')
      .select('id, name, latitude, longitude');

    if (peaksError) {
      throw new Error(`Failed to fetch peaks: ${peaksError.message}`);
    }

    if (!peaks || peaks.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No peaks found' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Fetching weather for ${peaks.length} peaks...`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Fetch weather for each peak with small delay to avoid rate limiting
    for (const peak of peaks) {
      try {
        const forecast = await fetchWeatherForPeak(peak.latitude, peak.longitude);
        await upsertConditions(supabase, peak.id, forecast);
        successCount++;
      } catch (error) {
        errorCount++;
        const message = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${peak.name}: ${message}`);
        console.error(`Error fetching weather for ${peak.name}:`, error);
      }

      // Small delay between requests (100ms)
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const duration = Date.now() - startTime;
    console.log(`Weather fetch complete: ${successCount} success, ${errorCount} errors in ${duration}ms`);

    return new Response(
      JSON.stringify({
        success: errorCount === 0,
        count: successCount,
        errors: errorCount,
        errorDetails: errors.slice(0, 5), // First 5 errors
        duration: `${duration}ms`
      }),
      {
        status: errorCount === peaks.length ? 500 : 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Weather webhook error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

// Also support GET for manual testing (remove in production if desired)
export const GET: RequestHandler = async ({ url }) => {
  const secret = url.searchParams.get('secret');
  const webhookSecret = env.WEBHOOK_SECRET;

  if (!webhookSecret || secret !== webhookSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Redirect to POST handler logic by creating a fake request
  const request = new Request(url, {
    method: 'POST',
    headers: { 'x-webhook-secret': secret }
  });

  return POST({ request, url } as Parameters<RequestHandler>[0]);
};
