import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="mb-20 flex flex-col justify-center items-center gap-6 text-center">
      <h1 className="text-5xl font-normal tracking-tight">
        Build complete apps with <br />
        your Jules agent
      </h1>

      <p className="max-w-lg text-muted-foreground leading-relaxed">
        A modern Kanban board to manage your Jules agent projects easily.
      </p>

      <div className="flex items-center gap-4">
        <Link href={"/login"}>
          <Button className="rounded-full" size={"lg"}>
            Get started
            <ArrowRight />
          </Button>
        </Link>
      </div>
    </section>
  );
}
