"use client";
import { useState } from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, GraduationCap, ArrowRight, FileSpreadsheet, Loader2, } from "lucide-react";
import { WellbeingActivity } from "@/modules/wellbeing/types/activity";
import { CreateWellbeingActivityInput } from "../hooks/types/create-activity-input";
import { WellbeingActivityForm } from "./components/wellbeing-activity-form";
import { ActivityDetail } from "../presentation/components/activity-detail";
import { WellbeingActivityApi } from "../api/wellbeing-activity.api";
import { WellbeingBenefeciaryApi } from "../api/wellbeing-beneficiary.api";
import { WellbeingHumanResourceApi } from "../api/wellbeing-human-resource.api";
import { useWellbeingActivities } from "../hooks/use-cases/use-wellbeing-activities";
import { toast } from "sonner";
import { ApiValidationError, formatValidationDetails } from "@/shared/api/api-errors";
import { motion, useReducedMotion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisteredWellbeingBeneficiariesPanel } from "@/modules/wellbeing/presentation/beneficiaries.panel";
import { RegisteredWellbeingHumanResourcesPanel } from "@/modules/wellbeing/presentation/human-resources.panel";
import { exportWellbeingExcel } from "@/modules/wellbeing/utils/export-wellbeing-excel";
const repository = new WellbeingActivityApi();
export function RegisteredWellbeingActivitiesPanel() {
    const [section, setSection] = useState<"activities" | "beneficiaries" | "human_resources">("activities");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedActivity, setSelectedActivity] = useState<WellbeingActivity | null>(null);
    const [openForm, setOpenForm] = useState(false);
    const [exporting, setExporting] = useState(false);
    const reduceMotion = useReducedMotion();
    const { activities, loading, error, refetch, } = useWellbeingActivities(repository);
    const beneficiaryRepo = new WellbeingBenefeciaryApi();
    const hrRepo = new WellbeingHumanResourceApi();
    const handleCreateWellbeingActivity = async (data: CreateWellbeingActivityInput) => {
        try {
            await repository.create(data);
            toast.success("Actividad creada", { description: `${data.activity_code} · ${data.year} S${data.semester}` });
            await refetch();
        }
        catch (e) {
            if (e instanceof ApiValidationError) {
                toast.error(e.message || "Error de validación", {
                    description: (<div className="whitespace-pre-line">{formatValidationDetails(e.details)}</div>),
                });
                throw e;
            }
            toast.error("No se pudo crear la actividad", {
                description: e instanceof Error ? e.message : "Error inesperado",
            });
            throw e;
        }
    };
    const filteredActivities = activities.filter((a) => a.activity_description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        a.activity_code.toString().includes(searchTerm));
    const handleExport = async () => {
        setExporting(true);
        try {
            const [acts, bens, hrs] = await Promise.all([
                repository.list(),
                beneficiaryRepo.list(),
                hrRepo.list(),
            ]);
            await exportWellbeingExcel({ activities: acts, beneficiaries: bens, humanResources: hrs });
            toast.success("Exportación completa", { description: "Se exportó Bienestar a Excel." });
        }
        catch (e) {
            toast.error("Error al exportar", { description: e instanceof Error ? e.message : "Error" });
        }
        finally {
            setExporting(false);
        }
    };
    if (error) {
        return (<div className="p-6">
        <p className="text-red-500">Error: {error}</p>
      </div>);
    }
    return (<>
      <div className="w-full">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute -top-32 left-1/2 h-128 w-lg -translate-x-1/2 rounded-full bg-primary/12 blur-3xl"
            />
            <div className="absolute -bottom-40 -right-40 h-120 w-120 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#111_1px,transparent_1px)] bg-size-[18px_18px]" />
          </div>

          <div className="container mx-auto px-4 md:px-8 lg:px-20 py-6 md:py-10 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-4 md:p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-primary/10 ring-1 ring-primary/15 shadow-xs flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                      Bienestar
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {section === "activities"
            ? selectedActivity
                ? "Detalle de la actividad"
                : "Actividades registradas"
            : section === "beneficiaries"
                ? "Beneficiarios de bienestar"
                : "Recursos humanos"}
                    </p>
                  </div>
                </div>

                {section === "activities" && selectedActivity ? (
                  <Button variant="outline" onClick={() => setSelectedActivity(null)}>
                    ← Volver
                  </Button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    {section === "activities" ? (
                      <div className="relative w-full sm:w-[320px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Buscar actividad…"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-background rounded-full"
                        />
                      </div>
                    ) : null}

                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                      onClick={handleExport}
                      disabled={exporting}
                    >
                      {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                      Exportar Excel
                    </Button>

                    {section === "activities" ? (
                      <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={() => setOpenForm(true)}>
                        <Plus className="h-4 w-4" />
                        Crear actividad
                      </Button>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Tabs
                  value={section}
                  onValueChange={(v) => {
                    setSection(v as any);
                    setSelectedActivity(null);
                  }}
                >
                  <TabsList className="w-full sm:w-fit">
                    <TabsTrigger value="activities">Actividades</TabsTrigger>
                    <TabsTrigger value="beneficiaries">Beneficiarios</TabsTrigger>
                    <TabsTrigger value="human_resources">Recursos humanos</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <Tabs value={section} onValueChange={(v) => setSection(v as any)} className="space-y-6">
              <TabsContent value="activities">
                {!selectedActivity ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {loading ? (
                      <Card className="border-border bg-card shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-sm text-muted-foreground">Cargando…</CardTitle>
                        </CardHeader>
                      </Card>
                    ) : (
                      filteredActivities.map((activity) => (
                        <Card
                          key={activity.id}
                          className="cursor-pointer border-border bg-card shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
                          onClick={() => setSelectedActivity(activity)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <CardTitle className="text-lg truncate">Código {activity.activity_code}</CardTitle>
                                <CardDescription className="mt-1 line-clamp-2">
                                  {activity.activity_description}
                                </CardDescription>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            </div>
                          </CardHeader>
                          <CardFooter className="pt-0">
                            <div className="text-xs text-muted-foreground">
                              Año {activity.year} · Semestre {activity.semester}
                            </div>
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </div>
                ) : (
                  <ActivityDetail activity={selectedActivity} onBack={() => setSelectedActivity(null)} />
                )}
              </TabsContent>
              <TabsContent value="beneficiaries">
                <RegisteredWellbeingBeneficiariesPanel />
              </TabsContent>
              <TabsContent value="human_resources">
                <RegisteredWellbeingHumanResourcesPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <WellbeingActivityForm open={openForm} onClose={() => setOpenForm(false)} onSubmit={handleCreateWellbeingActivity}/>
    </>);
}
