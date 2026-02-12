import Link from "next/link";
import { Logo } from "@/components/block/Logo";

export default function Nav() {
  const navLinks: {
    label: string;
    href: string;
  }[] = [
    {
      href: "/login",
      label: "Login",
    },
    {
      label: "Contact",
      href: "https://tally.so/r/ODQJ2k",
    },
  ];
  return (
    <nav className="flex py-6 justify-between">
      <Logo showText />
      <div className="flex gap-6 items-center">
        {navLinks.map((link) => (
          <Link
            className="text-sm font-medium hover:underline"
            href={link.href}
            key={link.href}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            target={link.href.startsWith("http") ? "_blank" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
