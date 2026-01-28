from courses.domain.exceptions.course_exception import InvalidCodeException
from courses.domain.exceptions.course_exception import InvalidNameException
from courses.domain.exceptions.course_exception import InvalidIdCineFieldDetailedException
from courses.domain.exceptions.course_exception import InvalidIsExtensionException
from courses.domain.exceptions.course_exception import InvalidIsActiveException

class Course:
    def __init__(self, id : int | None, code: str, name: str, id_cine_field_detailed: str, is_extension: bool, is_active: bool):
        self.id = id
        self.code = code
        self.name = name
        self.id_cine_field_detailed = id_cine_field_detailed
        self.is_extension = is_extension
        self.is_active = is_active

                               
                               
                                                 
                                       
                                    

    def _validate_code(self):
        if not self.code or len(self.code) != 6:
            raise InvalidCodeException("Invalid code")

    def _validate_name(self):
        if not self.name or len(self.name) < 3:
            raise InvalidNameException("Invalid name")

    def _validate_id_cine_field_detailed(self):
        if not self.id_cine_field_detailed or len(self.id_cine_field_detailed) != 6:
            raise InvalidIdCineFieldDetailedException("Invalid id_cine_field_detailed")

    def _validate_is_extension(self):
        if not self.is_extension:
            raise InvalidIsExtensionException("Invalid is_extension")

    def _validate_is_active(self):
        if not self.is_active:
            raise InvalidIsActiveException("Invalid is_active")