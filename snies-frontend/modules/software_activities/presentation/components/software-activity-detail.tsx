"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { SoftwareActivity } from "@/modules/software_activities/types/software-activity";

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 md:p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium break-words">{value}</div>
    </div>
  );
}

export function SoftwareActivityDetail(props: {
  activity: SoftwareActivity;
  onBack: () => void;
}) {
  const a = props.activity;
  return (
    <div className="space-y-5">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Actividad
              </div>
              <CardTitle className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
                {a.activity_name}
              </CardTitle>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge className="rounded-full border border-border bg-muted/20 text-foreground">
                  Año {a.year} · Sem {a.semester}
                </Badge>
                <Badge className="rounded-full border border-primary/20 bg-primary/10 text-primary">
                  {a.campus}
                </Badge>
              </div>
            </div>
            <button
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted/30"
              onClick={props.onBack}
              type="button"
            >
              ← Volver
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Info label="Lugar ejecución" value={a.execution_place || "—"} />
            <Info
              label="Fechas"
              value={
                <>
                  {a.start_date || "—"} → {a.end_date || "—"}
                </>
              }
            />
            <Info label="Horas" value={a.num_hours ?? "—"} />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Info label="Convenio (entidad)" value={a.agreement_entity || "—"} />
            <Info
              label="CINE"
              value={
                a.cine_isced_name
                  ? `${a.cine_isced_name} (${a.cine_field_detailed_id || "—"})`
                  : a.cine_field_detailed_id || "—"
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Info label="Total beneficiarios" value={a.total_beneficiaries ?? "—"} />
            <Info label="Profesor" value={a.professors_count ?? "—"} />
            <Info label="Administrativo" value={a.administrative_count ?? "—"} />
            <Info label="No vinculada" value={a.external_people_count ?? "—"} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Info label="Docente (tipo doc)" value={a.teacher_document_type || "—"} />
            <Info label="Docente (número)" value={a.teacher_document_number || "—"} />
          </div>

          {a.description ? (
            <div className="rounded-2xl border border-border bg-muted/10 p-4">
              <div className="text-sm font-semibold">Descripción</div>
              <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                {a.description}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

