"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleTheme = React.useCallback(() => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [resolvedTheme, setTheme]);

  return (
    <Button aria-label="Toggle theme" onClick={handleToggleTheme} size="icon" variant="outline">
      {mounted ? (
        resolvedTheme === "dark" ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )
      ) : (
        <Sun aria-hidden className="h-[1.2rem] w-[1.2rem] opacity-0" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
