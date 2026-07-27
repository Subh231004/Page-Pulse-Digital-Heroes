from pydantic import BaseModel, HttpUrl


class AuditRequest(BaseModel):
    url: HttpUrl


class AuditReport(BaseModel):
    url: str
    status: int
    response_time_ms: int
    title: str | None
    meta_description: str | None
    h1_count: int
    h2_count: int
    h3_count: int
    total_images: int
    images_missing_alt: int
    link_count: int
    paragraph_count: int
    list_count: int
    word_count: int
    has_meta_viewport: bool
    has_canonical: bool
    og_title: str | None
    og_description: str | None
    og_image: str | None


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorDetail
