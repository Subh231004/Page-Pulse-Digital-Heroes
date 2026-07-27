from fastapi import status


class AuditError(Exception):
    def __init__(self, code: str, message: str, status_code: int):
        self.code = code
        self.message = message
        self.status_code = status_code


INVALID_URL = AuditError(
    code="INVALID_URL",
    message="The provided URL is malformed or missing.",
    status_code=status.HTTP_400_BAD_REQUEST,
)

UNREACHABLE = AuditError(
    code="UNREACHABLE",
    message="Could not reach the target URL. Check the domain or try again.",
    status_code=status.HTTP_502_BAD_GATEWAY,
)

TIMEOUT = AuditError(
    code="TIMEOUT",
    message="The page took too long to respond.",
    status_code=status.HTTP_504_GATEWAY_TIMEOUT,
)

NON_HTML_RESPONSE = AuditError(
    code="NON_HTML_RESPONSE",
    message="The URL did not return an HTML page.",
    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
)

INTERNAL_ERROR = AuditError(
    code="INTERNAL_ERROR",
    message="An unexpected error occurred while auditing the page.",
    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
)
