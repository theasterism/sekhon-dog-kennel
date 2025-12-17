import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const cloudflareEnv = process.env.CLOUDFLARE_ENV;

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    cloudflare({
      viteEnvironment: { name: "ssr" },
      ...(cloudflareEnv ? { environment: cloudflareEnv } : {}),
      persistState: true,
    }),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
});
