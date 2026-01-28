"use client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Lightbulb, Globe, FlaskConical } from "lucide-react";
interface AreaFiltersProps {
    selectedArea: string;
    selectedPeriod: string;
    onAreaChange: (area: string) => void;
    onPeriodChange: (period: string) => void;
}
export function AreaFilters({ selectedArea, selectedPeriod, onAreaChange, onPeriodChange }: AreaFiltersProps) {
    const areas = [
        { id: "all", label: "Todas las Áreas", icon: null },
        { id: "bienestar", label: "Bienestar Universitario", icon: Heart },
        { id: "extension", label: "Extensión", icon: Lightbulb },
        { id: "internacional", label: "Internacionalización", icon: Globe },
        { id: "investigacion", label: "Investigación", icon: FlaskConical },
    ];
    return (<div className="bg-card border border-border rounded-lg p-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {areas.map((area) => {
            const Icon = area.icon;
            return (<Button key={area.id} variant={selectedArea === area.id ? "default" : "outline"} size="sm" onClick={() => onAreaChange(area.id)} className="gap-2">
                {Icon && <Icon className="w-4 h-4"/>}
                {area.label}
              </Button>);
        })}
        </div>

        <Select value={selectedPeriod} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Período"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Último mes</SelectItem>
            <SelectItem value="trimester">Último trimestre</SelectItem>
            <SelectItem value="semester">Semestre actual</SelectItem>
            <SelectItem value="year">Año académico</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>);
}
