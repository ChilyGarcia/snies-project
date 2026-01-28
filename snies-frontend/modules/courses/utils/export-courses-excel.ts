import type { Course } from "@/modules/courses/types/course";

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
      fgColor: { argb: "FF2F5597" },
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

export async function exportCoursesExcel(params: { courses: Course[] }) {
  const { courses } = params;

  const ExcelJS: ExcelJSImport = await import("exceljs");
  const wb = new ExcelJS.Workbook();
  wb.creator = "SNIES";
  wb.created = new Date();

  const sheet = wb.addWorksheet("CURSO", { views: [{ state: "frozen", ySplit: 1 }] });
  const info = wb.addWorksheet("INFO", { views: [{ state: "frozen", ySplit: 1 }] });

  // Headers must match the provided template exactly
  sheet.columns = [
    { header: "CODIGO_CURSO", key: "code", width: 18 },
    { header: "NOMBRE_CURSO", key: "name", width: 28 },
    { header: "ID_CINE_CAMPO_DETALLADO", key: "cine", width: 24 },
    { header: "ES_EXTENSION", key: "is_extension", width: 14 },
    { header: "ACTIVO", key: "is_active", width: 10 },
  ];
  styleHeaderRow(sheet.getRow(1));

  for (const c of courses) {
    sheet.addRow({
      code: c.code,
      name: c.name,
      cine: c.id_cine_field_detailed,
      is_extension: c.is_extension ? 1 : 0,
      is_active: c.is_active ? 1 : 0,
    });
  }

  info.columns = [
    { header: "CAMPO", key: "field", width: 22 },
    { header: "VALOR", key: "value", width: 40 },
  ];
  styleHeaderRow(info.getRow(1));
  info.addRow({ field: "TOTAL_CURSOS", value: courses.length });
  info.addRow({ field: "GENERADO_EN", value: new Date().toISOString() });

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  downloadBlob("SNIES_CURSOS.xlsx", blob);
}

