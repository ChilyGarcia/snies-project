"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { WellbeingActivity } from "@/modules/wellbeing/types/activity";
// Beneficiarios se gestionan en la sección separada del módulo (tab "Beneficiarios")
interface ActivityDetailProps {
    activity: WellbeingActivity;
    onBack: () => void;
}
function Info({ label, value }: {
    label: string;
    value: React.ReactNode;
}) {
    return (<div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-medium">{value ?? "-"}</p>
    </div>);
}
export function ActivityDetail({ activity, onBack }: ActivityDetailProps) {
    return (<div className="mx-auto space-y-4 md:space-y-6">
      <div className="border rounded-xl p-4 md:p-6 space-y-4 bg-card">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 md:gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Código: {activity.activity_code}
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge className="bg-[#3c3c3b] text-white text-sm">Año {activity.year}</Badge>
            <Badge className="bg-[#9c0f06] text-white text-sm">Semestre {activity.semester}</Badge>

            <Button variant="ghost" onClick={onBack} className="whitespace-nowrap text-base">
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Volver
            </Button>
          </div>
        </div>
      </div>

      <Card className="rounded-2xl border bg-background p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <Info label="Código Unidad Organizacional" value={activity.organization_unit_code}/>
          <Info label="Tipo de Actividad" value={activity.wellbeing_activity_type_id}/>
          <Info label="Fecha Inicio" value={activity.start_date}/>
          <Info label="Fecha Fin" value={activity.end_date}/>
          <Info label="Fuente Nacional" value={activity.national_source_id}/>
          <Info label="Valor Financiación Nacional" value={activity.national_funding_value}/>
          <Info label="País de Financiación" value={activity.funding_country_id}/>
          <Info label="Nombre entidad fuente internacional" value={activity.international_source_entity_name}/>
          <Info label="Valor financiación internacional" value={activity.international_funding_value}/>
        </div>
        <div className="mt-6">
          <Info label="Descripción de la Actividad" value={activity.activity_description}/>
        </div>
      </Card>
    </div>);
}
