class DomainException(Exception):
    code = "DOMAIN_ERROR"
    status_code = 400

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)
