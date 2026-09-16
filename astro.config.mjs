import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig, sessionDrivers } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
  site: "https://aljannahcenter.com",
  output: "server",
  adapter: cloudflare({ imageService: "passthrough" }),
  session: {
    driver: sessionDrivers.cloudflareR2Binding({
      binding: "MEDIA",
      base: "sessions",
    }),
  },
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB" }),
      storage: r2({ binding: "MEDIA" }),
      plugins: [],
      marketplace: "https://marketplace.emdashcms.com",
    }),
  ],
  devToolbar: { enabled: false },
});
