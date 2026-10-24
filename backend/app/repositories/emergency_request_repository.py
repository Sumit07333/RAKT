from typing import Optional, List, Tuple
from sqlalchemy import select, func
from sqlalchemy.orm import Session, joinedload, selectinload
from app.models.emergency_request import EmergencyRequest, RequestTimelineEvent


class EmergencyRequestRepository:
    """Repository handling database operations for EmergencyRequest entities."""

    @staticmethod
    def create_request(
        db: Session,
        request_obj: EmergencyRequest,
        initial_event: Optional[RequestTimelineEvent] = None
    ) -> EmergencyRequest:
        db.add(request_obj)
        if initial_event:
            db.add(initial_event)
        db.commit()
        db.refresh(request_obj)
        return request_obj

    @staticmethod
    def get_by_tracking_reference(db: Session, reference: str) -> Optional[EmergencyRequest]:
        clean_ref = reference.strip().upper()
        # Accept either RN-XXXXXX or RN-DEMO-XXXXXX transparently
        variants = [clean_ref]
        if clean_ref.startswith("RN-DEMO-"):
            variants.append(clean_ref.replace("RN-DEMO-", "RN-"))
        elif clean_ref.startswith("RN-"):
            variants.append(clean_ref.replace("RN-", "RN-DEMO-"))

        return db.scalar(
            select(EmergencyRequest)
            .options(
                joinedload(EmergencyRequest.preferred_facility),
                selectinload(EmergencyRequest.timeline_events)
            )
            .where(EmergencyRequest.tracking_reference.in_(variants))
        )

    @staticmethod
    def get_by_id(db: Session, request_id: str) -> Optional[EmergencyRequest]:
        return db.scalar(
            select(EmergencyRequest)
            .options(
                joinedload(EmergencyRequest.preferred_facility),
                selectinload(EmergencyRequest.timeline_events)
            )
            .where(EmergencyRequest.id == request_id)
        )

    @staticmethod
    def list_requests(
        db: Session,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Tuple[List[EmergencyRequest], int]:
        stmt = (
            select(EmergencyRequest)
            .options(
                joinedload(EmergencyRequest.preferred_facility),
                selectinload(EmergencyRequest.timeline_events)
            )
        )
        count_stmt = select(func.count()).select_from(EmergencyRequest)

        if status and status.strip() and status.strip().lower() != "all":
            clean_status = status.strip()
            stmt = stmt.where(EmergencyRequest.status.ilike(clean_status))
            count_stmt = count_stmt.where(EmergencyRequest.status.ilike(clean_status))

        total = db.scalar(count_stmt) or 0
        records = db.scalars(
            stmt.order_by(EmergencyRequest.created_at.desc())
            .offset(offset)
            .limit(limit)
        ).unique().all()

        return list(records), total

    @staticmethod
    def update_request_status(
        db: Session,
        request_obj: EmergencyRequest,
        new_status: str,
        note: Optional[str] = None
    ) -> EmergencyRequest:
        request_obj.status = new_status
        timeline_event = RequestTimelineEvent(
            status=new_status,
            description=note.strip() if note and note.strip() else f"Status updated to {new_status} by coordinator."
        )
        request_obj.timeline_events.append(timeline_event)
        db.commit()
        db.refresh(request_obj)
        return request_obj
