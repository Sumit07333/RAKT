from typing import List, Optional, Tuple
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from app.models.facility import Facility


class FacilityRepository:
    """Repository handling database operations for Facility entities."""

    @staticmethod
    def get_by_id(db: Session, facility_id: str) -> Optional[Facility]:
        return db.scalar(
            select(Facility).where(Facility.id == facility_id)
        )

    @staticmethod
    def list_facilities(
        db: Session,
        city: Optional[str] = None,
        is_active: Optional[bool] = True,
        limit: int = 50,
        offset: int = 0
    ) -> Tuple[List[Facility], int]:
        stmt = select(Facility)
        count_stmt = select(func.count()).select_from(Facility)

        if is_active is not None:
            stmt = stmt.where(Facility.is_active == is_active)
            count_stmt = count_stmt.where(Facility.is_active == is_active)

        if city and city.strip():
            city_query = f"%{city.strip()}%"
            stmt = stmt.where(Facility.city.ilike(city_query))
            count_stmt = count_stmt.where(Facility.city.ilike(city_query))

        total = db.scalar(count_stmt) or 0
        records = db.scalars(stmt.order_by(Facility.name.asc()).offset(offset).limit(limit)).all()
        return list(records), total
