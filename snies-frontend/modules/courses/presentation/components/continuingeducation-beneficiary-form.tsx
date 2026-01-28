"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateContinuingEducationBeneficiaryInput } from "@/modules/courses/types/continuing-education-beneficiary";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateContinuingEducationBeneficiaryInput) => Promise<void>;
  courseCode: string;
  defaultYear: string;
  defaultSemester: number;
  mode: "create" | "edit";
  initial?: Partial<CreateContinuingEducationBeneficiaryInput>;
};

export function ContinuingEducationBeneficiaryForm({
  open,
  onClose,
  onSubmit,
  courseCode,
  defaultYear,
  defaultSemester,
  mode,
  initial,
}: Props) {
  const currentYear = String(new Date().getFullYear());
  const yearOptions = Array.from({ length: 7 }, (_, i) => String(Number(currentYear) - i));
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateContinuingEducationBeneficiaryInput>({
    year: defaultYear,
    semester: defaultSemester,
    course_code: courseCode,
    beneficiary_type_extension_id: 0,
    beneficiaries_count: 0,
  });

  useEffect(() => {
    if (!open) return;
    setForm({
      year: initial?.year ?? defaultYear,
      semester: initial?.semester ?? defaultSemester,
      course_code: courseCode,
      beneficiary_type_extension_id: initial?.beneficiary_type_extension_id ?? 0,
      beneficiaries_count: initial?.beneficiaries_count ?? 0,
    });
  }, [open, courseCode, defaultYear, defaultSemester, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit({ ...form, course_code: courseCode });
      onClose();
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
              <CardTitle className="text-2xl">
                {mode === "edit" ? "Editar Beneficiario" : "Crear Beneficiario"}
              </CardTitle>
              <CardDescription className="mt-1">
                Registro de beneficiarios para educación continua
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} disabled={submitting}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <div className="text-xs text-muted-foreground">Curso</div>
              <div className="text-sm font-semibold text-foreground truncate">Código {courseCode}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ce-benef-year">Año</Label>
                <Select value={form.year} onValueChange={(v) => setForm((p) => ({ ...p, year: v }))}>
                  <SelectTrigger id="ce-benef-year" className="bg-muted/50" disabled={submitting}>
                    <SelectValue placeholder="Seleccione" />
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
                <Label htmlFor="ce-benef-type">Tipo beneficiario (extensión)</Label>
                <Input
                  id="ce-benef-type"
                  type="number"
                  min={0}
                  value={form.beneficiary_type_extension_id || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, beneficiary_type_extension_id: Number(e.target.value) }))
                  }
                  className="bg-muted/50"
                  placeholder="7"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ce-benef-count">Cantidad de beneficiarios</Label>
              <Input
                id="ce-benef-count"
                type="number"
                min={0}
                value={form.beneficiaries_count || ""}
                onChange={(e) => setForm((p) => ({ ...p, beneficiaries_count: Number(e.target.value) }))}
                className="bg-muted/50"
                placeholder="50"
                required
                disabled={submitting}
              />
            </div>
          </CardContent>

          <CardFooter className="flex gap-3 border-t pt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={submitting}>
              {submitting ? "Guardando..." : mode === "edit" ? "Guardar cambios" : "Crear Beneficiario"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

