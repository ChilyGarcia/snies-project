from continuing_education.domain.exceptions.continuing_education_exception import InvalidYearException, InvalidSemesterException, InvalidNumHoursException, InvalidIdCourseException, InvalidValueException

class ContinuingEducation:
    def __init__(self, id: int | None, year: str, semester: int, num_hours: int, id_course: int, value: int):
        self.id = id
        self.year = year
        self.semester = semester
        self.num_hours = num_hours
        self.id_course = id_course
        self.value = value

        self._validate_year()
        self._validate_semester()
        self._validate_num_hours()
        self._validate_id_course()
        self._validate_value()

    def _validate_year(self):
        if not self.year or len(self.year) != 4:
            raise InvalidYearException("Invalid year")

    def _validate_semester(self):
        if not self.semester or self.semester not in [1, 2]:
            raise InvalidSemesterException("Invalid semester")

    def _validate_num_hours(self):
        if not self.num_hours or self.num_hours < 0:
            raise InvalidNumHoursException("Invalid num_hours")

    def _validate_id_course(self):
        if not self.id_course or self.id_course < 0:
            raise InvalidIdCourseException("Invalid id_course")

    def _validate_value(self):
        if not self.value or self.value < 0:
            raise InvalidValueException("Invalid value")