import type { DashboardTopItem, DashboardTimeSeries } from "@/modules/dashboard/types/dashboard-stats";

export type NormalizedTop = { name: string; total: number };

function pickString(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v;
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return null;
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() && !Number.isNaN(Number(v))) return Number(v);
  }
  return null;
}

export function normalizeTopList(list: DashboardTopItem[] | undefined, opts: { labelKeys: string[]; valueKeys: string[] }) {
  const safe = Array.isArray(list) ? list : [];
  const out: NormalizedTop[] = [];
  for (const item of safe) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const name = pickString(obj, opts.labelKeys) ?? "Sin etiqueta";
    const total = pickNumber(obj, opts.valueKeys) ?? 0;
    out.push({ name, total });
  }
  return out;
}

export function buildTimeSeriesChartData(timeSeries: DashboardTimeSeries | undefined) {
  const ts = timeSeries && typeof timeSeries === "object" ? timeSeries : {};
  const keys = Object.keys(ts);

  const allPeriods = new Map<string, { year: string; semester: number }>();
  for (const k of keys) {
    const points = Array.isArray(ts[k]) ? ts[k] : [];
    for (const p of points) {
      if (!p || typeof p !== "object") continue;
      const year = typeof (p as any).year === "string" ? (p as any).year : String((p as any).year ?? "");
      const semester = Number((p as any).semester ?? 0);
      if (!year || !Number.isFinite(semester) || semester <= 0) continue;
      const id = `${year}-S${semester}`;
      allPeriods.set(id, { year, semester });
    }
  }

  const sortedPeriods = Array.from(allPeriods.entries())
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => {
      const ay = Number(a.year);
      const by = Number(b.year);
      if (ay !== by) return ay - by;
      return a.semester - b.semester;
    });

  const rows = sortedPeriods.map((p) => ({
    period: p.id,
  })) as Array<Record<string, any>>;

  for (const k of keys) {
    const points = Array.isArray(ts[k]) ? ts[k] : [];
    const map = new Map<string, number>();
    for (const p of points) {
      if (!p || typeof p !== "object") continue;
      const year = typeof (p as any).year === "string" ? (p as any).year : String((p as any).year ?? "");
      const semester = Number((p as any).semester ?? 0);
      const count = Number((p as any).records ?? (p as any).count ?? (p as any).total ?? 0);
      if (!year || !Number.isFinite(semester) || semester <= 0) continue;
      map.set(`${year}-S${semester}`, Number.isFinite(count) ? count : 0);
    }
    for (const row of rows) {
      row[k] = map.get(row.period) ?? 0;
    }
  }

  return { keys, rows };
}

