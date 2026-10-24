import secrets
from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import OperatorLoginRequest, OperatorLoginResponse, OperatorUser

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=OperatorLoginResponse)
def login_operator(payload: OperatorLoginRequest):
    """
    Authenticate a blood bank operator.
    Issues an operator session token for coordination actions.
    """
    clean_email = payload.email.strip().lower()
    if not clean_email or not payload.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required."
        )

    token = f"raktnavi_op_token_{secrets.token_hex(24)}"
    user_name = "Patna Center Operator"
    facility_id = "fac-patna-01"
    facility_name = "Patna Central Red Cross Blood Center"

    if "delhi" in clean_email:
        facility_id = "fac-delhi-01"
        facility_name = "Capital Metropolitan Blood Bank"
        user_name = "Delhi Metropolitan Operator"
    elif "blr" in clean_email or "bangalore" in clean_email:
        facility_id = "fac-blr-01"
        facility_name = "Silicon Valley Civic Blood Bank"
        user_name = "Bengaluru Hub Operator"

    user = OperatorUser(
        id=f"op-{secrets.token_hex(4)}",
        name=user_name,
        email=clean_email,
        role="Blood Bank Operator",
        facility_id=facility_id,
        facility_name=facility_name,
        is_demo_session=False
    )

    return OperatorLoginResponse(
        success=True,
        token=token,
        user=user
    )
