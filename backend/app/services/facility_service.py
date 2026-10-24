from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.config import settings
from app.repositories.facility_repository import FacilityRepository
from app.repositories.blood_availability_repository import BloodAvailabilityRepository
from app.schemas.facility import (
    FacilityBase,
    FacilityListResponse,
    FacilityDetailData,
    FacilityInventoryItem
)


class FacilityService:
    @staticmethod
    def list_facilities(
        db: Session,
        city: Optional[str] = None,
        is_active: Optional[bool] = True,
        limit: int = 50,
        offset: int = 0
    ) -> FacilityListResponse:
        facilities, total = FacilityRepository.list_facilities(
            db=db,
            city=city,
            is_active=is_active,
            limit=limit,
            offset=offset
        )
        return FacilityListResponse(
            total=total,
            records=[FacilityBase.model_validate(f) for f in facilities]
        )

    @staticmethod
    def get_facility_detail(db: Session, facility_id: str) -> FacilityDetailData:
        facility = FacilityRepository.get_by_id(db, facility_id)
        if not facility:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Facility with ID '{facility_id}' not found."
            )

        now = datetime.now(timezone.utc)
        stale_threshold_seconds = settings.STALE_THRESHOLD_HOURS * 3600

        inventory_records = BloodAvailabilityRepository.get_by_facility_id(db, facility_id)
        inventory_items: List[FacilityInventoryItem] = []

        for item in inventory_records:
            item_last_updated = item.last_updated
            if item_last_updated.tzinfo is None:
                item_last_updated = item_last_updated.replace(tzinfo=timezone.utc)

            age_seconds = (now - item_last_updated).total_seconds()
            is_stale = age_seconds > stale_threshold_seconds
            freshness = "Stale (Needs Reconfirmation)" if is_stale else item.freshness_category

            inventory_items.append(
                FacilityInventoryItem(
                    id=item.id,
                    blood_group=item.blood_group,
                    units_available=item.units_available,  # Strictly None if missing; never 0
                    availability_status=item.availability_status,
                    last_updated=item.last_updated,
                    is_stale=is_stale,
                    freshness_category=freshness,
                    notes=item.verification_notes
                )
            )

        return FacilityDetailData(
            facility=FacilityBase.model_validate(facility),
            inventory=inventory_items
        )
