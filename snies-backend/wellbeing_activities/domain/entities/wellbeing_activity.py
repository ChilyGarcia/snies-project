from datetime import date
from decimal import Decimal


class WellbeingActivity:
    def __init__(
        self,
        id: int | None,
        year: str,
        semester: int,
        organization_unit_code: str,
        activity_code: str,
        activity_description: str,
        wellbeing_activity_type_id: int,
        start_date: date,
        end_date: date,
        national_source_id: int,
        national_funding_value: Decimal,
        funding_country_id: int,
        international_source_entity_name: str | None,
        international_funding_value: Decimal | None,
    ):
        self.id = id
        self.year = year
        self.semester = semester
        self.organization_unit_code = organization_unit_code
        self.activity_code = activity_code
        self.activity_description = activity_description
        self.wellbeing_activity_type_id = wellbeing_activity_type_id
        self.start_date = start_date
        self.end_date = end_date
        self.national_source_id = national_source_id
        self.national_funding_value = national_funding_value
        self.funding_country_id = funding_country_id
        self.international_source_entity_name = international_source_entity_name
        self.international_funding_value = international_funding_value

