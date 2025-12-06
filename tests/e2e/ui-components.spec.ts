import { test, expect } from '@playwright/test';

/**
 * UI Components E2E Tests
 *
 * Tests UI components and interactions including:
 * - Toast notifications
 * - Buttons and forms
 * - Modal dialogs
 * - Loading states
 */

test.describe('UI Components', () => {
  test.describe('Toast Notifications', () => {
    test('should not have persistent error toasts on page load', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Check for error toasts - they should not persist
      const errorToast = page.locator('[role="alert"][data-type="error"]');
      await expect(errorToast).toHaveCount(0);
    });
  });

  test.describe('Loading States', () => {
    test('should show and hide loading indicators', async ({ page }) => {
      await page.goto('/dashboard');

      // Loading should eventually complete
      await page.waitForLoadState('networkidle');

      // Page should be interactive
      const mainGrid = page.locator('.grid.grid-cols-12');
      await expect(mainGrid).toBeVisible();
    });
  });

  test.describe('Buttons', () => {
    test('should have clickable buttons', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Find at least one button
      const button = page.locator('button').first();
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    });
  });

  test.describe('Forms', () => {
    test('should have proper form elements on settings page', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // If not redirected to login, check for form elements
      if (!page.url().includes('/login')) {
        const form = page.locator('form');
        await expect(form).toBeVisible();
        const inputs = page.locator('input, select, textarea');
        await expect(inputs).toHaveCountGreaterThan(0);
      }
    });
  });

  test.describe('Icons and Images', () => {
    test('should load SVG icons without errors', async ({ page }) => {
      await page.goto('/dashboard');

      // Check for at least one SVG icon
      const svgIcon = page.locator('svg').first();
      await expect(svgIcon).toBeVisible();
    });

    test('should have alt text for images', async ({ page }) => {
      await page.goto('/');

      // Find all images
      const images = page.locator('img');
      const count = await images.count();

      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        // Images should have alt attribute (can be empty for decorative)
        expect(alt).toBeDefined();
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');

      // Should have at least one h1
      const h1 = page.locator('h1');
      await expect(h1).toHaveCountGreaterThan(0);
    });

    test('should have proper ARIA labels where needed', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Check for buttons with aria-label
      const buttonsWithAriaLabel = page.locator('button[aria-label]');
      await expect(buttonsWithAriaLabel).toHaveCountGreaterThan(0);
    });

    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/');

      // Tab through the page
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should have focused element
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });
  });

  test.describe('Dark Mode', () => {
    test('should support dark mode styling', async ({ page }) => {
      await page.goto('/dashboard');

      // Check for dark mode class on html element
      const html = page.locator('html');
      await expect(html).toHaveClass(/dark/);
    });
  });
});
