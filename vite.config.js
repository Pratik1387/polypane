import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "PolyPane — Multi-Language Translator",
        short_name: "PolyPane",
        description: "Type once, see 4 languages instantly with pronunciation.",
        theme_color: "#0d0d1a",
        background_color: "#0d0d1a",
        display: "standalone",
        orientation: "landscape",
        start_url: "/",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ]
});
