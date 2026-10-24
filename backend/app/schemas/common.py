from datetime import datetime
from typing import Any, Optional, Generic, TypeVar
from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None


class StandardErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail


class StandardResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T


class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime
    database: str
    version: str = "1.0.0"
