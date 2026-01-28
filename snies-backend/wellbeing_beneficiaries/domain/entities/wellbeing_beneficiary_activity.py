class WellbeingBeneficiaryActivity:
    def __init__(
        self,
        id: int | None,
        year: str,
        semester: int,
        organization_unit_code: str,
        activity_code: str,
        beneficiary_type_id: int,
        beneficiaries_count: int,
    ):
        self.id = id
        self.year = year
        self.semester = semester
        self.organization_unit_code = organization_unit_code
        self.activity_code = activity_code
        self.beneficiary_type_id = beneficiary_type_id
        self.beneficiaries_count = beneficiaries_count

