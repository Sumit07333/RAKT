from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

VALID_BLOOD_GROUPS = ("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
VALID_STATUSES = ("Available", "Low Stock", "Critically Low", "Unavailable")


class BloodAvailabilityRecord(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: str
    facility_id: str
    facility_name: str
    city: str
    address: str
    contact_phone: str
    phone: Optional[str] = None
    blood_group: str
    
    # Units can be None (unverified / not provided by authorized facility).
    # Missing units are NEVER defaulted to zero.
    units_available: Optional[int] = None
    availability_status: str
    last_updated: datetime
    
    # Freshness and verification flags
    is_stale: bool = False
    freshness_category: str = "Recently Updated"
    notes: Optional[str] = None

    def model_post_init(self, __context):
        if not self.phone:
            self.phone = self.contact_phone


class BloodAvailabilityListResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    total: int
    records: List[BloodAvailabilityRecord]
