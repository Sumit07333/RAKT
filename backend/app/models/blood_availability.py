import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, UniqueConstraint, func, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class BloodAvailability(Base):
    """
    Blood Availability Entity represents cataloged blood group stock for an authorized facility.
    Quantity/units is strictly nullable; missing quantity is NEVER treated as zero or invented.
    """
    __tablename__ = "blood_inventory"

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        default=lambda: f"inv-{uuid.uuid4().hex[:12]}"
    )
    facility_id: Mapped[str] = mapped_column(
        String(50),
        ForeignKey("facilities.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    blood_group: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        index=True
    )  # e.g., 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'

    # Nullable units: Only set when formally verified by the facility.
    # Missing units are NULL (None), never assumed to be 0.
    units_available: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
        default=None
    )

    availability_status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Available",
        server_default="Available",
        index=True
    )  # 'Available', 'Low Stock', 'Critically Low', 'Unavailable'

    # Timestamp when the stock was last verified with facility staff
    last_updated: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True
    )

    freshness_category: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Recently Updated",
        server_default="Recently Updated"
    )
    verification_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

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
    facility: Mapped["Facility"] = relationship(
        "Facility",
        back_populates="inventory_records"
    )

    __table_args__ = (
        UniqueConstraint("facility_id", "blood_group", name="uq_facility_blood_group"),
        Index("ix_facility_blood_group", "facility_id", "blood_group"),
    )
