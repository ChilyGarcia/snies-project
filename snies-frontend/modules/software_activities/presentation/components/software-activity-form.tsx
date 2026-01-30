"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, Sparkles } from "lucide-react";

import type { BeneficiaryBreakdown, CreateSoftwareActivityInput } from "@/modules/software_activities/types/software-activity";

type BreakdownKey = `${string}|${string}|${string}|${string}`;

function makeKey(b: Pick<BeneficiaryBreakdown, "population" | "campus" | "program" | "level">): BreakdownKey {
  return `${b.population}|${b.campus}|${b.program}|${b.level}`;
}

function parseKey(k: BreakdownKey): BeneficiaryBreakdown {
  const [population, campus, program, level] = k.split("|");
  return { population, campus, program, level, count: 0 };
}

function sumByPopulation(bds: BeneficiaryBreakdown[], population: string) {
  return bds.reduce((acc, b) => acc + (b.population === population ? (b.count || 0) : 0), 0);
}

type CineOption = { code: string; name: string };

const CINE_OPTIONS: CineOption[] = [
  { code: "11", name: "Programas y certificaciones básicas" },
  { code: "21", name: "Alfabetización y aritmética elemental" },
  { code: "31", name: "Competencias personales y desarrollo" },
  { code: "111", name: "Ciencias de la educación" },
  { code: "112", name: "Formación para docentes de educación pre-primaría" },
  { code: "113", name: "Formación para docentes sin asignatura de especialización" },
  { code: "114", name: "Formación para docentes con asignatura de especialización" },
  { code: "211", name: "Técnicas audiovisuales y producción para medios de comunicación" },
  { code: "212", name: "Diseño industrial, de modas e interiores" },
  { code: "213", name: "Bellas artes" },
  { code: "214", name: "Artesanías" },
  { code: "215", name: "Música y artes escénicas" },
  { code: "221", name: "Religión y Teología" },
  { code: "222", name: "Historia y arqueología" },
  { code: "223", name: "Filosofía y ética" },
  { code: "231", name: "Adquisición del lenguaje" },
  { code: "232", name: "Literatura y lingüística" },
  { code: "311", name: "Economía" },
  { code: "312", name: "Ciencias políticas y educación cívica" },
  { code: "313", name: "Psicología" },
  { code: "314", name: "Sociología y estudios culturales" },
  { code: "321", name: "Periodismo y reportajes" },
  { code: "322", name: "Bibliotecología, información y archivología" },
  { code: "411", name: "Contabilidad e impuestos" },
  { code: "412", name: "Gestión financiera, administración bancaria y seguros" },
  { code: "413", name: "Gestión y administración" },
  { code: "414", name: "Mercadotecnia y publicidad" },
  { code: "415", name: "Secretariado y trabajo de oficina" },
  { code: "416", name: "Ventas al por mayor y al por menor" },
  { code: "417", name: "Competencias laborales" },
  { code: "421", name: "Derecho" },
  { code: "511", name: "Biología" },
  { code: "512", name: "Bioquímica" },
  { code: "521", name: "Ciencias del medio ambiente" },
  { code: "522", name: "Medio ambiente natural y vida silvestre" },
  { code: "531", name: "Química" },
  { code: "532", name: "Ciencias de la tierra" },
  { code: "533", name: "Física" },
  { code: "541", name: "Matemáticas" },
  { code: "542", name: "Estadística" },
  { code: "611", name: "Uso de computadores" },
  { code: "612", name: "Diseño y administración de redes y bases de datos" },
  { code: "613", name: "Desarrollo y análisis de software y aplicaciones" },
  { code: "711", name: "Ingeniería y procesos químicos" },
  { code: "712", name: "Tecnología de protección del medio ambiente" },
  { code: "713", name: "Electricidad y energía" },
  { code: "714", name: "Electrónica y automatización" },
  { code: "715", name: "Mecánica y profesiones afines a la metalistería" },
  { code: "716", name: "Vehículos, barcos y aeronaves motorizadas" },
  { code: "721", name: "Procesamiento de alimentos" },
  { code: "722", name: "Materiales (vidrio, papel, plástico y madera)" },
  { code: "723", name: "Producción textiles (ropa, calzado y artículos de cuero)" },
  { code: "724", name: "Minería y extracción" },
  { code: "731", name: "Arquitectura y urbanismo" },
  { code: "732", name: "Construcción e ingeniería civil" },
  { code: "811", name: "Producción agrícola y ganadera" },
  { code: "812", name: "Horticultura" },
  { code: "821", name: "Silvicultura" },
  { code: "831", name: "Pesca" },
  { code: "841", name: "Veterinaria" },
  { code: "911", name: "Odontología" },
  { code: "912", name: "Medicina" },
  { code: "913", name: "Enfermería y partería" },
  { code: "914", name: "Tecnología de diagnóstico y tratamiento médico" },
  { code: "915", name: "Terapia y rehabilitación" },
  { code: "916", name: "Farmacia" },
  { code: "917", name: "Medicina y terapia tradicional y complementaria" },
  { code: "921", name: "Asistencia a adultos mayores y discapacitados" },
  { code: "922", name: "Asistencia a la infancia y servicios para jóvenes" },
  { code: "923", name: "Trabajo social y orientación" },
  { code: "1011", name: "Servicios domésticos" },
  { code: "1012", name: "Peluquería y tratamientos de belleza" },
  { code: "1013", name: "Hotelería, restaurantes y servicios de banquetes" },
  { code: "1014", name: "Deportes" },
  { code: "1015", name: "Viajes, turismo y actividades recreativas" },
  { code: "1021", name: "Saneamiento de la comunidad" },
  { code: "1022", name: "Salud y protección laboral" },
  { code: "1031", name: "Educación militar y de defensa" },
  { code: "1032", name: "Protección de las personas y de la propiedad" },
  { code: "1041", name: "Servicios de transporte" },
];

