from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from decimal import Decimal


@dataclass(frozen=True)
class SoftwareActivity:
    id: int | None
    year: int
    semester: int
    start_date: date | None
    end_date: date | None
    execution_place: str
    campus: str
    activity_name: str
    agreement_entity: str | None
    description: str | None
    cine_isced_name: str | None
    cine_field_detailed_id: str | None
    num_hours: int | None
    activity_type: str | None
    course_value: Decimal | None
    teacher_document_type: str | None
    teacher_document_number: str | None
    total_beneficiaries: int | None
    professors_count: int | None
    administrative_count: int | None
    external_people_count: int | None
    speaker_full_name: str | None
    speaker_origin: str | None
    speaker_company: str | None
    consultancy_entity_name: str | None
    consultancy_sector_id: str | None
    consultancy_value: Decimal | None
    evidence_event_planning: bool
    evidence_attendance_control: bool
    evidence_program_design_guide: bool
    evidence_audiovisual_record: bool


@dataclass(frozen=True)
class BeneficiaryBreakdown:
    id: int | None
    activity_id: int | None
    population: str  # students|graduates
    campus: str  # CÚCUTA|OCAÑA
    program: str
    level: str  # técnico|tecnólogo|profesional
    count: int

