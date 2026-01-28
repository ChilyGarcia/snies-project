"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CheckCircle2, XCircle, GraduationCap, ArrowRight, BookOpenText, Users2, UserRoundPlus, Pencil, Trash2, FileSpreadsheet, Loader2, } from "lucide-react";
import { CreateCourseContainer } from "../presentation/create-course.container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContinuingEducationForm } from "@/modules/courses/presentation/components/continuingeducation-form";
import type { CreateContinuingEducationInput } from "@/modules/courses/hooks/types/create-continuingeducation-input";
import type { Course } from "@/modules/courses/types/course";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CourseApi } from "@/modules/courses/api/course.api";
import { useCourses } from "@/modules/courses/hooks/use-cases/use-courses";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import { createContinuingEducation, listContinuingEducation } from "@/modules/courses/api/continuing-education.api";
import { ApiValidationError, formatValidationDetails } from "@/shared/api/api-errors";
import { ContinuingEducationTeacherForm } from "@/modules/courses/presentation/components/continuingeducation-teacher-form";
import { createContinuingEducationTeacher, listContinuingEducationTeachers } from "@/modules/courses/api/continuing-education-teachers.api";
import type { ContinuingEducationTeacher, CreateContinuingEducationTeacherInput } from "@/modules/courses/types/continuing-education-teacher";
import { ContinuingEducationBeneficiaryForm } from "@/modules/courses/presentation/components/continuingeducation-beneficiary-form";
import { createContinuingEducationBeneficiary, deleteContinuingEducationBeneficiary, listContinuingEducationBeneficiaries, updateContinuingEducationBeneficiary } from "@/modules/courses/api/continuing-education-beneficiaries.api";
import type { ContinuingEducationBeneficiary, CreateContinuingEducationBeneficiaryInput } from "@/modules/courses/types/continuing-education-beneficiary";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { exportCourseExcel } from "@/modules/courses/utils/export-course-excel";
import { exportCoursesExcel } from "@/modules/courses/utils/export-courses-excel";

