"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/empty-state";
import { toast } from "sonner";
import { useAuditLogs } from "@/modules/audit/hooks/use-audit-logs";
import type { AuditLog } from "@/modules/audit/types/audit-log";
import { Shield, Search, RefreshCw, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const ACTIONS = [
  { value: "all", label: "Todas" },
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
];

const MODULES = [
  { value: "all", label: "Todos" },
  { value: "courses", label: "Cursos" },
  { value: "continuing_education", label: "Educación continua" },
  { value: "wellbeing", label: "Bienestar" },
  { value: "audit", label: "Auditoría" },
];

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("es-CO");
  } catch {
    return iso;
  }
}

function statusColor(status: number) {
  if (status >= 200 && status < 300) return "bg-emerald-500/12 text-emerald-700 border-emerald-200 dark:text-emerald-200 dark:border-emerald-900/40 dark:bg-emerald-900/20";
  if (status >= 400 && status < 500) return "bg-amber-500/12 text-amber-700 border-amber-200 dark:text-amber-200 dark:border-amber-900/40 dark:bg-amber-900/20";
  if (status >= 500) return "bg-red-500/12 text-red-700 border-red-200 dark:text-red-200 dark:border-red-900/40 dark:bg-red-900/20";
  return "bg-muted/30 text-foreground border-border";
}

