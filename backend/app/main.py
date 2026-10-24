import logging
import sys
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy import text
from app.config import settings
from app.database import engine
from app.schemas.common import HealthResponse, StandardErrorResponse, ErrorDetail
from app.api.v1.router import api_v1_router

# Configure safe structured logging
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("raktnavi.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing %s in %s environment", settings.APP_NAME, settings.APP_ENV)
    try:
        from app.database import engine, Base
        from app.models import Facility, BloodAvailability, EmergencyRequest, RequestTimelineEvent
        Base.metadata.create_all(bind=engine)
        logger.info("Database schema initialized successfully.")
    except Exception as e:
        logger.warning("Auto-create tables skipped: %s", e)
    yield
    logger.info("Shutting down %s", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="RaktNavi — Cloud-Based Blood Availability & Emergency Request Management Backend API",
    lifespan=lifespan
)

# CORS Configuration: Strictly bounded to allowed origins from environment
# Never allows wildcard ('*') with credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"],
)


# Request Payload Size Limiter Middleware
@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > settings.MAX_REQUEST_BODY_BYTES:
                return JSONResponse(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    content={
                        "success": False,
                        "error": {
                            "code": "PAYLOAD_TOO_LARGE",
                            "message": f"Request body exceeds maximum allowed size of {settings.MAX_REQUEST_BODY_BYTES} bytes.",
                            "details": None
                        }
                    }
                )
        except ValueError:
            pass
    return await call_next(request)


# Standardized Error Handling
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    code_map = {
        400: "BAD_REQUEST",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        404: "NOT_FOUND",
        409: "CONFLICT",
        413: "PAYLOAD_TOO_LARGE",
        422: "VALIDATION_ERROR",
        500: "INTERNAL_SERVER_ERROR"
    }
    error_code = code_map.get(exc.status_code, "API_ERROR")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": error_code,
                "message": exc.detail if isinstance(exc.detail, str) else "An error occurred.",
                "details": exc.detail if not isinstance(exc.detail, str) else None
            }
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    formatted_errors = []
    for error in exc.errors():
        field_loc = " -> ".join(str(loc) for loc in error.get("loc", []))
        formatted_errors.append({
            "field": field_loc,
            "message": error.get("msg")
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Input validation failed. Please check field requirements.",
                "details": formatted_errors
            }
        }
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled server exception: %s", exc, exc_info=settings.DEBUG)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An internal server error occurred. Please contact system administrator.",
                "details": None
            }
        }
    )


# Health check endpoint
@app.get("/health", response_model=HealthResponse, tags=["System Health"])
def health_check():
    """
    Application health and database connectivity verification.
    """
    db_status = "connected"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1;"))
    except Exception as e:
        logger.warning("Database connectivity check failed during /health: %s", e)
        db_status = "unreachable"

    return HealthResponse(
        status="healthy" if db_status == "connected" else "degraded",
        service="raktnavi-api",
        timestamp=datetime.now(timezone.utc),
        database=db_status,
        version="1.0.0"
    )


# Mount versioned API routes
app.include_router(api_v1_router)
