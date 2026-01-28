import ExcelJS from "exceljs";
import type { WellbeingActivity } from "@/modules/wellbeing/types/activity";
import type { WellbeingBenefeciary } from "@/modules/wellbeing/types/beneficiary";
import type { WellbeingHumanResource } from "@/modules/wellbeing/types/human-resource";

function applyHeaderStyle(sheet: ExcelJS.Worksheet) {
  const headerRow = sheet.getRow(1);
  headerRow.height = 20;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F4E79" }, // azul oscuro (similar al formato entregado)
    };
    cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  sheet.views = [{ state: "frozen", ySplit: 1 }];
}

function applyBodyBorders(sheet: ExcelJS.Worksheet) {
  const rowCount = sheet.rowCount;
  const colCount = sheet.columnCount;
  for (let r = 2; r <= rowCount; r++) {
    const row = sheet.getRow(r);
    for (let c = 1; c <= colCount; c++) {
      const cell = row.getCell(c);
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    }
  }
}

export async function exportWellbeingExcel(params: {
  activities: WellbeingActivity[];
  beneficiaries: WellbeingBenefeciary[];
  humanResources: WellbeingHumanResource[];
}) {
  const { activities, beneficiaries, humanResources } = params;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SNIES Dashboard";
  workbook.lastModifiedBy = "SNIES Dashboard";
  workbook.created = new Date();
  workbook.modified = new Date();

  // Hoja 1: ACTIVIDAD_BIENESTAR (headers idénticos al formato solicitado)
  const actSheet = workbook.addWorksheet("ACTIVIDAD_BIENESTAR");
  actSheet.columns = [
    { header: "AÑO", key: "year", width: 10 },
    { header: "SEMESTRE", key: "semester", width: 10 },
    { header: "CODIGO_UNIDAD_ORGANIZACIONAL", key: "organization_unit_code", width: 28 },
    { header: "CODIGO_ACTIVIDAD", key: "activity_code", width: 18 },
    { header: "DESCRIPCION_ACTIVIDAD", key: "activity_description", width: 40 },
    { header: "ID_TIPO_ACTIVIDAD_BIENESTAR", key: "wellbeing_activity_type_id", width: 26 },
    { header: "FECHA_INICIO", key: "start_date", width: 14 },
    { header: "FECHA_FINAL", key: "end_date", width: 14 },
    { header: "ID_FUENTE_NACIONAL", key: "national_source_id", width: 18 },
    { header: "VALOR_FUENTE_NACIONAL", key: "national_funding_value", width: 20 },
    { header: "ID_PAIS_FINANCIACION", key: "funding_country_id", width: 20 },
    { header: "ENTIDAD_FUENTE_INTERNACIONAL", key: "international_source_entity_name", width: 28 },
    { header: "VALOR_FUENTE_INTERNACIONAL", key: "international_funding_value", width: 22 },
  ];

  activities.forEach((a) => {
    actSheet.addRow({
      year: a.year,
      semester: a.semester,
      organization_unit_code: a.organization_unit_code,
      activity_code: a.activity_code,
      activity_description: a.activity_description,
      wellbeing_activity_type_id: a.wellbeing_activity_type_id,
      start_date: a.start_date,
      end_date: a.end_date,
      national_source_id: a.national_source_id,
      national_funding_value: a.national_funding_value,
      funding_country_id: a.funding_country_id,
      international_source_entity_name: a.international_source_entity_name ?? "",
      international_funding_value: a.international_funding_value ?? "",
    });
  });

  applyHeaderStyle(actSheet);
  applyBodyBorders(actSheet);

  // Hoja 2: ACT_BIENESTAR_BENEFICIARIOS
  const benSheet = workbook.addWorksheet("ACT_BIENESTAR_BENEFICIARIOS");
  benSheet.columns = [
    { header: "AÑO", key: "year", width: 10 },
    { header: "SEMESTRE", key: "semester", width: 10 },
    { header: "CODIGO_UNIDAD_ORGANIZACIONAL", key: "organization_unit_code", width: 28 },
    { header: "CODIGO_ACTIVIDAD", key: "activity_code", width: 18 },
    { header: "ID_TIPO_BENEFICIARIO", key: "beneficiary_type_id", width: 20 },
    { header: "CANTIDAD_BENEFICIARIOS", key: "beneficiaries_count", width: 24 },
  ];

  beneficiaries.forEach((b) => {
    benSheet.addRow({
      year: b.year,
      semester: b.semester,
      organization_unit_code: b.organization_unit_code,
      activity_code: b.activity_code,
      beneficiary_type_id: b.beneficiary_type_id,
      beneficiaries_count: b.beneficiaries_count,
    });
  });

  applyHeaderStyle(benSheet);
  applyBodyBorders(benSheet);

  // Hoja 3: ACT_BIENESTAR_REC_HUMANO
  const hrSheet = workbook.addWorksheet("ACT_BIENESTAR_REC_HUMANO");
  hrSheet.columns = [
    { header: "AÑO", key: "year", width: 10 },
    { header: "SEMESTRE", key: "semester", width: 10 },
    { header: "CODIGO_ACTIVIDAD", key: "activity_code", width: 18 },
    { header: "CODIGO_UNIDAD_ORGANIZACIONAL", key: "organization_unit_code", width: 28 },
    { header: "ID_TIPO_DOCUMENTO", key: "document_type_id", width: 18 },
    { header: "NUM_DOCUMENTO", key: "document_number", width: 18 },
    { header: "DEDICACION", key: "dedication", width: 14 },
  ];

  humanResources.forEach((r) => {
    hrSheet.addRow({
      year: r.year,
      semester: r.semester,
      activity_code: r.activity_code,
      organization_unit_code: r.organization_unit_code,
      document_type_id: r.document_type_id,
      document_number: r.document_number,
      dedication: r.dedication,
    });
  });

  applyHeaderStyle(hrSheet);
  applyBodyBorders(hrSheet);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bienestar_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
}

