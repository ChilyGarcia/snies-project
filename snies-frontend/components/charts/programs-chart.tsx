"use client";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
const data = [
    { area: "Bienestar", programas: 42 },
    { area: "Extensión", programas: 38 },
    { area: "Internacional", programas: 35 },
    { area: "Investigación", programas: 41 },
];
export function ProgramsChart() {
    return (<ChartContainer config={{
            programas: {
                label: "Programas",
                color: "#DC2626",
            },
        }} className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border"/>
          <XAxis dataKey="area" className="text-xs text-muted-foreground" angle={-15} textAnchor="end" height={60}/>
          <YAxis className="text-xs text-muted-foreground"/>
          <ChartTooltip content={<ChartTooltipContent />}/>
          <Bar dataKey="programas" fill="#DC2626" radius={[4, 4, 0, 0]}/>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>);
}
