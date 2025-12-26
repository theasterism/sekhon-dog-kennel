import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const UserTable = sqliteTable("user", {
  id: integer().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  passwordHash: text().notNull(),
  createdAt: integer({ mode: "timestamp_ms" }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
  updatedAt: integer({ mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
  displayUsername: text(),
});

export const SessionTable = sqliteTable(
  "session",
  {
    id: text().primaryKey(),
    userId: integer()
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    expiresAt: integer({ mode: "timestamp" }).notNull(),
    createdAt: integer({ mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer({ mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const DogTable = sqliteTable("dog", {
  id: text().primaryKey(),
  name: text().notNull(),
  breed: text(),
  age: integer(),
  gender: text({ enum: ["male", "female"] }),
  size: text({ enum: ["small", "medium", "large"] }),
  description: text(),
  isAvailable: integer({ mode: "boolean" }).default(true),
  price: real(),
  createdAt: integer({ mode: "timestamp_ms" }).default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`).notNull(),
  updatedAt: integer({ mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});

export const DogImageTable = sqliteTable(
  "dog_image",
  {
    id: text().primaryKey(),
    dogId: text()
      .notNull()
      .references(() => DogTable.id, { onDelete: "cascade" }),
    r2Key: text().notNull(),
    isPrimary: integer({ mode: "boolean" }).default(false),
    displayOrder: integer().default(0),
    createdAt: integer({ mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer({ mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("dog_image_dog_id_idx").on(table.dogId)],
);

export const ApplicationTable = sqliteTable(
  "application",
  {
    id: text().primaryKey(),
    dogId: text()
      .notNull()
      .references(() => DogTable.id, { onDelete: "cascade" }),
    applicantName: text().notNull(),
    email: text().notNull(),
    phone: text().notNull(),
    address: text(),
    status: text("status", { enum: ["pending", "approved", "rejected"] }).default("pending"),
    createdAt: integer({ mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer({ mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("application_dog_id_idx").on(table.dogId)],
);
