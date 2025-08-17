import { Button } from "./ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function SSOButtons() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="w-full mt-4">
      <div className="flex items-center gap-2 mb-4">
        <hr className="flex-1 border-muted-foreground" />
        <span className="text-xs text-muted-foreground">OR</span>
        <hr className="flex-1 border-muted-foreground" />
      </div>

      <Button
        onClick={handleGoogleSignIn}
        variant="outline"
        className="w-full flex items-center gap-1.5"
      >
        <Image src="/google.svg" alt="google-logo" width={18} height={18} />
        Google
      </Button>
    </div>
  );
}
