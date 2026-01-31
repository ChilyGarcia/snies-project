"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import {
  ClipboardList,
  FileSpreadsheet,
  Loader2,
  Plus,
  Search,
  Upload,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";

import {
  createSoftwareActivity,
  importSoftwareActivitiesExcel,
  listSoftwareActivities,
  exportSoftwareActivitiesExcel,
} from "@/modules/software_activities/api/software-activities.api";
import type { CreateSoftwareActivityInput, SoftwareActivity } from "@/modules/software_activities/types/software-activity";
import { SoftwareActivityForm } from "@/modules/software_activities/presentation/components/software-activity-form";
import { SoftwareActivityDetail } from "@/modules/software_activities/presentation/components/software-activity-detail";

export function RegisteredSoftwareActivitiesPanel() {
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState<"activities" | "import">("activities");

  const [openForm, setOpenForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [careerFilter, setCareerFilter] = useState<string>("all");
  const [selected, setSelected] = useState<SoftwareActivity | null>(null);

  const [items, setItems] = useState<SoftwareActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [importing, setImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [exporting, setExporting] = useState(false);

  const reqId = useRef(0);

  const load = async () => {
    const r = ++reqId.current;
    setLoading(true);
    setError(null);
    try {
      const data = await listSoftwareActivities({
        limit: 200,
        offset: 0,
        career: careerFilter !== "all" ? careerFilter : undefined,
      });
      if (r !== reqId.current) return;
      setItems(data);
    } catch (e) {
      if (r !== reqId.current) return;
      setItems([]);
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      if (r !== reqId.current) return;
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careerFilter]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const byCareer =
      careerFilter === "all" ? items : items.filter((a) => a.career === careerFilter);
    if (!q) return byCareer;
    return byCareer.filter((a) => {
      return (
        a.activity_name.toLowerCase().includes(q) ||
        a.execution_place.toLowerCase().includes(q) ||
        String(a.year).includes(q) ||
        String(a.semester).includes(q) ||
        (a.campus || "").toLowerCase().includes(q) ||
        (a.career || "").toLowerCase().includes(q)
      );
    });
  }, [items, searchTerm, careerFilter]);

  const handleCreate = async (payload: CreateSoftwareActivityInput) => {
    const res = await createSoftwareActivity(payload);
    toast.success("Actividad creada", {
      description: res.message || `ID #${res.id}`,
    });
    await load();
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error("Selecciona un archivo Excel primero");
      return;
    }
    setImporting(true);
    try {
      const res = await importSoftwareActivitiesExcel(importFile);
      toast.success("Importación completa", {
        description: `Creadas: ${res.created} · Filas vacías omitidas: ${res.skipped_empty_rows}`,
      });
      setImportFile(null);
      setTab("activities");
      await load();
    } catch (e) {
      toast.error("No se pudo importar", {
        description: e instanceof Error ? e.message : "Error",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportSoftwareActivitiesExcel();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "planilla_reporte_snies_software.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Excel exportado");
    } catch (e) {
      toast.error("No se pudo exportar", {
        description: e instanceof Error ? e.message : "Error",
      });
    } finally {
      setExporting(false);
    }
  };

  if (selected) {
    return (
      <div className="container mx-auto px-4 md:px-8 lg:px-20 py-6 md:py-10">
        <SoftwareActivityDetail activity={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute -top-32 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl"
            />
            <div className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#111_1px,transparent_1px)]" style={{ backgroundSize: '18px 18px' }} />
          </div>

          <div className="container mx-auto px-4 md:px-8 lg:px-20 py-6 md:py-10 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-4 md:p-5 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="h-11 w-11 shrink-0 rounded-2xl bg-primary/10 ring-1 ring-primary/15 shadow-xs flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        Actividades
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Registro, importación (Excel) y consulta de actividades.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      className="gap-2 shrink-0"
                      onClick={handleExport}
                      disabled={tab !== "activities" || exporting || loading}
                    >
                      {exporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <FileSpreadsheet className="h-4 w-4" />
                      )}
                      Exportar Excel
                    </Button>

                    <Button
                      className="bg-primary hover:bg-primary/90 gap-2 shrink-0"
                      onClick={() => setOpenForm(true)}
                      disabled={tab !== "activities"}
                    >
                      <Plus className="h-4 w-4" />
                      Crear actividad
                    </Button>
                  </div>
                </div>

                {tab === "activities" ? (
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <div className="w-full sm:w-[240px]">
                      <Select value={careerFilter} onValueChange={(v) => setCareerFilter(v)}>
                        <SelectTrigger className="w-full bg-background rounded-full">
                          <SelectValue placeholder="Carrera" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las carreras</SelectItem>
                          <SelectItem value="Ing. Software">Ing. Software</SelectItem>
                          <SelectItem value="Diseño Gráfico">Diseño Gráfico</SelectItem>
                          <SelectItem value="Negocios Internacionales">Negocios Internacionales</SelectItem>
                          <SelectItem value="Diseño de Modas">Diseño de Modas</SelectItem>
                          <SelectItem value="Administración Turística">Administración Turística</SelectItem>
                          <SelectItem value="Administración Financiera">Administración Financiera</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative w-full sm:flex-1 sm:max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Buscar por nombre, sede, lugar…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background rounded-full"
                        disabled={loading}
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-4">
                <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                  <TabsList className="w-full sm:w-fit rounded-2xl bg-muted/20 p-1 border border-border">
                    <TabsTrigger value="activities" className="rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      Actividades
                    </TabsTrigger>
                    <TabsTrigger value="import" className="rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      Importar Excel
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="space-y-6">
              <TabsContent value="activities">
                {error ? (
                  <div>
                    <EmptyState title="No se pudieron cargar actividades" description={error} />
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline" onClick={() => load()}>
                        Reintentar
                      </Button>
                    </div>
                  </div>
                ) : loading ? (
                  <Card className="border-border bg-card shadow-sm">
                    <CardContent className="p-6 text-sm text-muted-foreground">
                      Cargando actividades…
                    </CardContent>
                  </Card>
                ) : filtered.length === 0 ? (
                  <EmptyState title="Sin actividades" description="Aún no hay registros. Puedes crear una actividad o importar desde Excel." />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filtered.map((a) => (
                      <Card
                        key={a.id}
                        className="cursor-pointer border-border bg-card shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
                        onClick={() => setSelected(a)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <CardTitle className="text-lg line-clamp-2">
                                {a.activity_name}
                              </CardTitle>
                              <CardDescription className="mt-1 line-clamp-2">
                                {a.execution_place}
                              </CardDescription>
                              {a.career ? (
                                <div className="mt-2">
                                  <span className="inline-flex items-center rounded-full border border-border bg-muted/20 px-2.5 py-1 text-xs font-semibold text-foreground">
                                    {a.career}
                                  </span>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter className="pt-0">
                          <div className="w-full flex items-center justify-between gap-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-center rounded-full border border-border bg-muted/20 px-2.5 py-1">
                              {a.year} · S{a.semester}
                            </span>
                            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-primary">
                              {a.campus}
                            </span>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="import">
                <Card className="border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-primary" />
                      Importar desde Excel
                    </CardTitle>
                    <CardDescription>
                      Sube el archivo Excel con la hoja “Software”. La app poblará la
                      base de datos automáticamente.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-2xl border border-border bg-muted/10 p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold">Archivo</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Selecciona un `.xlsx`. Los datos empiezan desde la fila 7
                            (o se detecta el header automáticamente).
                          </div>
                        </div>
                        <label className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold cursor-pointer hover:bg-muted/30">
                          <Upload className="h-4 w-4" />
                          Elegir archivo
                          <input
                            type="file"
                            accept=".xlsx,.xlsm,.xltx,.xltm"
                            className="hidden"
                            onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
                          />
                        </label>
                      </div>
                      {importFile ? (
                        <div className="mt-3 text-xs text-muted-foreground">
                          Seleccionado:{" "}
                          <span className="font-medium text-foreground">
                            {importFile.name}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setImportFile(null)}
                        disabled={!importFile || importing}
                      >
                        Limpiar
                      </Button>
                      <Button className="gap-2" onClick={handleImport} disabled={!importFile || importing}>
                        {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Importar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <SoftwareActivityForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleCreate}
      />
    </>
  );
}

