from continuing_education_teachers.domain.exceptions.domain_exception import DomainException


class InvalidContinuingEducationTeacherException(DomainException):
    pass


class ContinuingEducationTeacherNotFoundException(DomainException):
    status_code = 404

