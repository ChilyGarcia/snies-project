class DomainException(Exception):
    status_code = 400

    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

