import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

if (!process.env.POSTGRES_URL) {
  throw new Error(
    "POSTGRES_URL is not defined."
  );
}

export default {
  schema: "./app/db.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  }
} satisfies Config;
