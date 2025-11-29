# Personal Portfolio & Blog PWA

## Overview
A Progressive Web App (PWA) personal portfolio and landing page with a markdown-based blog system. Built with React, Vite, and Tailwind CSS following atomic design principles and clean architecture.

## Current State
- **Phase**: Frontend prototype complete
- **Status**: Ready for user review

## Project Architecture

### Atomic Design Structure
```
client/src/components/
├── atoms/           # Basic UI elements (ThemeToggle, SocialIcon, SkillTag, etc.)
├── molecules/       # Composed components (ProfileCard, BlogPostCard, ProjectCard, etc.)
├── organisms/       # Complex sections (AppSidebar, HeroSection, Footer, etc.)
├── templates/       # Page layouts (MainLayout)
└── examples/        # Component demos for testing
```

### Pages
- `/` - Home landing page with hero, featured work, blog posts, about, and connect sections
- `/blog` - Blog listing with search and category filtering
- `/blog/:slug` - Individual blog post view
- `/portfolio` - Portfolio projects showcase
- `/about` - About page with bio and skills
- `/contact` - Contact form with social links

### Key Features
- **PWA Support**: manifest.json configured for installable app
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Semantic HTML5**: Proper use of header, main, footer, article, section, nav, aside
- **Responsive Design**: Mobile-first with sidebar navigation
- **Accessibility**: Skip links, ARIA labels, keyboard navigation
- **Social Integration**: GitHub, LinkedIn, Instagram links

## Tech Stack
- React 19 + Vite
- TypeScript
- Tailwind CSS with custom design system
- Shadcn UI components
- Wouter for routing
- Framer Motion for animations
- TanStack Query for data fetching

## User Preferences
- Atomic design approach
- Clean architecture
- Progressive Web App
- Markdown-based blog (build-time)
- Sidebar navigation layout

## Recent Changes
- Nov 29, 2025: Initial frontend prototype created
  - Implemented all atomic components
  - Created full page structure
  - Set up PWA configuration
  - Added dark mode support

## Next Steps (Backend)
1. Set up markdown blog content processing
2. Create API routes for blog posts
3. Implement contact form submission
4. Add service worker for offline support
