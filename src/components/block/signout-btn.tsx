"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function SignOutBtn({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <Button
      className={cn("cursor-pointer", className)}
      onClick={async () =>
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/"); // redirect to login page
            },
          },
        })
      }
      variant={"destructive"}
    >
      Sign Out
    </Button>
  );
}
