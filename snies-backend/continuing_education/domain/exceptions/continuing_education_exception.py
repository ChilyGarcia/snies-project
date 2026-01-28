from continuing_education.domain.exceptions.domain_exception import DomainException

class InvalidYearException(DomainException):
    pass

class InvalidSemesterException(DomainException):
    pass

class InvalidNumHoursException(DomainException):
    pass

class InvalidIdCourseException(DomainException):
    pass

class InvalidValueException(DomainException):
    pass


class CourseNotFoundException(DomainException):
    code = "COURSE_NOT_FOUND"
    status_code = 404