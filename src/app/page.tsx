import Footer from "@/components/landing/Footer";
import Gallery from "@/components/landing/Gallery";
import Hero from "@/components/landing/Hero";
import Nav from "@/components/landing/Nav";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="min-h-screen max-w-5xl mx-auto font-sans selection:primary/20">
        <Nav />
        <main className="py-20 md:py-32">
          <Hero />
          <Gallery />
        </main>
        <Footer />
      </div>
    </HydrateClient>
  );
}
