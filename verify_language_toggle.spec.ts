import { test, expect } from '@playwright/test';

test('verify language toggle exists and works', async ({ page }) => {
  // Bypass cinematic intro
  await page.addInitScript(() => {
    window.sessionStorage.setItem('ponloe_visited', '1');
  });

  await page.goto('http://localhost:5173/');

  // Wait for the page to be ready
  await page.waitForLoadState('networkidle');

  // Check for the toggle in the header
  const languageToggle = page.locator('header').locator('button').filter({ hasText: /EN|KM/ });
  await expect(languageToggle.first()).toBeVisible();

  const initialText = await languageToggle.first().textContent();
  console.log('Initial text:', initialText);

  // Take a screenshot before click
  await page.screenshot({ path: 'before_click.png' });

  // Click to toggle
  await languageToggle.first().click({ force: true });

  // Wait a bit for the state change
  await page.waitForTimeout(1000);

  // Take a screenshot after click
  await page.screenshot({ path: 'after_click.png' });

  // Verify it changed
  const newText = await languageToggle.first().textContent();
  console.log('New text:', newText);

  // If it didn't change, maybe there's another one?
  const allToggles = await languageToggle.all();
  console.log('Number of toggles found:', allToggles.length);

  expect(initialText?.trim()).not.toBe(newText?.trim());
});
