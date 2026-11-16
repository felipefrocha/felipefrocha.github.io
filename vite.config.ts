import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react({
      // Fast Refresh is enabled by default in @vitejs/plugin-react
      // This ensures optimal HMR for React components
    }),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectManifest: {
        injectionPoint: undefined, // We are handling our own precaching logic via SW caches.addAll
      },
      manifest: false, // We already have a static manifest.json in public/
      devOptions: {
        enabled: false,
      }
    }),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src", "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "src", "shared"),
      "@core": path.resolve(import.meta.dirname, "src", "core"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "src", "client"),
  // Env files (.env) live at the repo root, not under the Vite `root`.
  envDir: import.meta.dirname,
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }
          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/scheduler/") ||
            id.includes("/node_modules/wouter/")
          ) {
            return "react-vendor";
          }
          if (
            id.includes("/node_modules/framer-motion/") ||
            id.includes("/node_modules/motion-dom/") ||
            id.includes("/node_modules/motion-utils/") ||
            id.includes("/node_modules/lucide-react/") ||
            id.includes("/node_modules/@radix-ui/")
          ) {
            return "ui-vendor";
          }
          if (
            id.includes("/node_modules/marked/") ||
            id.includes("/node_modules/dompurify/")
          ) {
            return "markdown-vendor";
          }
          if (id.includes("/node_modules/@tanstack/")) {
            return "query-vendor";
          }
          if (
            id.includes("/node_modules/i18next") ||
            id.includes("/node_modules/react-i18next/")
          ) {
            return "i18n-vendor";
          }
          return undefined;
        },
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  // Optimize HMR updates
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
