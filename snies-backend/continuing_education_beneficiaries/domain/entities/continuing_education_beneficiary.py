from continuing_education_beneficiaries.domain.exceptions.continuing_education_beneficiary_exception import (
    InvalidContinuingEducationBeneficiaryException,
)


class ContinuingEducationBeneficiary:
    def __init__(
        self,
        id: int | None,
        year: str,
        semester: int,
        course_code: str,
        beneficiary_type_extension_id: int,
        beneficiaries_count: int,
    ):
        self.id = id
        self.year = str(year)
        self.semester = int(semester)
        self.course_code = str(course_code)
        self.beneficiary_type_extension_id = int(beneficiary_type_extension_id)
        self.beneficiaries_count = int(beneficiaries_count)

        self._validate()

    def _validate(self):
        if not (len(self.year) == 4 and self.year.isdigit()):
            raise InvalidContinuingEducationBeneficiaryException("Invalid year")
        if self.semester not in (1, 2):
            raise InvalidContinuingEducationBeneficiaryException("Invalid semester")
        if not self.course_code:
            raise InvalidContinuingEducationBeneficiaryException("Invalid course_code")
        if self.beneficiary_type_extension_id <= 0:
            raise InvalidContinuingEducationBeneficiaryException(
                "Invalid beneficiary_type_extension_id"
            )
        if self.beneficiaries_count < 0:
            raise InvalidContinuingEducationBeneficiaryException(
                "Invalid beneficiaries_count"
            )

