"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { signInGoogle } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function LoginButton({
  redirectUrl,
  text = "Sign up",
  showArrow = false,
  className,
}: {
  redirectUrl?: string;
  text: string;
  showArrow?: boolean;
  className?: string;
}) {
  return (
    <Button
      className={cn("hover:cursor-pointer ", className)}
      onClick={() =>
        signInGoogle({ callbackURL: redirectUrl ?? `${env.NEXT_PUBLIC_APP_URL}/dashboard` })
      }
    >
      <span className="btn-label">{text}</span>
      {showArrow && <ArrowRight />}
    </Button>
  );
}
