from typing import Optional
from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.services.blood_availability_service import BloodAvailabilityService
from app.services.facility_service import FacilityService
from app.schemas.common import StandardResponse
from app.schemas.blood_availability import BloodAvailabilityListResponse
from app.schemas.facility import FacilityDetailData

router = APIRouter(tags=["Blood Availability"])


@router.get("/blood-availability", response_model=StandardResponse[BloodAvailabilityListResponse])
@router.get("/inventory", response_model=StandardResponse[BloodAvailabilityListResponse], include_in_schema=False)
def search_blood_availability(
    blood_group: Optional[str] = Query(None, alias="blood_group", description="Blood group filter (e.g. O+, A-)"),
    bloodGroup: Optional[str] = Query(None, alias="bloodGroup", include_in_schema=False),
    city: Optional[str] = Query(None, description="City filter (case-insensitive)"),
    status: Optional[str] = Query(None, description="Availability status filter"),
    limit: int = Query(50, ge=1, le=200, description="Page limit"),
    offset: int = Query(0, ge=0, description="Page offset"),
    db: Session = Depends(get_db)
):
    """
    Search and filter cataloged blood availability across regional facilities.
    Filters by blood group, city, and availability status.
    Stale records are flagged when last updated past the configured threshold.
    """
    selected_bg = blood_group or bloodGroup
    result = BloodAvailabilityService.filter_availability(
        db=db,
        blood_group=selected_bg,
        city=city,
        status=status,
        limit=limit,
        offset=offset
    )
    return StandardResponse(data=result)


@router.get("/inventory/{facility_id}", response_model=StandardResponse[FacilityDetailData], include_in_schema=False)
def get_facility_inventory_compat(
    facility_id: str = Path(..., description="Unique facility identifier"),
    db: Session = Depends(get_db)
):
    """
    Compatibility alias for frontend: GET /api/v1/inventory/{facility_id} -> facility details & stock.
    """
    result = FacilityService.get_facility_detail(db=db, facility_id=facility_id)
    return StandardResponse(data=result)
