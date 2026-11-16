import { test, expect } from '@playwright/test';

test.describe('Modern Web Guidance & Functional Validation', () => {
  test('skip link has visible text and targets #main-content without redundant landmarks', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveText(/skip to main content/i);

    const main = page.locator('main#main-content');
    await expect(main).toBeVisible();
    await expect(main).toHaveAttribute('tabindex', '-1');
    await expect(main).not.toHaveAttribute('role', 'main');

    const header = page.locator('header').first();
    await expect(header).not.toHaveAttribute('role', 'banner');

    const footer = page.locator('footer').first();
    await expect(footer).not.toHaveAttribute('role', 'contentinfo');

    // Ensure no nested <a><a> elements exist anywhere in the DOM
    const nestedAnchors = await page.locator('a a').count();
    expect(nestedAnchors).toBe(0);
  });

  test('theme toggle switches between light and dark mode, syncs color-scheme meta, and persists', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const colorSchemeMeta = page.locator('meta[name="color-scheme"]');

    const initiallyDark = await html.evaluate((el) => el.classList.contains('dark'));
    const themeToggle = page.getByTestId('button-theme-toggle');
    await themeToggle.click();

    const afterToggleDark = await html.evaluate((el) => el.classList.contains('dark'));
    expect(afterToggleDark).toBe(!initiallyDark);
    await expect(colorSchemeMeta).toHaveAttribute('content', afterToggleDark ? 'dark light' : 'light dark');

    // Reload page and confirm FOUC inline script restores the chosen theme immediately
    await page.reload();
    const afterReloadDark = await html.evaluate((el) => el.classList.contains('dark'));
    expect(afterReloadDark).toBe(afterToggleDark);
  });

  test('language switcher updates <html lang> attribute dynamically', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');

    const trigger = page.getByRole('button', { name: /change language|mudar idioma|cambiar idioma/i });
    await trigger.click();
    await page.getByText('Português').click();
    await expect(html).toHaveAttribute('lang', 'pt');

    await trigger.click();
    await page.getByText('English').click();
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('blog page renders <search> landmark, labelled input, and keyboard-operable category buttons', async ({ page }) => {
    await page.goto('/blog');

    // Verify <search> landmark and accessible search input
    const searchLandmark = page.locator('search');
    await expect(searchLandmark).toBeVisible();
    const searchInput = page.getByTestId('input-search-posts');
    await expect(searchInput).toHaveAttribute('id', 'blog-search');
    await expect(searchInput).toHaveAttribute('name', 'q');
    await expect(searchInput).toHaveAttribute('autocomplete', 'off');

    // Verify category filter buttons use <button aria-pressed> inside role="group"
    const allFilterBtn = page.getByTestId('badge-category-all');
    await expect(allFilterBtn).toBeVisible();
    const tagName = await allFilterBtn.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('button');
    await expect(allFilterBtn).toHaveAttribute('aria-pressed', 'true');

    // Filter by typing into search input
    await searchInput.fill('Agentic');
    await expect(page.locator('a[href^="/blog/"]').first()).toBeVisible();
  });

  test('blog post renders keyboard-scrollable code blocks and safe JSON-LD', async ({ page }) => {
    await page.goto('/blog/agentic-sdlc');
    await expect(page.getByTestId('text-post-title')).toBeVisible();

    // Verify JSON-LD structured data is valid JSON
    const jsonLdText = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(jsonLdText).toBeTruthy();
    expect(() => JSON.parse(jsonLdText!)).not.toThrow();

    // If the post has <pre> code blocks, verify tabindex="0" and aria-label
    const preBlocks = page.locator('article pre');
    const preCount = await preBlocks.count();
    if (preCount > 0) {
      await expect(preBlocks.first()).toHaveAttribute('tabindex', '0');
      await expect(preBlocks.first()).toHaveAttribute('role', 'region');
      await expect(preBlocks.first()).toHaveAttribute('aria-label', 'Code snippet');
    }
  });

  test('contact page inputs are enabled with proper autocomplete attributes', async ({ page }) => {
    await page.goto('/contact');
    const nameInput = page.getByTestId('input-contact-name');
    const emailInput = page.getByTestId('input-contact-email');
    const subjectInput = page.getByTestId('input-contact-subject');
    const messageInput = page.getByTestId('input-contact-message');

    await expect(nameInput).toBeEnabled();
    await expect(nameInput).toHaveAttribute('autocomplete', 'name');

    await expect(emailInput).toBeEnabled();
    await expect(emailInput).toHaveAttribute('autocomplete', 'email');
    await expect(emailInput).toHaveAttribute('autocapitalize', 'none');

    await expect(subjectInput).toBeEnabled();
    await expect(subjectInput).toHaveAttribute('autocomplete', 'off');

    await expect(messageInput).toBeEnabled();

    await nameInput.fill('Ada Lovelace');
    await emailInput.fill('ada@example.com');
    await subjectInput.fill('Architecture Inquiry');
    await messageInput.fill('Hello Felipe, testing the contact form.');
    await expect(nameInput).toHaveValue('Ada Lovelace');
  });

  test('404 page uses theme-aware background and text classes', async ({ page }) => {
    await page.goto('/non-existent-page-404');
    await expect(page.getByText('404 Page Not Found')).toBeVisible();
    const hardcodedGray = await page.locator('.bg-gray-50').count();
    expect(hardcodedGray).toBe(0);
  });
});
