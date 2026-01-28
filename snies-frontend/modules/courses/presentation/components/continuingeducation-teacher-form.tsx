"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateContinuingEducationTeacherInput } from "@/modules/courses/types/continuing-education-teacher";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateContinuingEducationTeacherInput) => Promise<void>;
  courseCode: string;
  defaultYear: string;
  defaultSemester: number;
};

export function ContinuingEducationTeacherForm({ open, onClose, onSubmit, courseCode, defaultYear, defaultSemester }: Props) {
  const currentYear = String(new Date().getFullYear());
  const yearOptions = Array.from({ length: 7 }, (_, i) => String(Number(currentYear) - i));
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateContinuingEducationTeacherInput>({
    year: defaultYear || currentYear,
    semester: defaultSemester || 1,
    course_code: courseCode,
    document_type_id: 1,
    document_number: "",
  });

  useEffect(() => {
    if (!open) return;
    setForm((prev) => ({
      ...prev,
      course_code: courseCode || prev.course_code,
      year: defaultYear || prev.year,
      semester: defaultSemester || prev.semester,
    }));
  }, [open, courseCode, defaultYear, defaultSemester]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit({ ...form, course_code: courseCode });
      onClose();
      setForm((prev) => ({ ...prev, document_number: "" }));
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
              <CardTitle className="text-2xl">Crear Docente</CardTitle>
              <CardDescription className="mt-1">
                Registro de docente para educación continua
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
                <Label htmlFor="ce-teacher-year">Año</Label>
                <Select
                  value={form.year}
                  onValueChange={(v) => setForm((p) => ({ ...p, year: v }))}
                >
                  <SelectTrigger id="ce-teacher-year" className="bg-muted/50" disabled={submitting}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="ce-teacher-doc">Número de documento</Label>
              <Input
                id="ce-teacher-doc"
                value={form.document_number}
                onChange={(e) => setForm((p) => ({ ...p, document_number: e.target.value }))}
                className="bg-muted/50"
                placeholder="999999"
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
              {submitting ? "Creando..." : "Crear Docente"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

