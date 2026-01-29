"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { KpiVariant } from "./KpiCard";

interface ChartCardProps {
  title: string;
  description?: string;
  loading?: boolean;
  children: React.ReactNode;
  variant?: KpiVariant;
  className?: string;
}

export function ChartCard({ title, description, loading, children, variant = "slate", className }: ChartCardProps) {
   // Mapping simplified styles just for border/accents if needed, 
   // but keeping it cleaner for charts to let the data shine.
   const glowClass = {
       emerald: "shadow-emerald-500/5",
       blue: "shadow-blue-500/5",
       violet: "shadow-violet-500/5",
       orange: "shadow-orange-500/5",
       cyan: "shadow-cyan-500/5",
       slate: "shadow-slate-500/5"
   }[variant];

  return (
    <Card className={`overflow-hidden border-border/60 bg-card/60 backdrop-blur-md shadow-sm transition-all hover:shadow-md ${glowClass} ${className}`}>
      <CardHeader className="pb-2 border-b border-border/40 bg-muted/20">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <CardTitle className="text-lg font-semibold tracking-tight text-foreground/90">
                    {title}
                </CardTitle>
                {description && (
                    <CardDescription className="text-xs font-medium uppercase tracking-wide opacity-80">
                        {description}
                    </CardDescription>
                )}
            </div>
            {/* Optional: Add action buttons or indicators here */}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4 rounded opacity-50" />
            <Skeleton className="h-[280px] w-full rounded-2xl opacity-80" />
          </div>
        ) : (
          <div className="w-full animate-in fade-in zoom-in-95 duration-500">
              {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
