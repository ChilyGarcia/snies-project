"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { CreateCourseInput } from "../hooks/types/create-course-input";
interface CourseFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CreateCourseInput) => Promise<void>;
}
const INITIAL_STATE: CreateCourseInput = {
    code: "",
    name: "",
    id_cine_field_detailed: "",
    is_extension: false,
    is_active: false,
};
export function CourseForm({ open, onClose, onSubmit }: CourseFormProps) {
    const [form, setForm] = useState<CreateCourseInput>(INITIAL_STATE);
    const resetForm = () => setForm(INITIAL_STATE);
    const handleChange = (field: keyof CreateCourseInput, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(form);
        resetForm();
        onClose();
    };
    if (!open)
        return null;
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Crear Nuevo Curso</CardTitle>
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
              <div className="space-y-2">
                <Label>Nombre del Curso</Label>
                <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="bg-muted/50" required/>
              </div>

              <div className="space-y-2">
                <Label>Código del Curso</Label>
                <Input value={form.code} onChange={(e) => handleChange("code", e.target.value)} className="bg-muted/50" required/>
              </div>

              <div className="space-y-2">
                <Label>ID Cine Campo Detallado</Label>
                <Input value={form.id_cine_field_detailed} onChange={(e) => handleChange("id_cine_field_detailed", e.target.value)} className="bg-muted/50" required/>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label className="cursor-pointer">Curso de Extensión</Label>
                <Switch checked={form.is_extension} onCheckedChange={(v) => handleChange("is_extension", v)}/>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label className="cursor-pointer">Estado Activo</Label>
                <Switch checked={form.is_active} onCheckedChange={(v) => handleChange("is_active", v)}/>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3 border-t pt-6 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-[#9c0f06] hover:bg-[#e30513]">
              Crear Curso
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>);
}
