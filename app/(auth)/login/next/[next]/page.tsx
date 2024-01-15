import { LoginPage } from "@/app/(auth)/login/page";
import { headers as dynamic } from "next/headers";

export default function Login({
  params: { next },
}: {
  params: { next: string };
}) {
  dynamic();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginPage next={`/${next}`} />
    </div>
  );
}
