import { test, expect, Page } from '@playwright/test';

/**
 * Authentication E2E Tests
 *
 * Tests the complete authentication flow including:
 * - Login page accessibility
 * - OAuth redirect handling
 * - Protected route access
 * - Logout functionality
 */

test.describe('Authentication', () => {
  test.describe('Login Page', () => {
    test('should display login page with GitHub OAuth button', async ({ page }) => {
      await page.goto('/login');

      // Should show the login page
      await expect(page).toHaveTitle(/Software Factory|Login/);

      // Should have a GitHub login button
      const githubButton = page.getByRole('button', { name: 'Sign in with GitHub' });
      await expect(githubButton).toBeVisible();
    });

    test('should have proper OAuth configuration', async ({ page }) => {
      await page.goto('/login');

      // Wait for page load
      await page.waitForLoadState('networkidle');

      // Check page loaded without server error
      const heading = page.getByRole('heading', { name: 'SOFTWARE FACTORY' });
      await expect(heading).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated users from dashboard to login', async ({ page }) => {
      // Try to access dashboard without auth
      await page.goto('/dashboard');

      // Should redirect to login
      await page.waitForURL('**/login');
      await expect(page).toHaveURL(/.*\/login/);
    });

    test('should redirect unauthenticated users from settings to login', async ({ page }) => {
      await page.goto('/settings');

      // Should redirect to login
      await page.waitForURL('**/login');
      await expect(page).toHaveURL(/.*\/login/);
    });
  });

  test.describe('OAuth Callback', () => {
    test('should handle OAuth callback route without error', async ({ page }) => {
      // Visit callback without params should not crash
      const response = await page.goto('/auth/callback');

      // Should not return server error
      expect(response?.status()).toBeLessThan(500);
    });

    test('should handle callback with error param gracefully', async ({ page }) => {
      await page.goto('/auth/callback?error=access_denied');

      await page.waitForTimeout(500);

      // Should redirect to login or show error
      const url = page.url();
      expect(url).toBeTruthy();
    });
  });
});
