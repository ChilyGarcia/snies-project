"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { toast } from "sonner";
import { Loader2, RefreshCw, TrendingUp, Users2, UserCheck2, Activity, FilterX, Wallet, Clock, BookOpenText, ShieldCheck, AlignEndHorizontal } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area } from "recharts";

import { getDashboardStats } from "@/modules/dashboard/api/dashboard-stats.api";
import type { DashboardStatsResponse } from "@/modules/dashboard/types/dashboard-stats";
import { buildTimeSeriesChartData, normalizeTopList } from "@/modules/dashboard/utils/stats-normalizers";
export function DashboardActivitiesSection() {
  const currentYear = String(new Date().getFullYear());
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

      // Ajustar filtros a lo disponible (si el backend entrega catálogo)
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
    <section className="mt-2">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-48 left-[-8rem] h-[30rem] w-[30rem] rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute -bottom-52 right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#111_1px,transparent_1px)] bg-size-[20px_20px]" />
        </div>

        <div className="container mx-auto px-4 md:px-8 lg:px-20 py-5 md:py-6 space-y-5">
          {/* Toolbar */}
          <Card className="border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70 shadow-sm">
            <CardContent className="p-4 md:p-5">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start lg:items-center">
                <div className="min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-primary/10 ring-1 ring-primary/15 flex items-center justify-center shrink-0">
                      <AlignEndHorizontal className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Dashboard
                      </div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                          R-SNIES
                        </h1>
                        <span className="text-sm text-muted-foreground">Métricas</span>
                        <span className="inline-flex items-center rounded-full border border-border bg-muted/20 px-2.5 py-1 text-xs text-muted-foreground">
                          Top {topN}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {viewMode === "all"
                          ? "Vista global (sin filtros)."
                          : `Vista filtrada: ${year} · Semestre ${semester}.`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto">
                  {/* Segmented mode */}
                  <div className="flex items-center rounded-2xl border border-border bg-muted/20 p-1 w-full sm:w-auto">
                    <button
                      type="button"
                      className={`flex-1 sm:flex-none rounded-xl px-3 py-2 text-sm font-semibold transition ${
                        viewMode === "all"
                          ? "bg-primary/12 text-foreground ring-1 ring-primary/20 shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setViewMode("all")}
                      disabled={loading}
                    >
                      Histórico
                    </button>
                    <button
                      type="button"
                      className={`flex-1 sm:flex-none rounded-xl px-3 py-2 text-sm font-semibold transition ${
                        viewMode === "filtered"
                          ? "bg-primary/12 text-foreground ring-1 ring-primary/20 shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setViewMode("filtered")}
                      disabled={loading}
                    >
                      Filtrado
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
                    <div className="min-w-[132px]">
                      <Select value={year} onValueChange={setYear} disabled={loading || viewMode === "all"}>
                        <SelectTrigger className="bg-background rounded-2xl">
                          <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                          {yearOptions.map((y) => (
                            <SelectItem key={y} value={y}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="min-w-[132px]">
                      <Select
                        value={String(semester)}
                        onValueChange={(v) => setSemester(Number(v))}
                        disabled={loading || viewMode === "all"}
                      >
                        <SelectTrigger className="bg-background rounded-2xl">
                          <SelectValue placeholder="Semestre" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesterOptions.map((s) => (
                            <SelectItem key={s} value={String(s)}>
                              Semestre {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="min-w-[120px]">
                    <Select value={String(topN)} onValueChange={(v) => setTopN(Number(v))} disabled={loading}>
                      <SelectTrigger className="bg-background rounded-2xl">
                        <SelectValue placeholder="Top N" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 10, 20].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            Top {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="gap-2 rounded-2xl bg-primary hover:bg-primary/90"
                    onClick={() => {
                      toast("Actualizando…");
                      void fetchStats({ silent: true });
                    }}
                    disabled={loading || refreshing}
                  >
                    {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Actualizar
                  </Button>

                  {viewMode === "filtered" ? (
                    <Button
                      variant="outline"
                      className="gap-2 rounded-2xl"
                      onClick={() => {
                        setViewMode("all");
                        toast("Mostrando histórico sin filtros…");
                      }}
                      disabled={loading || refreshing}
                    >
                      <FilterX className="h-4 w-4" />
                      Quitar filtros
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KPI grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard
              title="Usuarios"
              value={loading ? "—" : usersTotal.toLocaleString("es-CO")}
              subtitle={`${loading ? "—" : rolesTotal.toLocaleString("es-CO")} roles registrados`}
              icon={<ShieldCheck className="h-5 w-5" />}
              variant="slate"
            />
            <KpiCard
              title="Cursos"
              value={loading ? "—" : coursesTotal.toLocaleString("es-CO")}
              subtitle={`${loading ? "—" : coursesActive.toLocaleString("es-CO")} activos`}
              icon={<BookOpenText className="h-5 w-5" />}
              variant="blue"
            />
            <KpiCard
              title="Educación continua"
              value={loading ? "—" : ceTotalRecords.toLocaleString("es-CO")}
              subtitle="Registros"
              icon={<Activity className="h-5 w-5" />}
              variant="emerald"
              spark={kpiSpark.continuing_education}
            />
            <KpiCard
              title="Docentes (Ed. continua)"
              value={loading ? "—" : ceTeachersTotal.toLocaleString("es-CO")}
              subtitle="Registros"
              icon={<UserCheck2 className="h-5 w-5" />}
              variant="violet"
              spark={kpiSpark.continuing_education_teachers}
            />
            <KpiCard
              title="Beneficiarios (Ed. continua)"
              value={loading ? "—" : ceBenefTotalRecords.toLocaleString("es-CO")}
              subtitle={`${loading ? "—" : ceBenefTotalPeople.toLocaleString("es-CO")} personas`}
              icon={<Users2 className="h-5 w-5" />}
              variant="orange"
              spark={kpiSpark.continuing_education_beneficiaries}
            />
            <KpiCard
              title="Valor total (Ed. continua)"
              value={loading ? "—" : formatMoneyCOP(ceTotalValue)}
              subtitle="COP"
              icon={<Wallet className="h-5 w-5" />}
              variant="emerald"
            />
            <KpiCard
              title="Horas totales (Ed. continua)"
              value={loading ? "—" : ceTotalHours.toLocaleString("es-CO")}
              subtitle="Horas"
              icon={<Clock className="h-5 w-5" />}
              variant="slate"
            />
            <KpiCard
              title="Recursos humanos (bienestar)"
              value={loading ? "—" : hrTotal.toLocaleString("es-CO")}
              subtitle="Registros"
              icon={<Activity className="h-5 w-5" />}
              variant="cyan"
              spark={kpiSpark.wellbeing_human_resources}
            />
          </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard title="Docentes · Top cursos" description="Cursos con más registros de docentes" loading={loading} variant="emerald">
            <TopBar data={teachersByCourse} color="#16a34a" />
          </ChartCard>

          <ChartCard title="Docentes · Tipo de documento" description="Distribución por tipo de documento" loading={loading} variant="violet">
            <TopPie data={teachersByDocType} colors={COLORS} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard title="Beneficiarios · Top cursos" description="Cursos con mayor volumen (personas)" loading={loading} variant="blue">
            <TopBar data={benefByCourse} color="#2563eb" />
          </ChartCard>

          <ChartCard title="Beneficiarios · Tipo" description="Distribución por tipo (personas)" loading={loading} variant="orange">
            <TopPie data={benefByType} colors={COLORS} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard title="Recursos humanos · Top actividades" description="Actividades con más registros" loading={loading} variant="cyan">
            <TopBar data={hrByActivity} color="#06b6d4" />
          </ChartCard>

          <ChartCard title="Recursos humanos · Top unidades" description="Unidades con más registros" loading={loading} variant="orange">
            <TopBar data={hrByOrgUnit} color="#f97316" />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartCard title="Recursos humanos · Tipo documento" description="Distribución por documento" loading={loading} variant="violet">
            <TopPie data={hrByDocType} colors={COLORS} />
          </ChartCard>

          <ChartCard title="Recursos humanos · Dedicación" description="Distribución por dedicación" loading={loading} variant="cyan">
            <TopBar data={hrByDedication} color="#0ea5e9" />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="border-border bg-card shadow-sm xl:col-span-1 overflow-hidden">
            <div className="p-5 border-b bg-muted/15">
              <div className="text-sm font-semibold">Bienestar · Resumen</div>
              <div className="text-xs text-muted-foreground mt-1">
                {loading ? "—" : `${wellbeingActivitiesTotal} actividades · ${wellbeingBenefTotalPeople.toLocaleString("es-CO")} beneficiarios`}
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Actividades</span>
                <span className="font-semibold">{loading ? "—" : wellbeingActivitiesTotal.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Beneficiarios (registros)</span>
                <span className="font-semibold">{loading ? "—" : wellbeingBenefTotalRecords.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Financiación nacional</span>
                <span className="font-semibold">{loading ? "—" : formatMaybeMoney(wellbeingNationalFunding)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Financiación internacional</span>
                <span className="font-semibold">{loading ? "—" : formatMaybeMoney(wellbeingInternationalFunding)}</span>
              </div>
              <div className="h-14 w-full rounded-xl bg-muted/15 border border-border overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={kpiSpark.wellbeing_beneficiaries}>
                    <Area type="monotone" dataKey="value" stroke="#f97316" fill="rgba(249,115,22,0.18)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-muted-foreground">Tendencia: beneficiarios de bienestar</div>
            </div>
          </Card>

          <Card className="border-border bg-card shadow-sm xl:col-span-2 overflow-hidden">
            <div className="p-5 border-b bg-muted/15">
              <div className="text-sm font-semibold">Tendencia histórica (time_series)</div>
              <div className="text-xs text-muted-foreground mt-1">Conteos por año/semestre (no depende de filtros)</div>
            </div>
            <div className="p-5">
              {loading ? (
                <div className="text-sm text-muted-foreground">Cargando…</div>
              ) : timeSeries.rows.length === 0 ? (
                <EmptyState title="Sin datos" description="El backend no devolvió series históricas." />
              ) : (
                <div className="h-[360px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeries.rows} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.35)" />
                      <XAxis dataKey="period" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value: any, name: any) => {
                          const label = typeof name === "string" ? (SERIES_LABELS[name] ?? name) : String(name);
                          return [value, label];
                        }}
                        labelFormatter={(label) => `Periodo: ${label}`}
                        contentStyle={{ borderRadius: 14, border: "1px solid rgba(148,163,184,0.25)", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
                      />
                      <Legend />
                      {seriesKeys.slice(0, 7).map((k, idx) => (
                        <Line
                          key={k}
                          type="monotone"
                          dataKey={k}
                          name={SERIES_LABELS[k] ?? k}
                          stroke={COLORS[idx % COLORS.length]}
                          strokeWidth={2.5}
                          dot={false}
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
      </div>
    </section>
  );
}

type KpiVariant = "emerald" | "blue" | "violet" | "orange" | "cyan" | "slate";
const KPI_STYLES: Record<KpiVariant, { ring: string; iconBg: string; iconFg: string; spark: string; glow: string }> = {
  emerald: { ring: "ring-emerald-500/20", iconBg: "bg-emerald-500/12", iconFg: "text-emerald-600 dark:text-emerald-300", spark: "#16a34a", glow: "bg-emerald-500/10" },
  blue: { ring: "ring-blue-500/20", iconBg: "bg-blue-500/12", iconFg: "text-blue-600 dark:text-blue-300", spark: "#2563eb", glow: "bg-blue-500/10" },
  violet: { ring: "ring-violet-500/20", iconBg: "bg-violet-500/12", iconFg: "text-violet-600 dark:text-violet-300", spark: "#7c3aed", glow: "bg-violet-500/10" },
  orange: { ring: "ring-orange-500/20", iconBg: "bg-orange-500/12", iconFg: "text-orange-600 dark:text-orange-300", spark: "#f97316", glow: "bg-orange-500/10" },
  cyan: { ring: "ring-cyan-500/20", iconBg: "bg-cyan-500/12", iconFg: "text-cyan-600 dark:text-cyan-300", spark: "#06b6d4", glow: "bg-cyan-500/10" },
  slate: { ring: "ring-slate-500/15", iconBg: "bg-slate-500/12", iconFg: "text-slate-600 dark:text-slate-300", spark: "#64748b", glow: "bg-slate-500/10" },
};

function KpiCard(props: { title: string; value: string; subtitle: string; icon: React.ReactNode; variant: KpiVariant; spark?: Array<{ period: string; value: number }> }) {
  const s = KPI_STYLES[props.variant];
  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition hover:-translate-y-0.5 will-change-transform overflow-hidden">
      <div className={`h-1 w-full ${s.glow}`} />
      <CardContent className="p-5 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">{props.title}</div>
          <div className="mt-1.5 text-2xl font-bold tracking-tight">{props.value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{props.subtitle}</div>

          {props.spark?.length ? (
            <div className="mt-3 h-12 w-full rounded-xl border border-border bg-muted/10 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={props.spark} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
                  <Area type="monotone" dataKey="value" stroke={s.spark} fill={`${s.spark}22`} strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </div>

        <div className={`h-11 w-11 rounded-2xl ring-1 ${s.ring} ${s.iconBg} flex items-center justify-center shrink-0 ${s.iconFg}`}>
          {props.icon}
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCard(props: { title: string; description?: string; loading?: boolean; children: React.ReactNode; variant?: KpiVariant }) {
  const v = props.variant ?? "slate";
  const s = KPI_STYLES[v];
  return (
    <Card className="border-border bg-card shadow-sm overflow-hidden">
      <div className={`h-1 w-full ${s.glow}`} />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{props.title}</CardTitle>
        {props.description ? <CardDescription>{props.description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{props.loading ? <div className="text-sm text-muted-foreground">Cargando…</div> : props.children}</CardContent>
    </Card>
  );
}

function TopBar({ data, color }: { data: Array<{ name: string; total: number }>; color: string }) {
  if (!data.length) return <div className="text-sm text-muted-foreground">Sin datos</div>;
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }} barCategoryGap={18}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.35)" />
          <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: "rgba(99,102,241,0.08)" }} />
          <Bar dataKey="total" fill={color} radius={[8, 8, 0, 0]} maxBarSize={120} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TopPie({ data, colors }: { data: Array<{ name: string; total: number }>; colors: string[] }) {
  if (!data.length) return <div className="text-sm text-muted-foreground">Sin datos</div>;
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="total" nameKey="name" outerRadius={110} label>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
