import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src', 'client', 'src'),
      '@shared': path.resolve(import.meta.dirname, 'src', 'shared'),
      '@core': path.resolve(import.meta.dirname, 'src', 'core'),
      '@assets': path.resolve(import.meta.dirname, 'attached_assets'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // Playwright e2e specs live under e2e/ and use their own runner.
    exclude: ['e2e/**', 'node_modules/**', 'dist/**', '.wrangler/**'],
    css: false,
    // Ensure the Supabase-backed comment UI renders in unit/integration tests.
    env: {
      VITE_SUPABASE_URL: 'https://test.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'sb_publishable_test_key',
      VITE_SITE_URL: 'https://www.feliperocha.systems',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      all: true,
      // 90% target is applied to meaningful application code only — vendored
      // shadcn primitives, demos, generated content, and entry/config files
      // are intentionally excluded (see README "Testing").
      include: [
        'src/client/src/lib/api.ts',
        'src/client/src/lib/markdown.ts',
        'src/client/src/lib/structuredData.ts',
        'src/client/src/lib/utils.ts',
        'src/client/src/lib/queryClient.ts',
        'src/client/src/lib/supabase.ts',
        'src/client/src/lib/i18n.ts',
        'src/client/src/hooks/useAuth.tsx',
        'src/client/src/hooks/useComments.ts',
        'src/client/src/hooks/useSiteData.ts',
        'src/client/src/hooks/useTheme.ts',
        'src/client/src/components/atoms/SEO.tsx',
        'src/client/src/components/atoms/SocialIcon.tsx',
        'src/client/src/components/atoms/StatNumber.tsx',
        'src/client/src/components/atoms/SkillTag.tsx',
        'src/client/src/components/atoms/ThemeToggle.tsx',
        'src/client/src/components/atoms/LanguageSwitcher.tsx',
        'src/client/src/components/molecules/CommentForm.tsx',
        'src/client/src/components/molecules/CommentItem.tsx',
        'src/client/src/components/organisms/CommentsSection.tsx',
        'src/core/content/index.ts',
        'src/shared/schema.ts',
        'functions/api/contact.ts',
      ],
      thresholds: {
        statements: 90,
        lines: 90,
        functions: 90,
        branches: 85,
      },
    },
  },
});
