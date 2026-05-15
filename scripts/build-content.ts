import fs from 'node:fs';
import path from 'node:path';
import {
  getAllBlogPosts,
  getProfile,
  getSocialLinks,
  getProjects,
  getSkills,
  getStats,
  getFeaturedBlogPosts
} from '../src/core/content/index';

const PUBLIC_API_DIR = path.join(process.cwd(), 'src/client/public/api');

function writeJson(filePath: string, data: any) {
  const fullPath = path.join(PUBLIC_API_DIR, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
}

async function buildContent() {
  console.log("Generating static JSON content for API...");
  
  // Clean old API directory
  if (fs.existsSync(PUBLIC_API_DIR)) {
    fs.rmSync(PUBLIC_API_DIR, { recursive: true, force: true });
  }

  const langs = ['en', 'es', 'pt'];

  // Global endpoints
  writeJson('profile.json', getProfile());
  writeJson('socials.json', getSocialLinks());
  writeJson('projects.json', getProjects());
  writeJson('skills.json', getSkills());
  writeJson('stats.json', getStats());

  const allPosts = getAllBlogPosts();

  for (const lang of langs) {
    // Language specific posts
    const uniquePosts = new Map();
    for (const post of allPosts) {
      if (post.language === lang) {
        uniquePosts.set(post.slug, post);
      } else if (post.language === 'en' && !uniquePosts.has(post.slug)) {
        uniquePosts.set(post.slug, post);
      }
    }
    const langPosts = Array.from(uniquePosts.values());
    
    // Write posts array
    writeJson(`${lang}/posts.json`, langPosts);

    // Write featured posts
    writeJson(`${lang}/posts/featured.json`, getFeaturedBlogPosts(3, lang));

    // Write aggregated site data
    writeJson(`${lang}/site-data.json`, {
      profile: getProfile(),
      socials: getSocialLinks(),
      projects: getProjects(),
      skills: getSkills(),
      stats: getStats(),
      featuredPosts: getFeaturedBlogPosts(3, lang),
    });

    // Write individual posts
    for (const post of langPosts) {
      writeJson(`${lang}/posts/${post.slug}.json`, post);
    }
  }

  console.log("✅ Static JSON API generated successfully in public/api/");
}

buildContent().catch(console.error);