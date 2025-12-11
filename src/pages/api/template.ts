---
// API endpoint to get dashboard template
// GET /api/template?version=latest

export const prerender = false;

import type { APIRoute } from 'astro';

const TEMPLATE_VERSIONS = ['v1', 'latest'] as const;

export const GET: APIRoute = async ({ request, url }) => {
  const version = url.searchParams.get('version') || 'latest';

  // Validate version
  if (!TEMPLATE_VERSIONS.includes(version as any)) {
    return new Response(JSON.stringify({
      error: 'Invalid version',
      valid_versions: TEMPLATE_VERSIONS,
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Map 'latest' to actual version
  const actualVersion = version === 'latest' ? 'v1' : version;

  try {
    // In production, templates are served from public/templates/
    // This endpoint provides metadata and redirect
    const templateUrl = `/software-factory-site/templates/dashboard/${actualVersion}/index.html`;

    return new Response(JSON.stringify({
      version: actualVersion,
      url: templateUrl,
      format: 'html',
      placeholders: [
        '{{REPO_NAME}}',
        '{{REPO_OWNER}}',
        '{{REPO_VISIBILITY}}',
        '{{ISSUES_OPEN}}',
        '{{ISSUES_CLOSED}}',
        '{{PRS_OPEN}}',
        '{{PRS_MERGED}}',
        '{{JULES_ACTIVE}}',
        '{{ORCHESTRATIONS}}',
        '{{PROTOCOL_VERSION}}',
        '{{HEALTH_SCORE}}',
        '{{BUILD_TIMESTAMP}}',
      ],
      instructions: 'Replace placeholders with actual values at build time',
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[API] Template error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get template',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
---
