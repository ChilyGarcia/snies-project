"use client";
import { GraduationCap, Calendar } from "lucide-react";
export function DashboardHeader() {
    const currentDate = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return (<header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground"/>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground text-balance">Dashboard Institucional</h1>
              <p className="text-muted-foreground text-sm mt-1">Gestión Académica y Administrativa</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4"/>
            <span>{currentDate}</span>
          </div>
        </div>
      </div>
    </header>);
}
