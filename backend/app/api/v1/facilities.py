from typing import Optional
from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.services.facility_service import FacilityService
from app.schemas.common import StandardResponse
from app.schemas.facility import FacilityListResponse, FacilityDetailData

router = APIRouter(prefix="/facilities", tags=["Facilities"])


@router.get("", response_model=StandardResponse[FacilityListResponse])
def list_facilities(
    city: Optional[str] = Query(None, description="Filter facilities by city name"),
    limit: int = Query(50, ge=1, le=200, description="Page limit"),
    offset: int = Query(0, ge=0, description="Page offset"),
    db: Session = Depends(get_db)
):
    """
    List registered blood facilities with optional city filtering.
    """
    result = FacilityService.list_facilities(
        db=db,
        city=city,
        is_active=True,
        limit=limit,
        offset=offset
    )
    return StandardResponse(data=result)


@router.get("/{facility_id}", response_model=StandardResponse[FacilityDetailData])
def get_facility(
    facility_id: str = Path(..., description="Unique facility identifier"),
    db: Session = Depends(get_db)
):
    """
    Retrieve comprehensive facility details and all its cataloged blood group availability records.
    """
    result = FacilityService.get_facility_detail(db=db, facility_id=facility_id)
    return StandardResponse(data=result)
