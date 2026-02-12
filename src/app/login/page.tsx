import { getSession } from "auth";
import Image from "next/image";
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
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Login Form */}
      <div className="flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex items-center gap-2 mb-8">
            <Logo showText />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
            <p className="text-muted-foreground">
              Welcome. You are just a step away from unlocking a new experience.
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

      {/* Right Side - Image & Testimonial */}
      <div className="hidden lg:block relative bg-muted">
        <Image
          alt="Login visual"
          className="object-cover"
          fill
          priority
          src="https://images.unsplash.com/photo-1762115331515-9740ca3dcd21"
        />
      </div>
    </div>
  );
}
