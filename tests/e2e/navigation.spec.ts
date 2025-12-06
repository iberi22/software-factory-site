import { test, expect } from '@playwright/test';

/**
 * Navigation E2E Tests
 *
 * Tests navigation between pages including:
 * - Home page links
 * - Dashboard navigation
 * - Settings navigation
 * - Sidebar/menu functionality
 */

test.describe('Navigation', () => {
  test.describe('Home Page', () => {
    test('should load home page successfully', async ({ page }) => {
      const response = await page.goto('/');
      expect(response?.status()).toBe(200);
    });

    test('should have navigation links', async ({ page }) => {
      await page.goto('/');

      // Look for the main navigation element
      const nav = page.locator('header [role="navigation"]');
      await expect(nav).toBeVisible();
    });

    test('should have CTA to dashboard or login', async ({ page }) => {
      await page.goto('/');

      // Look for a link to the dashboard or login
      const ctaLink = page.locator('a[href*="dashboard"], a[href*="login"]');
      await expect(ctaLink.first()).toBeVisible();
    });
  });

  test.describe('Page Navigation', () => {
    test('should navigate from home to login', async ({ page }) => {
      await page.goto('/');

      // Find and click login link
      const loginLink = page.getByRole('link', { name: /login/i });
      await loginLink.click();
      await page.waitForURL('**/login');
      await expect(page).toHaveURL(/.*\/login/);
    });

    test('should navigate between pages without errors', async ({ page }) => {
      // Visit each main page
      const pages = ['/', '/login', '/dashboard', '/settings'];

      for (const pagePath of pages) {
        const response = await page.goto(pagePath);
        // Should not have server errors and redirect to login for protected routes
        expect(response?.status()).toBeLessThan(500);
      }
    });
  });

  test.describe('Settings Page', () => {
    test('should load settings page', async ({ page }) => {
      const response = await page.goto('/settings');
      expect(response?.status()).toBeLessThan(500);
    });

    test('should display settings form or sections', async ({ page }) => {
      await page.goto('/settings');
      // Wait for either the settings form or the redirect to login
      await page.waitForLoadState('networkidle');

      const url = page.url();
      if (!url.includes('/login')) {
        const settingsContent = page.locator('main');
        await expect(settingsContent).toBeVisible();
      } else {
        await expect(page).toHaveURL(/.*\/login/);
      }
    });
  });

  test.describe('404 Handling', () => {
    test('should handle non-existent routes gracefully', async ({ page }) => {
      const response = await page.goto('/non-existent-page-12345');

      // Should return 404
      expect(response?.status()).toBe(404);
    });
  });

  test.describe('External Links', () => {
    test('should have proper target attributes for external links', async ({ page }) => {
      await page.goto('/');

      // Find external links
      const externalLinks = page.locator('a[href^="http"]');
      const count = await externalLinks.count();

      for (let i = 0; i < count; i++) {
        const link = externalLinks.nth(i);
        const target = await link.getAttribute('target');
        const rel = await link.getAttribute('rel');

        // External links with _blank should have noopener
        if (target === '_blank') {
          expect(rel).toContain('noopener');
        }
      }
    });
  });
});
