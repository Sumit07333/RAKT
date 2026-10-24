from typing import List, Optional, Tuple
from sqlalchemy import select, func
from sqlalchemy.orm import Session, joinedload
from app.models.blood_availability import BloodAvailability
from app.models.facility import Facility


class BloodAvailabilityRepository:
    """Repository handling database operations for BloodAvailability entities."""

    @staticmethod
    def get_by_id(db: Session, record_id: str) -> Optional[BloodAvailability]:
        return db.scalar(
            select(BloodAvailability)
            .options(joinedload(BloodAvailability.facility))
            .where(BloodAvailability.id == record_id)
        )

    @staticmethod
    def get_by_facility_id(db: Session, facility_id: str) -> List[BloodAvailability]:
        return list(
            db.scalars(
                select(BloodAvailability)
                .where(BloodAvailability.facility_id == facility_id)
                .order_by(BloodAvailability.blood_group.asc())
            ).all()
        )

    @staticmethod
    def filter_availability(
        db: Session,
        blood_group: Optional[str] = None,
        city: Optional[str] = None,
        status: Optional[str] = None,
        active_facilities_only: bool = True,
        limit: int = 50,
        offset: int = 0
    ) -> Tuple[List[BloodAvailability], int]:
        stmt = (
            select(BloodAvailability)
            .join(Facility, BloodAvailability.facility_id == Facility.id)
            .options(joinedload(BloodAvailability.facility))
        )
        count_stmt = (
            select(func.count())
            .select_from(BloodAvailability)
            .join(Facility, BloodAvailability.facility_id == Facility.id)
        )

        if active_facilities_only:
            stmt = stmt.where(Facility.is_active.is_(True))
            count_stmt = count_stmt.where(Facility.is_active.is_(True))

        if blood_group and blood_group.strip() and blood_group.strip().lower() != "all":
            clean_bg = blood_group.strip().upper()
            stmt = stmt.where(BloodAvailability.blood_group == clean_bg)
            count_stmt = count_stmt.where(BloodAvailability.blood_group == clean_bg)

        if city and city.strip():
            city_query = f"%{city.strip()}%"
            stmt = stmt.where(Facility.city.ilike(city_query))
            count_stmt = count_stmt.where(Facility.city.ilike(city_query))

        if status and status.strip() and status.strip().lower() not in ("all", "all statuses"):
            clean_status = status.strip()
            stmt = stmt.where(BloodAvailability.availability_status.ilike(clean_status))
            count_stmt = count_stmt.where(BloodAvailability.availability_status.ilike(clean_status))

        total = db.scalar(count_stmt) or 0
        records = db.scalars(
            stmt.order_by(
                BloodAvailability.last_updated.desc(),
                BloodAvailability.blood_group.asc()
            )
            .offset(offset)
            .limit(limit)
        ).all()

        return list(records), total

    @staticmethod
    def get_by_facility_and_blood_group(
        db: Session, facility_id: str, blood_group: str
    ) -> Optional[BloodAvailability]:
        return db.scalar(
            select(BloodAvailability)
            .options(joinedload(BloodAvailability.facility))
            .where(
                BloodAvailability.facility_id == facility_id,
                BloodAvailability.blood_group == blood_group.strip().upper()
            )
        )

    @staticmethod
    def update_stock(
        db: Session,
        record: BloodAvailability,
        units_available: Optional[int],
        availability_status: Optional[str] = None,
        notes: Optional[str] = None
    ) -> BloodAvailability:
        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)
        if units_available is not None:
            record.units_available = units_available
        if availability_status:
            record.availability_status = availability_status
        if notes:
            record.verification_notes = notes
        record.last_updated = now
        record.freshness_category = "Recently Updated"
        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def create_record(
        db: Session,
        record: BloodAvailability
    ) -> BloodAvailability:
        db.add(record)
        db.commit()
        db.refresh(record)
        return record