function actionColor(action: string) {
  const a = (action || "").toLowerCase();
  if (a === "create") return "bg-emerald-500/12 text-emerald-700 border-emerald-200 dark:text-emerald-200 dark:border-emerald-900/40 dark:bg-emerald-900/20";
  if (a === "update") return "bg-blue-500/12 text-blue-700 border-blue-200 dark:text-blue-200 dark:border-blue-900/40 dark:bg-blue-900/20";
  if (a === "delete") return "bg-red-500/12 text-red-700 border-red-200 dark:text-red-200 dark:border-red-900/40 dark:bg-red-900/20";
  return "bg-muted/30 text-foreground border-border";
}

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function RegisteredAuditLogsPanel() {
  const { page, setPage, pageSize, setPageSize, filters, setFilters, data, loading, error, refetch } = useAuditLogs({
    page: 1,
    page_size: 50,
  });

  const [selected, setSelected] = useState<AuditLog | null>(null);
  const [search, setSearch] = useState("");

  const results = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return results;
    return results.filter((r) => {
      return (
        (r.user_email ?? "").toLowerCase().includes(q) ||
        (r.path ?? "").toLowerCase().includes(q) ||
        (r.module ?? "").toLowerCase().includes(q) ||
        (r.action ?? "").toLowerCase().includes(q) ||
        String(r.status_code ?? "").includes(q)
      );
    });
  }, [results, search]);

  if (error) {
    return (
      <div className="p-6">
        <EmptyState title="No se pudieron cargar auditorías" description={error} actionLabel="Reintentar" onActionClick={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-48 left-[-8rem] h-[30rem] w-[30rem] rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -bottom-52 right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#111_1px,transparent_1px)] bg-size-[20px_20px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-20 py-5 md:py-6 space-y-5">
        <Card className="border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70 shadow-sm">
          <CardContent className="p-4 md:p-5">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start lg:items-center">
              <div className="min-w-0">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-primary/10 ring-1 ring-primary/15 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Módulo</div>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Auditorías</h1>
                      <span className="inline-flex items-center rounded-full border border-border bg-muted/20 px-2.5 py-1 text-xs text-muted-foreground">
                        {loading ? "—" : `${count.toLocaleString("es-CO")} eventos`}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Consulta acciones realizadas en el sistema (con filtros opcionales).
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full lg:w-auto">
                <div className="relative w-full sm:w-[320px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar (email, path, módulo, status)…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-background rounded-full"
                  />
                </div>
                <Button
                  className="gap-2 rounded-2xl bg-primary hover:bg-primary/90"
                  onClick={() => {
                    toast("Actualizando…");
                    void refetch({ silent: true });
                  }}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4" />
                  Actualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-4 md:p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="space-y-2 md:col-span-1">
                <Label>Acción</Label>
                <Select value={filters.action} onValueChange={(v) => { setPage(1); setFilters((p) => ({ ...p, action: v })); }}>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Acción" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIONS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label>Módulo</Label>
                <Select value={filters.module} onValueChange={(v) => { setPage(1); setFilters((p) => ({ ...p, module: v })); }}>
                  <SelectTrigger className="bg-muted/30">
                    <SelectValue placeholder="Módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODULES.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Email</Label>
                <Input
                  value={filters.user_email}
                  onChange={(e) => { setPage(1); setFilters((p) => ({ ...p, user_email: e.target.value })); }}
                  className="bg-muted/30"
                  placeholder="correo@..."
                />
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label>Desde (ISO)</Label>
                <Input
                  value={filters.from}
                  onChange={(e) => { setPage(1); setFilters((p) => ({ ...p, from: e.target.value })); }}
                  className="bg-muted/30"
                  placeholder="2026-01-01T00:00:00Z"
                />
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label>Hasta (ISO)</Label>
                <Input
                  value={filters.to}
                  onChange={(e) => { setPage(1); setFilters((p) => ({ ...p, to: e.target.value })); }}
                  className="bg-muted/30"
                  placeholder="2026-01-31T23:59:59Z"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                {loading ? "Cargando…" : `${filtered.length.toLocaleString("es-CO")} visibles en esta página`}
              </div>
              <div className="flex items-center gap-2">
                <Select value={String(pageSize)} onValueChange={(v) => { setPage(1); setPageSize(Number(v)); }}>
                  <SelectTrigger className="w-[130px] bg-background rounded-full">
                    <SelectValue placeholder="Tamaño" />
                  </SelectTrigger>
                  <SelectContent>
                    {[25, 50, 100].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} / pág
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                    setFilters({ action: "all", module: "all", user_email: "", from: "", to: "" });
                  }}
                >
                  Limpiar
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="text-sm text-muted-foreground">Cargando auditorías…</div>
            ) : filtered.length === 0 ? (
              <EmptyState title="Sin resultados" description="No hay registros para los filtros actuales." />
            ) : (
              <div className="rounded-xl border border-border overflow-hidden bg-card">
                <Table>
                  <TableHeader className="bg-muted/25">
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Módulo</TableHead>
                      <TableHead>Ruta</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead className="text-right">Detalle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => (
                      <TableRow key={r.id} className="hover:bg-muted/20">
                        <TableCell className="whitespace-nowrap">{formatDateTime(r.created_at)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${actionColor(r.action)}`}>
                            {r.action}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{r.method}</TableCell>
                        <TableCell>{r.module ?? "—"}</TableCell>
                        <TableCell className="max-w-[420px] truncate">{r.path}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusColor(r.status_code)}`}>
                            {r.status_code}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[220px] truncate">
                          {r.user_email ?? "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="h-8 rounded-full gap-2" onClick={() => setSelected(r)}>
                            <Eye className="h-4 w-4" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                Página {page} de {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages || loading}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalle de auditoría #{selected?.id}</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2">
                <div className="text-sm font-semibold">Resumen</div>
                <div className="text-sm text-muted-foreground">
                  <div><span className="font-medium text-foreground">Fecha:</span> {formatDateTime(selected.created_at)}</div>
                  <div><span className="font-medium text-foreground">Acción:</span> {selected.action}</div>
                  <div><span className="font-medium text-foreground">Método:</span> {selected.method}</div>
                  <div><span className="font-medium text-foreground">Módulo:</span> {selected.module ?? "—"}</div>
                  <div className="break-all"><span className="font-medium text-foreground">Ruta:</span> {selected.path}</div>
                  <div><span className="font-medium text-foreground">Status:</span> {selected.status_code}</div>
                  <div><span className="font-medium text-foreground">Usuario:</span> {selected.user_email ?? "—"} ({selected.user_role ?? "—"})</div>
                  <div><span className="font-medium text-foreground">IP:</span> {selected.ip ?? "—"}</div>
                  <div className="break-all"><span className="font-medium text-foreground">User agent:</span> {selected.user_agent ?? "—"}</div>
                  <div className="break-all"><span className="font-medium text-foreground">View:</span> {selected.view_name ?? "—"}</div>
                  <div><span className="font-medium text-foreground">Resource ID:</span> {selected.resource_id ?? "—"}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b bg-muted/15">
                    <div className="text-sm font-semibold">Request data</div>
                    <Badge variant="secondary" className="rounded-full">JSON</Badge>
                  </div>
                  <ScrollArea className="h-[220px]">
                    <pre className="p-3 text-xs leading-5 whitespace-pre-wrap break-words">{safeJsonStringify(selected.request_data)}</pre>
                  </ScrollArea>
                </div>

                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b bg-muted/15">
                    <div className="text-sm font-semibold">Response data</div>
                    <Badge variant="secondary" className="rounded-full">JSON</Badge>
                  </div>
                  <ScrollArea className="h-[220px]">
                    <pre className="p-3 text-xs leading-5 whitespace-pre-wrap break-words">{safeJsonStringify(selected.response_data)}</pre>
                  </ScrollArea>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

