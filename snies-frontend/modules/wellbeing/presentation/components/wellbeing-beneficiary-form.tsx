"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
export interface WellbeingBeneficiaryFormData {
    id: string;
    year: string;
    semester: number;
    organization_unit_code: string;
    activity_code: string;
    beneficiary_type_id: number;
    beneficiaries_count: number;
}
interface WellbeingBeneficiaryFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: WellbeingBeneficiaryFormData) => Promise<void>;
    initialData: WellbeingBeneficiaryFormData;
}
export function WellbeingBeneficiaryForm({ open, onClose, onSubmit, initialData, }: WellbeingBeneficiaryFormProps) {
    const [form, setForm] = useState<WellbeingBeneficiaryFormData>(initialData);
    const currentYear = String(new Date().getFullYear());
    const yearOptions = useMemo(() => Array.from({ length: 7 }, (_, i) => String(Number(currentYear) - i)), [currentYear]);
    const [submitting, setSubmitting] = useState(false);
    const resetForm = () => setForm(initialData);
    const handleChange = (field: keyof WellbeingBeneficiaryFormData, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await onSubmit(form);
            resetForm();
            onClose();
        }
        finally {
            setSubmitting(false);
        }
    };
    useEffect(() => {
        if (!open)
            return;
        setForm(initialData);
    }, [open, initialData]);
    if (!open)
        return null;
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex items-center justify-between border-b">
          <CardTitle>Agregar Beneficiario</CardTitle>
          <Button variant="ghost" size="icon" onClick={() => { resetForm(); onClose(); }}>
            <X className="h-4 w-4"/>
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label>Año</Label>
                <Select value={form.year} onValueChange={(v) => handleChange("year", v)}>
                  <SelectTrigger className="w-full bg-muted/50" disabled={submitting}>
                    <SelectValue placeholder="Seleccione el año"/>
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {yearOptions.map((y) => (<SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>))}
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label>Semestre</Label>
                  <Select value={form.semester
            ? String(form.semester)
            : ""} onValueChange={(value) => handleChange("semester", Number(value))}>
                    <SelectTrigger className="w-full bg-muted/50" disabled={submitting}>
                      <SelectValue placeholder="Seleccione el semestre"/>
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="1">Semestre 1</SelectItem>
                      <SelectItem value="2">Semestre 2</SelectItem>
                    </SelectContent>
                  </Select>
            </div>

            <div className="space-y-2">
              <Label>Código Unidad Organizacional</Label>
              <Input type="text" maxLength={30} value={form.organization_unit_code || ""} onChange={(e) => handleChange("organization_unit_code", e.target.value)} className="bg-muted/50" placeholder="U01" required disabled={submitting}/>
            </div>

            <div className="space-y-2">
              <Label>Código Actividad</Label>
                <Input type="text" maxLength={15} placeholder="Ej: A001" value={form.activity_code || ""} onChange={(e) => handleChange("activity_code", e.target.value)} className="bg-muted/50" required disabled={submitting}/>
            </div>

            <div className="space-y-2">
              <Label>ID Tipo Beneficiario</Label>
              <Select value={form.beneficiary_type_id
            ? String(form.beneficiary_type_id)
            : ""} onValueChange={(value) => handleChange("beneficiary_type_id", Number(value))}>
                    <SelectTrigger className="w-full bg-muted/50" disabled={submitting}>
                      <SelectValue placeholder="Seleccione el tipo de beneficiario"/>
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="1">Estudiante de la IES</SelectItem>
                      <SelectItem value="2">Graduado de la IES</SelectItem>
                      <SelectItem value="3">Profesor de la IES</SelectItem>
                      <SelectItem value="4">Administrativo de la IES</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label>Cantidad Beneficiarios</Label>
              <Input type="text" inputMode="numeric" value={form.beneficiaries_count || ""} onChange={(e) => handleChange("beneficiaries_count", e.target.value === "" ? 0 : Number(e.target.value))} className="bg-muted/50" placeholder="0" disabled={submitting}/>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3 border-t mt-4 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => { resetForm(); onClose(); }} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>);
}
