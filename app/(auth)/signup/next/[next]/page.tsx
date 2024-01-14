import { SignUpPage } from "@/app/(auth)/signup/page";
import { headers as dynamic } from "next/headers";

export default function Login({
  params: { next },
}: {
  params: { next: string };
}) {
  dynamic();
  return <SignUpPage next={`/${next}`} />;
}
