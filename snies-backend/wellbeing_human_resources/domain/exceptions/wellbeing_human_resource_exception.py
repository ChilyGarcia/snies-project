from wellbeing_human_resources.domain.exceptions.domain_exception import DomainException


class InvalidWellbeingHumanResourceException(DomainException):
    pass


class WellbeingHumanResourceNotFoundException(DomainException):
    status_code = 404

