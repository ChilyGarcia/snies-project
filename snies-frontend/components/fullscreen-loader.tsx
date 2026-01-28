"use client";
import { Loader2 } from "lucide-react";
export function FullscreenLoader({ title = "Cargando…", subtitle = "Por favor espera un momento.", }: {
    title?: string;
    subtitle?: string;
}) {
    return (<div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-background/70 backdrop-blur p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center ring-1 ring-border/60">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          </div>
        </div>
      </div>
    </div>);
}
