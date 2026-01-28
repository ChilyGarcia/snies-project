import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
const COLORS = ["#e30513", "#3c3c3b", "#9c0f06", "#6b7280"];
interface Props {
    data: {
        name: string;
        total: number;
    }[];
}
export function ActivitiesPieChart({ data }: Props) {
    return (<div className="space-y-4">
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="total" nameKey="name" outerRadius={90} label>
                {data.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]}/>))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
  
        <div className="flex flex-wrap items-center justify-center gap-4">
            {data.map((item, i) => (<div key={item.name} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{
                backgroundColor: COLORS[i % COLORS.length],
            }}/>
                <span className="text-muted-foreground">
                    {item.name}
                </span>
                </div>))}
        </div>
      </div>);
}
