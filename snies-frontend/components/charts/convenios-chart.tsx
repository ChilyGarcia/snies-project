"use client";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
const data = [
    { region: "América Latina", convenios: 28 },
    { region: "Europa", convenios: 34 },
    { region: "Asia", convenios: 15 },
    { region: "Norteamérica", convenios: 12 },
];
export function ConveniosChart() {
    return (<ChartContainer config={{
            convenios: {
                label: "Convenios",
                color: "#DC2626",
            },
        }} className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border"/>
          <XAxis type="number" className="text-xs text-muted-foreground"/>
          <YAxis type="category" dataKey="region" className="text-xs text-muted-foreground" width={100}/>
          <ChartTooltip content={<ChartTooltipContent />}/>
          <Bar dataKey="convenios" fill="#DC2626" radius={[0, 4, 4, 0]}/>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>);
}
