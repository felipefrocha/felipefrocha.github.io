# Personal Portfolio & Blog PWA

A modern, performant Progressive Web App (PWA) for personal portfolio and markdown-based blog. Built with React, Vite, TypeScript, and Tailwind CSS, following atomic design principles and clean architecture.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run check
```

The development server will start at `http://localhost:3000`.

## 📚 Documentation

This project includes comprehensive documentation:

- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Complete guide for deploying to Cloudflare Pages
- **[Design Guidelines](./docs/design_guidelines.md)** - Design system, typography, colors, and component patterns
- **[Agents Guide](./AGENTS.md)** - Project architecture, tech stack, and development notes

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (Express server) |
| `npm run build:cloudflare` | Build for Cloudflare Pages deployment |
| `npm run start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `make deploy` | Build and deploy to Cloudflare Pages (requires [Makefile](./Makefile)) |

### Using Makefile (Recommended)

The project includes a comprehensive Makefile for common tasks:

```bash
# Show all available commands
make help

# Complete setup (install deps + wrangler)
make setup

# Build and deploy
make deploy PROJECT_NAME=your-project-name

# Clean build artifacts
make clean

# Check project status
make status
```

See the Makefile for all available commands.

## 📁 Project Structure

```
├── client/              # React frontend application
│   ├── public/         # Static assets (includes assets/ folder for images)
│   └── src/
│       ├── components/ # Atomic design components
│       │   ├── atoms/  # Basic UI elements
│       │   ├── molecules/ # Composed components
│       │   ├── organisms/ # Complex sections
│       │   ├── templates/ # Page layouts
│       │   └── ui/     # Shadcn UI components
│       ├── pages/      # Page components
│       ├── hooks/      # Custom React hooks
│       └── lib/        # Utilities and API clients
├── server/             # Express backend (development)
│   ├── routes.ts      # API route handlers
│   ├── content.ts     # Content management (JSON/Markdown)
│   └── static.ts      # Static file serving
├── functions/          # Cloudflare Pages Functions (API routes)
│   ├── api/           # API endpoints
│   └── lib/           # Shared utilities
├── content/            # Content files (JSON + Markdown)
│   ├── blog/          # Blog posts (Markdown)
│   ├── profile.json   # Profile information
│   ├── projects.json  # Portfolio projects
│   ├── skills.json    # Skills list
│   ├── socials.json   # Social media links
│   └── stats.json     # Statistics
├── docs/              # Documentation
├── shared/            # Shared types and schemas
└── script/            # Build scripts
```

## 🎨 Features

### Core Features

- ✅ **Progressive Web App (PWA)** - Installable, offline-capable
- ✅ **Dark/Light Mode** - Theme toggle with persistence
- ✅ **Responsive Design** - Mobile-first with sidebar navigation
- ✅ **Markdown Blog** - Write posts in Markdown
- ✅ **Atomic Design** - Scalable component architecture
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Accessibility** - ARIA labels, keyboard navigation, semantic HTML

### Pages

- **Home** (`/`) - Landing page with hero, featured work, recent posts
- **Blog** (`/blog`) - Blog listing with search and filtering
- **Blog Post** (`/blog/:slug`) - Individual blog post view
- **Portfolio** (`/portfolio`) - Projects showcase
- **About** (`/about`) - Biography, skills, and experience
- **Contact** (`/contact`) - Contact information and social links

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Component library
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **Framer Motion** - Animations

### Backend/API

- **Express** - Development server
- **Cloudflare Pages Functions** - Production API (serverless)
- **Markdown** - Blog content format (gray-matter)

### Deployment

- **Cloudflare Pages** - Hosting and edge functions
- **Wrangler CLI** - Cloudflare deployment tool

## 📝 Content Management

All content is managed through JSON and Markdown files in the `content/` directory:

### Profile

Edit `content/profile.json` to update:
- Name, tagline, bio
- Email, location
- Avatar image path (place image in `client/public/assets/`)

### Blog Posts

Add Markdown files to `content/blog/` with frontmatter:

```markdown
---
title: Your Post Title
excerpt: Short description
date: 2025-01-01
readTime: 5 min read
category: Category
tags: [tag1, tag2]
featured: true
---

Your blog post content here...
```

### Projects, Skills, Socials

Edit the respective JSON files in `content/`:
- `projects.json` - Portfolio projects
- `skills.json` - Skills list
- `socials.json` - Social media links
- `stats.json` - Statistics

## 🚀 Deployment

This project is optimized for deployment on **Cloudflare Pages**. See the [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

### Quick Deploy

```bash
# Using Makefile
make setup          # Install dependencies and Wrangler
make wrangler-login # Authenticate with Cloudflare
make deploy         # Build and deploy
```

Or manually:

```bash
npm run build:cloudflare
wrangler pages deploy dist/public --project-name=your-project-name
```

## 🎨 Design System

The project follows a comprehensive design system. See [Design Guidelines](./docs/design_guidelines.md) for:

- Typography system
- Color palette and theming
- Spacing and layout
- Component patterns
- Responsive breakpoints

## 🔧 Development

### Component Architecture

The project follows **Atomic Design** principles:

- **Atoms** - Basic building blocks (buttons, inputs, icons)
- **Molecules** - Simple component groups (cards, forms)
- **Organisms** - Complex sections (sidebar, hero, footer)
- **Templates** - Page layouts

### Adding New Features

1. Create components in the appropriate atomic level directory
2. Add types to `shared/schema.ts` if needed
3. Update content files in `content/` directory
4. Add routes in `server/routes.ts` and `functions/api/` for API endpoints

### Code Style

- TypeScript strict mode enabled
- ESLint configuration (if configured)
- Prettier formatting (if configured)
- Follow existing component patterns

## 🧪 Testing

Three layers, run locally and in CI:

```bash
npm test            # unit + integration (Vitest + Testing Library, jsdom)
npm run test:coverage  # same, with a V8 coverage report (./coverage)
npm run test:e2e    # end-to-end (Playwright, auto-starts the Vite dev server)
```

- **Unit / integration** specs live next to the code as `*.test.ts(x)`. They cover
  the content pipeline, SEO helpers, markdown rendering, the Cloudflare contact
  function, and the Supabase-backed comment layer (auth, data hooks, and UI).
- **E2E** specs live in `e2e/` as `*.spec.ts` and drive real browser flows
  (blog reading, navigation, i18n, and the comment login gate).
- **Coverage scope:** the 90% thresholds in `vitest.config.ts` apply to
  meaningful application code (`lib/`, `hooks/`, `core/`, `shared/`, the
  comment/SEO components, and `functions/api`). Vendored shadcn `ui/`
  primitives, `examples/`, generated content JSON, and entry/config files are
  intentionally excluded.

## 📖 Additional Resources

- [Deployment Guide](./docs/DEPLOYMENT.md) - Cloudflare Pages deployment
- [Supabase OAuth Setup](./docs/SUPABASE_OAUTH_SETUP.md) - Comments auth (GitHub + Google) and secrets
- [Design Guidelines](./docs/design_guidelines.md) - Design system reference
- [Agents Guide](./AGENTS.md) - Architecture and development notes

## 📄 License

MIT

## 👤 Author

Felipe F. Rocha

---

**Built with ❤️ using React, Vite, and TypeScript**

