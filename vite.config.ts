import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";
import { prerenderOgPages } from "./build/prerender-og-pages";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    imagetools({
      defaultDirectives: (url) => {
        // Automatically convert to WebP and create optimized versions
        return new URLSearchParams({
          format: "webp",
          quality: "85",
        });
      },
    }),
    // Generate static HTML files for /blog/:slug pages with correct OG meta tags
    // so social crawlers can see per-article images (they don't execute JS).
    prerenderOgPages({
      siteUrl: "https://schebet-moj.lovable.app",
      defaultOgImage: "https://schebet-moj.lovable.app/og-images/default.jpg",
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.JPG", "**/*.jpg", "**/*.jpeg", "**/*.png", "**/*.webp"],
}));

