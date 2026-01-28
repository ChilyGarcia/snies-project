from __future__ import annotations

from django.db.models import Count, Sum, Value, DecimalField
from django.db.models.functions import Coalesce

from stats.domain.ports.stats_repository import StatsRepository
from users.models import RoleModel, UserModel
from courses.infraestructure.persistence.django.models import CourseModel
from continuing_education.infraestructure.persistence.django.models import ContinuingEducationModel
from continuing_education_teachers.infraestructure.persistence.django.models import (
    ContinuingEducationTeacherModel,
)
from continuing_education_beneficiaries.infraestructure.persistence.django.models import (
    ContinuingEducationBeneficiaryModel,
)
from wellbeing_activities.infraestructure.persistence.django.models import WellbeingActivityModel
from wellbeing_beneficiaries.infraestructure.persistence.django.models import (
    WellbeingBeneficiaryActivityModel,
)
from wellbeing_human_resources.infraestructure.persistence.django.models import (
    WellbeingHumanResourceModel,
)


class DjangoStatsRepository(StatsRepository):
    def _dec_sum(self, field_name: str, max_digits: int = 18, decimal_places: int = 2):
        """
        Coalesce(Sum(decimal_field), 0) must declare output_field to avoid:
        FieldError: Expression contains mixed types: DecimalField, IntegerField.
        """
        return Coalesce(
            Sum(field_name),
            Value(0, output_field=DecimalField(max_digits=max_digits, decimal_places=decimal_places)),
            output_field=DecimalField(max_digits=max_digits, decimal_places=decimal_places),
        )

    def _filter_year_semester(self, qs, year: str | None, semester: int | None):
        if year:
            qs = qs.filter(year=str(year))
        if semester is not None:
            qs = qs.filter(semester=int(semester))
        return qs

    def get_dashboard(self, year: str | None, semester: int | None, top_n: int) -> dict:
        top_n = max(1, min(int(top_n or 10), 50))

        # Available filters (union across year/semester-based tables)
        years = set()
        semesters = set()
        for qs in (
            WellbeingActivityModel.objects.values_list("year", flat=True).distinct(),
            WellbeingBeneficiaryActivityModel.objects.values_list("year", flat=True).distinct(),
            ContinuingEducationModel.objects.values_list("year", flat=True).distinct(),
            ContinuingEducationTeacherModel.objects.values_list("year", flat=True).distinct(),
            ContinuingEducationBeneficiaryModel.objects.values_list("year", flat=True).distinct(),
            WellbeingHumanResourceModel.objects.values_list("year", flat=True).distinct(),
        ):
            years.update([str(y) for y in qs if y is not None])
        for qs in (
            WellbeingActivityModel.objects.values_list("semester", flat=True).distinct(),
            WellbeingBeneficiaryActivityModel.objects.values_list("semester", flat=True).distinct(),
            ContinuingEducationModel.objects.values_list("semester", flat=True).distinct(),
            ContinuingEducationTeacherModel.objects.values_list("semester", flat=True).distinct(),
            ContinuingEducationBeneficiaryModel.objects.values_list("semester", flat=True).distinct(),
            WellbeingHumanResourceModel.objects.values_list("semester", flat=True).distinct(),
        ):
            semesters.update([int(s) for s in qs if s is not None])

        # Users / Roles (no year/semester)
        users_total = UserModel.objects.count()
        roles_total = RoleModel.objects.count()
        users_by_role = (
            UserModel.objects.select_related("role")
            .values("role__name")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        # Courses (no year/semester)
        courses_total = CourseModel.objects.count()
        courses_by_active = (
            CourseModel.objects.values("is_active").annotate(count=Count("id")).order_by("-count")
        )
        courses_by_extension = (
            CourseModel.objects.values("is_extension").annotate(count=Count("id")).order_by("-count")
        )

        # Continuing education (year/semester applies)
        ce_qs = self._filter_year_semester(ContinuingEducationModel.objects.all(), year, semester)
        ce_totals = ce_qs.aggregate(
            records=Count("id"),
            total_value=Coalesce(Sum("value"), 0),
            total_hours=Coalesce(Sum("num_hours"), 0),
        )
        ce_by_course = (
            ce_qs.values("id_course_id")
            .annotate(records=Count("id"), total_value=Coalesce(Sum("value"), 0))
            .order_by("-records")[:top_n]
        )

        # Wellbeing activities (year/semester applies)
        wa_qs = self._filter_year_semester(WellbeingActivityModel.objects.all(), year, semester)
        wa_totals = wa_qs.aggregate(
            records=Count("id"),
            national_funding_total=self._dec_sum("national_funding_value"),
            international_funding_total=self._dec_sum("international_funding_value"),
        )
        wa_by_type = (
            wa_qs.values("wellbeing_activity_type_id")
            .annotate(count=Count("id"))
            .order_by("-count")[:top_n]
        )
        wa_by_org_unit = (
            wa_qs.values("organization_unit_code")
            .annotate(count=Count("id"))
            .order_by("-count")[:top_n]
        )
        wa_by_country = (
            wa_qs.values("funding_country_id")
            .annotate(
                count=Count("id"),
                national_funding_total=self._dec_sum("national_funding_value"),
                international_funding_total=self._dec_sum("international_funding_value"),
            )
            .order_by("-count")[:top_n]
        )

        # Wellbeing beneficiaries (year/semester applies)
        wb_qs = self._filter_year_semester(
            WellbeingBeneficiaryActivityModel.objects.all(), year, semester
        )
        wb_totals = wb_qs.aggregate(
            records=Count("id"),
            beneficiaries_total=Coalesce(Sum("beneficiaries_count"), 0),
        )
        wb_by_type = (
            wb_qs.values("beneficiary_type_id")
            .annotate(beneficiaries_total=Coalesce(Sum("beneficiaries_count"), 0))
            .order_by("-beneficiaries_total")[:top_n]
        )
        wb_by_activity = (
            wb_qs.values("activity_code")
            .annotate(beneficiaries_total=Coalesce(Sum("beneficiaries_count"), 0))
            .order_by("-beneficiaries_total")[:top_n]
        )

        # Continuing education - teachers (year/semester applies)
        cet_qs = self._filter_year_semester(
            ContinuingEducationTeacherModel.objects.all(), year, semester
        )
        cet_totals = cet_qs.aggregate(records=Count("id"))
        cet_by_course = (
            cet_qs.values("course_code")
            .annotate(records=Count("id"))
            .order_by("-records")[:top_n]
        )
        cet_by_doc_type = (
            cet_qs.values("document_type_id")
            .annotate(records=Count("id"))
            .order_by("-records")[:top_n]
        )

        # Continuing education - beneficiaries (year/semester applies)
        ceb_qs = self._filter_year_semester(
            ContinuingEducationBeneficiaryModel.objects.all(), year, semester
        )
        ceb_totals = ceb_qs.aggregate(
            records=Count("id"),
            beneficiaries_total=Coalesce(Sum("beneficiaries_count"), 0),
        )
        ceb_by_course = (
            ceb_qs.values("course_code")
            .annotate(beneficiaries_total=Coalesce(Sum("beneficiaries_count"), 0))
            .order_by("-beneficiaries_total")[:top_n]
        )
        ceb_by_type = (
            ceb_qs.values("beneficiary_type_extension_id")
            .annotate(beneficiaries_total=Coalesce(Sum("beneficiaries_count"), 0))
            .order_by("-beneficiaries_total")[:top_n]
        )

        # Wellbeing - human resources (year/semester applies)
        whr_qs = self._filter_year_semester(WellbeingHumanResourceModel.objects.all(), year, semester)
        whr_totals = whr_qs.aggregate(records=Count("id"))
        whr_by_activity = (
            whr_qs.values("activity_code")
            .annotate(records=Count("id"))
            .order_by("-records")[:top_n]
        )
        whr_by_org_unit = (
            whr_qs.values("organization_unit_code")
            .annotate(records=Count("id"))
            .order_by("-records")[:top_n]
        )
        whr_by_doc_type = (
            whr_qs.values("document_type_id")
            .annotate(records=Count("id"))
            .order_by("-records")[:top_n]
        )
        whr_by_dedication = (
            whr_qs.values("dedication")
            .annotate(records=Count("id"))
            .order_by("-records")[:top_n]
        )

        # Time series (NOT filtered by request filters; intended for line/stacked-bar charts)
        ts_ce = (
            ContinuingEducationModel.objects.values("year", "semester")
            .annotate(records=Count("id"))
            .order_by("year", "semester")
        )
        ts_cet = (
            ContinuingEducationTeacherModel.objects.values("year", "semester")
            .annotate(records=Count("id"))
            .order_by("year", "semester")
        )
        ts_ceb = (
            ContinuingEducationBeneficiaryModel.objects.values("year", "semester")
            .annotate(records=Count("id"))
            .order_by("year", "semester")
        )
        ts_wa = (
            WellbeingActivityModel.objects.values("year", "semester")
            .annotate(records=Count("id"))
            .order_by("year", "semester")
        )
        ts_wb = (
            WellbeingBeneficiaryActivityModel.objects.values("year", "semester")
            .annotate(records=Count("id"))
            .order_by("year", "semester")
        )
        ts_whr = (
            WellbeingHumanResourceModel.objects.values("year", "semester")
            .annotate(records=Count("id"))
            .order_by("year", "semester")
        )

        return {
            "filters_available": {
                "years": sorted(years),
                "semesters": sorted(semesters),
            },
            "filters_applied": {"year": year, "semester": semester},
            "users": {
                "total": users_total,
                "roles_total": roles_total,
                "by_role": [
                    {"role": r["role__name"] or "sin_rol", "count": r["count"]}
                    for r in users_by_role
                ],
            },
            "courses": {
                "total": courses_total,
                "by_active": [{"is_active": r["is_active"], "count": r["count"]} for r in courses_by_active],
                "by_extension": [{"is_extension": r["is_extension"], "count": r["count"]} for r in courses_by_extension],
            },
            "continuing_education": {
                "totals": {
                    "records": int(ce_totals["records"]),
                    "total_value": int(ce_totals["total_value"]),
                    "total_hours": int(ce_totals["total_hours"]),
                },
                "by_course_top": [
                    {
                        "course_id": r["id_course_id"],
                        "records": r["records"],
                        "total_value": int(r["total_value"]),
                    }
                    for r in ce_by_course
                ],
            },
            "continuing_education_teachers": {
                "totals": {"records": int(cet_totals["records"])},
                "by_course_top": [{"course_code": r["course_code"], "records": r["records"]} for r in cet_by_course],
                "by_document_type_top": [{"document_type_id": r["document_type_id"], "records": r["records"]} for r in cet_by_doc_type],
            },
            "continuing_education_beneficiaries": {
                "totals": {
                    "records": int(ceb_totals["records"]),
                    "beneficiaries_total": int(ceb_totals["beneficiaries_total"]),
                },
                "by_course_top": [{"course_code": r["course_code"], "beneficiaries_total": int(r["beneficiaries_total"])} for r in ceb_by_course],
                "by_type_top": [{"beneficiary_type_extension_id": r["beneficiary_type_extension_id"], "beneficiaries_total": int(r["beneficiaries_total"])} for r in ceb_by_type],
            },
            "wellbeing": {
                "activities": {
                    "totals": {
                        "records": int(wa_totals["records"]),
                        "national_funding_total": str(wa_totals["national_funding_total"]),
                        "international_funding_total": str(wa_totals["international_funding_total"]),
                    },
                    "by_type_top": [
                        {"type_id": r["wellbeing_activity_type_id"], "count": r["count"]}
                        for r in wa_by_type
                    ],
                    "by_org_unit_top": [
                        {"organization_unit_code": r["organization_unit_code"], "count": r["count"]}
                        for r in wa_by_org_unit
                    ],
                    "by_country_top": [
                        {
                            "funding_country_id": r["funding_country_id"],
                            "count": r["count"],
                            "national_funding_total": str(r["national_funding_total"]),
                            "international_funding_total": str(r["international_funding_total"]),
                        }
                        for r in wa_by_country
                    ],
                },
                "beneficiaries": {
                    "totals": {
                        "records": int(wb_totals["records"]),
                        "beneficiaries_total": int(wb_totals["beneficiaries_total"]),
                    },
                    "by_type_top": [
                        {"beneficiary_type_id": r["beneficiary_type_id"], "beneficiaries_total": int(r["beneficiaries_total"])}
                        for r in wb_by_type
                    ],
                    "by_activity_top": [
                        {"activity_code": r["activity_code"], "beneficiaries_total": int(r["beneficiaries_total"])}
                        for r in wb_by_activity
                    ],
                },
                "human_resources": {
                    "totals": {"records": int(whr_totals["records"])},
                    "by_activity_top": [{"activity_code": r["activity_code"], "records": r["records"]} for r in whr_by_activity],
                    "by_org_unit_top": [{"organization_unit_code": r["organization_unit_code"], "records": r["records"]} for r in whr_by_org_unit],
                    "by_document_type_top": [{"document_type_id": r["document_type_id"], "records": r["records"]} for r in whr_by_doc_type],
                    "by_dedication_top": [{"dedication": r["dedication"], "records": r["records"]} for r in whr_by_dedication],
                },
            },
            "time_series": {
                "continuing_education": [{"year": r["year"], "semester": r["semester"], "records": r["records"]} for r in ts_ce],
                "continuing_education_teachers": [{"year": r["year"], "semester": r["semester"], "records": r["records"]} for r in ts_cet],
                "continuing_education_beneficiaries": [{"year": r["year"], "semester": r["semester"], "records": r["records"]} for r in ts_ceb],
                "wellbeing_activities": [{"year": r["year"], "semester": r["semester"], "records": r["records"]} for r in ts_wa],
                "wellbeing_beneficiaries": [{"year": r["year"], "semester": r["semester"], "records": r["records"]} for r in ts_wb],
                "wellbeing_human_resources": [{"year": r["year"], "semester": r["semester"], "records": r["records"]} for r in ts_whr],
            },
        }

