import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://starobrnenskysenk.cz",
  output: "static",
  integrations: [sitemap()],
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
  }),
  build: {
    inlineStylesheets: "never",
  },
  vite: {
    build: {
      cssMinify: "lightningcss",
    },
  },
});
