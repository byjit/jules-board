"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GoHome() {
  return (
    <Link
      className={cn(
        "flex items-center p-0",
        buttonVariants({
          variant: "link",
        })
      )}
      href={"/"}
    >
      <ArrowLeft className="h-4 w-4" />
      Home
    </Link>
  );
}

export function GoBack({
  className,
  text = "back",
  variant = "ghost",
}: {
  className?: string;
  text?: string;
  variant?: "ghost" | "link" | "default";
}) {
  return (
    <Button
      className={className}
      onClick={() => window.history.back()}
      size={"sm"}
      type="button"
      variant={variant}
    >
      <ArrowLeft className="h-4 w-4" /> {text}
    </Button>
  );
}
