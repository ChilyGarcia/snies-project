from .domain_exception import DomainException


class InvalidUserException(DomainException):
    pass


class UserNotFoundException(DomainException):
    pass
