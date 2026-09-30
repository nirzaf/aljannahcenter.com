import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { cloudflareEmail } from "@emdash-cms/cloudflare/plugins";
import { defineConfig, sessionDrivers } from "astro/config";
import emdash from "emdash/astro";

export default defineConfig({
  site: "https://aljannahcentre.com",
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
    // The adapter must inject the R2 bucket object into the session driver.
    sessionKVBindingName: "MEDIA",
  }),
  session: {
    driver: sessionDrivers.cloudflareR2Binding({
      binding: "MEDIA",
      base: "sessions",
    }),
  },
  integrations: [
    react(),
    emdash({
      siteUrl: "https://aljannahcentre.com",
      database: d1({ binding: "DB" }),
      storage: r2({ binding: "MEDIA" }),
      plugins: [cloudflareEmail({
        binding: "EMAIL",
        from: { email: "login@cms.aljannahcentre.com", name: "Al-Jannah Centre" },
        replyTo: "info@aljannahcentre.com",
      })],
      marketplace: "https://marketplace.emdashcms.com",
    }),
  ],
  devToolbar: { enabled: false },
});
