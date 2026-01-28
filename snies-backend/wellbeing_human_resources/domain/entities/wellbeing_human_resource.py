from wellbeing_human_resources.domain.exceptions.wellbeing_human_resource_exception import (
    InvalidWellbeingHumanResourceException,
)


class WellbeingHumanResource:
    def __init__(
        self,
        id: int | None,
        year: str,
        semester: int,
        activity_code: str,
        organization_unit_code: str,
        document_type_id: int,
        document_number: str,
        dedication: str,
    ):
        self.id = id
        self.year = str(year)
        self.semester = int(semester)
        self.activity_code = str(activity_code)
        self.organization_unit_code = str(organization_unit_code)
        self.document_type_id = int(document_type_id)
        self.document_number = str(document_number)
        self.dedication = str(dedication)

        self._validate()

    def _validate(self):
        if not (len(self.year) == 4 and self.year.isdigit()):
            raise InvalidWellbeingHumanResourceException("Invalid year")
        if self.semester not in (1, 2):
            raise InvalidWellbeingHumanResourceException("Invalid semester")
        if not self.activity_code:
            raise InvalidWellbeingHumanResourceException("Invalid activity_code")
        if not self.organization_unit_code:
            raise InvalidWellbeingHumanResourceException("Invalid organization_unit_code")
        if self.document_type_id <= 0:
            raise InvalidWellbeingHumanResourceException("Invalid document_type_id")
        if not self.document_number:
            raise InvalidWellbeingHumanResourceException("Invalid document_number")
        if not self.dedication:
            raise InvalidWellbeingHumanResourceException("Invalid dedication")

