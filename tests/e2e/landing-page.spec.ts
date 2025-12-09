import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Page Load', () => {
    test('should load successfully with 200 status', async ({ page }) => {
      const response = await page.goto('/');
      expect(response?.status()).toBe(200);
    });

    test('should have correct page title', async ({ page }) => {
      await expect(page).toHaveTitle(/Software Factory.*AI-Powered Development/i);
    });

    test('should load without console errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.waitForLoadState('networkidle');
      expect(errors.length).toBe(0);
    });
  });

  test.describe('Hero Section', () => {
    test('should display main heading with correct text', async ({ page }) => {
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      await expect(h1).toContainText(/Software.*Factory/i);
    });

    test('should have neon cyan styling on "Software"', async ({ page }) => {
      const softwareSpan = page.locator('h1 span.text-neon-cyan');
      await expect(softwareSpan).toBeVisible();
      await expect(softwareSpan).toHaveText('Software');
    });

    test('should have neon magenta styling on "Factory"', async ({ page }) => {
      const factorySpan = page.locator('h1 span.text-neon-magenta');
      await expect(factorySpan).toBeVisible();
      await expect(factorySpan).toHaveText('Factory');
    });

    test('should display tagline', async ({ page }) => {
      const tagline = page.locator('p.text-xl, p.text-2xl').first();
      await expect(tagline).toBeVisible();
    });
  });

  test.describe('BYOC Banner', () => {
    test('should display BYOC banner section', async ({ page }) => {
      const banner = page.locator('section').filter({ hasText: /bring your own cloud/i });
      await expect(banner).toBeVisible();
    });

    test('should have gradient background', async ({ page }) => {
      const banner = page.locator('.bg-gradient-to-r');
      await expect(banner).toBeVisible();
    });

    test('should display BYOC heading', async ({ page }) => {
      const heading = page.locator('h2, h3').filter({ hasText: /bring your own cloud/i });
      await expect(heading).toBeVisible();
    });

    test('should display BYOC description text', async ({ page }) => {
      const description = page.locator('text=/supabase.*cloudflare/i');
      await expect(description).toBeVisible();
    });
  });

  test.describe('Pricing Section', () => {
    test('should display pricing section', async ({ page }) => {
      const pricingSection = page.locator('section').filter({ hasText: /pricing/i });
      await expect(pricingSection).toBeVisible();
    });

    test('should display Free tier with $0', async ({ page }) => {
      const freeTier = page.locator('text=/free.*\\$0/i').or(page.locator('text=/\\$0.*free/i'));
      await expect(freeTier).toBeVisible();
    });

    test('should display Free tier with 50 orchestrations', async ({ page }) => {
      const freeOrchestrations = page.locator('text=/50.*orchestration/i');
      await expect(freeOrchestrations).toBeVisible();
    });

    test('should display Starter tier with $7', async ({ page }) => {
      const starterTier = page.locator('text=/starter.*\\$7/i').or(page.locator('text=/\\$7.*starter/i'));
      await expect(starterTier).toBeVisible();
    });

    test('should display Starter tier with 200 orchestrations', async ({ page }) => {
      const starterOrchestrations = page.locator('text=/200.*orchestration/i');
      await expect(starterOrchestrations).toBeVisible();
    });

    test('should display Pro tier with $15', async ({ page }) => {
      const proTier = page.locator('text=/pro.*\\$15/i').or(page.locator('text=/\\$15.*pro/i'));
      await expect(proTier).toBeVisible();
    });

    test('should display Pro tier with 1000 orchestrations', async ({ page }) => {
      const proOrchestrations = page.locator('text=/1,?000.*orchestration/i');
      await expect(proOrchestrations).toBeVisible();
    });

    test('should mention team plan at $39', async ({ page }) => {
      const teamPlan = page.locator('text=/\\$39/i');
      await expect(teamPlan).toBeVisible();
    });
  });

  test.describe('Git-Core Protocol Notice', () => {
    test('should display Git-Core Protocol section', async ({ page }) => {
      const protocolSection = page.locator('section, div').filter({ hasText: /git-core protocol/i });
      await expect(protocolSection).toBeVisible();
    });

    test('should mention Git-Core Protocol in text', async ({ page }) => {
      const protocolText = page.locator('text=/git-core protocol/i');
      await expect(protocolText).toBeVisible();
    });

    test('should have link or reference to protocol', async ({ page }) => {
      // Check for either a link or text mentioning the protocol
      const protocolReference = page.locator('a[href*="git-core"], a[href*="protocol"]').or(
        page.locator('text=/built with.*git-core/i')
      );
      const count = await protocolReference.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Footer', () => {
    test('should display footer section', async ({ page }) => {
      const footer = page.locator('footer, section:last-of-type');
      await expect(footer).toBeVisible();
    });

    test('should have clickable links', async ({ page }) => {
      const links = page.locator('a[href]');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);

      // Check first link is visible and enabled
      await expect(links.first()).toBeVisible();
      await expect(links.first()).toBeEnabled();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      const pricingSection = page.locator('text=/pricing/i');
      await expect(pricingSection).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad

      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      const banner = page.locator('text=/bring your own cloud/i');
      await expect(banner).toBeVisible();
    });

    test('should work on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 }); // Full HD

      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      const allPricing = page.locator('text=/\\$0|\\$7|\\$15/i');
      const count = await allPricing.count();
      expect(count).toBeGreaterThanOrEqual(3); // All three tiers visible
    });
  });

  test.describe('Performance', () => {
    test('should load main content within 3 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.locator('h1').waitFor({ state: 'visible' });
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000);
    });

    test('should have no accessibility violations', async ({ page }) => {
      // Check for basic accessibility
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThan(0);

      const imgWithoutAlt = await page.locator('img:not([alt])').count();
      expect(imgWithoutAlt).toBe(0);
    });
  });
});
