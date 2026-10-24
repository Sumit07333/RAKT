def test_filter_availability_all(client, seeded_fixtures):
    """Verify listing all active blood availability records."""
    response = client.get("/api/v1/blood-availability")
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    records = payload["data"]["records"]
    assert len(records) == 3


def test_filter_availability_by_blood_group(client, seeded_fixtures):
    """Verify filtering by specific blood group."""
    response = client.get("/api/v1/blood-availability?blood_group=O%2B")
    assert response.status_code == 200
    payload = response.json()
    records = payload["data"]["records"]
    assert len(records) == 1
    assert records[0]["bloodGroup"] == "O+"
    assert records[0]["facilityName"] == "Test Patna Apex Center"


def test_filter_availability_by_city(client, seeded_fixtures):
    """Verify filtering availability records by city."""
    response = client.get("/api/v1/blood-availability?city=Delhi")
    assert response.status_code == 200
    payload = response.json()
    records = payload["data"]["records"]
    assert len(records) == 1
    assert records[0]["city"] == "New Delhi"
    assert records[0]["bloodGroup"] == "B+"


def test_missing_units_not_treated_as_zero(client, seeded_fixtures):
    """
    CRITICAL REQUIREMENT: Do not treat missing quantity as zero. Do not invent verified availability.
    When units_available is not provided/verified, the API MUST return null, not 0.
    """
    response = client.get("/api/v1/blood-availability?blood_group=AB-")
    assert response.status_code == 200
    payload = response.json()
    records = payload["data"]["records"]
    assert len(records) == 1
    rec = records[0]
    assert rec["bloodGroup"] == "AB-"
    assert rec["unitsAvailable"] is None  # MUST be None / null, NOT 0
    assert rec["availabilityStatus"] == "Available"


def test_stale_record_detection(client, seeded_fixtures):
    """
    CRITICAL REQUIREMENT: Clear approach for expired or stale records.
    Records older than configured STALE_THRESHOLD_HOURS (24h) must be flagged with isStale=True.
    """
    # Fresh record: test-inv-01 (2 hours old)
    res_fresh = client.get("/api/v1/blood-availability?blood_group=O%2B")
    rec_fresh = res_fresh.json()["data"]["records"][0]
    assert rec_fresh["isStale"] is False
    assert rec_fresh["freshnessCategory"] == "Recently Updated"

    # Stale record: test-inv-03 (36 hours old)
    res_stale = client.get("/api/v1/blood-availability?blood_group=B%2B")
    rec_stale = res_stale.json()["data"]["records"][0]
    assert rec_stale["isStale"] is True
    assert "Needs Reconfirmation" in rec_stale["freshnessCategory"] or "Stale" in rec_stale["freshnessCategory"]


def test_frontend_inventory_alias(client, seeded_fixtures):
    """Verify frontend compatibility alias /api/v1/inventory works transparently."""
    response = client.get("/api/v1/inventory?city=Patna")
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert len(payload["data"]["records"]) == 2