const ACTIVITY_TYPE_OPTIONS = [
  { value: "1 Cursos, cursos especializados (certificaciones)", label: "1 Cursos, cursos especializados (certificaciones)" },
  { value: "2 Talleres", label: "2 Talleres" },
  { value: "3 Diplomados", label: "3 Diplomados" },
  { value: "4 Seminarios, Congresos o simposios", label: "4 Seminarios, Congresos o simposios" },
  { value: "5 Otro", label: "5 Otro" },
  { value: "6 Consultoria", label: "6 Consultoria" },
  { value: "7 Eventos", label: "7 Eventos" },
] as const;

const TEACHER_DOCUMENT_TYPE_OPTIONS = [
  { value: "CC  Cédula de ciudadanía", label: "CC  Cédula de ciudadanía" },
  { value: "DE  Documento de Identidad Extranjera", label: "DE  Documento de Identidad Extranjera" },
  { value: "CE  Cédula de Extranjería", label: "CE  Cédula de Extranjería" },
  { value: "TI  Tarjeta de Identidad", label: "TI  Tarjeta de Identidad" },
  { value: "PS  Pasaporte", label: "PS  Pasaporte" },
  { value: "CA  Certificado cabildo", label: "CA  Certificado cabildo" },
] as const;

const CONSULTANCY_SECTOR_OPTIONS = [
  { value: "1 Sector Empresarial", label: "1 Sector Empresarial" },
  { value: "2 Sector Administración Pública", label: "2 Sector Administración Pública" },
  { value: "3 Centros de Investigación y Desarrollo Tecnológico", label: "3 Centros de Investigación y Desarrollo Tecnológico" },
  { value: "4 Hospitales y Clínicas", label: "4 Hospitales y Clínicas" },
  { value: "5 Instituciones privadas sin ánimo de lucro", label: "5 Instituciones privadas sin ánimo de lucro" },
  { value: "6 Instituciones de Educación", label: "6 Instituciones de Educación" },
  { value: "7 Comunidad", label: "7 Comunidad" },
  { value: "8 Otro", label: "8 Otro" },
] as const;

