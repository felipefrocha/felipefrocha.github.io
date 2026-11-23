import { test } from '@playwright/test';
import path from 'node:path';

/**
 * Visual capture (not a regression test). Skipped unless CAPTURE=1.
 *   CAPTURE=1 SNAP_DIR=/abs/out/dir npx playwright test e2e/visual
 */
const enabled = !!process.env.CAPTURE;
const outDir = process.env.SNAP_DIR ?? path.resolve('test-results/snapshots');

const pages = [
  { name: 'home', url: '/' },
  { name: 'blog', url: '/blog' },
  { name: 'blog-post', url: '/blog/agentic-sdlc' },
  { name: 'kubecon2026', url: '/kubecon-2026' },
  { name: 'kubecon2026-stage', url: '/kubecon-2026#step-3' },
  { name: 'portfolio', url: '/portfolio' },
  { name: 'about', url: '/about' },
  { name: 'contact', url: '/contact' },
  { name: '404', url: '/this-route-does-not-exist' },
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const themes = ['light', 'dark'] as const;

test.describe('visual capture', () => {
  test.skip(!enabled, 'set CAPTURE=1 to run');

  for (const vp of viewports) {
    for (const theme of themes) {
      for (const p of pages) {
        test(`${p.name}-${vp.name}-${theme}`, async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
          await page.addInitScript((t) => {
            localStorage.setItem('theme', t);
            localStorage.setItem('i18nextLng', 'en');
          }, theme);
          await page.goto(p.url, { waitUntil: 'load' });
          // Some pages (e.g. contact w/ third-party widgets) never go fully idle.
          await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
          // Scroll through to trigger lazy/in-view content, then back to top.
          await page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += 600) {
              window.scrollTo(0, y);
              await new Promise((r) => setTimeout(r, 50));
            }
            window.scrollTo(0, 0);
          });
          await page.waitForTimeout(500);
          await page.screenshot({
            path: path.join(outDir, `${p.name}-${vp.name}-${theme}.png`),
            fullPage: true,
            animations: 'disabled',
          });
          if (p.name === 'kubecon2026') {
            await page.screenshot({
              path: path.join(outDir, `kubecon2026-hero-${vp.name}-${theme}.png`),
              fullPage: false,
              animations: 'disabled',
            });
            await page.evaluate(() => {
              document.getElementById('answer')?.scrollIntoView({ block: 'start', behavior: 'instant' });
            });
            await page.waitForTimeout(200);
            await page.screenshot({
              path: path.join(outDir, `kubecon2026-answer-${vp.name}-${theme}.png`),
              fullPage: false,
              animations: 'disabled',
            });
            await page.evaluate(() => {
              document.getElementById('map')?.scrollIntoView({ block: 'start', behavior: 'instant' });
            });
            await page.waitForTimeout(200);
            await page.screenshot({
              path: path.join(outDir, `kubecon2026-matrix-${vp.name}-${theme}.png`),
              fullPage: false,
              animations: 'disabled',
            });
          }
        });
      }
    }
  }
});
