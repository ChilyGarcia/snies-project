from continuing_education_beneficiaries.domain.exceptions.domain_exception import DomainException


class InvalidContinuingEducationBeneficiaryException(DomainException):
    pass


class ContinuingEducationBeneficiaryNotFoundException(DomainException):
    status_code = 404

