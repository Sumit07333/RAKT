import logging
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.emergency_request import (
    EmergencyRequest,
    RequestTimelineEvent,
    generate_tracking_reference
)
from app.repositories.emergency_request_repository import EmergencyRequestRepository
from app.repositories.facility_repository import FacilityRepository
from app.schemas.emergency_request import (
    EmergencyRequestCreate,
    EmergencyRequestCreatedData,
    EmergencyRequestPublicTrackData,
    TimelineEventResponse,
    mask_phone_number,
    mask_requester_name
)

logger = logging.getLogger("raktnavi.emergency_request")


class EmergencyRequestService:
    @staticmethod
    def create_emergency_request(
        db: Session,
        payload: EmergencyRequestCreate
    ) -> EmergencyRequestCreatedData:
        # Validate preferred facility if specified
        facility_name = None
        if payload.facility_preference_id:
            facility = FacilityRepository.get_by_id(db, payload.facility_preference_id)
            if not facility:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Preferred facility ID '{payload.facility_preference_id}' is invalid or does not exist."
                )
            facility_name = facility.name

        # Generate unique, non-sequential tracking reference
        tracking_ref = generate_tracking_reference()

        # Build request model
        request_obj = EmergencyRequest(
            tracking_reference=tracking_ref,
            requester_name=payload.requester_name.strip(),
            contact_phone=payload.contact_phone.strip(),
            city=payload.city.strip(),
            blood_group=payload.blood_group,
            units_required=payload.units_required,
            urgency_level=payload.urgency_level,
            status="Pending",
            additional_notes=payload.additional_notes.strip() if payload.additional_notes else None,
            facility_preference_id=payload.facility_preference_id
        )

        initial_timeline = RequestTimelineEvent(
            status="Pending",
            description="Emergency request registered into RaktNavi coordination queue."
        )
        request_obj.timeline_events.append(initial_timeline)

        persisted = EmergencyRequestRepository.create_request(db, request_obj)

        # Logging without exposing sensitive PII (never log requester name or phone)
        logger.info(
            "Registered emergency request %s (blood_group=%s, units=%d, city=%s, urgency=%s)",
            persisted.tracking_reference,
            persisted.blood_group,
            persisted.units_required,
            persisted.city,
            persisted.urgency_level
        )

        return EmergencyRequestCreatedData(
            id=persisted.id,
            tracking_reference=persisted.tracking_reference,
            request_code=persisted.tracking_reference,
            status=persisted.status,
            created_at=persisted.created_at,
            message="Emergency request registered successfully into the coordination queue."
        )

    @staticmethod
    def get_public_tracking_status(
        db: Session,
        tracking_reference: str
    ) -> EmergencyRequestPublicTrackData:
        req = EmergencyRequestRepository.get_by_tracking_reference(db, tracking_reference)
        if not req:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No emergency request found matching reference code '{tracking_reference}'."
            )

        facility_name = req.preferred_facility.name if req.preferred_facility else None

        timeline_responses = [
            TimelineEventResponse(
                status=event.status,
                description=event.description,
                timestamp=event.event_timestamp
            )
            for event in req.timeline_events
        ]

        # Security/Privacy Protection: Requester PII is strictly masked for public tracking
        return EmergencyRequestPublicTrackData(
            tracking_reference=req.tracking_reference,
            request_code=req.tracking_reference,
            blood_group=req.blood_group,
            units_required=req.units_required,
            city=req.city,
            urgency_level=req.urgency_level,
            status=req.status,
            created_at=req.created_at,
            updated_at=req.updated_at,
            facility_preference_id=req.facility_preference_id,
            facility_name=facility_name,
            requester_name=mask_requester_name(req.requester_name),
            contact_phone=mask_phone_number(req.contact_phone),
            additional_notes=req.additional_notes,
            timeline=timeline_responses
        )
