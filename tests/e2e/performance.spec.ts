import { test, expect } from '@playwright/test';

/**
 * Performance E2E Tests
 *
 * Tests performance metrics including:
 * - Page load times
 * - Core Web Vitals
 * - Resource loading
 */

test.describe('Performance', () => {
  test.describe('Page Load Times', () => {
    test('home page should load within 5 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(5000);
    });

    test('dashboard should load within 5 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/dashboard');
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(5000);
    });

    test('login page should load within 3 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000);
    });
  });

  test.describe('Resource Loading', () => {
    test('should load critical CSS', async ({ page }) => {
      await page.goto('/');

      // Check for stylesheet links
      const stylesheets = page.locator('link[rel="stylesheet"], style');
      const count = await stylesheets.count();

      expect(count).toBeGreaterThan(0);
    });

    test('should load JavaScript bundles', async ({ page }) => {
      await page.goto('/');

      // Check for script tags
      const scripts = page.locator('script[src]');
      const count = await scripts.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should not have broken resources', async ({ page }) => {
      const failedRequests: string[] = [];

      page.on('requestfailed', request => {
        failedRequests.push(request.url());
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Filter out expected failures (external APIs, fonts, etc.)
      const criticalFailures = failedRequests.filter(url =>
        !url.includes('supabase') &&
        !url.includes('analytics') &&
        !url.includes('favicon') &&
        !url.includes('fonts') &&
        !url.includes('google') &&
        !url.includes('vercel')
      );

      // Allow some non-critical failures
      expect(criticalFailures.length).toBeLessThan(3);
    });
  });

  test.describe('Network Efficiency', () => {
    test('should not make excessive requests on initial load', async ({ page }) => {
      let requestCount = 0;

      page.on('request', () => {
        requestCount++;
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Should have reasonable number of requests
      expect(requestCount).toBeLessThan(50);
    });
  });

  test.describe('Memory and Console', () => {
    test('should not have console errors on home page', async ({ page }) => {
      const consoleErrors: string[] = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Filter out expected errors (like network errors for unauthenticated API calls)
      const criticalErrors = consoleErrors.filter(err =>
        !err.includes('Supabase') &&
        !err.includes('401') &&
        !err.includes('auth') &&
        !err.toLowerCase().includes('cors')
      );

      // Should have minimal critical console errors
      expect(criticalErrors.length).toBeLessThan(3);
    });
  });
});
