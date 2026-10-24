import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
from app.database import Base


class Facility(Base):
    """
    Facility Entity represents blood banks, hospitals, and charitable transfusion centers.
    """
    __tablename__ = "facilities"

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        default=lambda: f"fac-{uuid.uuid4().hex[:12]}"
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="Blood Bank",
        server_default="Blood Bank"
    )
    address: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    pincode: Mapped[str] = mapped_column(String(20), nullable=False)
    
    # Contact information
    contact_phone: Mapped[str] = mapped_column(String(50), nullable=False)
    helpline_email: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    operating_hours: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="24/7 Emergency Service",
        server_default="24/7 Emergency Service"
    )
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Status flags
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default="true",
        index=True
    )
    is_demo_record: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false"
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )

    # Relationships
    inventory_records: Mapped[List["BloodAvailability"]] = relationship(
        "BloodAvailability",
        back_populates="facility",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    emergency_requests: Mapped[List["EmergencyRequest"]] = relationship(
        "EmergencyRequest",
        back_populates="preferred_facility"
    )
