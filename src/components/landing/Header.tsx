import Link from "next/link";
import { Logo } from "@/components/block/Logo";
import { ThemeSwitcher } from "../theme-switcher";

export default function Header() {
  const navLinks: { href: string; label: string }[] = [{ href: "/login", label: "Login" }];
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2">
        <Logo showText />
      </div>
      <nav className="space-x-3 flex items-center text-sm">
        {navLinks.map((link) => (
          <Link className="hover:underline" href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
        <ThemeSwitcher />
      </nav>
    </header>
  );
}
