from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy.orm import Session
from app.config import settings
from app.repositories.blood_availability_repository import BloodAvailabilityRepository
from app.schemas.blood_availability import (
    BloodAvailabilityRecord,
    BloodAvailabilityListResponse
)


class BloodAvailabilityService:
    @staticmethod
    def filter_availability(
        db: Session,
        blood_group: Optional[str] = None,
        city: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> BloodAvailabilityListResponse:
        records, total = BloodAvailabilityRepository.filter_availability(
            db=db,
            blood_group=blood_group,
            city=city,
            status=status,
            active_facilities_only=True,
            limit=limit,
            offset=offset
        )

        now = datetime.now(timezone.utc)
        stale_threshold_seconds = settings.STALE_THRESHOLD_HOURS * 3600
        result_records: List[BloodAvailabilityRecord] = []

        for rec in records:
            facility = rec.facility
            rec_last_updated = rec.last_updated
            if rec_last_updated.tzinfo is None:
                rec_last_updated = rec_last_updated.replace(tzinfo=timezone.utc)

            age_seconds = (now - rec_last_updated).total_seconds()
            is_stale = age_seconds > stale_threshold_seconds

            freshness = "Stale (Needs Reconfirmation)" if is_stale else rec.freshness_category

            result_records.append(
                BloodAvailabilityRecord(
                    id=rec.id,
                    facility_id=rec.facility_id,
                    facility_name=facility.name if facility else "Unknown Facility",
                    city=facility.city if facility else "Unknown City",
                    address=facility.address if facility else "",
                    contact_phone=facility.contact_phone if facility else "",
                    phone=facility.contact_phone if facility else "",
                    blood_group=rec.blood_group,
                    units_available=rec.units_available,  # Preserves None; NEVER converted to zero
                    availability_status=rec.availability_status,
                    last_updated=rec.last_updated,
                    is_stale=is_stale,
                    freshness_category=freshness,
                    notes=rec.verification_notes
                )
            )

        return BloodAvailabilityListResponse(
            total=total,
            records=result_records
        )
