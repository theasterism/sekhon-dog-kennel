import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const UserTable = sqliteTable("user", {
  id: integer().primaryKey(),
  username: text().notNull(),
  passwordHash: text().notNull(),
  createdAt: integer({ mode: "timestamp_ms" }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
  updatedAt: integer({ mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  displayUsername: text(),
});

export const SessionTable = sqliteTable("session", {
  id: text().primaryKey(),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
  createdAt: integer({ mode: "timestamp_ms" }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
  updatedAt: integer({ mode: "timestamp_ms" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
