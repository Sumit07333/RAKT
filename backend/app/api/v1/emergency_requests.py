from fastapi import APIRouter, Depends, Path, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.services.emergency_request_service import EmergencyRequestService
from app.schemas.common import StandardResponse
from app.schemas.emergency_request import (
    EmergencyRequestCreate,
    EmergencyRequestCreatedData,
    EmergencyRequestPublicTrackData
)

router = APIRouter(tags=["Emergency Requests"])


@router.post(
    "/emergency-requests",
    response_model=StandardResponse[EmergencyRequestCreatedData],
    status_code=status.HTTP_201_CREATED
)
@router.post(
    "/requests",
    response_model=StandardResponse[EmergencyRequestCreatedData],
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False
)
def create_emergency_request(
    payload: EmergencyRequestCreate,
    db: Session = Depends(get_db)
):
    """
    Validate and register an emergency blood request.
    Generates a secure, non-sequential unguessable public tracking reference.
    """
    result = EmergencyRequestService.create_emergency_request(db=db, payload=payload)
    return StandardResponse(data=result)


@router.get(
    "/emergency-requests/{tracking_reference}",
    response_model=StandardResponse[EmergencyRequestPublicTrackData]
)
@router.get(
    "/requests/{tracking_reference}",
    response_model=StandardResponse[EmergencyRequestPublicTrackData],
    include_in_schema=False
)
def track_emergency_request(
    tracking_reference: str = Path(..., description="Unique unguessable tracking reference (e.g. RN-782194)"),
    db: Session = Depends(get_db)
):
    """
    Retrieve real-time tracking status and timeline events using the unguessable tracking reference.
    Personal identification details are strictly masked for privacy and security.
    """
    result = EmergencyRequestService.get_public_tracking_status(
        db=db,
        tracking_reference=tracking_reference
    )
    return StandardResponse(data=result)
