"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ParticipationChart } from "@/components/charts/participation-chart";
import { ProgramsChart } from "@/components/charts/programs-chart";
import { ConveniosChart } from "@/components/charts/convenios-chart";
import { ProyectosChart } from "@/components/charts/proyectos-chart";
interface ChartsSectionProps {
    selectedArea: string;
    selectedPeriod: string;
}
export function ChartsSection({ selectedArea, selectedPeriod }: ChartsSectionProps) {
    return (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-border lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-foreground">Participación Estudiantil y Docente</CardTitle>
          <CardDescription className="text-muted-foreground">
            Evolución mensual de la participación en actividades institucionales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ParticipationChart />
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Programas por Área</CardTitle>
          <CardDescription className="text-muted-foreground">Distribución de programas activos</CardDescription>
        </CardHeader>
        <CardContent>
          <ProgramsChart />
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Convenios Internacionales</CardTitle>
          <CardDescription className="text-muted-foreground">Convenios activos por región</CardDescription>
        </CardHeader>
        <CardContent>
          <ConveniosChart />
        </CardContent>
      </Card>

      <Card className="border-border lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-foreground">Proyectos de Investigación</CardTitle>
          <CardDescription className="text-muted-foreground">
            Estado de proyectos por fase de desarrollo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProyectosChart />
        </CardContent>
      </Card>
    </div>);
}
