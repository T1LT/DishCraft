import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  pgTable,
  text,
  index,
  integer,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";
import { nolookalikes } from "nanoid-dictionary";
import { sql } from "drizzle-orm";

// init nanoid
const nanoid = customAlphabet(nolookalikes, 12);

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL env variable not set.");
}

neonConfig.fetchConnectionCache = true;

export const db = drizzle(
  neon(process.env.POSTGRES_URL, {
    fetchOptions: {
      cache: "no-store",
    },
  }),
);

export const usersTable = pgTable(
  "users",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    username: varchar("username", { length: 256 }).notNull().unique(),
    email: varchar("email", { length: 256 }),
    password: varchar("password", { length: 256 }).notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    username_idx: index("username_idx").on(t.username),
  }),
);

export const genUserId = () => {
  return `user_${nanoid(12)}`;
};

export const recipesTable = pgTable(
  "recipes",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    image_url: varchar("image_url", { length: 256 }),
    cuisine: varchar("cuisine", { length: 256 }).notNull(),
    category: varchar("category", { length: 256 }).notNull(),
    ingredients: text("ingredients"),
    procedure: text("procedure"),
    username: varchar("username", { length: 256 }),
    likes: integer("likes").notNull().default(0),
    submitted_by: varchar("submitted_by", { length: 256 }).references(
      () => usersTable.id,
      { onDelete: "set null" },
    ),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    trgm_idx: index("trgm_idx")
      .on(t.title)
      .concurrently()
      .using(sql`gin (title gin_trgm_ops)`),
    created_at_idx: index("created_at_idx").on(t.created_at),
    cuisine_idx: index("cuisine_idx").on(t.cuisine),
    category_idx: index("category_idx").on(t.category),
  }),
);

export const genRecipeId = () => {
  return `recipe_${nanoid(12)}`;
};

export const likesTable = pgTable("likes", {
  id: varchar("id", { length: 256 }).primaryKey().notNull(),
  recipe_id: varchar("recipe_id", { length: 256 })
    .notNull()
    .references(() => recipesTable.id),
  user_id: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => usersTable.id),
});

export const genLikeId = () => {
  return `comment_${nanoid(12)}`;
};
