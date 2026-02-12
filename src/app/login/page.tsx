import { getSession } from "auth";
import { redirect } from "next/navigation";
import { Logo } from "@/components/block/Logo";
import { LoginButton } from "@/components/login-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full min-h-screen">
      {/* Left Side - Login Form */}
      <div className="flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-2 mb-8">
            <Logo showText />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
            <p className="text-muted-foreground">
              Welcome. Let&apos;s create your account first. Sign in by clicking here.
            </p>
          </div>

          <div className="space-y-4">
            <LoginButton
              className={cn(buttonVariants({ size: "lg" }))}
              redirectUrl="/dashboard"
              showArrow
              text="Sign in with Google"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
