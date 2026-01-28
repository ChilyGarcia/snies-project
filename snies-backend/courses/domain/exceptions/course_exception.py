from .domain_exception import DomainException

class InvalidCodeException(DomainException):
    pass


class InvalidNameException(DomainException):
    pass


class InvalidIdCineFieldDetailedException(DomainException):
    pass


class InvalidIsExtensionException(DomainException):
    pass


class InvalidIsActiveException(DomainException):
    pass
