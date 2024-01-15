import { SignUpPage } from "@/app/(auth)/signup/page";
import { headers as dynamic } from "next/headers";

export default function SignUp({
  params: { next },
}: {
  params: { next: string };
}) {
  dynamic();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUpPage next={`/${next}`} />
    </div>
  );
}
