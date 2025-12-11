// Configuration for Software Factory Site
// All environment variables and service URLs

export const config = {
  // Site
  site: {
    name: 'Software Factory',
    url: import.meta.env.SITE || 'https://iberi22.github.io/software-factory-site',
    basePath: import.meta.env.BASE_URL || '/software-factory-site',
  },

  // Supabase
  supabase: {
    url: import.meta.env.PUBLIC_SUPABASE_URL || '',
    anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '',
    // Edge functions
    functions: {
      julesOrchestrator: '/functions/v1/jules-orchestrator',
      julesStatusMonitor: '/functions/v1/jules-status-monitor',
    },
  },

  // Cloudflare
  cloudflare: {
    // Worker URLs
    api: import.meta.env.PUBLIC_CF_API_URL || 'https://factory-api.iberi22.workers.dev',
    // Turnstile site key (for bot protection)
    turnstileSiteKey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
  },

  // GitHub
  github: {
    // Main repos
    protocolRepo: 'iberi22/Git-Core-Protocol',
    factoryRepo: 'iberi22/software-factory',
    siteRepo: 'iberi22/software-factory-site',
    // Raw content URLs
    rawUrl: 'https://raw.githubusercontent.com',
  },

  // API Endpoints
  api: {
    // Template endpoints
    template: '/api/template',
    // Repo registration
    register: '/api/register',
    // Metrics
    metrics: '/api/metrics',
    // Health check
    health: '/api/health',
  },

  // Feature flags
  features: {
    // Enable Cloudflare protection
    cloudflareProtection: true,
    // Enable Stripe payments
    stripeEnabled: false, // TODO: Enable when ready
    // Enable Jules integration
    julesIntegration: true,
    // Enable telemetry collection
    telemetry: true,
  },

  // Pricing tiers
  pricing: {
    free: {
      name: 'Free',
      price: 0,
      orchestrations: 50,
      repos: 1,
      features: ['Basic agent dispatch', 'Community support', 'Contains ads'],
    },
    starter: {
      name: 'Starter',
      price: 7,
      orchestrations: 200,
      repos: 3,
      features: ['All AI agents', 'Priority support', 'No ads'],
    },
    pro: {
      name: 'Pro',
      price: 15,
      orchestrations: 1000,
      repos: 10,
      features: ['Custom agents', 'API access', 'Dedicated support'],
    },
    team: {
      name: 'Team',
      price: 39,
      orchestrations: 5000,
      repos: 50,
      features: ['Everything in Pro', 'Team management', 'SLA', 'Onboarding call'],
    },
  },
} as const;

// Helper to build full URLs
export function buildApiUrl(endpoint: keyof typeof config.api): string {
  if (config.features.cloudflareProtection) {
    return `${config.cloudflare.api}${config.api[endpoint]}`;
  }
  return `${config.site.url}${config.api[endpoint]}`;
}

// Helper to get template URL
export function getTemplateUrl(version: string = 'latest'): string {
  return `${config.site.url}/templates/dashboard/${version}/index.html`;
}

// Helper to get install script URL
export function getInstallScriptUrl(platform: 'windows' | 'unix' = 'windows'): string {
  const script = platform === 'windows' ? 'install.ps1' : 'install.sh';
  return `${config.github.rawUrl}/${config.factoryRepo}/main/${script}`;
}
