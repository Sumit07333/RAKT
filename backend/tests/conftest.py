import pytest
from datetime import datetime, timezone, timedelta
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models import Facility, BloodAvailability, EmergencyRequest, RequestTimelineEvent

# In-memory SQLite engine for fast, isolated, deterministic unit and integration tests
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine,
    expire_on_commit=False
)


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Create all schema tables for the test session."""
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    """Provide an isolated database session per test function with automatic cleanup."""
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """FastAPI TestClient with overridden get_db dependency."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def seeded_fixtures(db_session: Session):
    """
    Isolated test fixtures. These are explicitly isolated from production and only for test execution.
    """
    now = datetime.now(timezone.utc)

    # 1. Active Facility in Patna
    fac1 = Facility(
        id="test-fac-01",
        name="Test Patna Apex Center",
        category="Regional Blood Bank",
        address="123 Test Bailey Road",
        city="Patna",
        state="Bihar",
        pincode="800001",
        contact_phone="+91 612 2200001",
        helpline_email="test-patna@raktnavi.example.com",
        operating_hours="24/7 Emergency Service",
        is_active=True,
        is_demo_record=False,
        created_at=now,
        updated_at=now
    )

    # 2. Active Facility in Delhi
    fac2 = Facility(
        id="test-fac-02",
        name="Test Delhi Apex Center",
        category="Hospital Attached",
        address="456 Test Ansari Nagar",
        city="New Delhi",
        state="Delhi",
        pincode="110029",
        contact_phone="+91 11 26000001",
        helpline_email="test-delhi@raktnavi.example.com",
        operating_hours="24/7 Emergency Service",
        is_active=True,
        is_demo_record=False,
        created_at=now,
        updated_at=now
    )

    # 3. Inactive Facility
    fac3 = Facility(
        id="test-fac-03",
        name="Test Inactive Facility",
        category="Community Center",
        address="789 Closed Road",
        city="Patna",
        state="Bihar",
        pincode="800020",
        contact_phone="+91 612 2209999",
        is_active=False,
        is_demo_record=False,
        created_at=now,
        updated_at=now
    )

    db_session.add_all([fac1, fac2, fac3])
    db_session.flush()

    # Stock item 1: Verified units in Patna (O+)
    stock1 = BloodAvailability(
        id="test-inv-01",
        facility_id=fac1.id,
        blood_group="O+",
        units_available=14,  # Verified quantity
        availability_status="Available",
        last_updated=now - timedelta(hours=2),
        freshness_category="Recently Updated",
        verification_notes="Verified via central registry",
        created_at=now,
        updated_at=now
    )

    # Stock item 2: UNVERIFIED units (None) - missing quantity MUST NOT be treated as zero
    stock2 = BloodAvailability(
        id="test-inv-02",
        facility_id=fac1.id,
        blood_group="AB-",
        units_available=None,  # Missing quantity (not zero)
        availability_status="Available",
        last_updated=now - timedelta(hours=1),
        freshness_category="Recently Updated",
        verification_notes="Group listed by center without exact unit count",
        created_at=now,
        updated_at=now
    )

    # Stock item 3: Stale record (older than 24 hours, e.g. 36 hours ago)
    stock3 = BloodAvailability(
        id="test-inv-03",
        facility_id=fac2.id,
        blood_group="B+",
        units_available=6,
        availability_status="Low Stock",
        last_updated=now - timedelta(hours=36),  # Stale (> 24h)
        freshness_category="Recently Updated",
        verification_notes="Prior day update",
        created_at=now,
        updated_at=now
    )

    db_session.add_all([stock1, stock2, stock3])
    db_session.commit()

    return {
        "fac1": fac1,
        "fac2": fac2,
        "fac3": fac3,
        "stock1": stock1,
        "stock2": stock2,
        "stock3": stock3
    }
