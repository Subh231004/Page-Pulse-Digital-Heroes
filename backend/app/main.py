import os

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .audit import fetch_page, analyze_html
from .errors import AuditError, INTERNAL_ERROR, INVALID_URL
from .schemas import AuditRequest, AuditReport, ErrorResponse, ErrorDetail

app = FastAPI(title="Page Pulse API")

origins = [o.strip() for o in os.getenv("FRONTEND_URL", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=INVALID_URL.status_code,
        content=ErrorResponse(
            error=ErrorDetail(code=INVALID_URL.code, message=INVALID_URL.message)
        ).model_dump(),
    )


@app.exception_handler(AuditError)
async def audit_error_handler(request: Request, exc: AuditError):
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(error=ErrorDetail(code=exc.code, message=exc.message)).model_dump(),
    )


@app.exception_handler(Exception)
async def generic_error_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=INTERNAL_ERROR.status_code,
        content=ErrorResponse(
            error=ErrorDetail(code=INTERNAL_ERROR.code, message=INTERNAL_ERROR.message)
        ).model_dump(),
    )


@app.post("/api/audit", response_model=AuditReport)
async def audit(request: AuditRequest):
    url = str(request.url)
    html, status, elapsed_ms = await fetch_page(url)
    report = analyze_html(html, url, status, elapsed_ms)
    return AuditReport(**report)
