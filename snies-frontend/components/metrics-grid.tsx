"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, TrendingUp, UserCheck, BookOpen, Building2, Award } from "lucide-react";
interface MetricsGridProps {
    selectedArea: string;
}
export function MetricsGrid({ selectedArea }: MetricsGridProps) {
    const getMetrics = () => {
        const allMetrics = [
            {
                title: "Estudiantes Participantes",
                value: "12,450",
                change: "+8.2%",
                icon: Users,
                trend: "up",
            },
            {
                title: "Docentes Involucrados",
                value: "847",
                change: "+5.1%",
                icon: UserCheck,
                trend: "up",
            },
            {
                title: "Programas Activos",
                value: "156",
                change: "+12.3%",
                icon: BookOpen,
                trend: "up",
            },
            {
                title: "Actividades Realizadas",
                value: "423",
                change: "+15.7%",
                icon: Calendar,
                trend: "up",
            },
            {
                title: "Convenios Vigentes",
                value: "89",
                change: "+3.4%",
                icon: FileText,
                trend: "up",
            },
            {
                title: "Proyectos en Curso",
                value: "234",
                change: "+9.8%",
                icon: TrendingUp,
                trend: "up",
            },
            {
                title: "Instituciones Aliadas",
                value: "67",
                change: "+6.2%",
                icon: Building2,
                trend: "up",
            },
            {
                title: "Reconocimientos",
                value: "45",
                change: "+18.9%",
                icon: Award,
                trend: "up",
            },
        ];
        return allMetrics;
    };
    const metrics = getMetrics();
    return (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (<Card key={index} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <Icon className="w-4 h-4 text-muted-foreground"/>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3">
                <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                <span className="text-sm font-medium text-primary">{metric.change}</span>
              </div>
            </CardContent>
          </Card>);
        })}
    </div>);
}
