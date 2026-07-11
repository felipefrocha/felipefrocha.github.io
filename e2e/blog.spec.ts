import { test, expect } from '@playwright/test';

const POST_SLUG = 'agentic-sdlc';

test.describe('Blog reading experience', () => {
  test('home page renders the hero and navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Felipe/i);
    // Primary navigation is present.
    await expect(page.getByRole('link', { name: /blog/i }).first()).toBeVisible();
  });

  test('blog listing shows posts and links to a post', async ({ page }) => {
    await page.goto('/blog');
    const firstPost = page.locator('a[href^="/blog/"]').first();
    await expect(firstPost).toBeVisible();
    await firstPost.click();
    await expect(page).toHaveURL(/\/blog\/.+/);
    await expect(page.getByTestId('text-post-title')).toBeVisible();
  });

  test('a post renders markdown content and SEO title', async ({ page }) => {
    await page.goto(`/blog/${POST_SLUG}`);
    await expect(page.getByTestId('text-post-title')).toBeVisible();
    // marked renders real headings/lists inside the article.
    await expect(page.locator('article h2, article h3').first()).toBeVisible();
    await expect(page).toHaveTitle(/.+\|\s*Felipe/);
  });

  test('comments section shows a login gate for anonymous readers', async ({ page }) => {
    await page.goto(`/blog/${POST_SLUG}`);
    const comments = page.getByTestId('comments-section');
    await comments.scrollIntoViewIfNeeded();
    await expect(comments.getByRole('heading', { name: /comments/i })).toBeVisible();
    await expect(page.getByTestId('button-signin-github')).toBeVisible();
    await expect(page.getByTestId('button-signin-google')).toBeVisible();
    // Anonymous users cannot see a comment composer.
    await expect(page.getByTestId('input-comment')).toHaveCount(0);
  });
});
