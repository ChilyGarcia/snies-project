"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const reduceMotion = useReducedMotion();
    useEffect(() => {
        setMounted(true);
    }, []);
    const isDark = theme === "dark";
    return (<Button type="button" variant="outline" size="sm" className="relative h-9 gap-2 rounded-full border-border bg-background/60 px-3 text-xs font-medium shadow-xs backdrop-blur hover:bg-muted/40 hover:text-foreground overflow-hidden" aria-label={mounted ? `Cambiar a tema ${isDark ? "claro" : "oscuro"}` : "Cambiar tema"} onClick={() => setTheme(isDark ? "light" : "dark")} disabled={!mounted}>
      
      <motion.span aria-hidden="true" initial={false} animate={{
            opacity: 1,
            x: isDark ? 8 : -8,
        }} transition={reduceMotion ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }} className="pointer-events-none absolute inset-0 bg-linear-to-r from-muted/70 via-transparent to-muted/70"/>

      
      <span className="relative flex h-6 w-12 items-center rounded-full bg-muted/60 ring-1 ring-border/50">
        <motion.span aria-hidden="true" initial={false} animate={{ x: isDark ? 24 : 2 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 450, damping: 30 }} className="absolute left-0 top-0.5 h-5 w-5 rounded-full bg-background shadow-sm ring-1 ring-border flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (<motion.span key="sun" initial={{ opacity: 0, rotate: -20, scale: 0.9 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 20, scale: 0.9 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.18 }}>
                <Sun className="h-3.5 w-3.5"/>
              </motion.span>) : (<motion.span key="moon" initial={{ opacity: 0, rotate: 20, scale: 0.9 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: -20, scale: 0.9 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.18 }}>
                <Moon className="h-3.5 w-3.5"/>
              </motion.span>)}
          </AnimatePresence>
        </motion.span>
      </span>

      <span className="relative hidden sm:inline">{isDark ? "Oscuro" : "Claro"}</span>
    </Button>);
}
