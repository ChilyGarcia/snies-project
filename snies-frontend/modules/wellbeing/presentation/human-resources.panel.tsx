"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/empty-state";
import { Plus, Search, Users2 } from "lucide-react";
import { toast } from "sonner";
import { ApiValidationError, formatValidationDetails } from "@/shared/api/api-errors";
import { WellbeingHumanResourceApi } from "@/modules/wellbeing/api/wellbeing-human-resource.api";
import { useWellbeingHumanResources } from "@/modules/wellbeing/hooks/use-cases/use-wellbeing-human-resources";
import { WellbeingHumanResourceForm } from "@/modules/wellbeing/presentation/components/wellbeing-human-resource-form";
import type { CreateWellbeingHumanResourceInput } from "@/modules/wellbeing/hooks/types/create-human-resource-input";

const repository = new WellbeingHumanResourceApi();

export function RegisteredWellbeingHumanResourcesPanel() {
  const currentYear = String(new Date().getFullYear());
  const yearOptions = useMemo(() => Array.from({ length: 7 }, (_, i) => String(Number(currentYear) - i)), [currentYear]);

  const [search, setSearch] = useState("");
  const [year, setYear] = useState<string>("all");
  const [semester, setSemester] = useState<number | "all">("all");
  const [open, setOpen] = useState(false);

  const { items, loading, error, refetch, setItems } = useWellbeingHumanResources(repository);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = items;
    if (!q) return list;
    return list.filter((r) => {
      return (
        r.activity_code.toLowerCase().includes(q) ||
        r.organization_unit_code.toLowerCase().includes(q) ||
        r.document_number.toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  const load = async (y: string, s: number | "all") => {
    await refetch({
      year: y === "all" ? undefined : y,
      semester: s === "all" ? undefined : s,
    });
  };

  // Debounced effect
  useEffect(() => {
    const t = setTimeout(() => {
      void load(year, semester);
    }, 250);
    return () => clearTimeout(t);
  }, [year, semester]);

  const handleCreate = async (data: CreateWellbeingHumanResourceInput) => {
    try {
      const created = await repository.create(data);
      toast.success("Recurso humano creado", { description: `${created.activity_code} · ${created.year} S${created.semester}` });
      setOpen(false);
      // Optimistic insert, then refetch to keep consistent
      setItems((prev) => [created, ...prev]);
      await load(year, semester);
    } catch (e) {
      if (e instanceof ApiValidationError) {
        toast.error(e.message || "Error de validación", {
          description: <div className="whitespace-pre-line">{formatValidationDetails(e.details)}</div>,
        });
        throw e;
      }
      toast.error("No se pudo crear", { description: e instanceof Error ? e.message : "Error" });
      throw e;
    }
  };

  return (
    <div className="space-y-5">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 ring-1 ring-primary/15 flex items-center justify-center">
              <Users2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Recursos humanos</CardTitle>
              <div className="text-xs text-muted-foreground">
                Registro y consulta de recursos humanos por actividad.
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por actividad, unidad o documento…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background rounded-full"
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Crear recurso
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>Año</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {yearOptions.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Semestre</Label>
              <Select
                value={String(semester)}
                onValueChange={(v) => setSemester(v === "all" ? "all" : Number(v))}
              >
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="1">Semestre 1</SelectItem>
                  <SelectItem value="2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setYear("all");
                  setSemester("all");
                }}
              >
                Borrar filtros
              </Button>
            </div>
          </div>

          {error ? (
            <EmptyState title="No se pudieron cargar recursos humanos" description={error} />
          ) : loading ? (
            <div className="text-sm text-muted-foreground">Cargando…</div>
          ) : filteredItems.length === 0 ? (
            <EmptyState title="Sin registros" description="No hay registros para mostrar." />
          ) : (
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <Table>
                <TableHeader className="bg-muted/25">
                  <TableRow>
                    <TableHead>Año</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Actividad</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Tipo doc</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead className="text-right">Dedicación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.year}</TableCell>
                      <TableCell>{r.semester}</TableCell>
                      <TableCell className="font-medium">{r.activity_code}</TableCell>
                      <TableCell className="font-medium">{r.organization_unit_code}</TableCell>
                      <TableCell>{r.document_type_id}</TableCell>
                      <TableCell>{r.document_number}</TableCell>
                      <TableCell className="text-right">{r.dedication}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <WellbeingHumanResourceForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreate}
        defaultYear={year === "all" ? currentYear : year}
        defaultSemester={semester === "all" ? 1 : semester}
      />
    </div>
  );
}

