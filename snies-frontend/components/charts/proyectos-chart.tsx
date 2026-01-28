"use client";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
const data = [
    { fase: "Planificación", proyectos: 45, completados: 8 },
    { fase: "Ejecución", proyectos: 98, completados: 12 },
    { fase: "Seguimiento", proyectos: 67, completados: 34 },
    { fase: "Finalización", proyectos: 24, completados: 18 },
];
export function ProyectosChart() {
    return (<ChartContainer config={{
            proyectos: {
                label: "En Curso",
                color: "#DC2626",
            },
            completados: {
                label: "Completados",
                color: "#6B7280",
            },
        }} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border"/>
          <XAxis dataKey="fase" className="text-xs text-muted-foreground"/>
          <YAxis className="text-xs text-muted-foreground"/>
          <ChartTooltip content={<ChartTooltipContent />}/>
          <Bar dataKey="proyectos" fill="#DC2626" radius={[4, 4, 0, 0]}/>
          <Bar dataKey="completados" fill="#6B7280" radius={[4, 4, 0, 0]}/>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>);
}
