# Cloudflare Pages Deployment Guide

This guide will help you deploy your portfolio/blog PWA to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account (free tier works)
2. Node.js installed (version 18 or higher)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Option 1: Deploy via Wrangler CLI (Recommended for testing)

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

### Step 3: Build the project

```bash
npm run build:cloudflare
```

This will:
- Build the React frontend to `dist/public`
- Bundle all content files (blog posts, profile, etc.) into the Functions
- Prepare everything for Cloudflare Pages

### Step 4: Deploy

```bash
wrangler pages deploy dist/public --project-name=feliperocha-systems
```

Replace `feliperocha-systems` with your desired project name.

## Option 2: Deploy via Cloudflare Dashboard (Recommended for production)

### Step 1: Push your code to a Git repository

Push your code to GitHub, GitLab, or Bitbucket if you haven't already.

### Step 2: Create a new Cloudflare Pages project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Pages**
3. Click **Create a project** → **Connect to Git**
4. Select your Git provider and authorize Cloudflare
5. Select your repository

### Step 3: Configure build settings

In the build configuration:

- **Project name**: `feliperocha-systems` (or your preferred name)
- **Production branch**: `main` (or your default branch)
- **Framework preset**: `None` or `Vite`
- **Build command**: `npm run build:cloudflare`
- **Build output directory**: `dist/public`
- **Root directory**: `/` (leave as default)

### Step 4: Add environment variables (if needed)

If you have any environment variables, add them in the project settings:
- Go to **Settings** → **Environment Variables**
- Add any required variables (e.g., API keys)

### Step 5: Deploy

Click **Save and Deploy**. Cloudflare will:
1. Clone your repository
2. Install dependencies (`npm install`)
3. Run the build command
4. Deploy both the static files and Functions

## Project Structure for Cloudflare Pages

```
/
├── functions/              # Cloudflare Pages Functions (API routes)
│   ├── api/
│   │   ├── posts.ts
│   │   ├── profile.ts
│   │   └── ...
│   ├── lib/
│   │   └── content.ts     # Content management
│   └── _init.ts           # Auto-generated content bundle
├── dist/
│   └── public/            # Built frontend (deployed)
├── content/               # Source content files
├── client/                # React frontend source
└── wrangler.toml          # Cloudflare configuration
```

## How It Works

1. **Frontend**: The React app is built as static files in `dist/public`
2. **API Routes**: Each file in `functions/api/` becomes an API endpoint
   - `functions/api/posts.ts` → `/api/posts`
   - `functions/api/profile.ts` → `/api/profile`
   - etc.
3. **Content**: Content files are bundled at build time into `functions/_init.ts` and loaded by Functions at runtime

## Custom Domain (Optional)

1. Go to your Pages project in Cloudflare Dashboard
2. Click **Custom domains**
3. Add your domain
4. Follow the DNS configuration instructions

## Environment Variables

If you need environment variables:

1. Go to **Settings** → **Environment Variables** in your Pages project
2. Add variables for Production, Preview, and Branch previews
3. Access them in Functions using `env` parameter:

```typescript
export async function onRequest(context: { env: Env }): Promise<Response> {
  const apiKey = context.env.API_KEY;
  // ...
}
```

## Updating Content

To update blog posts or profile information:

1. Edit files in the `content/` directory
2. Commit and push to your repository
3. Cloudflare Pages will automatically rebuild and deploy

## Troubleshooting

### Functions not working

- Ensure `functions/_init.ts` is generated during build
- Check that Functions import `../_init` or `../../_init` correctly
- Verify build output includes the `functions/` directory

### Build failures

- Check build logs in Cloudflare Dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Cloudflare Pages uses Node.js 18 by default)

### Content not loading

- Verify content files exist in `content/` directory
- Check that `build-cloudflare.ts` successfully loads all content
- Review Function logs in Cloudflare Dashboard

## Support

For more information:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Pages Functions Documentation](https://developers.cloudflare.com/pages/platform/functions/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

