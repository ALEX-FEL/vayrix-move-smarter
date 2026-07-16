// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon-192.jpeg", "icons/icon-512.jpeg"],
      manifest: {
        name: "Vayrix",
        short_name: "Vayrix",
        description: "Application de course mobile Vayrix",
        start_url: "/",
        display: "standalone",
        background_color: "#0A0E27",
        theme_color: "#0A0E27",
        orientation: "portrait",
        icons: [
          {
            src: "/icons/icon-192.jpeg",
            sizes: "192x192",
            type: "image/jpeg",
          },
          {
            src: "/icons/icon-512.jpeg",
            sizes: "512x512",
            type: "image/jpeg",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
