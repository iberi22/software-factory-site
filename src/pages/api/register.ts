---
// API endpoint to register a repository
// POST /api/register

export const prerender = false;

import type { APIRoute } from 'astro';

// Rate limiting (simple in-memory, use Cloudflare Workers KV in production)
const registrations = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // 5 registrations
const RATE_WINDOW = 3600000; // per hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = registrations.get(ip);

  if (!record || record.resetAt < now) {
    registrations.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export const POST: APIRoute = async ({ request }) => {
  // Get client IP (will be set by Cloudflare)
  const clientIp = request.headers.get('CF-Connecting-IP') ||
                   request.headers.get('X-Forwarded-For')?.split(',')[0] ||
                   'unknown';

  // Check rate limit
  if (!checkRateLimit(clientIp)) {
    return new Response(JSON.stringify({
      error: 'Rate limit exceeded',
      retry_after: 3600,
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '3600',
      },
    });
  }

  try {
    const body = await request.json();
    const { owner, name, visibility, protocol_version } = body;

    // Validate required fields
    if (!owner || !name) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: owner, name',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate owner/name format
    const validNamePattern = /^[a-zA-Z0-9_.-]+$/;
    if (!validNamePattern.test(owner) || !validNamePattern.test(name)) {
      return new Response(JSON.stringify({
        error: 'Invalid owner or name format',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: In production, save to Supabase
    // For now, just return success
    const repoId = `${owner}/${name}`.toLowerCase();

    console.log(`[API] Registered repo: ${repoId}`);

    return new Response(JSON.stringify({
      success: true,
      repo_id: repoId,
      visibility: visibility || 'unknown',
      protocol_version: protocol_version || 'unknown',
      dashboard_url: `https://${owner}.github.io/${name}/`,
      message: 'Repository registered successfully',
      next_steps: [
        'Enable GitHub Pages in repo settings',
        'Set source to "docs" folder',
        'Run build-dashboard.ps1 to generate dashboard',
      ],
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[API] Registration error:', error);
    return new Response(JSON.stringify({
      error: 'Invalid request body',
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Handle CORS preflight
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};
---
