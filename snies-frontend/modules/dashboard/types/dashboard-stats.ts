export type DashboardFiltersAvailable = {
  years: string[];
  semesters: number[];
};

export type DashboardTopItem = Record<string, unknown>;

export type DashboardTotals = Record<string, unknown>;

export type DashboardTimePoint = {
  year: string;
  semester: number;
  records: number;
};

export type DashboardTimeSeries = Record<string, DashboardTimePoint[]>;

export type DashboardStatsResponse = {
  filters_available?: DashboardFiltersAvailable;
  filters_applied?: { year: string | null; semester: number | null };

  users?: {
    total?: number;
    roles_total?: number;
    by_role?: Array<{ role: string; count: number }>;
  };

  courses?: {
    total?: number;
    by_active?: Array<{ is_active: boolean; count: number }>;
    by_extension?: Array<{ is_extension: boolean; count: number }>;
  };

  continuing_education?: {
    totals?: { records?: number; total_value?: number; total_hours?: number };
    by_course_top?: DashboardTopItem[];
  };

  continuing_education_teachers?: {
    totals?: { records?: number };
    by_course_top?: DashboardTopItem[];
    by_document_type_top?: DashboardTopItem[];
  };

  continuing_education_beneficiaries?: {
    totals?: { records?: number; beneficiaries_total?: number };
    by_course_top?: DashboardTopItem[];
    by_type_top?: DashboardTopItem[];
  };

  wellbeing?: {
    activities?: {
      totals?: { records?: number; national_funding_total?: string; international_funding_total?: string };
      by_type_top?: DashboardTopItem[];
      by_org_unit_top?: DashboardTopItem[];
      by_country_top?: DashboardTopItem[];
    };

    beneficiaries?: {
      totals?: { records?: number; beneficiaries_total?: number };
      by_type_top?: DashboardTopItem[];
      by_activity_top?: DashboardTopItem[];
    };

    human_resources?: {
      totals?: { records?: number };
      by_activity_top?: DashboardTopItem[];
      by_org_unit_top?: DashboardTopItem[];
      by_document_type_top?: DashboardTopItem[];
      by_dedication_top?: DashboardTopItem[];
    };
  };

  time_series?: DashboardTimeSeries;
};

