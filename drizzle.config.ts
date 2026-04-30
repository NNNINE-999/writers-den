import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./writers-den.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
