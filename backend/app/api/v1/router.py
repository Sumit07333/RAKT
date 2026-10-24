from fastapi import APIRouter
from app.api.v1.facilities import router as facilities_router
from app.api.v1.blood_availability import router as blood_availability_router
from app.api.v1.emergency_requests import router as emergency_requests_router
from app.api.v1.auth import router as auth_router
from app.api.v1.admin import router as admin_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(facilities_router)
api_v1_router.include_router(blood_availability_router)
api_v1_router.include_router(emergency_requests_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(admin_router)
