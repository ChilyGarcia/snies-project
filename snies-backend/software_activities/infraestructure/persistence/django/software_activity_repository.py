from __future__ import annotations

from django.db import transaction

from software_activities.domain.entities.software_activity import (
    SoftwareActivity,
    BeneficiaryBreakdown,
)
from software_activities.domain.ports.software_activity_repository import (
    SoftwareActivityRepository,
)
from software_activities.infraestructure.persistence.django.models import (
    SoftwareActivityModel,
    SoftwareActivityBeneficiaryBreakdownModel,
)


class SoftwareActivityRepositoryDjango(SoftwareActivityRepository):
    def create(
        self,
        activity: SoftwareActivity,
        breakdowns: list[BeneficiaryBreakdown] | None = None,
    ) -> SoftwareActivity:
        with transaction.atomic():
            m = SoftwareActivityModel.objects.create(
                year=activity.year,
                semester=activity.semester,
                start_date=activity.start_date,
                end_date=activity.end_date,
                execution_place=activity.execution_place,
                campus=activity.campus,
                activity_name=activity.activity_name,
                agreement_entity=activity.agreement_entity,
                description=activity.description,
                cine_isced_name=activity.cine_isced_name,
                cine_field_detailed_id=activity.cine_field_detailed_id,
                num_hours=activity.num_hours,
                activity_type=activity.activity_type,
                course_value=activity.course_value,
                teacher_document_type=activity.teacher_document_type,
                teacher_document_number=activity.teacher_document_number,
                total_beneficiaries=activity.total_beneficiaries,
                professors_count=activity.professors_count,
                administrative_count=activity.administrative_count,
                external_people_count=activity.external_people_count,
                speaker_full_name=activity.speaker_full_name,
                speaker_origin=activity.speaker_origin,
                speaker_company=activity.speaker_company,
                consultancy_entity_name=activity.consultancy_entity_name,
                consultancy_sector_id=activity.consultancy_sector_id,
                consultancy_value=activity.consultancy_value,
                evidence_event_planning=activity.evidence_event_planning,
                evidence_attendance_control=activity.evidence_attendance_control,
                evidence_program_design_guide=activity.evidence_program_design_guide,
                evidence_audiovisual_record=activity.evidence_audiovisual_record,
            )

            if breakdowns:
                SoftwareActivityBeneficiaryBreakdownModel.objects.bulk_create(
                    [
                        SoftwareActivityBeneficiaryBreakdownModel(
                            activity=m,
                            population=b.population,
                            campus=b.campus,
                            program=b.program,
                            level=b.level,
                            count=b.count,
                        )
                        for b in breakdowns
                    ]
                )

            return self._to_domain(m)

    def bulk_create(
        self,
        activities: list[SoftwareActivity],
        breakdowns_by_temp_index: dict[int, list[BeneficiaryBreakdown]] | None = None,
    ) -> int:
        if not activities:
            return 0

        breakdowns_by_temp_index = breakdowns_by_temp_index or {}

        with transaction.atomic():
            created_models = SoftwareActivityModel.objects.bulk_create(
                [
                    SoftwareActivityModel(
                        year=a.year,
                        semester=a.semester,
                        start_date=a.start_date,
                        end_date=a.end_date,
                        execution_place=a.execution_place,
                        campus=a.campus,
                        activity_name=a.activity_name,
                        agreement_entity=a.agreement_entity,
                        description=a.description,
                        cine_isced_name=a.cine_isced_name,
                        cine_field_detailed_id=a.cine_field_detailed_id,
                        num_hours=a.num_hours,
                        activity_type=a.activity_type,
                        course_value=a.course_value,
                        teacher_document_type=a.teacher_document_type,
                        teacher_document_number=a.teacher_document_number,
                        total_beneficiaries=a.total_beneficiaries,
                        professors_count=a.professors_count,
                        administrative_count=a.administrative_count,
                        external_people_count=a.external_people_count,
                        speaker_full_name=a.speaker_full_name,
                        speaker_origin=a.speaker_origin,
                        speaker_company=a.speaker_company,
                        consultancy_entity_name=a.consultancy_entity_name,
                        consultancy_sector_id=a.consultancy_sector_id,
                        consultancy_value=a.consultancy_value,
                        evidence_event_planning=a.evidence_event_planning,
                        evidence_attendance_control=a.evidence_attendance_control,
                        evidence_program_design_guide=a.evidence_program_design_guide,
                        evidence_audiovisual_record=a.evidence_audiovisual_record,
                    )
                    for a in activities
                ]
            )

            breakdown_rows: list[SoftwareActivityBeneficiaryBreakdownModel] = []
            for idx, model in enumerate(created_models):
                for b in breakdowns_by_temp_index.get(idx, []):
                    breakdown_rows.append(
                        SoftwareActivityBeneficiaryBreakdownModel(
                            activity=model,
                            population=b.population,
                            campus=b.campus,
                            program=b.program,
                            level=b.level,
                            count=b.count,
                        )
                    )
            if breakdown_rows:
                SoftwareActivityBeneficiaryBreakdownModel.objects.bulk_create(breakdown_rows)

        return len(activities)

    def list(self, limit: int = 100, offset: int = 0) -> list[SoftwareActivity]:
        qs = SoftwareActivityModel.objects.all().order_by("-id")[offset : offset + limit]
        return [self._to_domain(x) for x in qs]

    def list_with_breakdowns(
        self, limit: int = 100, offset: int = 0
    ) -> list[tuple[SoftwareActivity, list[BeneficiaryBreakdown]]]:
        qs = (
            SoftwareActivityModel.objects.all()
            .prefetch_related("beneficiary_breakdowns")
            .order_by("-id")[offset : offset + limit]
        )
        out: list[tuple[SoftwareActivity, list[BeneficiaryBreakdown]]] = []
        for m in qs:
            activity = self._to_domain(m)
            bds = [
                BeneficiaryBreakdown(
                    id=bd.id,
                    activity_id=m.id,
                    population=bd.population,
                    campus=bd.campus,
                    program=bd.program,
                    level=bd.level,
                    count=bd.count,
                )
                for bd in m.beneficiary_breakdowns.all()
            ]
            out.append((activity, bds))
        return out

    def _to_domain(self, m: SoftwareActivityModel) -> SoftwareActivity:
        return SoftwareActivity(
            id=m.id,
            year=m.year,
            semester=m.semester,
            start_date=m.start_date,
            end_date=m.end_date,
            execution_place=m.execution_place,
            campus=m.campus,
            activity_name=m.activity_name,
            agreement_entity=m.agreement_entity,
            description=m.description,
            cine_isced_name=m.cine_isced_name,
            cine_field_detailed_id=m.cine_field_detailed_id,
            num_hours=m.num_hours,
            activity_type=m.activity_type,
            course_value=m.course_value,
            teacher_document_type=m.teacher_document_type,
            teacher_document_number=m.teacher_document_number,
            total_beneficiaries=m.total_beneficiaries,
            professors_count=m.professors_count,
            administrative_count=m.administrative_count,
            external_people_count=m.external_people_count,
            speaker_full_name=m.speaker_full_name,
            speaker_origin=m.speaker_origin,
            speaker_company=m.speaker_company,
            consultancy_entity_name=m.consultancy_entity_name,
            consultancy_sector_id=m.consultancy_sector_id,
            consultancy_value=m.consultancy_value,
            evidence_event_planning=bool(m.evidence_event_planning),
            evidence_attendance_control=bool(m.evidence_attendance_control),
            evidence_program_design_guide=bool(m.evidence_program_design_guide),
            evidence_audiovisual_record=bool(m.evidence_audiovisual_record),
        )