const schema = z.object({
  career: z.enum(
    [
      "Ing. Software",
      "Diseño Gráfico",
      "Negocios Internacionales",
      "Diseño de Modas",
      "Administración Turística",
      "Administración Financiera",
    ],
    { message: "Carrera inválida" }
  ),
  year: z.coerce.number().int().min(2000).max(2100),
  semester: z.coerce
    .number()
    .int()
    .refine((v) => v === 1 || v === 2, { message: "Semestre debe ser 1 o 2" }),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
  execution_place: z.string().min(2, "Requerido"),
  campus: z.enum(["CÚCUTA", "OCAÑA"], { message: "Sede inválida" }),
  activity_name: z.string().min(3, "Requerido"),
  agreement_entity: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  cine_isced_name: z.string().optional().nullable(),
  cine_field_detailed_id: z.string().optional().nullable(),
  num_hours: z.coerce.number().int().min(0).optional().nullable(),
  activity_type: z.string().optional().nullable(),
  course_value: z.coerce.number().min(0).optional().nullable(),
  teacher_document_type: z.string().optional().nullable(),
  teacher_document_number: z.string().optional().nullable(),
  total_beneficiaries: z.coerce.number().int().min(0).optional().nullable(),
  professors_count: z.coerce.number().int().min(0).optional().nullable(),
  administrative_count: z.coerce.number().int().min(0).optional().nullable(),
  external_people_count: z.coerce.number().int().min(0).optional().nullable(),
  speaker_full_name: z.string().optional().nullable(),
  speaker_origin: z.string().optional().nullable(),
  speaker_company: z.string().optional().nullable(),
  consultancy_entity_name: z.string().optional().nullable(),
  consultancy_sector_id: z.string().optional().nullable(),
  consultancy_value: z.coerce.number().min(0).optional().nullable(),
  evidence_event_planning: z.boolean().optional(),
  evidence_attendance_control: z.boolean().optional(),
  evidence_program_design_guide: z.boolean().optional(),
  evidence_audiovisual_record: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function SoftwareActivityForm(props: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateSoftwareActivityInput) => Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [breakdownMap, setBreakdownMap] = useState<Record<string, number | null>>({});
  const [cineOpen, setCineOpen] = useState(false);
  const [courseValueText, setCourseValueText] = useState("");
  const [consultancyValueText, setConsultancyValueText] = useState("");
  const yearNow = new Date().getFullYear();

  const defaults = useMemo<FormValues>(
    () => ({
      career: "Ing. Software",
      year: yearNow,
      semester: 1,
      start_date: null,
      end_date: null,
      execution_place: "",
      campus: "CÚCUTA",
      activity_name: "",
      agreement_entity: null,
      description: null,
      cine_isced_name: null,
      cine_field_detailed_id: null,
      num_hours: null,
      activity_type: null,
      course_value: null,
      teacher_document_type: null,
      teacher_document_number: null,
      total_beneficiaries: null,
      professors_count: null,
      administrative_count: null,
      external_people_count: null,
      speaker_full_name: null,
      speaker_origin: null,
      speaker_company: null,
      consultancy_entity_name: null,
      consultancy_sector_id: null,
      consultancy_value: null,
      evidence_event_planning: false,
      evidence_attendance_control: false,
      evidence_program_design_guide: false,
      evidence_audiovisual_record: false,
    }),
    [yearNow]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  const closeAndReset = () => {
    form.reset(defaults);
    setBreakdownMap({});
    setCourseValueText("");
    setConsultancyValueText("");
    props.onClose();
  };

  const submit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const parsedCourseValue = parseMoneyLoose(courseValueText);
      const courseValue = parsedCourseValue ?? values.course_value ?? null;

      const parsedConsultancyValue = parseMoneyLoose(consultancyValueText);
      const consultancyValue = parsedConsultancyValue ?? values.consultancy_value ?? null;

      const breakdowns: BeneficiaryBreakdown[] = Object.entries(breakdownMap)
        .filter(([, v]) => v !== null && v !== undefined && !Number.isNaN(Number(v)))
        .map(([k, v]) => {
          const base = parseKey(k as BreakdownKey);
          return { ...base, count: Number(v) };
        })
        .filter((b) => b.count !== null && b.count !== undefined);

      // Autocompletado suave: si el usuario llenó breakdowns pero dejó totales nulos, los calculamos.
      const studentsTotal = sumByPopulation(breakdowns, "students");
      const graduatesTotal = sumByPopulation(breakdowns, "graduates");
      const professorByProgramTotal = sumByPopulation(breakdowns, "professor");

      const professorsCount =
        values.professors_count === null || values.professors_count === undefined
          ? professorByProgramTotal || null
          : values.professors_count;

      const totalBeneficiaries =
        values.total_beneficiaries === null || values.total_beneficiaries === undefined
          ? (studentsTotal || 0) +
            (graduatesTotal || 0) +
            (professorsCount || 0) +
            (values.administrative_count || 0) +
            (values.external_people_count || 0) || null
          : values.total_beneficiaries;

      await props.onSubmit({
        ...values,
        course_value: courseValue,
        consultancy_value: consultancyValue,
        professors_count: professorsCount,
        total_beneficiaries: totalBeneficiaries,
        beneficiary_breakdowns: breakdowns.length ? breakdowns : undefined,
      });
      closeAndReset();
    } finally {
      setSubmitting(false);
    }
  });

  const fieldError = (name: keyof FormValues) =>
    form.formState.errors[name]?.message?.toString();

  const breakdownsPreview = useMemo(() => {
    const breakdowns: BeneficiaryBreakdown[] = Object.entries(breakdownMap)
      .filter(([, v]) => v !== null && v !== undefined && !Number.isNaN(Number(v)))
      .map(([k, v]) => ({ ...parseKey(k as BreakdownKey), count: Number(v) }));
    return {
      students: sumByPopulation(breakdowns, "students"),
      graduates: sumByPopulation(breakdowns, "graduates"),
      professorByProgram: sumByPopulation(breakdowns, "professor"),
      filled: breakdowns.filter((b) => (b.count ?? 0) !== 0).length,
    };
  }, [breakdownMap]);

  const formatMoneyEsCo = (n: number) =>
    new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 }).format(n);

  const parseMoneyLoose = (raw: string): number | null => {
    const s = (raw || "").trim();
    if (!s) return null;
    // deja solo dígitos, separadores y signo
    const keep = s.replace(/[^\d.,-]/g, "");
    const hasComma = keep.includes(",");
    const hasDot = keep.includes(".");
    let normalized = keep;

    if (hasComma && hasDot) {
      // es-CO típico: . miles y , decimales
      normalized = normalized.replace(/\./g, "").replace(/,/g, ".");
    } else if (hasComma) {
      // coma como decimal
      normalized = normalized.replace(/,/g, ".");
    } else if (hasDot) {
      // si hay 1 punto y quedan 1-2 decimales -> decimal; si no, miles
      const parts = normalized.split(".");
      const last = parts[parts.length - 1] ?? "";
      if (parts.length === 2 && last.length > 0 && last.length <= 2) {
        // decimal
        normalized = normalized;
      } else {
        // miles
        normalized = normalized.replace(/\./g, "");
      }
    }

    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  };

  return (
    <Dialog open={props.open} onOpenChange={(o) => (!o ? closeAndReset() : null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="space-y-2 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
              <Sparkles className="h-4 w-4 text-primary" />
            </span>
            Registrar actividad (Ing. Software)
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Completa los datos principales y, si aplica, agrega evidencias. Puedes
            dejar campos opcionales vacíos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label>Carrera *</Label>
              <Select
                value={form.watch("career")}
                onValueChange={(v) => form.setValue("career", v as FormValues["career"])}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ing. Software">Ing. Software</SelectItem>
                  <SelectItem value="Diseño Gráfico">Diseño Gráfico</SelectItem>
                  <SelectItem value="Negocios Internacionales">Negocios Internacionales</SelectItem>
                  <SelectItem value="Diseño de Modas">Diseño de Modas</SelectItem>
                  <SelectItem value="Administración Turística">Administración Turística</SelectItem>
                  <SelectItem value="Administración Financiera">Administración Financiera</SelectItem>
                </SelectContent>
              </Select>
              {fieldError("career") ? (
                <div className="text-xs text-destructive">{fieldError("career")}</div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Año *</Label>
              <Input type="number" {...form.register("year")} />
              {fieldError("year") ? (
                <div className="text-xs text-destructive">{fieldError("year")}</div>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label>Semestre *</Label>
              <Select
                value={String(form.watch("semester"))}
                onValueChange={(v) => form.setValue("semester", Number(v) as 1 | 2)}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semestre 1</SelectItem>
                  <SelectItem value="2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
              {fieldError("semester") ? (
                <div className="text-xs text-destructive">{fieldError("semester")}</div>
              ) : null}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Sede (CÚCUTA / OCAÑA) *</Label>
              <Select
                value={form.watch("campus")}
                onValueChange={(v) => form.setValue("campus", v as "CÚCUTA" | "OCAÑA")}
              >
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CÚCUTA">Cúcuta</SelectItem>
                  <SelectItem value="OCAÑA">Ocaña</SelectItem>
                </SelectContent>
              </Select>
              {fieldError("campus") ? (
                <div className="text-xs text-destructive">{fieldError("campus")}</div>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha inicio</Label>
              <Input type="date" {...form.register("start_date")} />
            </div>
            <div className="space-y-2">
              <Label>Fecha fin</Label>
              <Input type="date" {...form.register("end_date")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Lugar de ejecución *</Label>
            <Input
              placeholder="EMPRESA / INSTITUCIÓN / AUDITORIO…"
              {...form.register("execution_place")}
            />
            {fieldError("execution_place") ? (
              <div className="text-xs text-destructive">
                {fieldError("execution_place")}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Nombre de la actividad *</Label>
            <Input
              placeholder="Del aula a la industria…"
              {...form.register("activity_name")}
            />
            {fieldError("activity_name") ? (
              <div className="text-xs text-destructive">
                {fieldError("activity_name")}
              </div>
            ) : null}
          </div>

          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-border bg-muted/10 px-4"
          >
            <AccordionItem value="details">
              <AccordionTrigger>Detalles académicos</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-end justify-between gap-2">
                      <Label>Clasificación CINE (campo detallado)</Label>
                      {form.watch("cine_field_detailed_id") || form.watch("cine_isced_name") ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => {
                            form.setValue("cine_field_detailed_id", null);
                            form.setValue("cine_isced_name", null);
                          }}
                        >
                          Limpiar
                        </Button>
                      ) : null}
                    </div>

                    <Popover open={cineOpen} onOpenChange={setCineOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={cineOpen}
                          className="w-full justify-between bg-background"
                        >
                          <span className="truncate">
                            {form.watch("cine_isced_name")
                              ? form.watch("cine_isced_name")
                              : "Selecciona una clasificación CINE..."}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar por código o nombre..." />
                          <CommandList>
                            <CommandEmpty>Sin resultados</CommandEmpty>
                            <CommandGroup>
                              {CINE_OPTIONS.map((opt) => {
                                const value = `${opt.code} ${opt.name}`;
                                const selected = form.watch("cine_field_detailed_id") === opt.code;
                                return (
                                  <CommandItem
                                    key={opt.code}
                                    value={value}
                                    onSelect={() => {
                                      form.setValue("cine_field_detailed_id", opt.code, { shouldDirty: true });
                                      // Guardamos el texto combinado para que exporte idéntico a la plantilla
                                      form.setValue("cine_isced_name", value, { shouldDirty: true });
                                      setCineOpen(false);
                                    }}
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")} />
                                    <span className="font-medium tabular-nums">{opt.code}</span>
                                    <span className="ml-2 text-sm text-muted-foreground truncate">{opt.name}</span>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <div className="text-xs text-muted-foreground">
                      Se guardará en Excel como “código + nombre” y el ID se toma del código.
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de actividad</Label>
                    <Select
                      value={form.watch("activity_type") ?? ""}
                      onValueChange={(v) => form.setValue("activity_type", v || null)}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIVITY_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Número de horas</Label>
                    <Input type="number" min={0} {...form.register("num_hours")} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Descripción</Label>
                    <Textarea rows={4} placeholder="Descripción detallada…" {...form.register("description")} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Convenio (entidad)</Label>
                    <Input placeholder="JADE S.A.S" {...form.register("agreement_entity")} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="teacher">
              <AccordionTrigger>Docente que impartió</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo documento</Label>
                    <Select
                      value={form.watch("teacher_document_type") ?? ""}
                      onValueChange={(v) => form.setValue("teacher_document_type", v || null)}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEACHER_DOCUMENT_TYPE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Número documento</Label>
                    <Input placeholder="88251069" {...form.register("teacher_document_number")} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Valor del curso (COP)</Label>
                    <Input
                      inputMode="decimal"
                      placeholder="Ej. 2.333.333"
                      value={courseValueText}
                      onChange={(e) => setCourseValueText(e.target.value)}
                      onBlur={() => {
                        const n = parseMoneyLoose(courseValueText);
                        form.setValue("course_value", n, { shouldDirty: true });
                        setCourseValueText(n === null ? "" : formatMoneyEsCo(n));
                      }}
                    />
                    <div className="text-xs text-muted-foreground">
                      Se formatea con separador de miles. Puedes pegar valores como <span className="font-medium">2333333</span> o{" "}
                      <span className="font-medium">2.333.333</span>.
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="beneficiaries">
              <AccordionTrigger>Beneficiarios (totales)</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Total beneficiarios</Label>
                    <Input type="number" min={0} {...form.register("total_beneficiaries")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Profesor</Label>
                    <Input type="number" min={0} {...form.register("professors_count")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Administrativo</Label>
                    <Input type="number" min={0} {...form.register("administrative_count")} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Persona no vinculada</Label>
                    <Input type="number" min={0} {...form.register("external_people_count")} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Nota: el desglose por programa/campus/nivel es opcional. Si lo llenas, el export completará las columnas
                  de beneficiarios (y calculará Estudiantes/Graduados automáticamente).
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="beneficiary_breakdown">
              <AccordionTrigger>Beneficiarios por programa (opcional)</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <div className="text-sm font-semibold">Resumen</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Llenos (≠ 0): <span className="font-medium text-foreground">{breakdownsPreview.filled}</span> ·
                      Estudiantes: <span className="font-medium text-foreground">{breakdownsPreview.students}</span> ·
                      Graduados: <span className="font-medium text-foreground">{breakdownsPreview.graduates}</span> ·
                      Profesor (por programa):{" "}
                      <span className="font-medium text-foreground">{breakdownsPreview.professorByProgram}</span>
                    </div>
                  </div>

                  <BreakdownSection
                    title="Estudiantes Cúcuta"
                    description="Por programa y nivel (técnico/tecnólogo/profesional)."
                    items={[
                      { program: "Admón Financiera", levels: ["técnico", "tecnólogo", "profesional"] },
                      { program: "Logitica Empresarial", levels: ["técnico", "tecnólogo"] },
                      { program: "Admón Turistica y Hotelera", levels: ["técnico", "tecnólogo", "profesional"] },
                      { program: "Ing. Software", levels: ["técnico", "tecnólogo", "profesional"] },
                      { program: "Admón Negocios Internacionales (Presencial)", levels: ["técnico", "tecnólogo", "profesional"] },
                      { program: "Admón Negocios Internacionales (Distancia)", levels: ["técnico", "tecnólogo", "profesional"] },
                      { program: "Diseno Grafico", levels: ["técnico", "tecnólogo", "profesional"] },
                      { program: "Diseno y Admon de la Moda", levels: ["técnico", "tecnólogo", "profesional"] },
                    ]}
                    makeBreakdown={(program, level) => ({
                      population: "students",
                      campus: "CÚCUTA",
                      program,
                      level,
                      count: 0,
                    })}
                    breakdownMap={breakdownMap}
                    setBreakdownMap={setBreakdownMap}
                  />

                  <BreakdownSection
                    title="Estudiantes Ocaña"
                    description="En la plantilla solo aparece tecnólogo/profesional para estos programas."
                    items={[
                      { program: "Admón Financiera", levels: ["tecnólogo", "profesional"] },
                      { program: "Admón Negocios Internacionales (Presencial)", levels: ["tecnólogo", "profesional"] },
                      { program: "Diseno Grafico", levels: ["tecnólogo", "profesional"] },
                    ]}
                    makeBreakdown={(program, level) => ({
                      population: "students",
                      campus: "OCAÑA",
                      program,
                      level,
                      count: 0,
                    })}
                    breakdownMap={breakdownMap}
                    setBreakdownMap={setBreakdownMap}
                  />

                  <BreakdownTotalsSection
                    title="Graduados (totales por programa)"
                    description="En la plantilla estos van como total por programa (sin nivel)."
                    groups={[
                      { campus: "CÚCUTA", programs: ["Admón Financiera", "Logitica Empresarial", "Admón Turistica y Hotelera", "Ing. Software", "Admón Negocios Internacionales", "Diseno Grafico", "Diseno y Admon de la Moda"] },
                      { campus: "OCAÑA", programs: ["Admón Financiera", "Admón Negocios Internacionales", "Diseno Grafico"] },
                    ]}
                    makeBreakdown={(campus, program) => ({
                      population: "graduates",
                      campus,
                      program,
                      level: "total",
                      count: 0,
                    })}
                    breakdownMap={breakdownMap}
                    setBreakdownMap={setBreakdownMap}
                  />

                  <BreakdownTotalsSection
                    title="Profesor (totales por programa)"
                    description="Este bloque llena las columnas BI–BO del Excel."
                    groups={[
                      { campus: "N/A", programs: ["Admón Financiera", "Logitica Empresarial", "Admón Turistica y Hotelera", "Ing. Software", "Admón Negocios Internacionales", "Diseno Grafico", "Diseno y Admon de la Moda"] },
                    ]}
                    makeBreakdown={(_, program) => ({
                      population: "professor",
                      campus: "N/A",
                      program,
                      level: "total",
                      count: 0,
                    })}
                    breakdownMap={breakdownMap}
                    setBreakdownMap={setBreakdownMap}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="speaker">
              <AccordionTrigger>Ponente / conferencista (si aplica)</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Nombres y apellidos</Label>
                    <Input {...form.register("speaker_full_name")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Procedencia</Label>
                    <Input {...form.register("speaker_origin")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa que representa</Label>
                    <Input {...form.register("speaker_company")} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="consultancy">
              <AccordionTrigger>Consultoría (si aplica)</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Nombre entidad</Label>
                    <Input {...form.register("consultancy_entity_name")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Sector (ID)</Label>
                    <Select
                      value={form.watch("consultancy_sector_id") ?? ""}
                      onValueChange={(v) => form.setValue("consultancy_sector_id", v || null)}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONSULTANCY_SECTOR_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <Label>Valor (COP)</Label>
                    <Input
                      inputMode="decimal"
                      placeholder="Ej. 2.131.321"
                      value={consultancyValueText}
                      onChange={(e) => setConsultancyValueText(e.target.value)}
                      onBlur={() => {
                        const n = parseMoneyLoose(consultancyValueText);
                        form.setValue("consultancy_value", n, { shouldDirty: true });
                        setConsultancyValueText(n === null ? "" : formatMoneyEsCo(n));
                      }}
                    />
                    <div className="text-xs text-muted-foreground">
                      Se formatea con separador de miles. Puedes pegar valores como <span className="font-medium">2131321</span> o{" "}
                      <span className="font-medium">2.131.321</span>.
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="evidence">
              <AccordionTrigger>Evidencias</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EvidenceRow
                    label="Formato planeación de eventos"
                    checked={Boolean(form.watch("evidence_event_planning"))}
                    onCheckedChange={(v) => form.setValue("evidence_event_planning", v)}
                  />
                  <EvidenceRow
                    label="Control asistencia (académicas extracurriculares)"
                    checked={Boolean(form.watch("evidence_attendance_control"))}
                    onCheckedChange={(v) => form.setValue("evidence_attendance_control", v)}
                  />
                  <EvidenceRow
                    label="Guía diseño programas (Diplomados)"
                    checked={Boolean(form.watch("evidence_program_design_guide"))}
                    onCheckedChange={(v) => form.setValue("evidence_program_design_guide", v)}
                  />
                  <EvidenceRow
                    label="Registro audiovisual"
                    checked={Boolean(form.watch("evidence_audiovisual_record"))}
                    onCheckedChange={(v) => form.setValue("evidence_audiovisual_record", v)}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={closeAndReset} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" className="gap-2" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Crear actividad
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EvidenceRow(props: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold">{props.label}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Marca “Sí” o “No”.
          </div>
        </div>
        <Switch checked={props.checked} onCheckedChange={props.onCheckedChange} />
      </div>
    </div>
  );
}

function BreakdownSection(props: {
  title: string;
  description?: string;
  items: Array<{ program: string; levels: Array<"técnico" | "tecnólogo" | "profesional"> }>;
  makeBreakdown: (program: string, level: "técnico" | "tecnólogo" | "profesional") => BeneficiaryBreakdown;
  breakdownMap: Record<string, number | null>;
  setBreakdownMap: (next: Record<string, number | null> | ((prev: Record<string, number | null>) => Record<string, number | null>)) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-4">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <div className="text-sm font-semibold">{props.title}</div>
          {props.description ? <div className="mt-1 text-xs text-muted-foreground">{props.description}</div> : null}
        </div>
        <div className="text-[11px] text-muted-foreground">
          Tip: deja vacío lo que no aplique; escribe 0 si quieres que se vea 0.
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="text-left px-3 py-2 bg-muted/30 rounded-tl-xl border border-border">Programa</th>
              <th className="text-left px-3 py-2 bg-muted/30 border border-border">Técnico</th>
              <th className="text-left px-3 py-2 bg-muted/30 border border-border">Tecnólogo</th>
              <th className="text-left px-3 py-2 bg-muted/30 rounded-tr-xl border border-border">Profesional</th>
            </tr>
          </thead>
          <tbody>
            {props.items.map((row) => {
              const has = (lvl: "técnico" | "tecnólogo" | "profesional") => row.levels.includes(lvl);
              const cell = (lvl: "técnico" | "tecnólogo" | "profesional") => {
                if (!has(lvl)) return <div className="h-9" />;
                const b = props.makeBreakdown(row.program, lvl);
                const key = makeKey(b);
                const val = props.breakdownMap[key];
                return (
                  <Input
                    type="number"
                    min={0}
                    value={val ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      props.setBreakdownMap((prev) => ({
                        ...prev,
                        [key]: raw === "" ? null : Number(raw),
                      }));
                    }}
                    className="h-9 bg-background"
                  />
                );
              };

              return (
                <tr key={row.program}>
                  <td className="px-3 py-2 border border-border bg-background/30 font-medium">{row.program}</td>
                  <td className="px-2 py-2 border border-border">{cell("técnico")}</td>
                  <td className="px-2 py-2 border border-border">{cell("tecnólogo")}</td>
                  <td className="px-2 py-2 border border-border">{cell("profesional")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BreakdownTotalsSection(props: {
  title: string;
  description?: string;
  groups: Array<{ campus: string; programs: string[] }>;
  makeBreakdown: (campus: string, program: string) => BeneficiaryBreakdown;
  breakdownMap: Record<string, number | null>;
  setBreakdownMap: (next: Record<string, number | null> | ((prev: Record<string, number | null>) => Record<string, number | null>)) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-4">
      <div>
        <div className="text-sm font-semibold">{props.title}</div>
        {props.description ? <div className="mt-1 text-xs text-muted-foreground">{props.description}</div> : null}
      </div>

      <div className="mt-3 space-y-4">
        {props.groups.map((g) => (
          <div key={g.campus} className="rounded-xl border border-border bg-background/30 p-3">
            <div className="text-xs font-semibold text-muted-foreground">{g.campus}</div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {g.programs.map((program) => {
                const b = props.makeBreakdown(g.campus, program);
                const key = makeKey(b);
                const val = props.breakdownMap[key];
                return (
                  <div key={`${g.campus}-${program}`} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/50 px-3 py-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{program}</div>
                      <div className="text-[11px] text-muted-foreground">Total</div>
                    </div>
                    <Input
                      type="number"
                      min={0}
                      value={val ?? ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        props.setBreakdownMap((prev) => ({
                          ...prev,
                          [key]: raw === "" ? null : Number(raw),
                        }));
                      }}
                      className="h-9 w-28 bg-background"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

