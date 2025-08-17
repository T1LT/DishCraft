import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  pgTable,
  text,
  index,
  integer,
  varchar,
  timestamp,
  unique,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";
import { nolookalikes } from "nanoid-dictionary";
import { sql } from "drizzle-orm";
import type { AdapterAccount } from "@auth/core/adapters";

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
  })
);

export const usersTable = pgTable(
  "user",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    username: varchar("username", { length: 256 }).unique(),
    name: varchar("name", { length: 256 }),
    email: varchar("email", { length: 256 }).unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    password: varchar("password", { length: 256 }),
    image: varchar("image", { length: 256 }),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    username_idx: index("username_idx").on(t.username),
  })
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
    prepTime: integer("prepTime").notNull(),
    ingredients: text("ingredients").notNull(),
    procedure: text("procedure").notNull(),
    username: varchar("username", { length: 256 }),
    likes: integer("likes").notNull().default(0),
    submitted_by: varchar("submitted_by", { length: 256 }).references(
      () => usersTable.id,
      { onDelete: "set null" }
    ),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    trgm_idx: index("trgm_idx")
      .on(t.title)
      .concurrently()
      .using(
        sql`gin (title gin_trgm_ops, cuisine gin_trgm_ops, category gin_trgm_ops)`
      ),
    created_at_idx: index("created_at_idx").on(t.created_at),
  })
);

export const genRecipeId = () => {
  return `recipe_${nanoid(12)}`;
};

export const likesTable = pgTable(
  "likes",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    recipe_id: varchar("recipe_id", { length: 256 })
      .notNull()
      .references(() => recipesTable.id),
    user_id: varchar("user_id", { length: 256 })
      .notNull()
      .references(() => usersTable.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    unq: unique().on(t.recipe_id, t.user_id),
  })
);

export const genLikeId = () => {
  return `like_${nanoid(12)}`;
};

export const genAccountId = () => {
  return `account_${nanoid(12)}`;
};

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: unique().on(account.provider, account.providerAccountId),
  })
);

// export const sessions = pgTable("session", {
//   sessionToken: text("sessionToken").primaryKey(),
//   userId: text("userId")
//     .notNull()
//     .references(() => usersTable.id, { onDelete: "cascade" }),
//   expires: timestamp("expires", { mode: "date" }).notNull(),
// });

// export const verificationTokens = pgTable(
//   "verificationToken",
//   {
//     identifier: text("identifier").notNull(),
//     token: text("token").notNull(),
//     expires: timestamp("expires", { mode: "date" }).notNull(),
//   },
//   (verificationToken) => ({
//     compositePk: primaryKey({
//       columns: [verificationToken.identifier, verificationToken.token],
//     }),
//   })
// );

// export const authenticators = pgTable(
//   "authenticator",
//   {
//     credentialID: text("credentialID").notNull().unique(),
//     userId: text("userId")
//       .notNull()
//       .references(() => usersTable.id, { onDelete: "cascade" }),
//     providerAccountId: text("providerAccountId").notNull(),
//     credentialPublicKey: text("credentialPublicKey").notNull(),
//     counter: integer("counter").notNull(),
//     credentialDeviceType: text("credentialDeviceType").notNull(),
//     credentialBackedUp: boolean("credentialBackedUp").notNull(),
//     transports: text("transports"),
//   },
//   (authenticator) => ({
//     compositePK: primaryKey({
//       columns: [authenticator.userId, authenticator.credentialID],
//     }),
//   })
// );