const courseRepo = new CourseApi();
export function RegisteredCoursesPanel() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [typeFilter, setTypeFilter] = useState<"all" | "extension" | "regular">("all");
    const [open, setOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [openContinuingForm, setOpenContinuingForm] = useState(false);
    const [openContinuingDefaults, setOpenContinuingDefaults] = useState<{ year: string; semester: number } | null>(null);
    const { courses, loading, error, refetch } = useCourses(courseRepo);
    const [exportingCourses, setExportingCourses] = useState(false);
    const handleCreateContinuingEducation = async (data: CreateContinuingEducationInput) => {
        if (!selectedCourse) {
            toast.error("Selecciona un curso primero");
            return;
        }
        try {
            const payload: CreateContinuingEducationInput = {
                ...data,
                id_course: Number(selectedCourse.id),
            };
            const res = await createContinuingEducation(payload);
            toast.success("Educación continua creada", {
                description: res.message || `ID #${res.id}`,
            });
            window.dispatchEvent(new CustomEvent("continuing-education-updated", { detail: { courseId: Number(selectedCourse.id) } }));
        }
        catch (err) {
            if (err instanceof ApiValidationError) {
                toast.error(err.message || "Error de validación", {
                    description: (<div className="whitespace-pre-line">{formatValidationDetails(err.details)}</div>),
                });
                throw err;
            }
            toast.error("No se pudo crear educación continua", {
                description: err instanceof Error ? err.message : "Error inesperado",
            });
            throw err;
        }
    };
    const filtered = useMemo(() => courses
        .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((c) => {
        if (statusFilter === "active")
            return c.is_active;
        if (statusFilter === "inactive")
            return !c.is_active;
        return true;
    })
        .filter((c) => {
        if (typeFilter === "extension")
            return c.is_extension;
        if (typeFilter === "regular")
            return !c.is_extension;
        return true;
    }), [courses, searchTerm, statusFilter, typeFilter]);
    const totalCount = courses.length;
    const activeCount = useMemo(() => courses.filter((c) => c.is_active).length, [courses]);
    const extensionCount = useMemo(() => courses.filter((c) => c.is_extension).length, [courses]);

    const handleExportCourses = async () => {
        if (loading)
            return;
        if (error) {
            toast.error("No se pueden exportar cursos", { description: error });
            return;
        }
        if (!courses.length) {
            toast.message("No hay cursos para exportar");
            return;
        }
        try {
            setExportingCourses(true);
            await exportCoursesExcel({ courses });
            toast.success("Excel exportado");
        }
        catch (e) {
            toast.error("No se pudo exportar", { description: e instanceof Error ? e.message : "Error" });
        }
        finally {
            setExportingCourses(false);
        }
    };
    return (<>
      <div className="w-full">
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-32 left-1/2 h-128 w-lg -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 h-120 w-120 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#111_1px,transparent_1px)] bg-size-[18px_18px]" />
          </div>

          <div className="container mx-auto px-4 md:px-8 lg:px-20 py-6 md:py-10 space-y-8">
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-border bg-card p-4 md:p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-primary/10 ring-1 ring-primary/15 shadow-xs flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        Cursos
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {selectedCourse ? "Detalle del curso" : "Listado y creación de cursos."}
                      </p>
                    </div>
                  </div>

                  {selectedCourse ? (
                    <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                      ← Volver
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="rounded-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-700/20 shadow-sm"
                        onClick={handleExportCourses}
                        disabled={exportingCourses || loading}
                      >
                        {exportingCourses ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                        Exportar Excel
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={() => setOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Crear curso
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {!selectedCourse ? (
                <div className="grid gap-6 lg:grid-cols-3">
                  <Card className="border-border bg-card shadow-sm h-full">
                    <CardContent className="p-5 min-h-[92px] flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/12 ring-1 ring-primary/20 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{loading ? "—" : totalCount}</div>
                          <div className="text-xs text-muted-foreground">Cursos registrados</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
                          {loading ? "—" : activeCount} activos
                        </span>
                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs text-primary">
                          {loading ? "—" : extensionCount} ext.
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-card shadow-sm lg:col-span-2 h-full">
                    <CardContent className="p-5 min-h-[92px] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Buscar por nombre o código…"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-background"
                          disabled={loading}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground w-full md:w-auto justify-between md:justify-end">
                        <span className="inline-flex items-center rounded-full border border-border bg-muted/20 px-2.5 py-1">
                          {loading ? "Cargando…" : `${filtered.length} resultados`}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => setSearchTerm("")} disabled={!searchTerm}>
                          Limpiar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : null}

              {!selectedCourse ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Filtros
                    </span>
                    <div className="h-4 w-px bg-border hidden sm:block" />
                    <Button
                      size="sm"
                      variant={statusFilter === "all" ? "default" : "outline"}
                      className={`rounded-full ${statusFilter === "all" ? "bg-primary hover:bg-primary/90" : ""}`}
                      onClick={() => setStatusFilter("all")}
                    >
                      Todos
                    </Button>
                    <Button
                      size="sm"
                      variant={statusFilter === "active" ? "default" : "outline"}
                      className={`rounded-full ${statusFilter === "active" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                      onClick={() => setStatusFilter("active")}
                    >
                      Activos
                    </Button>
                    <Button
                      size="sm"
                      variant={statusFilter === "inactive" ? "default" : "outline"}
                      className={`rounded-full ${statusFilter === "inactive" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                      onClick={() => setStatusFilter("inactive")}
                    >
                      Inactivos
                    </Button>
                    <div className="h-4 w-px bg-border hidden sm:block" />
                    <Button
                      size="sm"
                      variant={typeFilter === "all" ? "secondary" : "outline"}
                      className="rounded-full"
                      onClick={() => setTypeFilter("all")}
                    >
                      Tipo: todos
                    </Button>
                    <Button
                      size="sm"
                      variant={typeFilter === "extension" ? "default" : "outline"}
                      className={`rounded-full ${typeFilter === "extension" ? "bg-primary hover:bg-primary/90" : ""}`}
                      onClick={() => setTypeFilter("extension")}
                    >
                      Extensión
                    </Button>
                    <Button
                      size="sm"
                      variant={typeFilter === "regular" ? "secondary" : "outline"}
                      className="rounded-full"
                      onClick={() => setTypeFilter("regular")}
                    >
                      Regular
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setTypeFilter("all");
                    }}
                    disabled={!searchTerm && statusFilter === "all" && typeFilter === "all"}
                  >
                    Limpiar filtros
                  </Button>
                </div>
              ) : null}

              {!selectedCourse ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {loading ? (
                    <div className="lg:col-span-3">
                      <Card className="border-border bg-card shadow-sm">
                        <CardContent className="p-6 text-sm text-muted-foreground">
                          Cargando cursos…
                        </CardContent>
                      </Card>
                    </div>
                  ) : error ? (
                    <div className="lg:col-span-3">
                      <EmptyState title="No se pudieron cargar los cursos" description={error} />
                      <div className="mt-4 flex justify-center">
                        <Button
                          variant="outline"
                          onClick={() => {
                            toast.message("Reintentando…");
                            refetch();
                          }}
                        >
                          Reintentar
                        </Button>
                      </div>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="lg:col-span-3">
                      <EmptyState title="Sin resultados" description="Prueba ajustar los filtros o el término de búsqueda." />
                    </div>
                  ) : filtered.map((course) => (
                    <Card
                      key={course.id}
                      className={`cursor-pointer border-border bg-card shadow-sm hover:shadow-md transition hover:-translate-y-0.5 will-change-transform ${
                        course.is_extension ? "ring-1 ring-primary/15" : "ring-1 ring-border/60"
                      }`}
                      onClick={() => setSelectedCourse(course)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <CardTitle className="text-lg md:text-xl truncate">{course.name}</CardTitle>
                            <CardDescription className="mt-1 flex items-center gap-2">
                              <span className="inline-flex items-center rounded-full border border-border bg-muted/20 px-2 py-0.5 text-xs">
                                Código {course.code}
                              </span>
                              <span className="text-xs text-muted-foreground">ID CINE {course.id_cine_field_detailed}</span>
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0"/>
                          </div>
                        </div>
                      </CardHeader>

                      <CardFooter className="pt-0">
                        <div className="flex items-center justify-between gap-2 w-full">
                          <Badge
                            className={`rounded-full px-3 py-1 text-xs border ${
                              course.is_extension
                                ? "border-primary/20 bg-primary/12 text-primary"
                                : "border-border bg-muted/25 text-foreground"
                            }`}
                          >
                            {course.is_extension ? "Extensión" : "Regular"}
                          </Badge>

                          <div
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                              course.is_active
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200"
                                : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200"
                            }`}
                          >
                            {course.is_active ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            {course.is_active ? "Activo" : "Inactivo"}
                          </div>
                        </div>
                      </CardFooter>
                </Card>
                  ))}
                </div>
              ) : (
                <CourseDetail
                  course={selectedCourse}
                  onBack={() => setSelectedCourse(null)}
                  onOpenContinuing={(defaults) => {
                    setOpenContinuingDefaults(defaults);
                    setOpenContinuingForm(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateCourseContainer
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => {
          refetch();
        }}
      />

      <ContinuingEducationForm
        open={openContinuingForm}
        onClose={() => setOpenContinuingForm(false)}
        onSubmit={handleCreateContinuingEducation}
        courseId={selectedCourse ? Number(selectedCourse.id) : 0}
        courseName={selectedCourse?.name}
        defaultYear={openContinuingDefaults?.year}
        defaultSemester={openContinuingDefaults?.semester}
      />
    </>);
}
function CourseDetail({ course, onBack, onOpenContinuing, }: {
    course: Course;
    onBack: () => void;
    onOpenContinuing: (defaults: { year: string; semester: number }) => void;
}) {
    const [tab, setTab] = useState("Continuingeducation");
    const reduceMotion = useReducedMotion();
    const currentYear = String(new Date().getFullYear());
    const yearOptions = Array.from({ length: 7 }, (_, i) => String(Number(currentYear) - i));
    const [exporting, setExporting] = useState(false);
    const [teacherYear, setTeacherYear] = useState<string>("all");
    const [teacherSemester, setTeacherSemester] = useState<number | "all">("all");
    const [teachers, setTeachers] = useState<ContinuingEducationTeacher[]>([]);
    const [teachersLoading, setTeachersLoading] = useState(false);
    const [teachersError, setTeachersError] = useState<string | null>(null);
    const [openTeacherModal, setOpenTeacherModal] = useState(false);
    const teachersReqId = useRef(0);

    const [benefYear, setBenefYear] = useState<string>("all");
    const [benefSemester, setBenefSemester] = useState<number | "all">("all");
    const [beneficiaries, setBeneficiaries] = useState<ContinuingEducationBeneficiary[]>([]);
    const [benefLoading, setBenefLoading] = useState(false);
    const [benefError, setBenefError] = useState<string | null>(null);
    const [openBenefModal, setOpenBenefModal] = useState(false);
    const [benefModalMode, setBenefModalMode] = useState<"create" | "edit">("create");
    const [selectedBenef, setSelectedBenef] = useState<ContinuingEducationBeneficiary | null>(null);
    const [confirmDeleteBenef, setConfirmDeleteBenef] = useState<ContinuingEducationBeneficiary | null>(null);
    const benefReqId = useRef(0);

    const [ceYear, setCeYear] = useState<string>("all");
    const [ceSemester, setCeSemester] = useState<number | "all">("all");
    const [ceItems, setCeItems] = useState<Array<{
        id: number;
        year: string;
        semester: number;
        num_hours: number;
        id_course: number;
        value: number;
    }>>([]);
    const [ceLoading, setCeLoading] = useState(false);
    const [ceError, setCeError] = useState<string | null>(null);
    const ceReqId = useRef(0);

    const fetchTeachers = async () => {
        const req = ++teachersReqId.current;
        setTeachersLoading(true);
        setTeachersError(null);
        try {
            const list = await listContinuingEducationTeachers({
                year: teacherYear === "all" ? undefined : teacherYear,
                semester: teacherSemester === "all" ? undefined : teacherSemester,
            });
            if (req !== teachersReqId.current)
                return;
            setTeachers(list.filter((t) => t.course_code === course.code));
        }
        catch (e) {
            if (req !== teachersReqId.current)
                return;
            setTeachers([]);
            setTeachersError(e instanceof Error ? e.message : "Error");
        }
        finally {
            if (req !== teachersReqId.current)
                return;
            setTeachersLoading(false);
        }
    };

    const fetchBeneficiaries = async () => {
        const req = ++benefReqId.current;
        setBenefLoading(true);
        setBenefError(null);
        try {
            const list = await listContinuingEducationBeneficiaries({
                year: benefYear === "all" ? undefined : benefYear,
                semester: benefSemester === "all" ? undefined : benefSemester,
            });
            if (req !== benefReqId.current)
                return;
            setBeneficiaries(list.filter((b) => b.course_code === course.code));
        }
        catch (e) {
            if (req !== benefReqId.current)
                return;
            setBeneficiaries([]);
            setBenefError(e instanceof Error ? e.message : "Error");
        }
        finally {
            if (req !== benefReqId.current)
                return;
            setBenefLoading(false);
        }
    };

    const fetchContinuingEducation = async () => {
        const req = ++ceReqId.current;
        setCeLoading(true);
        setCeError(null);
        try {
            const list = await listContinuingEducation({
                year: ceYear === "all" ? undefined : ceYear,
                semester: ceSemester === "all" ? undefined : ceSemester,
            });
            const courseIdNum = Number(course.id);
            if (req !== ceReqId.current)
                return;
            setCeItems(list.filter((r) => r.id_course === courseIdNum));
        }
        catch (e) {
            if (req !== ceReqId.current)
                return;
            setCeItems([]);
            setCeError(e instanceof Error ? e.message : "Error");
        }
        finally {
            if (req !== ceReqId.current)
                return;
            setCeLoading(false);
        }
    };

    const handleExportExcel = async () => {
        try {
            setExporting(true);
            const [ceAll, teachersAll, benefAll] = await Promise.all([
                listContinuingEducation(),
                listContinuingEducationTeachers({}),
                listContinuingEducationBeneficiaries({}),
            ]);
            const courseIdNum = Number(course.id);
            const ceForCourse = ceAll.filter((r) => r.id_course === courseIdNum);
            const teachersForCourse = teachersAll.filter((t) => t.course_code === course.code);
            const benefForCourse = benefAll.filter((b) => b.course_code === course.code);
            await exportCourseExcel({
                course,
                continuingEducation: ceForCourse,
                teachers: teachersForCourse,
                beneficiaries: benefForCourse,
            });
            toast.success("Excel exportado");
        }
        catch (e) {
            toast.error("No se pudo exportar", { description: e instanceof Error ? e.message : "Error" });
        }
        finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        teachersReqId.current = 0;
        benefReqId.current = 0;
        ceReqId.current = 0;
        setTeachers([]);
        setBeneficiaries([]);
        setCeItems([]);
    }, [course.code]);

    useEffect(() => {
        if (tab !== "Teachers")
            return;
        const t = setTimeout(() => {
            void fetchTeachers();
        }, 250);
        return () => clearTimeout(t);
    }, [tab, teacherYear, teacherSemester, course.code]);

    useEffect(() => {
        if (tab !== "Beneficiaries")
            return;
        const t = setTimeout(() => {
            void fetchBeneficiaries();
        }, 250);
        return () => clearTimeout(t);
    }, [tab, benefYear, benefSemester, course.code]);

    useEffect(() => {
        if (tab !== "Continuingeducation")
            return;
        const t = setTimeout(() => {
            void fetchContinuingEducation();
        }, 250);
        return () => clearTimeout(t);
    }, [tab, ceYear, ceSemester, course.id]);

    useEffect(() => {
        const onCEUpdated = (ev: Event) => {
            const ce = ev as CustomEvent<{ courseId?: number }>;
            if (typeof ce.detail?.courseId === "number" && ce.detail.courseId !== Number(course.id))
                return;
            void fetchContinuingEducation();
        };
        window.addEventListener("continuing-education-updated", onCEUpdated as EventListener);
        return () => window.removeEventListener("continuing-education-updated", onCEUpdated as EventListener);
    }, [course.id]);

    const handleCreateTeacher = async (data: CreateContinuingEducationTeacherInput) => {
        try {
            const res = await createContinuingEducationTeacher(data);
            toast.success("Docente creado", { description: res.message || `ID #${res.id}` });
            await fetchTeachers();
        }
        catch (err) {
            if (err instanceof ApiValidationError) {
                toast.error(err.message || "Error de validación", {
                    description: (<div className="whitespace-pre-line">{formatValidationDetails(err.details)}</div>),
                });
                throw err;
            }
            toast.error("No se pudo crear el docente", {
                description: err instanceof Error ? err.message : "Error inesperado",
            });
            throw err;
        }
    };

    const handleCreateBeneficiary = async (data: CreateContinuingEducationBeneficiaryInput) => {
        try {
            const res = await createContinuingEducationBeneficiary(data);
            toast.success("Beneficiario creado", { description: res.message || `ID #${res.id}` });
            await fetchBeneficiaries();
        }
        catch (err) {
            if (err instanceof ApiValidationError) {
                toast.error(err.message || "Error de validación", {
                    description: (<div className="whitespace-pre-line">{formatValidationDetails(err.details)}</div>),
                });
                throw err;
            }
            toast.error("No se pudo crear el beneficiario", {
                description: err instanceof Error ? err.message : "Error inesperado",
            });
            throw err;
        }
    };

    const handleUpdateBeneficiary = async (data: CreateContinuingEducationBeneficiaryInput) => {
        if (!selectedBenef)
            return;
        try {
            await updateContinuingEducationBeneficiary(selectedBenef.id, data);
            toast.success("Beneficiario actualizado");
            await fetchBeneficiaries();
        }
        catch (err) {
            if (err instanceof ApiValidationError) {
                toast.error(err.message || "Error de validación", {
                    description: (<div className="whitespace-pre-line">{formatValidationDetails(err.details)}</div>),
                });
                throw err;
            }
            toast.error("No se pudo actualizar el beneficiario", {
                description: err instanceof Error ? err.message : "Error inesperado",
            });
            throw err;
        }
    };

    const handleDeleteBeneficiary = async (id: number) => {
        try {
            await deleteContinuingEducationBeneficiary(id);
            toast.success("Beneficiario eliminado");
            await fetchBeneficiaries();
        }
        catch (err) {
            toast.error("No se pudo eliminar el beneficiario", {
                description: err instanceof Error ? err.message : "Error inesperado",
            });
        }
    };
    return (<div className="w-full max-w-none space-y-5 md:space-y-6">
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Detalle del curso
              </div>
              <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight truncate">
                {course.name}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-border bg-muted/20 px-3 py-1 text-xs text-muted-foreground">
                  Código <span className="ml-1 font-medium text-foreground">{course.code}</span>
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-muted/20 px-3 py-1 text-xs text-muted-foreground">
                  ID CINE <span className="ml-1 font-medium text-foreground">{course.id_cine_field_detailed}</span>
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-muted/20 px-3 py-1 text-xs text-muted-foreground">
                  ID <span className="ml-1 font-medium text-foreground">{course.id}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap lg:justify-end">
              <Badge className={`rounded-full px-3 py-1 text-xs border ${course.is_extension
            ? "border-primary/20 bg-primary/12 text-primary"
            : "border-border bg-muted/25 text-foreground"}`}>
                {course.is_extension ? "Extensión" : "Regular"}
              </Badge>

              <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${course.is_active
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200"
            : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200"}`}>
                {course.is_active ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {course.is_active ? "Activo" : "Inactivo"}
              </div>

              <Button variant="outline" size="sm" onClick={onBack} className="rounded-full">
                ← Volver a cursos
              </Button>

              <Button
                size="sm"
                className="rounded-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-700/20 shadow-sm"
                onClick={handleExportExcel}
                disabled={exporting}
              >
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                Exportar Excel
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <Info label="Código" value={course.code} />
            <Info label="ID CINE" value={course.id_cine_field_detailed} />
            <Info label="Identificador" value={course.id} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-3 md:p-4">
          <Tabs value={tab} onValueChange={setTab} className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="overflow-x-auto">
                <TabsList className="w-full md:w-fit rounded-2xl bg-muted/20 p-1 border border-border">
                  <TabsTrigger
                    value="Continuingeducation"
                    className="rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Educación continua
                  </TabsTrigger>
                  <TabsTrigger
                    value="Teachers"
                    className="rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Docentes
                  </TabsTrigger>
                  <TabsTrigger
                    value="Beneficiaries"
                    className="rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Beneficiarios
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="text-xs text-muted-foreground inline-flex items-center rounded-full border border-border bg-muted/20 px-3 py-1 w-fit">
                Sección activa:{" "}
                <span className="ml-1 text-foreground font-medium">
                  {tab === "Continuingeducation" ? "Educación continua" : tab === "Teachers" ? "Docentes" : "Beneficiarios"}
                </span>
              </div>
            </div>

            <TabsContent value="Continuingeducation" className="space-y-4">
              <Card className="border-border bg-background/50">
                <CardContent className="p-4 md:p-5 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">Educación Continua</div>
                      <div className="text-xs md:text-sm text-muted-foreground mt-1">
                        Listado por año/semestre y creación de registros asociados a este curso.
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="gap-2 w-full sm:w-auto"
                      onClick={() => onOpenContinuing({
                        year: ceYear === "all" ? currentYear : ceYear,
                        semester: ceSemester === "all" ? 1 : ceSemester,
                      })}
                    >
                      <Plus className="h-4 w-4" />
                      Crear registro
                    </Button>
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/15 p-3 md:p-4">
                    <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
                      <div className="space-y-2 w-full md:max-w-[260px]">
                        <Label>Año</Label>
                        <Select value={ceYear} onValueChange={(v) => setCeYear(v)}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                            {yearOptions.map((y) => (
                              <SelectItem key={y} value={y}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 w-full md:max-w-[260px]">
                        <Label>Semestre</Label>
                      <Select
                        value={String(ceSemester)}
                        onValueChange={(v) => setCeSemester(v === "all" ? "all" : Number(v))}
                      >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="1">Semestre 1</SelectItem>
                            <SelectItem value="2">Semestre 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:ml-auto text-xs text-muted-foreground inline-flex items-center rounded-full border border-border bg-background px-3 py-1 w-fit">
                        Se actualiza automáticamente
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={() => {
                        setCeYear("all");
                        setCeSemester("all");
                      }}
                    >
                      Borrar filtros
                    </Button>
                  </div>

                  {ceError ? (
                    <EmptyState title="No se pudo cargar educación continua" description={ceError} />
                  ) : ceLoading ? (
                    <div className="text-sm text-muted-foreground">Cargando…</div>
                  ) : ceItems.length === 0 ? (
                    <EmptyState title="Sin registros" description="No hay registros para el filtro seleccionado." />
                  ) : (
                    <div className="rounded-xl border border-border overflow-hidden bg-card">
                      <Table>
                        <TableHeader className="bg-muted/25">
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Año</TableHead>
                            <TableHead>Semestre</TableHead>
                            <TableHead>Horas</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ceItems.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell>{r.id}</TableCell>
                              <TableCell>{r.year}</TableCell>
                              <TableCell>{r.semester}</TableCell>
                              <TableCell>{r.num_hours}</TableCell>
                              <TableCell>{r.id_course}</TableCell>
                              <TableCell className="text-right">{r.value.toLocaleString("es-CO")}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="Teachers" className="space-y-4">
              <Card className="border-border bg-background/50">
                <CardContent className="p-4 md:p-5 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">Docentes</div>
                      <div className="text-xs md:text-sm text-muted-foreground mt-1">
                        Listado por año/semestre y creación de docentes para educación continua.
                      </div>
                    </div>
                    <Button size="sm" className="gap-2 w-full sm:w-auto" onClick={() => setOpenTeacherModal(true)}>
                      <Plus className="h-4 w-4" />
                      Crear docente
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Año</Label>
                      <Select value={teacherYear} onValueChange={(v) => setTeacherYear(v)}>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {yearOptions.map((y) => (
                            <SelectItem key={y} value={y}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Semestre</Label>
                      <Select
                        value={String(teacherSemester)}
                        onValueChange={(v) => setTeacherSemester(v === "all" ? "all" : Number(v))}
                      >
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="1">Semestre 1</SelectItem>
                          <SelectItem value="2">Semestre 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                    <span>Se actualiza automáticamente al cambiar los filtros.</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-full sm:w-auto"
                      onClick={() => {
                        setTeacherYear("all");
                        setTeacherSemester("all");
                      }}
                    >
                      Borrar filtros
                    </Button>
                  </div>

                  {teachersError ? (
                    <EmptyState title="No se pudieron cargar docentes" description={teachersError} />
                  ) : teachersLoading ? (
                    <div className="text-sm text-muted-foreground">Cargando…</div>
                  ) : teachers.length === 0 ? (
                    <EmptyState title="Sin docentes" description="No hay registros para el filtro seleccionado." />
                  ) : (
                    <div className="rounded-xl border border-border overflow-hidden bg-card">
                      <Table>
                        <TableHeader className="bg-muted/25">
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Año</TableHead>
                            <TableHead>Semestre</TableHead>
                            <TableHead>Código curso</TableHead>
                            <TableHead>Tipo doc</TableHead>
                            <TableHead>Número</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {teachers.map((t) => (
                            <TableRow key={t.id}>
                              <TableCell>{t.id}</TableCell>
                              <TableCell>{t.year}</TableCell>
                              <TableCell>{t.semester}</TableCell>
                              <TableCell className="font-medium">{t.course_code}</TableCell>
                              <TableCell>{t.document_type_id}</TableCell>
                              <TableCell>{t.document_number}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="Beneficiaries" className="space-y-4">
              <Card className="border-border bg-background/50">
                <CardContent className="p-4 md:p-5 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">Beneficiarios</div>
                      <div className="text-xs md:text-sm text-muted-foreground mt-1">
                        Listado por año/semestre y gestión de beneficiarios (educación continua).
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="gap-2 w-full sm:w-auto"
                      onClick={() => {
                        setBenefModalMode("create");
                        setSelectedBenef(null);
                        setOpenBenefModal(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                      Crear beneficiario
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Año</Label>
                      <Select value={benefYear} onValueChange={(v) => setBenefYear(v)}>
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {yearOptions.map((y) => (
                            <SelectItem key={y} value={y}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Semestre</Label>
                      <Select
                        value={String(benefSemester)}
                        onValueChange={(v) => setBenefSemester(v === "all" ? "all" : Number(v))}
                      >
                        <SelectTrigger className="bg-muted/50">
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="1">Semestre 1</SelectItem>
                          <SelectItem value="2">Semestre 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                    <span>Se actualiza automáticamente al cambiar los filtros.</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-full sm:w-auto"
                      onClick={() => {
                        setBenefYear("all");
                        setBenefSemester("all");
                      }}
                    >
                      Borrar filtros
                    </Button>
                  </div>

                  {benefError ? (
                    <EmptyState title="No se pudieron cargar beneficiarios" description={benefError} />
                  ) : benefLoading ? (
                    <div className="text-sm text-muted-foreground">Cargando…</div>
                  ) : beneficiaries.length === 0 ? (
                    <EmptyState title="Sin beneficiarios" description="No hay registros para el filtro seleccionado." />
                  ) : (
                    <div className="rounded-xl border border-border overflow-hidden bg-card">
                      <Table>
                        <TableHeader className="bg-muted/25">
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Año</TableHead>
                            <TableHead>Semestre</TableHead>
                            <TableHead>Código curso</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {beneficiaries.map((b) => (
                            <TableRow key={b.id}>
                              <TableCell>{b.id}</TableCell>
                              <TableCell>{b.year}</TableCell>
                              <TableCell>{b.semester}</TableCell>
                              <TableCell className="font-medium">{b.course_code}</TableCell>
                              <TableCell>{b.beneficiary_type_extension_id}</TableCell>
                              <TableCell>{b.beneficiaries_count}</TableCell>
                              <TableCell className="text-right">
                                <div className="inline-flex items-center gap-2 justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => {
                                      setBenefModalMode("edit");
                                      setSelectedBenef(b);
                                      setOpenBenefModal(true);
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => setConfirmDeleteBenef(b)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  <AlertDialog
                    open={!!confirmDeleteBenef}
                    onOpenChange={(open) => {
                      if (!open) setConfirmDeleteBenef(null);
                    }}
                  >
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar beneficiario</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. ¿Deseas eliminar el registro{" "}
                          {confirmDeleteBenef ? `#${confirmDeleteBenef.id}` : ""}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmDeleteBenef(null)}>
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            if (!confirmDeleteBenef) return;
                            const id = confirmDeleteBenef.id;
                            setConfirmDeleteBenef(null);
                            await handleDeleteBeneficiary(id);
                          }}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ContinuingEducationTeacherForm
        open={openTeacherModal}
        onClose={() => setOpenTeacherModal(false)}
        onSubmit={handleCreateTeacher}
        courseCode={course.code}
        defaultYear={teacherYear}
        defaultSemester={teacherSemester === "all" ? 1 : teacherSemester}
      />

      <ContinuingEducationBeneficiaryForm
        open={openBenefModal}
        onClose={() => setOpenBenefModal(false)}
        mode={benefModalMode}
        courseCode={course.code}
        defaultYear={benefYear}
        defaultSemester={benefSemester === "all" ? 1 : benefSemester}
        initial={selectedBenef ?? undefined}
        onSubmit={async (payload) => {
          if (benefModalMode === "edit") return await handleUpdateBeneficiary(payload);
          return await handleCreateBeneficiary(payload);
        }}
      />
    </div>);
}
function Info({ label, value }: {
    label: string;
    value: string;
}) {
    return (<div className="bg-card border border-border rounded-xl p-3 md:p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm md:text-base font-medium break-all">{value}</p>
    </div>);
}
