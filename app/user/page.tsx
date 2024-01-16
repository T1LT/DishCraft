import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { db, usersTable } from "@/app/db";
import { sql } from "drizzle-orm";

export default async function UserPage() {
  const session = await auth();

  if (!session?.user?.id) redirect("/login/next/user");

  const user = (
    await db
      .select()
      .from(usersTable)
      .where(sql`${usersTable.id} = ${session.user.id}`)
      .limit(1)
  )[0];

  if (!user) redirect("/login/next/user");

  return <div>{user.username}</div>;
}
