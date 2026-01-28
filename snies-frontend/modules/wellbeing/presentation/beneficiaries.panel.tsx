"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/empty-state";
import { Search, Plus, Pencil, Trash2, Users } from "lucide-react";
import { WellbeingBenefeciaryApi } from "@/modules/wellbeing/api/wellbeing-beneficiary.api";
import { useWellbeingBeneficiariesCRUD } from "@/modules/wellbeing/hooks/use-cases/use-wellbeing-beneficiaries";
import { WellbeingBeneficiaryForm } from "@/modules/wellbeing/presentation/components/wellbeing-beneficiary-form";
import type { WellbeingBenefeciary } from "@/modules/wellbeing/types/beneficiary";
import { toast } from "sonner";

const repository = new WellbeingBenefeciaryApi();

export function RegisteredWellbeingBeneficiariesPanel() {
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<WellbeingBenefeciary | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<WellbeingBenefeciary | null>(null);

  const { beneficiaries, loading, error, createBeneficiary, updateBeneficiary, deleteBeneficiary, fetchBeneficiaries } =
    useWellbeingBeneficiariesCRUD(repository);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return beneficiaries;
    return beneficiaries.filter((b) => {
      return (
        b.activity_code.toLowerCase().includes(q) ||
        b.organization_unit_code.toLowerCase().includes(q) ||
        String(b.beneficiary_type_id).includes(q)
      );
    });
  }, [beneficiaries, search]);

  const initialData = editing
    ? { ...editing }
    : {
        id: "",
        year: String(new Date().getFullYear()),
        semester: 1,
        organization_unit_code: "",
        activity_code: "",
        beneficiary_type_id: 0,
        beneficiaries_count: 0,
      };

  const handleCreate = async (data: typeof initialData) => {
    const payload = {
      year: data.year,
      semester: data.semester,
      organization_unit_code: data.organization_unit_code,
      activity_code: data.activity_code,
      beneficiary_type_id: data.beneficiary_type_id,
      beneficiaries_count: data.beneficiaries_count,
    };
    const result = await createBeneficiary(payload as any);
    if (!result.success) throw new Error(result.error || "Error");
    toast.success("Beneficiario creado");
    setOpenForm(false);
    setEditing(null);
  };

  const handleUpdate = async (id: string, data: typeof initialData) => {
    const payload = {
      year: data.year,
      semester: data.semester,
      organization_unit_code: data.organization_unit_code,
      activity_code: data.activity_code,
      beneficiary_type_id: data.beneficiary_type_id,
      beneficiaries_count: data.beneficiaries_count,
    };
    const result = await updateBeneficiary(id, payload as any);
    if (!result.success) throw new Error(result.error || "Error");
    toast.success("Beneficiario actualizado");
    setOpenForm(false);
    setEditing(null);
  };

  const doDelete = async (id: string) => {
    const result = await deleteBeneficiary(id);
    if (!result.success) throw new Error(result.error || "Error");
    toast.success("Beneficiario eliminado");
  };

  return (
    <div className="space-y-5">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 ring-1 ring-primary/15 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Beneficiarios</CardTitle>
              <div className="text-xs text-muted-foreground">
                Registro y consulta de beneficiarios de bienestar.
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por actividad, unidad o tipo…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background rounded-full"
              />
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 gap-2"
              onClick={() => {
                setEditing(null);
                setOpenForm(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Crear beneficiario
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <EmptyState title="No se pudieron cargar beneficiarios" description={error} />
          ) : loading ? (
            <div className="text-sm text-muted-foreground">Cargando…</div>
          ) : filtered.length === 0 ? (
            <EmptyState title="Sin beneficiarios" description="No hay registros para mostrar." />
          ) : (
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <Table>
                <TableHeader className="bg-muted/25">
                  <TableRow>
                    <TableHead>Año</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Actividad</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>{b.year}</TableCell>
                      <TableCell>{b.semester}</TableCell>
                      <TableCell className="font-medium">{b.organization_unit_code}</TableCell>
                      <TableCell className="font-medium">{b.activity_code}</TableCell>
                      <TableCell>{b.beneficiary_type_id}</TableCell>
                      <TableCell>{b.beneficiaries_count}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => {
                              setEditing(b);
                              setOpenForm(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => setConfirmDelete(b)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => fetchBeneficiaries()}>
              Refrescar
            </Button>
          </div>
        </CardContent>
      </Card>

      <WellbeingBeneficiaryForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditing(null);
        }}
        initialData={initialData as any}
        onSubmit={(data) => {
          if (editing?.id) return handleUpdate(editing.id, data as any);
          return handleCreate(data as any);
        }}
      />

      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(o) => {
          if (!o) setConfirmDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar beneficiario</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. ¿Deseas eliminar el registro{" "}
              {confirmDelete ? `#${confirmDelete.id}` : ""}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!confirmDelete) return;
                const id = confirmDelete.id;
                setConfirmDelete(null);
                try {
                  await doDelete(id);
                } catch (e) {
                  toast.error("No se pudo eliminar", { description: e instanceof Error ? e.message : "Error" });
                }
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

