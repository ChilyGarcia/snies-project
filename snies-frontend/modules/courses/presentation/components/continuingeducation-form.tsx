"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { CreateContinuingEducationInput } from "../../hooks/types/create-continuingeducation-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
interface ContinuingEducationFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateContinuingEducationInput) => Promise<void>;
    courseId: number;
    courseName?: string;
    defaultYear?: string;
    defaultSemester?: number;
}
export function ContinuingEducationForm({ open, onClose, onSubmit, courseId, courseName, defaultYear, defaultSemester, }: ContinuingEducationFormProps) {
    const currentYear = String(new Date().getFullYear());
    const yearOptions = Array.from({ length: 7 }, (_, i) => String(Number(currentYear) - i));
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<CreateContinuingEducationInput>({
        year: defaultYear ?? "",
        semester: defaultSemester ?? 0,
        num_hours: 0,
        id_course: courseId,
        value: 0,
    });
    const formatMoney = (n: number) => {
        try {
            return (n || 0).toLocaleString("es-CO");
        }
        catch {
            return String(n || 0);
        }
    };
    useEffect(() => {
        if (open) {
            setForm((prev) => ({
                ...prev,
                id_course: courseId,
                year: defaultYear ?? prev.year,
                semester: defaultSemester ?? prev.semester,
            }));
        }
    }, [courseId, defaultYear, defaultSemester, open]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await onSubmit({ ...form, id_course: courseId });
            setForm({
                year: defaultYear ?? "",
                semester: defaultSemester ?? 0,
                num_hours: 0,
                id_course: courseId,
                value: 0,
            });
            onClose();
        }
        catch (error) {
            console.error(error);
            toast.error("Error creando educación continua", {
                description: error instanceof Error ? error.message : "Error inesperado",
            });
        }
        finally {
            setSubmitting(false);
        }
    };
    if (!open)
        return null;
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Crear Educación Continua</CardTitle>
              <CardDescription className="mt-1">
                Complete los campos del formulario
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4"/>
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-muted/20 p-3">
                <div className="text-xs text-muted-foreground">Curso</div>
                <div className="text-sm font-semibold text-foreground truncate">
                  {courseName ? courseName : `ID #${courseId}`}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Año</Label>
                <Select value={form.year} onValueChange={(v) => setForm({ ...form, year: v })}>
                  <SelectTrigger id="year" className="bg-muted/50" disabled={submitting}>
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

              <div className="flex gap-4">
                  <div className="space-y-2 w-full">
                    <label className="text-sm font-medium">Semestre</label>
                    <Select value={String(form.semester || "")} onValueChange={(value) => setForm({ ...form, semester: Number(value) })}>
                      <SelectTrigger className="w-full bg-muted/50" disabled={submitting}>
                        <SelectValue placeholder="Seleccione el semestre"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Semestre 1</SelectItem>
                        <SelectItem value="2">Semestre 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="num_hours">Número de Horas</Label>
                <Input id="num_hours" type="number" min={0} value={form.num_hours || ""} onChange={(e) => setForm({ ...form, num_hours: Number(e.target.value) })} className="bg-muted/50" placeholder="Ingrese el número de horas del curso" required disabled={submitting}/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Valor</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/3 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="value"
                    type="text"
                    inputMode="numeric"
                    value={form.value ? formatMoney(form.value) : ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const digits = raw.replace(/[^\d]/g, "");
                      const num = digits ? Number(digits) : 0;
                      setForm({ ...form, value: num });
                    }}
                    className="w-full pl-8 pr-3 mb-6 py-2 border border-input rounded-md bg-muted/50"
                    placeholder="0"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3 border-t pt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={submitting}>
              {submitting ? "Creando..." : "Crear Registro"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>);
}
