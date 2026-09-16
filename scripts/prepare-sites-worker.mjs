import { copyFileSync, existsSync } from "node:fs";

const entrypoint = "dist/server/entry.mjs";
const compatibilityEntrypoint = "dist/server/index.js";

if (!existsSync(entrypoint)) {
  throw new Error(`Missing Astro worker entrypoint: ${entrypoint}`);
}

copyFileSync(entrypoint, compatibilityEntrypoint);
console.log(`Created Sites-compatible worker entrypoint: ${compatibilityEntrypoint}`);
