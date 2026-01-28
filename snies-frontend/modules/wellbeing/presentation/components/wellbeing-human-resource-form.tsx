"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import type { CreateWellbeingHumanResourceInput } from "@/modules/wellbeing/hooks/types/create-human-resource-input";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWellbeingHumanResourceInput) => Promise<void>;
  defaultYear?: string;
  defaultSemester?: number;
};

export function WellbeingHumanResourceForm({
  open,
  onClose,
  onSubmit,
  defaultYear,
  defaultSemester,
}: Props) {
  const currentYear = String(new Date().getFullYear());
  const yearOptions = useMemo(() => Array.from({ length: 7 }, (_, i) => String(Number(currentYear) - i)), [currentYear]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateWellbeingHumanResourceInput>({
    year: defaultYear ?? currentYear,
    semester: defaultSemester ?? 1,
    activity_code: "",
    organization_unit_code: "",
    document_type_id: 1,
    document_number: "",
    dedication: "1",
  });

  useEffect(() => {
    if (!open) return;
    setForm((p) => ({
      ...p,
      year: defaultYear ?? p.year ?? currentYear,
      semester: defaultSemester ?? p.semester ?? 1,
    }));
  }, [open, defaultYear, defaultSemester, currentYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit(form);
      onClose();
      setForm((p) => ({ ...p, activity_code: "", organization_unit_code: "", document_number: "" }));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <CardTitle className="text-2xl">Crear Recurso Humano</CardTitle>
              <CardDescription className="mt-1">
                Registro de recursos humanos asociados a actividades de bienestar
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} disabled={submitting}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Año</Label>
                <Select value={form.year} onValueChange={(v) => setForm((p) => ({ ...p, year: v }))}>
                  <SelectTrigger className="bg-muted/50" disabled={submitting}>
                    <SelectValue placeholder="Seleccione el año" />
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

              <div className="space-y-2">
                <Label>Semestre</Label>
                <Select
                  value={String(form.semester || "")}
                  onValueChange={(v) => setForm((p) => ({ ...p, semester: Number(v) }))}
                >
                  <SelectTrigger className="bg-muted/50" disabled={submitting}>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semestre 1</SelectItem>
                    <SelectItem value="2">Semestre 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dedicación</Label>
                <Input
                  value={form.dedication}
                  onChange={(e) => setForm((p) => ({ ...p, dedication: e.target.value }))}
                  className="bg-muted/50"
                  placeholder="0.5"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código actividad</Label>
                <Input
                  value={form.activity_code}
                  onChange={(e) => setForm((p) => ({ ...p, activity_code: e.target.value }))}
                  className="bg-muted/50"
                  placeholder="A001"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label>Código unidad organizacional</Label>
                <Input
                  value={form.organization_unit_code}
                  onChange={(e) => setForm((p) => ({ ...p, organization_unit_code: e.target.value }))}
                  className="bg-muted/50"
                  placeholder="U01"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de documento</Label>
                <Select
                  value={String(form.document_type_id || "")}
                  onValueChange={(v) => setForm((p) => ({ ...p, document_type_id: Number(v) }))}
                >
                  <SelectTrigger className="bg-muted/50" disabled={submitting}>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Cédula</SelectItem>
                    <SelectItem value="2">Tarjeta de identidad</SelectItem>
                    <SelectItem value="3">Pasaporte</SelectItem>
                    <SelectItem value="4">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Número de documento</Label>
                <Input
                  value={form.document_number}
                  onChange={(e) => setForm((p) => ({ ...p, document_number: e.target.value }))}
                  className="bg-muted/50"
                  placeholder="123"
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3 border-t pt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={submitting}>
              {submitting ? "Creando..." : "Crear"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

