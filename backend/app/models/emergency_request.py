import uuid
import secrets
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, func, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


def generate_tracking_reference() -> str:
    """
    Generate an unguessable, non-sequential public tracking reference.
    Uses cryptographically strong random selection (secrets module) to avoid enumeration attacks.
    Format: RN-XXXXXX (e.g. RN-782194 or RN-A8C3F2)
    """
    random_digits = "".join(secrets.choice("23456789ABCDEFGHJKLMNPQRSTUVWXYZ") for _ in range(6))
    return f"RN-{random_digits}"


class EmergencyRequest(Base):
    """
    Emergency Request Entity manages blood coordination requests submitted by patients/guardians.
    Personal information is stored securely and minimized.
    Public tracking utilizes a non-sequential, cryptographically unguessable tracking reference.
    """
    __tablename__ = "emergency_requests"

    id: Mapped[str] = mapped_column(
        String(50),
        primary_key=True,
        default=lambda: f"req-{uuid.uuid4().hex[:12]}"
    )

    # Unique, non-sequential public tracking reference (e.g. RN-894215)
    tracking_reference: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
        default=generate_tracking_reference
    )

    # Requester identity - collected only for clinical verification
    requester_name: Mapped[str] = mapped_column(String(100), nullable=False)
    contact_phone: Mapped[str] = mapped_column(String(30), nullable=False)

    # Clinical requirements
    blood_group: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    units_required: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    city: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    urgency_level: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Urgent",
        server_default="Urgent",
        index=True
    )  # 'Normal', 'Urgent', 'Immediate / Critical'
    
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="Pending",
        server_default="Pending",
        index=True
    )  # 'Pending', 'Contacted', 'Fulfilled', 'Cancelled'

    additional_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Optional preferred facility
    facility_preference_id: Mapped[Optional[str]] = mapped_column(
        String(50),
        ForeignKey("facilities.id", ondelete="SET NULL"),
        nullable=True,
        index=True
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
    preferred_facility: Mapped[Optional["Facility"]] = relationship(
        "Facility",
        back_populates="emergency_requests"
    )
    timeline_events: Mapped[List["RequestTimelineEvent"]] = relationship(
        "RequestTimelineEvent",
        back_populates="request",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="RequestTimelineEvent.event_timestamp"
    )

    # Property alias for frontend requestCode compatibility
    @property
    def request_code(self) -> str:
        return self.tracking_reference


class RequestTimelineEvent(Base):
    """
    Immutable audit timeline of coordination milestones for an emergency request.
    """
    __tablename__ = "request_timeline_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    request_id: Mapped[str] = mapped_column(
        String(50),
        ForeignKey("emergency_requests.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    event_timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    # Relationship
    request: Mapped["EmergencyRequest"] = relationship(
        "EmergencyRequest",
        back_populates="timeline_events"
    )
