import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './src/server/db/.drizzle',
  schema: './src/server/db/schema.ts',
  casing: "snake_case",
  dialect: "sqlite",
  dbCredentials: {
  url: './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/cfac2df05a7d90dcd1286aa4feace15b238010c90980b580b603cabad260149f.sqlite'
  },
})
