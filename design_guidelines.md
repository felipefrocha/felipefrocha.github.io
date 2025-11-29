# Design Guidelines: Personal Portfolio & Blog Platform

## Design Approach

**Selected Approach:** Reference-Based with Design System Foundation
- **Primary References:** Linear (navigation/typography), Vercel (developer portfolio aesthetic), Notion (content organization)
- **Supporting System:** Shadcn UI component patterns with Tailwind utilities
- **Design Principles:** Clean minimalism, content-first hierarchy, professional developer aesthetic

## Core Design Elements

### Typography System
- **Primary Font:** Inter or Geist from Google Fonts
- **Hierarchy:**
  - Hero/Page Titles: text-5xl md:text-6xl font-bold tracking-tight
  - Section Headers: text-3xl md:text-4xl font-semibold
  - Subsections: text-xl md:text-2xl font-medium
  - Body: text-base leading-relaxed
  - Captions/Meta: text-sm text-muted-foreground
- **Blog Typography:** Optimized for reading with max-w-prose containers

### Layout System
**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24
- **Sidebar:** Fixed w-64 (desktop), collapsible mobile drawer
- **Content Container:** max-w-6xl mx-auto with px-6 md:px-8
- **Section Padding:** py-16 md:py-20 for major sections, py-8 md:py-12 for subsections
- **Card Spacing:** p-6 with gap-6 between elements
- **Grid Gaps:** gap-6 for cards, gap-4 for list items

### Layout Structure

**Sidebar Navigation (Fixed Left):**
- Profile section at top: Avatar (rounded-full w-16 h-16), name (text-lg font-semibold), tagline (text-sm)
- Navigation links with active state indicators
- Social media icons at bottom (GitHub, LinkedIn, Instagram) - 24x24 from Heroicons
- Mobile: Hamburger menu converting to drawer

**Main Content Area:**
- Offset by sidebar width (ml-64 on lg+)
- Full-width hero section (80vh min-height)
- Content sections with consistent vertical rhythm

**Footer:**
- Full-width spanning beyond sidebar
- Newsletter signup form + quick links + social icons
- Copyright and build timestamp
- Sticky positioning consideration for blog navigation

## Component Library

### Homepage Sections (5-7 sections)

1. **Hero Section (80-100vh)**
   - Large typographic statement: "Developer. Writer. Creator."
   - Animated gradient text effect on key words
   - Scroll indicator at bottom
   - NO background image - pure typography focus

2. **Featured Work Grid (2-column md, 3-column lg)**
   - Project cards with hover lift effect (transform scale-105)
   - Each card: thumbnail, title, tech stack tags, brief description
   - "View Portfolio" CTA linking to /portfolio path

3. **Recent Blog Posts (Masonry-style grid)**
   - 2-3 featured posts with larger cards
   - Meta info: date, read time, category tag
   - Card structure: p-6 border rounded-lg hover:shadow-lg transition

4. **About/Skills Section (Asymmetric 2-column)**
   - Left: Brief bio with max-w-prose
   - Right: Skill tags in flowing layout (flex flex-wrap gap-2)
   - Tech stack icons displayed inline

5. **Social Proof/Stats (3-4 column grid)**
   - Metrics: GitHub stars, blog readers, projects completed
   - Large numbers (text-4xl font-bold) with labels below

6. **Connect Section**
   - Social media cards in grid (2x2)
   - Each platform: icon, handle, follower count, CTA
   - Distinct card treatment per platform

7. **Footer/Newsletter**
   - Email signup form (inline layout: input + button)
   - Quick navigation links
   - Social icons repeated

### Blog Layout Components

**Blog Index:**
- Filter/category tags at top (sticky)
- Card grid with featured image, title, excerpt, meta
- Pagination with numbered pages

**Blog Post Template:**
- Breadcrumb navigation
- Article header: title (text-4xl), meta info, author card
- Markdown content with max-w-prose mx-auto
- Syntax highlighting blocks with rounded corners
- Table of contents sidebar (sticky, hidden on mobile)
- Related posts at bottom (3-column grid)

### Navigation Components
- **Sidebar Nav Items:** py-2 px-4 rounded-md with active state border-l-2
- **Mobile Menu:** Slide-in drawer from left, full-height overlay
- **Breadcrumbs:** text-sm with chevron separators

### Interactive Elements
- **Buttons:** Primary (filled), Secondary (outlined), Ghost - use Shadcn button variants
- **Cards:** border rounded-lg p-6 hover:shadow-md transition-shadow
- **Links:** Underline on hover with offset-2
- **Form Inputs:** Consistent h-10 with ring focus states

## PWA-Specific Design

- **Install Prompt:** Floating bottom banner (dismissible) with CTA
- **Offline Indicator:** Toast notification with refresh action
- **App Icon Design:** Simple monogram in circle, works at all sizes

## Accessibility & Performance
- Focus rings: ring-2 ring-offset-2 visible on keyboard navigation
- Skip to content link at top
- ARIA labels on icon-only buttons
- Reduced motion support with prefers-reduced-motion queries

## Animation Budget (Minimal)
- Page transitions: Fade in content with 300ms delay
- Card hover: Subtle lift (translateY(-4px))
- Link underlines: Width transition
- **NO:** Parallax, scroll-triggered animations, complex entrance effects

## Images
- **Hero:** NO image - typography-focused design
- **Portfolio Cards:** Project thumbnails (16:9 aspect ratio)
- **Blog Posts:** Featured images (2:1 aspect ratio)
- **About Section:** Professional headshot (square, 400x400)
- **Social Cards:** Platform logo icons