---
// API endpoint for health checks
// GET /api/health

export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const status = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      templates: 'available',
      registration: 'available',
      // TODO: Add actual health checks
      // supabase: await checkSupabase(),
      // cloudflare: await checkCloudflare(),
    },
  };

  return new Response(JSON.stringify(status), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      'Access-Control-Allow-Origin': '*',
    },
  });
};
---
