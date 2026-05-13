import puppeteer from 'puppeteer';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { getAllBlogPosts } from '../server/content';

const SITE_URL = process.env.VITE_SITE_URL || 'http://localhost:3000';
const OUTPUT_DIR = join(process.cwd(), 'dist', 'public');

interface Route {
  path: string;
  outputPath: string;
}

async function ensureDirectory(path: string) {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function prerenderRoute(browser: any, route: Route): Promise<void> {
  const page = await browser.newPage();
  
  try {
    console.log(`Prerendering ${route.path}...`);
    
    // Navigate to the route
    await page.goto(`${SITE_URL}${route.path}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for React to hydrate and content to load
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // Wait a bit more for any async content
    await page.waitForTimeout(2000);

    // Get the rendered HTML
    const html = await page.content();

    // Extract just the body content (we'll inject it into the template)
    const bodyContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root ? root.innerHTML : '';
    });

    // Read the original index.html
    const indexPath = join(OUTPUT_DIR, 'index.html');
    let template = await readFile(indexPath, 'utf-8');

    // Replace the root div with pre-rendered content
    template = template.replace(
      /<div id="root"><\/div>/,
      `<div id="root">${bodyContent}</div>`
    );

    // Ensure output directory exists
    await ensureDirectory(route.outputPath);

    // Write the pre-rendered HTML
    await writeFile(route.outputPath, template, 'utf-8');
    
    console.log(`✅ Prerendered ${route.path} -> ${route.outputPath}`);
  } catch (error) {
    console.error(`❌ Error prerendering ${route.path}:`, error);
    throw error;
  } finally {
    await page.close();
  }
}

async function prerender() {
  console.log('🚀 Starting pre-rendering...');
  console.log(`Site URL: ${SITE_URL}`);
  console.log(`Output directory: ${OUTPUT_DIR}`);

  // Get all routes to prerender
  const posts = getAllBlogPosts();
  
  const routes: Route[] = [
    { path: '/', outputPath: join(OUTPUT_DIR, 'index.html') },
    { path: '/blog', outputPath: join(OUTPUT_DIR, 'blog', 'index.html') },
    { path: '/portfolio', outputPath: join(OUTPUT_DIR, 'portfolio', 'index.html') },
    { path: '/about', outputPath: join(OUTPUT_DIR, 'about', 'index.html') },
    { path: '/contact', outputPath: join(OUTPUT_DIR, 'contact', 'index.html') },
    // Blog posts
    ...posts.map(post => ({
      path: `/blog/${post.slug}`,
      outputPath: join(OUTPUT_DIR, 'blog', post.slug, 'index.html'),
    })),
  ];

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    // Prerender all routes
    for (const route of routes) {
      await prerenderRoute(browser, route);
    }

    console.log(`\n✅ Successfully prerendered ${routes.length} routes`);
  } catch (error) {
    console.error('❌ Prerendering failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Only run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  prerender().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { prerender };

