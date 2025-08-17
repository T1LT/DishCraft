import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { db, usersTable } from "./db";
import { compare } from "bcrypt";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";

const authOptions: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: "username" },
        password: { type: "password" },
      },
      authorize,
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};

async function authorize(
  credentials: Partial<Record<"username" | "password", unknown>>,
  req: Request
) {
  if (!credentials?.username) {
    // throw new Error('"username" is required in credentials');
    return null;
  }

  if (!credentials?.password || "string" !== typeof credentials.password) {
    // throw new Error('"password" is required in credentials');
    return null;
  }

  const reqId = req.headers.get("x-vercel-id") ?? nanoid();
  console.time(`fetch user for login ${reqId}`);
  const maybeUser = (
    await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.username} = ${credentials.username}`)
      .limit(1)
  )[0];
  console.timeEnd(`fetch user for login ${reqId}`);

  if (!maybeUser || !maybeUser.password) return null;

  console.time(`bcrypt ${reqId}`);
  if (!(await compare(credentials.password, maybeUser.password))) {
    return null;
  }
  console.timeEnd(`bcrypt ${reqId}`);

  return { id: maybeUser.id };
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
