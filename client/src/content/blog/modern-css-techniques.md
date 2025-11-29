---
title: Modern CSS Techniques You Should Know
excerpt: Explore the latest CSS features including container queries, cascade layers, and the :has selector.
date: 2025-11-15
readTime: 5 min read
category: CSS
tags:
  - css
  - web-development
  - design
featured: false
---

# Modern CSS Techniques You Should Know

CSS has evolved dramatically in recent years. Here are the modern features that will transform how you write styles.

## Container Queries

Finally, we can style elements based on their container size, not just the viewport:

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}

@container card (max-width: 399px) {
  .card {
    display: flex;
    flex-direction: column;
  }
}
```

This is game-changing for component-based design systems.

## The :has() Selector

The "parent selector" we've wanted for years:

```css
/* Style a card differently if it contains an image */
.card:has(img) {
  padding-top: 0;
}

/* Style form labels when their inputs are invalid */
label:has(+ input:invalid) {
  color: red;
}

/* Change page layout when sidebar is present */
main:has(+ aside) {
  grid-template-columns: 1fr 300px;
}
```

## Cascade Layers

Control specificity without specificity hacks:

```css
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; }
}

@layer base {
  body { font-family: system-ui; }
}

@layer components {
  .button { padding: 1rem 2rem; }
}

@layer utilities {
  .mt-4 { margin-top: 1rem; }
}
```

Later layers always win, regardless of selector specificity.

## Native CSS Nesting

No preprocessor needed:

```css
.card {
  padding: 1rem;
  
  & .title {
    font-size: 1.5rem;
  }
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
}
```

## Subgrid

Align nested grid items with parent grid:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.grid-item {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}
```

## Color Functions

Modern color manipulation:

```css
:root {
  --primary: oklch(60% 0.15 250);
  --primary-light: oklch(from var(--primary) calc(l + 20%) c h);
  --primary-dark: oklch(from var(--primary) calc(l - 20%) c h);
}

.button {
  background: var(--primary);
}

.button:hover {
  background: var(--primary-light);
}
```

## Scroll-Driven Animations

Animate based on scroll position:

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-on-scroll {
  animation: fade-in linear;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
```

## Conclusion

These CSS features reduce our dependence on JavaScript and preprocessors while making our styles more maintainable. Browser support is excellent for most of these features, so start using them today!
