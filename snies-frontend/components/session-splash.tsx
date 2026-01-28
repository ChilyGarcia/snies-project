"use client";
import { motion, useReducedMotion } from "framer-motion";
export function SessionSplash() {
    const reduceMotion = useReducedMotion();
    return (<div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="relative w-full max-w-md">
        
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"/>
          <div className="absolute -bottom-16 right-[-4rem] h-64 w-64 rounded-full bg-muted/60 blur-3xl"/>
        </div>

        <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }} className="rounded-3xl border border-border bg-background/70 backdrop-blur p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-2xl bg-white ring-1 ring-border shadow-xs flex items-center justify-center overflow-hidden">
              <img src="/logo-fesc.png" alt="FESC" className="h-9 w-9 object-contain"/>
              {!reduceMotion ? (<motion.span aria-hidden="true" className="absolute inset-0 rounded-2xl ring-2 ring-primary/30" animate={{ opacity: [0.15, 0.5, 0.15] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}/>) : null}
            </div>

            <div className="min-w-0">
              <div className="text-sm font-semibold">Validando sesión</div>
              <div className="text-xs text-muted-foreground">
                Preparando tu dashboard…
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="h-2 rounded-full bg-muted/50 overflow-hidden ring-1 ring-border/50">
              <motion.div className="h-full bg-primary/60" initial={{ x: "-60%" }} animate={{ x: "120%" }} transition={reduceMotion
            ? { duration: 0 }
            : { duration: 1.1, repeat: Infinity, ease: "easeInOut" }}/>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>SNIES</span>
              <span>Seguridad</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>);
}
