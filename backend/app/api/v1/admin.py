import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, Path, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.blood_availability import BloodAvailability
from app.models.emergency_request import EmergencyRequest
from app.models.facility import Facility
from app.repositories.emergency_request_repository import EmergencyRequestRepository
from app.repositories.blood_availability_repository import BloodAvailabilityRepository
from app.repositories.facility_repository import FacilityRepository
from app.schemas.common import StandardResponse
from app.schemas.emergency_request import TimelineEventResponse
from app.schemas.blood_availability import BloodAvailabilityRecord
from app.schemas.admin import (
    AdminRequestRecord,
    AdminRequestListResponse,
    AdminUpdateRequestPayload,
    AdminInventoryUpdatePayload
)

router = APIRouter(prefix="/admin", tags=["Operator / Admin"])


def _map_request(req: EmergencyRequest) -> AdminRequestRecord:
    facility = req.preferred_facility
    timeline = [
        TimelineEventResponse(
            status=ev.status,
            description=ev.description,
            timestamp=ev.event_timestamp
        )
        for ev in req.timeline_events
    ]
    return AdminRequestRecord(
        id=req.id,
        request_code=req.tracking_reference,
        requester_name=req.requester_name,
        contact_phone=req.contact_phone,
        city=req.city,
        blood_group=req.blood_group,
        units_required=req.units_required,
        urgency_level=req.urgency_level,
        status=req.status,
        additional_notes=req.additional_notes,
        facility_preference_id=req.facility_preference_id,
        facility_name=facility.name if facility else "No specific facility selected",
        created_at=req.created_at,
        updated_at=req.updated_at,
        timeline=timeline
    )


def _map_inventory(rec: BloodAvailability) -> BloodAvailabilityRecord:
    fac = rec.facility
    return BloodAvailabilityRecord(
        id=rec.id,
        facility_id=rec.facility_id,
        facility_name=fac.name if fac else "Unknown Facility",
        city=fac.city if fac else "Unknown City",
        address=fac.address if fac else "",
        contact_phone=fac.contact_phone if fac else "",
        phone=fac.contact_phone if fac else "",
        blood_group=rec.blood_group,
        units_available=rec.units_available,
        availability_status=rec.availability_status,
        last_updated=rec.last_updated,
        is_stale=False,
        freshness_category=rec.freshness_category or "Recently Updated",
        notes=rec.verification_notes
    )


@router.get("/requests", response_model=StandardResponse[AdminRequestListResponse])
def list_admin_requests(
    status: Optional[str] = Query(None, description="Filter requests by status"),
    limit: int = Query(100, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """
    List all emergency requests for operator coordination queue.
    Includes full contact details and unmasked requester names for hospital coordinators.
    """
    records, total = EmergencyRequestRepository.list_requests(
        db=db,
        status=status,
        limit=limit,
        offset=offset
    )
    mapped = [_map_request(r) for r in records]
    return StandardResponse(data=AdminRequestListResponse(total=total, records=mapped))


@router.patch("/requests/{request_id}", response_model=StandardResponse[AdminRequestRecord])
def update_request_status(
    request_id: str = Path(..., description="Unique request ID"),
    payload: AdminUpdateRequestPayload = ...,
    db: Session = Depends(get_db)
):
    """
    Update the coordination status of an emergency blood request.
    Appends an immutable timeline event to the audit trail.
    """
    req = EmergencyRequestRepository.get_by_id(db, request_id)
    if not req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Emergency request with ID '{request_id}' not found."
        )

    updated_req = EmergencyRequestRepository.update_request_status(
        db=db,
        request_obj=req,
        new_status=payload.status,
        note=payload.note
    )
    return StandardResponse(data=_map_request(updated_req))


@router.patch("/inventory/{inventory_id}", response_model=StandardResponse[BloodAvailabilityRecord])
def update_inventory_record(
    inventory_id: str = Path(..., description="Unique inventory record ID"),
    payload: AdminInventoryUpdatePayload = ...,
    db: Session = Depends(get_db)
):
    """
    Update blood units and availability status for a specific inventory record.
    Refreshes the timestamp to ensure freshness compliance.
    """
    record = BloodAvailabilityRepository.get_by_id(db, inventory_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blood inventory record with ID '{inventory_id}' not found."
        )

    updated = BloodAvailabilityRepository.update_stock(
        db=db,
        record=record,
        units_available=payload.units_available,
        availability_status=payload.availability_status,
        notes=payload.notes
    )
    return StandardResponse(data=_map_inventory(updated))


@router.post("/inventory", response_model=StandardResponse[BloodAvailabilityRecord])
def upsert_inventory_record(
    payload: AdminInventoryUpdatePayload,
    db: Session = Depends(get_db)
):
    """
    Add or update blood stock availability for a facility and blood group.
    """
    if not payload.facility_id or not payload.blood_group:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="facility_id and blood_group are required fields."
        )

    facility = FacilityRepository.get_by_id(db, payload.facility_id)
    if not facility:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Facility '{payload.facility_id}' not found."
        )

    existing = BloodAvailabilityRepository.get_by_facility_and_blood_group(
        db=db,
        facility_id=payload.facility_id,
        blood_group=payload.blood_group
    )

    if existing:
        updated = BloodAvailabilityRepository.update_stock(
            db=db,
            record=existing,
            units_available=payload.units_available,
            availability_status=payload.availability_status or existing.availability_status,
            notes=payload.notes
        )
        return StandardResponse(data=_map_inventory(updated))

    # Create new inventory record
    new_rec = BloodAvailability(
        id=f"inv-{uuid.uuid4().hex[:12]}",
        facility_id=payload.facility_id,
        blood_group=payload.blood_group.strip().upper(),
        units_available=payload.units_available,
        availability_status=payload.availability_status or "Available",
        verification_notes=payload.notes or "Added via operator portal",
        freshness_category="Recently Updated"
    )
    created = BloodAvailabilityRepository.create_record(db, new_rec)
    # Refresh to load facility relationship
    loaded = BloodAvailabilityRepository.get_by_id(db, created.id)
    return StandardResponse(data=_map_inventory(loaded or created))
