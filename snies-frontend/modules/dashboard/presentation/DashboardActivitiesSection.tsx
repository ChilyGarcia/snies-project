"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { toast } from "sonner";
import { Loader2, RefreshCw, Activity, FilterX, Wallet, Clock, BookOpenText, ShieldCheck, AlignEndHorizontal, Users2, UserCheck2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { motion, useReducedMotion } from "framer-motion";

import { getDashboardStats } from "@/modules/dashboard/api/dashboard-stats.api";
import type { DashboardStatsResponse } from "@/modules/dashboard/types/dashboard-stats";
import { buildTimeSeriesChartData, normalizeTopList } from "@/modules/dashboard/utils/stats-normalizers";

// Components
import { KpiCard } from "./components/KpiCard";
import { ChartCard } from "./components/ChartCard";
import { TopBar, TopPie } from "./components/DashboardCharts";

export function DashboardActivitiesSection() {
  const currentYear = String(new Date().getFullYear());
  const reduceMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<"all" | "filtered">("all");
  const [year, setYear] = useState(currentYear);
  const [semester, setSemester] = useState<number>(1);
  const [topN, setTopN] = useState<number>(10);

  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) setLoading(true);
      else setRefreshing(true);
      setError(null);
      const data =
        viewMode === "all"
          ? await getDashboardStats({ topN })
          : await getDashboardStats({ year, semester, topN });
      setStats(data);

      const availableYears = data.filters_available?.years ?? [];
      const availableSemesters = data.filters_available?.semesters ?? [];
      if (viewMode === "filtered" && availableYears.length && !availableYears.includes(year)) {
        setYear(availableYears[0]);
      }
      if (viewMode === "filtered" && availableSemesters.length && !availableSemesters.includes(semester)) {
        setSemester(availableSemesters[0]);
      }
    } catch (e) {
      setStats(null);
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      if (!opts?.silent) setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, year, semester, topN]);

  const filters = stats?.filters_available;
  const yearOptions = filters?.years?.length ? filters.years : [currentYear];
  const semesterOptions = filters?.semesters?.length ? filters.semesters : [1, 2];

  const ceTeachersTotal = Number(stats?.continuing_education_teachers?.totals?.records ?? 0);
  const ceTotalRecords = Number(stats?.continuing_education?.totals?.records ?? 0);
  const ceTotalValue = Number(stats?.continuing_education?.totals?.total_value ?? 0);
  const ceTotalHours = Number(stats?.continuing_education?.totals?.total_hours ?? 0);
  const ceBenefTotalRecords = Number(stats?.continuing_education_beneficiaries?.totals?.records ?? 0);
  const ceBenefTotalPeople = Number(stats?.continuing_education_beneficiaries?.totals?.beneficiaries_total ?? 0);
  const hrTotal = Number(stats?.wellbeing?.human_resources?.totals?.records ?? 0);
  const wellbeingActivitiesTotal = Number(stats?.wellbeing?.activities?.totals?.records ?? 0);
  const wellbeingBenefTotalRecords = Number(stats?.wellbeing?.beneficiaries?.totals?.records ?? 0);
  const wellbeingBenefTotalPeople = Number(stats?.wellbeing?.beneficiaries?.totals?.beneficiaries_total ?? 0);
  const usersTotal = Number(stats?.users?.total ?? 0);
  const rolesTotal = Number(stats?.users?.roles_total ?? 0);
  const coursesTotal = Number(stats?.courses?.total ?? 0);
  const coursesActive = Number((stats?.courses?.by_active ?? []).find((x) => x.is_active)?.count ?? 0);

  const wellbeingNationalFunding = stats?.wellbeing?.activities?.totals?.national_funding_total ?? null;
  const wellbeingInternationalFunding = stats?.wellbeing?.activities?.totals?.international_funding_total ?? null;

  const teachersByCourse = useMemo(
    () =>
      normalizeTopList(stats?.continuing_education_teachers?.by_course_top, {
        labelKeys: ["course_code", "code", "course", "name", "label"],
        valueKeys: ["total", "count", "records", "value"],
      }),
    [stats]
  );

  const teachersByDocType = useMemo(
    () =>
      normalizeTopList(stats?.continuing_education_teachers?.by_document_type_top, {
        labelKeys: ["document_type_id", "document_type", "type", "name", "label"],
        valueKeys: ["total", "count", "records", "value"],
      }),
    [stats]
  );

  const benefByCourse = useMemo(
    () =>
      normalizeTopList(stats?.continuing_education_beneficiaries?.by_course_top, {
        labelKeys: ["course_code", "code", "course", "name", "label"],
        valueKeys: ["total", "count", "records", "value", "beneficiaries_total"],
      }),
    [stats]
  );

  const benefByType = useMemo(
    () =>
      normalizeTopList(stats?.continuing_education_beneficiaries?.by_type_top, {
        labelKeys: ["beneficiary_type_extension_id", "beneficiary_type_id", "type", "name", "label"],
        valueKeys: ["total", "count", "records", "value", "beneficiaries_total"],
      }),
    [stats]
  );

  const hrByActivity = useMemo(
    () =>
      normalizeTopList(stats?.wellbeing?.human_resources?.by_activity_top, {
        labelKeys: ["activity_code", "activity", "name", "label"],
        valueKeys: ["total", "count", "records", "value"],
      }),
    [stats]
  );

  const hrByOrgUnit = useMemo(
    () =>
      normalizeTopList(stats?.wellbeing?.human_resources?.by_org_unit_top, {
        labelKeys: ["organization_unit_code", "org_unit", "unit", "name", "label"],
        valueKeys: ["total", "count", "records", "value"],
      }),
    [stats]
  );

  const hrByDocType = useMemo(
    () =>
      normalizeTopList(stats?.wellbeing?.human_resources?.by_document_type_top, {
        labelKeys: ["document_type_id", "document_type", "type", "name", "label"],
        valueKeys: ["total", "count", "records", "value"],
      }),
    [stats]
  );

  const hrByDedication = useMemo(
    () =>
      normalizeTopList(stats?.wellbeing?.human_resources?.by_dedication_top, {
        labelKeys: ["dedication", "name", "label"],
        valueKeys: ["total", "count", "records", "value"],
      }),
    [stats]
  );

  const timeSeries = useMemo(() => buildTimeSeriesChartData(stats?.time_series), [stats]);

  const COLORS = ["#16a34a", "#2563eb", "#a855f7", "#f97316", "#ef4444", "#0ea5e9", "#64748b"];
  const SERIES_LABELS: Record<string, string> = {
    continuing_education: "Educación continua",
    continuing_education_teachers: "Docentes (Ed. continua)",
    continuing_education_beneficiaries: "Beneficiarios (Ed. continua)",
    wellbeing_activities: "Actividades de bienestar",
    wellbeing_beneficiaries: "Beneficiarios de bienestar",
    wellbeing_human_resources: "Recursos humanos (bienestar)",
  };
  const SERIES_ORDER = [
    "continuing_education",
    "continuing_education_teachers",
    "continuing_education_beneficiaries",
    "wellbeing_activities",
    "wellbeing_beneficiaries",
    "wellbeing_human_resources",
  ];
  const seriesKeys = useMemo(() => {
    const available = new Set(timeSeries.keys);
    const ordered = SERIES_ORDER.filter((k) => available.has(k));
    if (ordered.length) return ordered;
    return timeSeries.keys;
  }, [timeSeries.keys]);

  const kpiSpark = useMemo(() => {
    const slice = (key: string) =>
      timeSeries.rows
        .slice(Math.max(0, timeSeries.rows.length - 8))
        .map((r) => ({ period: r.period as string, value: Number((r as any)[key] ?? 0) }));

    return {
      continuing_education: slice("continuing_education"),
      continuing_education_teachers: slice("continuing_education_teachers"),
      continuing_education_beneficiaries: slice("continuing_education_beneficiaries"),
      wellbeing_activities: slice("wellbeing_activities"),
      wellbeing_beneficiaries: slice("wellbeing_beneficiaries"),
      wellbeing_human_resources: slice("wellbeing_human_resources"),
    };
  }, [timeSeries.rows]);

  const formatMoneyCOP = (n: number) => {
    try {
      return n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
    } catch {
      return `$ ${n.toLocaleString("es-CO")}`;
    }
  };

  const formatMaybeMoney = (raw: string | null) => {
    if (!raw) return "—";
    const n = Number(raw);
    if (!Number.isFinite(n)) return raw;
    return formatMoneyCOP(n);
  };

  if (error) {
    return (
      <section className="mt-8">
        <div className="container mx-auto px-4 md:px-8 lg:px-20 py-6 md:py-8">
          <EmptyState title="No se pudieron cargar estadísticas" description={error} actionLabel="Reintentar" onActionClick={() => fetchStats()} />
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className="mt-6 space-y-8 pb-12"
      initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
        <div className="container mx-auto px-4 lg:px-6 xl:px-8 space-y-6">
          {/* Header & Filter Toolbar */}
          <Card className="border-border/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-sm ring-1 ring-border/50 sticky top-4 z-30 transition-shadow hover:shadow-md">
            <CardContent className="p-4 md:p-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                
                {/* Brand & Title */}
                <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/20 flex items-center justify-center shrink-0 shadow-inner">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground/90">
                          R-SNIES
                        </h1>
                        <div className="h-4 w-[1px] bg-border mx-1" />
                        <span className="text-sm font-medium text-muted-foreground/80">Dashboard de Métricas</span>
                      </div>
                       <p className="text-xs text-muted-foreground mt-0.5">
                        {viewMode === "all" ? "Visualizando histórico completo" : `Filtrado: ${year} - Semestre ${semester}`}
                      </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 w-full lg:w-auto items-stretch lg:items-center">
                  
                  {/* Mode Toggle */}
                  <div className="relative inline-flex items-center p-1 rounded-xl bg-muted/40 border border-border/40">
                    <motion.div
                      className="absolute inset-y-1 rounded-lg bg-background shadow-xs ring-1 ring-black/5 dark:ring-white/5"
                      layoutId="mode-pill"
                      style={{
                        left: viewMode === "all" ? 4 : "50%",
                        width: "calc(50% - 4px)", 
                      }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                    <button
                      onClick={() => setViewMode("all")}
                      disabled={loading}
                      className={`relative z-10 flex-1 px-4 py-1.5 text-sm font-medium transition-colors ${viewMode === "all" ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"}`}
                    >
                      Histórico
                    </button>
                    <button
                      onClick={() => setViewMode("filtered")}
                      disabled={loading}
                      className={`relative z-10 flex-1 px-4 py-1.5 text-sm font-medium transition-colors ${viewMode === "filtered" ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"}`}
                    >
                      Filtrado
                    </button>
                  </div>

                  <div className="h-8 w-[1px] bg-border hidden lg:block mx-1" />

                  {/* Filters */}
                  {viewMode === "filtered" && (
                    <>
                      <Select value={year} onValueChange={setYear} disabled={loading}>
                        <SelectTrigger className="w-full sm:w-[100px] bg-background/50">
                          <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent><div className="max-h-[200px] overflow-y-auto">{yearOptions.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</div></SelectContent>
                      </Select>
                      <Select value={String(semester)} onValueChange={(v) => setSemester(Number(v))} disabled={loading}>
                        <SelectTrigger className="w-full sm:w-[130px] bg-background/50">
                          <SelectValue placeholder="Semestre" />
                        </SelectTrigger>
                        <SelectContent>{semesterOptions.map(s => <SelectItem key={s} value={String(s)}>Semestre {s}</SelectItem>)}</SelectContent>
                      </Select>
                    </>
                  )}

                  <Select value={String(topN)} onValueChange={(v) => setTopN(Number(v))} disabled={loading}>
                       <SelectTrigger className="w-full sm:w-[100px] bg-background/50">
                          <SelectValue placeholder="Top" />
                       </SelectTrigger>
                       <SelectContent>
                           {[5, 10, 20].map(n => <SelectItem key={n} value={String(n)}>Top {n}</SelectItem>)}
                       </SelectContent>
                  </Select>

                  <Button
                    size="icon"
                    variant="outline"
                    className="shrink-0 bg-background/50"
                    onClick={() => {
                        toast.info("Actualizando datos...");
                        void fetchStats({ silent: true });
                    }}
                    disabled={loading || refreshing}
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6"
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05 } }
            }}
            initial="hidden"
            animate="show"
          >
            <KpiCard
              title="Usuarios"
              value={usersTotal.toLocaleString("es-CO")}
              subtitle={`${rolesTotal.toLocaleString("es-CO")} roles`}
              icon={<ShieldCheck className="h-5 w-5" />}
              variant="slate"
              loading={loading}
            />
            <KpiCard
              title="Cursos Activos"
              value={coursesActive.toLocaleString("es-CO")}
              subtitle={`de ${coursesTotal.toLocaleString("es-CO")} cursos`}
              icon={<BookOpenText className="h-5 w-5" />}
              variant="blue"
              loading={loading}
            />
            <KpiCard
              title="Ed. Continua"
              value={ceTotalRecords.toLocaleString("es-CO")}
              subtitle="Registros Totales"
              icon={<Activity className="h-5 w-5" />}
              variant="emerald"
              spark={kpiSpark.continuing_education}
              loading={loading}
            />
             <KpiCard
              title="Valor Total EC"
              value={formatMoneyCOP(ceTotalValue)}
              subtitle="COP Recaudado"
              icon={<Wallet className="h-5 w-5" />}
              variant="emerald"
              loading={loading}
            />
            <KpiCard
              title="Docentes EC"
              value={ceTeachersTotal.toLocaleString("es-CO")}
              subtitle="Registros"
              icon={<UserCheck2 className="h-5 w-5" />}
              variant="violet"
              spark={kpiSpark.continuing_education_teachers}
              loading={loading}
            />
            <KpiCard
              title="Beneficiarios EC"
              value={ceBenefTotalRecords.toLocaleString("es-CO")}
              subtitle={`${ceBenefTotalPeople.toLocaleString("es-CO")} personas`}
              icon={<Users2 className="h-5 w-5" />}
              variant="orange"
              spark={kpiSpark.continuing_education_beneficiaries}
              loading={loading}
            />
            <KpiCard
              title="Horas Total EC"
              value={ceTotalHours.toLocaleString("es-CO")}
              subtitle="Horas dictadas"
              icon={<Clock className="h-5 w-5" />}
              variant="slate"
              loading={loading}
            />
            <KpiCard
              title="RH Bienestar"
              value={hrTotal.toLocaleString("es-CO")}
              subtitle="Registros"
              icon={<Activity className="h-5 w-5" />}
              variant="cyan"
              spark={kpiSpark.wellbeing_human_resources}
              loading={loading}
            />
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
               <ChartCard title="Docentes · Top Cursos" description="Cursos con más registros de docentes" loading={loading} variant="emerald">
                  <TopBar data={teachersByCourse} color="#10b981" />
               </ChartCard>
               <ChartCard title="Docentes · Tipo Documento" description="Distribución por tipo de documento" loading={loading} variant="violet">
                  <TopPie data={teachersByDocType} colors={COLORS} />
               </ChartCard>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartCard title="Beneficiarios · Top Cursos" description="Cursos con mayor volumen de personas" loading={loading} variant="blue">
                    <TopBar data={benefByCourse} color="#3b82f6" />
                </ChartCard>
                <ChartCard title="Beneficiarios · Tipo" description="Distribución por tipo de beneficiario" loading={loading} variant="orange">
                    <TopPie data={benefByType} colors={COLORS} />
                </ChartCard>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                 <ChartCard title="Recursos Humanos · Top Actividades" description="Actividades con más personal asignado" loading={loading} variant="cyan">
                    <TopBar data={hrByActivity} color="#06b6d4" />
                 </ChartCard>
                 <ChartCard title="Recursos Humanos · Top Unidades" description="Unidades con más registros" loading={loading} variant="orange">
                    <TopBar data={hrByOrgUnit} color="#f97316" />
                 </ChartCard>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ChartCard title="Recursos Humanos · Tipo Documento" description="Distribución por documento" loading={loading} variant="violet">
                     <TopPie data={hrByDocType} colors={COLORS} />
                </ChartCard>
                <ChartCard title="Recursos Humanos · Dedicación" description="Distribución por tipo de dedicación" loading={loading} variant="cyan">
                     <TopBar data={hrByDedication} color="#0ea5e9" />
                </ChartCard>
          </div>

          {/* Special Section: Wellbeing Summary & Time Series */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
               {/* Wellbeing Summary */}
               <Card className="xl:col-span-1 border-border/60 bg-card/40 backdrop-blur-md overflow-hidden flex flex-col">
                   <div className="p-5 border-b border-border/40 bg-muted/20">
                      <h3 className="text-base font-semibold">Resumen de Bienestar</h3>
                      <p className="text-xs text-muted-foreground mt-1">Impacto general y financiación</p>
                   </div>
                   <div className="p-6 space-y-6 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                 <span className="text-xs text-muted-foreground uppercase tracking-wider">Actividades</span>
                                 <div className="text-2xl font-bold">{wellbeingActivitiesTotal.toLocaleString("es-CO")}</div>
                             </div>
                             <div className="space-y-1">
                                 <span className="text-xs text-muted-foreground uppercase tracking-wider">Beneficiarios</span>
                                 <div className="text-2xl font-bold">{wellbeingBenefTotalRecords.toLocaleString("es-CO")}</div>
                             </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-dashed border-border">
                             <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground">Financiación Nacional</span>
                                  <span className="font-medium font-mono">{formatMaybeMoney(wellbeingNationalFunding)}</span>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground">Financiación Internacional</span>
                                  <span className="font-medium font-mono">{formatMaybeMoney(wellbeingInternationalFunding)}</span>
                             </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <span className="text-xs text-muted-foreground">Tendencia Reciente (Beneficiarios)</span>
                             <div className="h-20 w-full rounded-lg bg-orange-500/5 ring-1 ring-orange-500/10 overflow-hidden">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <AreaChart data={kpiSpark.wellbeing_beneficiaries}>
                                          <Area type="monotone" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.1} strokeWidth={2} />
                                      </AreaChart>
                                  </ResponsiveContainer>
                             </div>
                        </div>
                   </div>
               </Card>

               {/* Time Series Chart */}
               <Card className="xl:col-span-2 border-border/60 bg-card/40 backdrop-blur-md overflow-hidden">
                    <div className="p-5 border-b border-border/40 bg-muted/20 flex justify-between items-center">
                         <div>
                            <h3 className="text-base font-semibold">Tendencia Histórica</h3>
                            <p className="text-xs text-muted-foreground mt-1">Evolución de registros por periodo</p>
                         </div>
                    </div>
                    <div className="p-6">
                        {loading ? (
                             <div className="h-[350px] flex items-center justify-center">
                                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
                             </div>
                        ) : (
                             <div className="h-[350px] w-full">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={timeSeries.rows} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
                                          <XAxis dataKey="period" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                          <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                                          <Tooltip 
                                              contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                              labelStyle={{ fontWeight: 600, color: "var(--foreground)", marginBottom: 8 }}
                                          />
                                          <Legend wrapperStyle={{ paddingTop: 20 }} />
                                          {seriesKeys.slice(0, 7).map((k, idx) => (
                                              <Line
                                                  key={k}
                                                  type="monotone"
                                                  dataKey={k}
                                                  name={SERIES_LABELS[k] ?? k}
                                                  stroke={COLORS[idx % COLORS.length]}
                                                  strokeWidth={3}
                                                  dot={false}
                                                  activeDot={{ r: 6, strokeWidth: 0 }}
                                              />
                                          ))}
                                      </LineChart>
                                  </ResponsiveContainer>
                             </div>
                        )}
                    </div>
               </Card>
          </div>
        </div>
    </motion.section>
  );
}
