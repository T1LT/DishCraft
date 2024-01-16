import Link from "next/link";
import { cookies } from "next/headers";
import { auth } from "@/app/auth";
import { db, usersTable } from "@/app/db";
import { sql } from "drizzle-orm";
import { Logout } from "./logout";
import { Button } from "@/components/ui/button";

export async function AuthNav({ type }: { type?: "dropdown" | undefined }) {
  if (!cookies().getAll().length) return <LoggedOut type={type} />;

  const session = await auth();

  if (!session?.user?.id) return <LoggedOut type={type} />;

  const user = (
    await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.id} = ${session.user.id}`)
      .limit(1)
  )[0];

  if (!user) {
    console.error("user not found in db, invalid session", session);
    return <LoggedOut type={type} />;
  }

  return <Logout type={type} />;
}

function LoggedOut({ type }: { type?: "dropdown" | undefined }) {
  if (type === "dropdown") {
    return (
      <Link href="/login" className="hover:underline font-semibold">
        Login
      </Link>
    );
  } else {
    return (
      <div className="w-full flex justify-end">
        <Button
          asChild
          className="h-8 py-5 px-4 rounded-full hidden lg:flex lg:col-span-1"
        >
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }
}

export async function AddLink() {
  const session = await auth();

  return (
    <Link
      href={session?.user?.id ? "/add-recipe" : "/login/next/add-recipe"}
      className="hover:underline underline-offset-4 flex gap-1"
    >
      Add <span className="block lg:hidden">a Recipe</span>
    </Link>
  );
}

export async function UsernameLabel() {
  const session = await auth();

  if (!session?.user?.id) return <h1>Hello There!</h1>;

  const user = (
    await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.id} = ${session.user.id}`)
      .limit(1)
  )[0];

  return <h1>Hello {user.username}!</h1>;
}
