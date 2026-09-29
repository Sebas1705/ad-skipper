import { defineConfig } from "wxt";

// https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    name: "Ad Skipper",
    description: "Clicks the Skip button on video ads as soon as it appears.",
    // Ask for the least that works. Every permission is questioned in the
    // Chrome Web Store review, and each one is a warning at install time.
    permissions: ["storage"],
  },
});
