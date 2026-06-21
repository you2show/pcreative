import { test, expect } from '@playwright/test';

test('verify redesign', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(2000); // Wait for animations
  await page.screenshot({ path: 'redesign-hero.png', fullPage: false });

  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'redesign-services.png', fullPage: false });

  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'redesign-portfolio.png', fullPage: false });

  await page.evaluate(() => window.scrollTo(0, 5000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'redesign-footer.png', fullPage: false });
});
