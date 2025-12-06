import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test.describe('Page Load', () => {
    test('should load successfully with 200 status', async ({ page }) => {
      const response = await page.goto('/', { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
    });

    test('should have correct page title', async ({ page }) => {
      await expect(page).toHaveTitle('Software Factory - AI-Powered Development');
    });
  });

  test.describe('Hero Section', () => {
    test('should display main heading', async ({ page }) => {
      // Use getByRole for the hero heading (more specific than locator('h1'))
      const heading = page.getByRole('heading', { name: /Software Factory/i, level: 1 });
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Software');
      await expect(heading).toContainText('Factory');
    });

    test('should display tagline', async ({ page }) => {
      const tagline = page.getByText('Transform your GitHub repos into autonomous AI-powered factories');
      await expect(tagline).toBeVisible();
    });

    test('should have CTA buttons', async ({ page }) => {
      const getStartedBtn = page.getByRole('link', { name: 'Get Started Free' });
      const docsBtn = page.getByRole('link', { name: 'Documentation' });
      await expect(getStartedBtn).toBeVisible();
      await expect(docsBtn).toBeVisible();
    });
  });

  test.describe('Features Section', () => {
    test('should display features heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Features' });
      await expect(heading).toBeVisible();
    });

    test('should display AI Agents feature', async ({ page }) => {
      const feature = page.getByText('GitHub Copilot & Jules integration');
      await expect(feature).toBeVisible();
    });

    test('should display Rust Core feature', async ({ page }) => {
      const feature = page.getByText('Blazingly fast agent execution');
      await expect(feature).toBeVisible();
    });
  });

  test.describe('BYOC Banner', () => {
    test('should display BYOC section', async ({ page }) => {
      const banner = page.getByText('Bring Your Own Copilot (BYOC)');
      await expect(banner).toBeVisible();
    });

    test('should mention GitHub Copilot Pro requirement', async ({ page }) => {
      const text = page.getByText('GitHub Copilot Pro');
      await expect(text).toBeVisible();
    });

    test('should have link to get Copilot', async ({ page }) => {
      const link = page.getByRole('link', { name: /Get Copilot/i });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', 'https://github.com/features/copilot/plans');
    });
  });

  test.describe('Pricing Section', () => {
    test('should display pricing heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Pricing' });
      await expect(heading).toBeVisible();
    });

    test('should display Free tier', async ({ page }) => {
      const freeTier = page.getByRole('heading', { name: 'Free', exact: true });
      await expect(freeTier).toBeVisible();
      
      const price = page.locator('text=/\\$0\\s*\\/mo/');
      await expect(price).toBeVisible();
      
      const limit = page.getByText('50 orchestrations/mo');
      await expect(limit).toBeVisible();
    });

    test('should display Starter tier', async ({ page }) => {
      const starterTier = page.getByRole('heading', { name: 'Starter', exact: true });
      await expect(starterTier).toBeVisible();
      
      const price = page.locator('text=/\\$7\\s*\\/mo/');
      await expect(price).toBeVisible();
      
      const limit = page.getByText('200 orchestrations/mo');
      await expect(limit).toBeVisible();
    });

    test('should display Pro tier', async ({ page }) => {
      const proTier = page.getByRole('heading', { name: 'Pro', exact: true });
      await expect(proTier).toBeVisible();
      
      const price = page.locator('text=/\\$15\\s*\\/mo/');
      await expect(price).toBeVisible();
      
      const limit = page.getByText('1,000 orchestrations/mo');
      await expect(limit).toBeVisible();
    });

    test('should mention Team plan', async ({ page }) => {
      const teamPlan = page.getByText('Team plan at $39/mo');
      await expect(teamPlan).toBeVisible();
    });
  });

  test.describe('Git-Core Protocol Notice', () => {
    test('should display protocol notice', async ({ page }) => {
      const notice = page.getByText('Requires Git-Core Protocol');
      await expect(notice).toBeVisible();
    });

    test('should have link to protocol spec', async ({ page }) => {
      const link = page.getByRole('link', { name: /Learn more about Git-Core Protocol/i });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', 'https://github.com/git-core-protocol/specification');
    });
  });

  test.describe('Footer', () => {
    test('should display footer', async ({ page }) => {
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    });

    test('should have GitHub link', async ({ page }) => {
      const githubLink = page.locator('footer a[href="https://github.com/iberi22/software-factory-site"]');
      await expect(githubLink).toBeVisible();
    });

    test('should have Docs link', async ({ page }) => {
      const docsLink = page.locator('footer').getByRole('link', { name: 'Docs' });
      await expect(docsLink).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load page in less than 3 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000);
    });
  });
});
