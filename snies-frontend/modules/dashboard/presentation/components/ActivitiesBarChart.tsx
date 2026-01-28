"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, } from "recharts";
interface Props {
    data: {
        name: string;
        total: number;
    }[];
}
export function ActivitiesBarChart({ data }: Props) {
    return (<div className="h-[320px] w-full rounded-xl bg-white p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 10 }} barCategoryGap={24}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb"/>

            <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false}/>

            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false}/>

            <Tooltip cursor={{ fill: "rgba(227,5,19,0.08)" }} contentStyle={{
            borderRadius: 8,
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }} labelStyle={{ fontWeight: 600 }}/>

            <Bar dataKey="total" fill="#e30513" radius={[8, 8, 0, 0]} maxBarSize={150}/>
            </BarChart>
        </ResponsiveContainer>
    </div>);
}
