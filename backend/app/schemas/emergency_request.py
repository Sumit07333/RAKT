import re
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.alias_generators import to_camel
from app.schemas.blood_availability import VALID_BLOOD_GROUPS

VALID_URGENCY_LEVELS = ("Normal", "Urgent", "Immediate / Critical", "Emergency")


def mask_phone_number(phone: str) -> str:
    """
    Mask contact phone number for privacy protection in public tracking endpoints.
    e.g. '+91 98765 43210' -> '+91 98*** ***10'
    """
    cleaned = phone.strip()
    digits = re.sub(r"\D", "", cleaned)
    if len(digits) < 4:
        return "****"
    # Show first 2 digits and last 2 digits, mask the interior
    visible_prefix = digits[:2]
    visible_suffix = digits[-2:]
    return f"+91 {visible_prefix}*** ***{visible_suffix}" if cleaned.startswith("+91") else f"{visible_prefix}*** ***{visible_suffix}"


def mask_requester_name(name: str) -> str:
    """
    Mask personal requester name for public tracking.
    e.g. 'Rajesh Sharma' -> 'Rajesh S***'
    """
    parts = name.strip().split()
    if not parts:
        return "Requester"
    if len(parts) == 1:
        first = parts[0]
        return f"{first[0]}***" if len(first) > 1 else first
    return f"{parts[0]} {parts[-1][0]}***"


class EmergencyRequestCreate(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    requester_name: str = Field(..., min_length=2, max_length=100)
    contact_phone: str = Field(..., min_length=7, max_length=30)
    city: str = Field(..., min_length=2, max_length=100)
    blood_group: str
    units_required: int = Field(1, ge=1, le=50)
    facility_preference_id: Optional[str] = None
    urgency_level: str = "Urgent"
    additional_notes: Optional[str] = Field(None, max_length=500)

    @field_validator("blood_group")
    @classmethod
    def validate_blood_group(cls, v: str) -> str:
        clean = v.strip().upper()
        if clean not in VALID_BLOOD_GROUPS:
            raise ValueError(f"Invalid blood group '{v}'. Must be one of {', '.join(VALID_BLOOD_GROUPS)}")
        return clean

    @field_validator("contact_phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        clean = v.strip()
        digits = re.sub(r"\D", "", clean)
        if len(digits) < 7 or len(digits) > 15:
            raise ValueError("Contact phone number must contain between 7 and 15 digits.")
        return clean

    @field_validator("urgency_level")
    @classmethod
    def validate_urgency(cls, v: str) -> str:
        clean = v.strip()
        # Accept case-tolerant match
        matched = next((u for u in VALID_URGENCY_LEVELS if u.lower() == clean.lower()), None)
        if not matched:
            raise ValueError(f"Invalid urgency level '{v}'. Allowed: {', '.join(VALID_URGENCY_LEVELS)}")
        return matched


class EmergencyRequestCreatedData(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    tracking_reference: str
    request_code: str
    status: str
    created_at: datetime
    message: str


class TimelineEventResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    status: str
    description: str
    timestamp: datetime


class EmergencyRequestPublicTrackData(BaseModel):
    """
    Publicly visible tracking status.
    Personal identification information is strictly masked to prevent unauthorized PII exposure.
    """
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    tracking_reference: str
    request_code: str
    blood_group: str
    units_required: int
    city: str
    urgency_level: str
    status: str
    created_at: datetime
    updated_at: datetime
    facility_preference_id: Optional[str] = None
    facility_name: Optional[str] = None
    
    # Masked PII fields for public protection
    requester_name: str
    contact_phone: str
    additional_notes: Optional[str] = None
    
    timeline: List[TimelineEventResponse]

