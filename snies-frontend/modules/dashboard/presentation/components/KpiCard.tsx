"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export type KpiVariant =
  | "emerald"
  | "blue"
  | "violet"
  | "orange"
  | "cyan"
  | "slate";

const KPI_STYLES: Record<
  KpiVariant,
  {
    ring: string;
    iconBg: string;
    iconFg: string;
    spark: string;
    glow: string;
    border: string;
  }
> = {
  emerald: {
    ring: "ring-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    iconFg: "text-emerald-600 dark:text-emerald-400",
    spark: "#10b981",
    glow: "shadow-emerald-500/10",
    border: "border-emerald-200/50 dark:border-emerald-800/50",
  },
  blue: {
    ring: "ring-blue-500/20",
    iconBg: "bg-blue-500/10",
    iconFg: "text-blue-600 dark:text-blue-400",
    spark: "#3b82f6",
    glow: "shadow-blue-500/10",
    border: "border-blue-200/50 dark:border-blue-800/50",
  },
  violet: {
    ring: "ring-violet-500/20",
    iconBg: "bg-violet-500/10",
    iconFg: "text-violet-600 dark:text-violet-400",
    spark: "#8b5cf6",
    glow: "shadow-violet-500/10",
    border: "border-violet-200/50 dark:border-violet-800/50",
  },
  orange: {
    ring: "ring-orange-500/20",
    iconBg: "bg-orange-500/10",
    iconFg: "text-orange-600 dark:text-orange-400",
    spark: "#f97316",
    glow: "shadow-orange-500/10",
    border: "border-orange-200/50 dark:border-orange-800/50",
  },
  cyan: {
    ring: "ring-cyan-500/20",
    iconBg: "bg-cyan-500/10",
    iconFg: "text-cyan-600 dark:text-cyan-400",
    spark: "#06b6d4",
    glow: "shadow-cyan-500/10",
    border: "border-cyan-200/50 dark:border-cyan-800/50",
  },
  slate: {
    ring: "ring-slate-500/20",
    iconBg: "bg-slate-500/10",
    iconFg: "text-slate-600 dark:text-slate-400",
    spark: "#64748b",
    glow: "shadow-slate-500/10",
    border: "border-slate-200/50 dark:border-slate-800/50",
  },
};

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  variant: KpiVariant;
  spark?: Array<{ period: string; value: number }>;
  loading?: boolean;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  variant,
  spark,
  loading,
}: KpiCardProps) {
  const s = KPI_STYLES[variant];

  return (
    <motion.div
      className="h-full"
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: "easeOut" },
        },
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card
        className={`group relative overflow-hidden bg-card/50 backdrop-blur-sm border transition-all duration-300 hover:shadow-lg ${s.border} ${s.glow} hover:shadow-xl h-full`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent dark:from-white/5 pointer-events-none" />

        <div
          className="absolute top-0 right-0 p-32 rounded-full opacity-[0.03] transform translate-x-12 -translate-y-12 pointer-events-none"
          style={{ backgroundColor: s.spark }}
        />

        <CardContent className="relative p-5 flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                {title}
              </p>
              {loading ? (
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-8 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                </div>
              ) : (
                <div className="space-y-0.5">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground font-feature-settings-tnum">
                    {value}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground">
                    {subtitle}
                  </p>
                </div>
              )}
            </div>

            <div
              className={`shrink-0 p-2.5 rounded-xl ring-1 transition-colors duration-300 group-hover:bg-opacity-20 ${s.ring} ${s.iconBg} ${s.iconFg}`}
            >
              {icon}
            </div>
          </div>

          {!loading && spark && spark.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="h-10 w-full overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spark}>
                    <defs>
                      <linearGradient
                        id={`gradient-${variant}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={s.spark}
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor={s.spark}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={s.spark}
                      strokeWidth={2}
                      fill={`url(#gradient-${variant})`}
                      isAnimationActive={true}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
