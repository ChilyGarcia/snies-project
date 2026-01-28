"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { CreateWellbeingActivityInput } from "../../hooks/types/create-activity-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
interface WellbeingActivityFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateWellbeingActivityInput) => Promise<void>;
}
const INITIAL_STATE: CreateWellbeingActivityInput = {
    year: "",
    semester: 1,
    organization_unit_code: "",
    activity_code: "",
    activity_description: "",
    wellbeing_activity_type_id: 0,
    start_date: "",
    end_date: "",
    national_source_id: 0,
    national_funding_value: "0.00",
    funding_country_id: 0,
    international_source_entity_name: null,
    international_funding_value: null,
};
export function WellbeingActivityForm({ open, onClose, onSubmit, }: WellbeingActivityFormProps) {
    const [form, setForm] = useState<CreateWellbeingActivityInput>(INITIAL_STATE);
    const currentYear = String(new Date().getFullYear());
    const yearOptions = useMemo(() => Array.from({ length: 7 }, (_, i) => String(Number(currentYear) - i)), [currentYear]);
    const [submitting, setSubmitting] = useState(false);

    const formatMoneyDecimal = (raw: string | null) => {
        if (!raw)
            return "";
        const n = Number(raw);
        if (!Number.isFinite(n))
            return "";
        return n.toLocaleString("es-CO");
    };

    const parseMoneyInputToDecimalString = (raw: string) => {
        const digits = (raw ?? "").replace(/[^\d]/g, "");
        if (!digits)
            return "0.00";
        return `${Number(digits)}.00`;
    };
    const resetForm = () => setForm(INITIAL_STATE);
    const handleChange = (field: keyof CreateWellbeingActivityInput, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
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
        if (!form.year) {
            setForm((p) => ({ ...p, year: currentYear }));
        }
    }, [open, currentYear]);
    if (!open)
        return null;
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Crear Actividad de Bienestar
              </CardTitle>
              <CardDescription className="mt-1">
                Complete la información solicitada
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => {
            resetForm();
            onClose();
        }}>
              <X className="h-4 w-4"/>
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Año</Label>
                  <Select value={form.year} onValueChange={(v) => handleChange("year", v)}>
                    <SelectTrigger className="bg-muted/50" disabled={submitting}>
                      <SelectValue placeholder="Seleccione el año"/>
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((y) => (<SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 w-full">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código Unidad Organizacional</Label>
                  <Input type="text" maxLength={30} placeholder="Ej: U01" value={form.organization_unit_code || ""} onChange={(e) => handleChange("organization_unit_code", e.target.value)} className="bg-muted/50" required disabled={submitting}/>
                </div>

                <div className="space-y-2">
                  <Label>Código de la Actividad</Label>
                  <Input type="text" maxLength={15} placeholder="Ej: A001" value={form.activity_code || ""} onChange={(e) => handleChange("activity_code", e.target.value)} className="bg-muted/50" required disabled={submitting}/>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descripción de la Actividad</Label>
                <Input placeholder="Descripción de la actividad" value={form.activity_description} onChange={(e) => handleChange("activity_description", e.target.value)} className="bg-muted/50" required disabled={submitting}/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 w-full">
                  <Label>Tipo de Actividad de Bienestar</Label>
                  <Select value={form.wellbeing_activity_type_id
            ? String(form.wellbeing_activity_type_id)
            : ""} onValueChange={(value) => handleChange("wellbeing_activity_type_id", Number(value))}>
                    <SelectTrigger className="w-full bg-muted/50" disabled={submitting}>
                      <SelectValue placeholder="Seleccione el tipo de actividad"/>
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="1">Salud</SelectItem>
                      <SelectItem value="2">Cultura</SelectItem>
                      <SelectItem value="3">Desarrollo humano</SelectItem>
                      <SelectItem value="4">Promoción socioeconómica</SelectItem>
                      <SelectItem value="5">Recreación y deporte</SelectItem>
                      <SelectItem value="6">Apoyo económico</SelectItem>
                      <SelectItem value="7">Apoyo académico</SelectItem>
                      <SelectItem value="8">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fecha Inicio</Label>
                  <Input type="date" value={form.start_date} onChange={(e) => handleChange("start_date", e.target.value)} className="bg-muted/50" required disabled={submitting}/>
                </div>

                <div className="space-y-2">
                  <Label>Fecha Fin</Label>
                  <Input type="date" value={form.end_date} onChange={(e) => handleChange("end_date", e.target.value)} className="bg-muted/50" required disabled={submitting}/>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="w-full space-y-2">
                  <Label>Fuente Nacional</Label>
                  <Select value={form.national_source_id
            ? String(form.national_source_id)
            : ""} onValueChange={(value) => handleChange("national_source_id", Number(value))}>
                    <SelectTrigger className="w-full bg-muted/50" disabled={submitting}>
                      <SelectValue placeholder="Seleccione la fuente"/>
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="1">Recursos IES</SelectItem>
                      <SelectItem value="2">Recursos públicos nacionales</SelectItem>
                      <SelectItem value="3">Recursos públicos departamentales</SelectItem>
                      <SelectItem value="4">Recursos públicos municipales o distritales</SelectItem>
                      <SelectItem value="5">Recursos privados</SelectItem>
                      <SelectItem value="6">Recursos de organizaciones sin ánimo de lucro</SelectItem>
                      <SelectItem value="7">Otras entidades</SelectItem>
                      <SelectItem value="8">Recursos propios privados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Valor Financiación Nacional</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formatMoneyDecimal(form.national_funding_value)}
                    onChange={(e) => handleChange("national_funding_value", parseMoneyInputToDecimalString(e.target.value))}
                    className="bg-muted/50"
                    placeholder="0"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label>ID País de Financiación</Label>
                  <Input type="text" inputMode="numeric" value={form.funding_country_id || ""} onChange={(e) => handleChange("funding_country_id", e.target.value === "" ? 0 : Number(e.target.value))} className="bg-muted/50" required disabled={submitting}/>
                </div>

                <div className="space-y-2">
                  <Label>Entidad Fuente Internacional</Label>
                  <Input value={form.international_source_entity_name ?? ""} onChange={(e) => handleChange("international_source_entity_name", e.target.value ? e.target.value : null)} className="bg-muted/50" placeholder="(Opcional)" disabled={submitting}/>
                </div>

                <div className="space-y-2">
                  <Label>Valor Financiación Internacional</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formatMoneyDecimal(form.international_funding_value)}
                    onChange={(e) => handleChange("international_funding_value", e.target.value ? parseMoneyInputToDecimalString(e.target.value) : null)}
                    className="bg-muted/50"
                    placeholder="(Opcional)"
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3 border-t pt-6">
            <Button type="button" variant="outline" className="flex-1" onClick={() => {
            resetForm();
            onClose();
        }} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={submitting}>
              {submitting ? "Creando..." : "Crear Actividad"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>);
}
