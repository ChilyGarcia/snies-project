"use client";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
const data = [
    { month: "Ene", estudiantes: 1850, docentes: 124 },
    { month: "Feb", estudiantes: 2100, docentes: 145 },
    { month: "Mar", estudiantes: 2380, docentes: 167 },
    { month: "Abr", estudiantes: 2200, docentes: 156 },
    { month: "May", estudiantes: 2650, docentes: 178 },
    { month: "Jun", estudiantes: 2900, docentes: 189 },
];
export function ParticipationChart() {
    return (<ChartContainer config={{
            estudiantes: {
                label: "Estudiantes",
                color: "#DC2626",
            },
            docentes: {
                label: "Docentes",
                color: "#6B7280",
            },
        }} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border"/>
          <XAxis dataKey="month" className="text-xs text-muted-foreground"/>
          <YAxis className="text-xs text-muted-foreground"/>
          <ChartTooltip content={<ChartTooltipContent />}/>
          <Line type="monotone" dataKey="estudiantes" stroke="#DC2626" strokeWidth={2} dot={{ fill: "#DC2626", r: 4 }}/>
          <Line type="monotone" dataKey="docentes" stroke="#6B7280" strokeWidth={2} dot={{ fill: "#6B7280", r: 4 }}/>
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>);
}
