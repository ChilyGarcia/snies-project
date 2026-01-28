import type { Course } from "@/modules/courses/types/course";
import type { ContinuingEducationRecord } from "@/modules/courses/api/continuing-education.api";
import type { ContinuingEducationTeacher } from "@/modules/courses/types/continuing-education-teacher";
import type { ContinuingEducationBeneficiary } from "@/modules/courses/types/continuing-education-beneficiary";

type ExcelJSImport = typeof import("exceljs");

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function styleHeaderRow(row: any) {
  row.height = 20;
  row.eachCell((cell: any) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2F5597" }, // Excel-ish dark blue
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin", color: { argb: "FF1F1F1F" } },
      left: { style: "thin", color: { argb: "FF1F1F1F" } },
      bottom: { style: "thin", color: { argb: "FF1F1F1F" } },
      right: { style: "thin", color: { argb: "FF1F1F1F" } },
    };
  });
}

export async function exportCourseExcel(params: {
  course: Course;
  continuingEducation: ContinuingEducationRecord[];
  teachers: ContinuingEducationTeacher[];
  beneficiaries: ContinuingEducationBeneficiary[];
}) {
  const { course, continuingEducation, teachers, beneficiaries } = params;

  const ExcelJS: ExcelJSImport = await import("exceljs");
  const wb = new ExcelJS.Workbook();
  wb.creator = "SNIES";
  wb.created = new Date();

  const sheetCE = wb.addWorksheet("EDUCACION_CONTINUA", { views: [{ state: "frozen", ySplit: 1 }] });
  const sheetTeachers = wb.addWorksheet("EDUCACION_CONTINUA_DOCENTES", { views: [{ state: "frozen", ySplit: 1 }] });
  const sheetBenef = wb.addWorksheet("EDUCAC_CONTINUA_BENEFICIARIOS", { views: [{ state: "frozen", ySplit: 1 }] });
  const sheetInfo = wb.addWorksheet("INFO");

  // --- EDUCACION_CONTINUA ---
  sheetCE.columns = [
    { header: "AÑO", key: "year", width: 10 },
    { header: "SEMESTRE", key: "semester", width: 12 },
    { header: "CODIGO_CURSO", key: "course_code", width: 18 },
    { header: "NUM_HORAS", key: "num_hours", width: 12 },
    { header: "ID_TIPO_CURSO_EXTENSION", key: "id_tipo", width: 24 },
    { header: "VALOR_CURSO", key: "value", width: 16 },
  ];
  styleHeaderRow(sheetCE.getRow(1));
  for (const r of continuingEducation) {
    sheetCE.addRow({
      year: r.year,
      semester: r.semester,
      course_code: course.code,
      num_hours: r.num_hours,
      id_tipo: r.id_course, // backend returns id_course; in template it's named as tipo extension
      value: r.value,
    });
  }

  // --- DOCENTES ---
  sheetTeachers.columns = [
    { header: "AÑO", key: "year", width: 10 },
    { header: "SEMESTRE", key: "semester", width: 12 },
    { header: "CODIGO_CURSO", key: "course_code", width: 18 },
    { header: "ID_TIPO_DOCUMENTO", key: "document_type_id", width: 18 },
    { header: "NUM_DOCUMENTO", key: "document_number", width: 18 },
  ];
  styleHeaderRow(sheetTeachers.getRow(1));
  for (const t of teachers) {
    sheetTeachers.addRow({
      year: t.year,
      semester: t.semester,
      course_code: t.course_code,
      document_type_id: t.document_type_id,
      document_number: t.document_number,
    });
  }

  // --- BENEFICIARIOS ---
  sheetBenef.columns = [
    { header: "AÑO", key: "year", width: 10 },
    { header: "SEMESTRE", key: "semester", width: 12 },
    { header: "CODIGO_CURSO", key: "course_code", width: 18 },
    { header: "ID_TIPO_BENEF_EXTENSION", key: "beneficiary_type_extension_id", width: 24 },
    { header: "CANTIDAD_BENEFICIARIOS", key: "beneficiaries_count", width: 24 },
  ];
  styleHeaderRow(sheetBenef.getRow(1));
  for (const b of beneficiaries) {
    sheetBenef.addRow({
      year: b.year,
      semester: b.semester,
      course_code: b.course_code,
      beneficiary_type_extension_id: b.beneficiary_type_extension_id,
      beneficiaries_count: b.beneficiaries_count,
    });
  }

  // --- INFO ---
  sheetInfo.columns = [
    { header: "CAMPO", key: "field", width: 22 },
    { header: "VALOR", key: "value", width: 40 },
  ];
  styleHeaderRow(sheetInfo.getRow(1));
  sheetInfo.addRow({ field: "CURSO", value: course.name });
  sheetInfo.addRow({ field: "CODIGO_CURSO", value: course.code });
  sheetInfo.addRow({ field: "ID_CURSO", value: course.id });
  sheetInfo.addRow({ field: "GENERADO_EN", value: new Date().toISOString() });

  // Numeric formatting
  sheetCE.getColumn("value").numFmt = "#,##0";
  sheetCE.getColumn("num_hours").numFmt = "0";
  sheetTeachers.getColumn("document_type_id").numFmt = "0";
  sheetBenef.getColumn("beneficiary_type_extension_id").numFmt = "0";
  sheetBenef.getColumn("beneficiaries_count").numFmt = "0";

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const safeCode = (course.code || "curso").replace(/[^\w-]+/g, "_");
  const filename = `SNIES_${safeCode}_educacion_continua.xlsx`;
  downloadBlob(filename, blob);
}

