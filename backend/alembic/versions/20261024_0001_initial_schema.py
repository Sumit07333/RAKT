"""Initial database schema for facilities, blood availability, and emergency requests

Revision ID: 20261024_0001
Revises: 
Create Date: 2026-10-24 10:45:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '20261024_0001'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Facilities Table
    op.create_table(
        'facilities',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('category', sa.String(length=100), server_default='Blood Bank', nullable=False),
        sa.Column('address', sa.Text(), nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=False),
        sa.Column('pincode', sa.String(length=20), nullable=False),
        sa.Column('contact_phone', sa.String(length=50), nullable=False),
        sa.Column('helpline_email', sa.String(length=150), nullable=True),
        sa.Column('operating_hours', sa.String(length=100), server_default='24/7 Emergency Service', nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('is_demo_record', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_facilities_name', 'facilities', ['name'])
    op.create_index('ix_facilities_city', 'facilities', ['city'])
    op.create_index('ix_facilities_is_active', 'facilities', ['is_active'])

    # 2. Blood Inventory / Availability Table
    op.create_table(
        'blood_inventory',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('facility_id', sa.String(length=50), nullable=False),
        sa.Column('blood_group', sa.String(length=10), nullable=False),
        sa.Column('units_available', sa.Integer(), nullable=True),
        sa.Column('availability_status', sa.String(length=50), server_default='Available', nullable=False),
        sa.Column('last_updated', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('freshness_category', sa.String(length=50), server_default='Recently Updated', nullable=False),
        sa.Column('verification_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['facility_id'], ['facilities.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('facility_id', 'blood_group', name='uq_facility_blood_group')
    )
    op.create_index('ix_blood_inventory_facility_id', 'blood_inventory', ['facility_id'])
    op.create_index('ix_blood_inventory_blood_group', 'blood_inventory', ['blood_group'])
    op.create_index('ix_blood_inventory_availability_status', 'blood_inventory', ['availability_status'])
    op.create_index('ix_blood_inventory_last_updated', 'blood_inventory', ['last_updated'])
    op.create_index('ix_facility_blood_group', 'blood_inventory', ['facility_id', 'blood_group'])

    # 3. Emergency Requests Table
    op.create_table(
        'emergency_requests',
        sa.Column('id', sa.String(length=50), nullable=False),
        sa.Column('tracking_reference', sa.String(length=30), nullable=False),
        sa.Column('requester_name', sa.String(length=100), nullable=False),
        sa.Column('contact_phone', sa.String(length=30), nullable=False),
        sa.Column('blood_group', sa.String(length=10), nullable=False),
        sa.Column('units_required', sa.Integer(), server_default='1', nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('urgency_level', sa.String(length=50), server_default='Urgent', nullable=False),
        sa.Column('status', sa.String(length=50), server_default='Pending', nullable=False),
        sa.Column('additional_notes', sa.Text(), nullable=True),
        sa.Column('facility_preference_id', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['facility_preference_id'], ['facilities.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('tracking_reference')
    )
    op.create_index('ix_emergency_requests_tracking_reference', 'emergency_requests', ['tracking_reference'])
    op.create_index('ix_emergency_requests_blood_group', 'emergency_requests', ['blood_group'])
    op.create_index('ix_emergency_requests_city', 'emergency_requests', ['city'])
    op.create_index('ix_emergency_requests_urgency_level', 'emergency_requests', ['urgency_level'])
    op.create_index('ix_emergency_requests_status', 'emergency_requests', ['status'])
    op.create_index('ix_emergency_requests_facility_preference_id', 'emergency_requests', ['facility_preference_id'])

    # 4. Request Timeline Events Table
    op.create_table(
        'request_timeline_events',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('request_id', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('event_timestamp', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['request_id'], ['emergency_requests.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_request_timeline_events_request_id', 'request_timeline_events', ['request_id'])


def downgrade() -> None:
    op.drop_table('request_timeline_events')
    op.drop_table('emergency_requests')
    op.drop_table('blood_inventory')
    op.drop_table('facilities')
