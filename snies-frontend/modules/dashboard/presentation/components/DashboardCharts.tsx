"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  TooltipProps
} from "recharts";

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-md px-3 py-2 shadow-xl ring-1 ring-black/5 dark:ring-white/5">
        <p className="mb-1 text-xs font-semibold text-muted-foreground">{label}</p>
        <p className="font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].fill }} />
            {payload[0].value?.toLocaleString('es-CO')}
        </p>
      </div>
    );
  }
  return null;
};

export function TopBar({ data, color }: { data: Array<{ name: string; total: number }>; color: string }) {
  if (!data?.length) return <EmptyChartState />;

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barCategoryGap={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            height={40}
            tickFormatter={(value) => value.length > 12 ? `${value.substring(0, 12)}...` : value}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => Intl.NumberFormat('es-CO', { notation: "compact", compactDisplay: "short" }).format(value)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.2 }} />
          <Bar
            dataKey="total"
            fill={color}
            radius={[6, 6, 0, 0]}
            maxBarSize={60}
            animationDuration={1000}
            animationBegin={200}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopPie({ data, colors }: { data: Array<{ name: string; total: number }>; colors: string[] }) {
  if (!data?.length) return <EmptyChartState />;

  return (
    <div className="h-[320px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Pie
            data={data}
            dataKey="total"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            stroke="var(--background)"
            strokeWidth={2}
          >
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend inside or below could be nice, currently keeping it simple */}
      <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground max-h-20 overflow-y-auto">
          {data.slice(0, 5).map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: colors[index % colors.length] }} />
                  <span className="truncate max-w-[100px]" title={entry.name}>{entry.name}</span>
              </div>
          ))}
          {data.length > 5 && <span>+{data.length - 5} más</span>}
      </div>
    </div>
  );
}

function EmptyChartState() {
  return (
    <div className="h-[320px] w-full flex flex-col items-center justify-center text-muted-foreground/50 border-2 border-dashed border-border/30 rounded-xl bg-muted/5">
       <p className="text-sm">No hay datos disponibles</p>
    </div>
  );
}
