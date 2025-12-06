import { test, expect } from '@playwright/test';

/**
 * Dashboard E2E Tests
 *
 * Tests the main dashboard functionality including:
 * - Page loading and rendering
 * - Metrics panel display
 * - Event stream display
 * - Projects list display
 * - Active agents display
 */

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Structure', () => {
    test('should load dashboard page without errors', async ({ page }) => {
      // Check page loaded successfully
      const response = await page.goto('/dashboard');
      expect(response?.status()).toBeLessThan(400);
    });

    test('should have proper page title', async ({ page }) => {
      await expect(page).toHaveTitle(/Command Center|Software Factory/);
    });

    test('should display main layout structure', async ({ page }) => {
      // Check for the main grid layout
      const mainGrid = page.locator('.grid.grid-cols-12');
      await expect(mainGrid).toBeVisible();
    });
  });

  test.describe('Metrics Panel', () => {
    test('should display metrics section', async ({ page }) => {
      // Look for the metrics container
      const metricsContainer = page.locator('#metrics-container');
      await expect(metricsContainer).toBeVisible();
    });

    test('should show metric cards with numbers', async ({ page }) => {
      // Wait for the metrics panel to be visible
      const metricsPanel = page.locator('#metrics-container');
      await metricsPanel.waitFor({ state: 'visible' });

      // Check for at least one metric card with a number
      const metricCard = metricsPanel.locator('.stat-value');
      await expect(metricCard.first()).toBeVisible();
    });
  });

  test.describe('Event Stream', () => {
    test('should display events section', async ({ page }) => {
      // Look for the events container
      const eventsContainer = page.locator('#events-container');
      await expect(eventsContainer).toBeVisible();
    });
  });

  test.describe('Projects List', () => {
    test('should display projects section', async ({ page }) => {
      // Look for the projects container
      const projectsContainer = page.locator('#projects-container');
      await expect(projectsContainer).toBeVisible();
    });
  });

  test.describe('Active Agents', () => {
    test('should display agents section', async ({ page }) => {
      // Look for the active agents container
      const agentsContainer = page.locator('#active-agents-container');
      await expect(agentsContainer).toBeVisible();
    });
  });

  test.describe('Responsive Layout', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');

      // Page should still have the main grid
      const mainGrid = page.locator('.grid.grid-cols-12');
      await expect(mainGrid).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/dashboard');

      // Page should still have the main grid
      const mainGrid = page.locator('.grid.grid-cols-12');
      await expect(mainGrid).toBeVisible();
    });
  });
});
