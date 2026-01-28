import { Card, CardContent } from "@/components/ui/card";
interface StatsCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    description?: string;
}
export function StatsCard({ title, value, icon, description, }: StatsCardProps) {
    return (<Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {description && (<p className="text-xs text-muted-foreground">{description}</p>)}
        </div>
        <div className="bg-muted p-3 rounded-xl">
          {icon}
        </div>
      </CardContent>
    </Card>);
}
