from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class FacilityBase(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: str
    name: str
    category: str
    address: str
    city: str
    state: str
    pincode: str
    contact_phone: str
    phone: Optional[str] = None
    helpline_email: Optional[str] = None
    email: Optional[str] = None
    operating_hours: str = "24/7 Emergency Service"
    description: Optional[str] = None
    is_active: bool = True
    is_demo_record: bool = False
    created_at: datetime
    updated_at: datetime

    def model_post_init(self, __context):
        if not self.phone:
            self.phone = self.contact_phone
        if not self.email and self.helpline_email:
            self.email = self.helpline_email


class FacilityListResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    total: int
    records: List[FacilityBase]


class FacilityInventoryItem(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)

    id: str
    blood_group: str
    units_available: Optional[int] = None
    availability_status: str
    last_updated: datetime
    is_stale: bool = False
    freshness_category: str = "Recently Updated"
    notes: Optional[str] = None


class FacilityDetailData(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    facility: FacilityBase
    inventory: List[FacilityInventoryItem]
