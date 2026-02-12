"use client";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function SuperButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 z-50 hidden md:block"
      exit={{ opacity: 0, y: 20 }}
      initial={{ opacity: 0, y: 20 }}
      whileHover={{ x: -10 }}
    >
      <Button
        className="transform bg-primary rotate-90 origin-bottom-right px-4 pb-4 pt-9"
        data-tally-auto-close="1000"
        data-tally-hide-title="1"
        data-tally-open="wQjYxg"
        data-tally-width="540"
      >
        <Lightbulb className="size-4" /> <p className="tracking-wide">Give feedback</p>
      </Button>
    </motion.div>
  );
}
