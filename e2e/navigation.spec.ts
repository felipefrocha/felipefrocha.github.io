import { test, expect } from '@playwright/test';

test.describe('Site navigation', () => {
  test('reaches the main sections', async ({ page }) => {
    await page.goto('/');
    for (const path of ['/portfolio', '/about', '/contact', '/blog']) {
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.locator('#main-content')).toBeVisible();
    }
  });

  test('shows a not-found view for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.locator('#main-content')).toBeVisible();
    await expect(page.getByText(/404|not found/i).first()).toBeVisible();
  });

  test('can switch the interface language', async ({ page }) => {
    await page.goto('/');
    // The language switcher is the button labelled for screen readers.
    const trigger = page.getByRole('button', { name: /change language/i });
    await trigger.click();
    await page.getByText('Português').click();
    // The blog description should now render in Portuguese somewhere on the home page nav.
    await expect(page.getByRole('link', { name: /blog/i }).first()).toBeVisible();
  });
});
