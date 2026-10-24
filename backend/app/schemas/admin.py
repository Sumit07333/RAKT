from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel
from app.schemas.emergency_request import TimelineEventResponse
from app.schemas.blood_availability import BloodAvailabilityRecord


class AdminRequestRecord(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    request_code: str
    requester_name: str
    contact_phone: str
    city: str
    blood_group: str
    units_required: int
    urgency_level: str
    status: str
    additional_notes: Optional[str] = None
    facility_preference_id: Optional[str] = None
    facility_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    timeline: List[TimelineEventResponse] = []


class AdminRequestListResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    total: int
    records: List[AdminRequestRecord]


class AdminUpdateRequestPayload(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    status: str
    note: Optional[str] = None


class AdminInventoryUpdatePayload(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    facility_id: Optional[str] = None
    blood_group: Optional[str] = None
    units_available: Optional[int] = Field(None, ge=0, le=1000)
    availability_status: Optional[str] = None
    notes: Optional[str] = None
