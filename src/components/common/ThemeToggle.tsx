"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  /** Classes for the button wrapper (sizing, border, etc.). */
  className?: string;
  /** Classes for the sun/moon icon (sizing). */
  iconClassName?: string;
};

/**
 * Light/dark mode toggle with an animated sun↔moon swap.
 * Renders nothing until mounted to avoid a hydration mismatch.
 */
export default function ThemeToggle({ className, iconClassName }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex items-center justify-center rounded-lg border border-border/50 bg-transparent text-foreground transition-colors hover:bg-accent",
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className={cn("h-4 w-4", iconClassName)} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className={cn("h-4 w-4", iconClassName)} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
