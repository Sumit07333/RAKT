def test_list_facilities_returns_active_only(client, seeded_fixtures):
    """Verify listing facilities returns active facilities and omits inactive ones by default."""
    response = client.get("/api/v1/facilities")
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    data = payload["data"]
    assert data["total"] == 2  # 2 active facilities out of 3 seeded
    facility_ids = [f["id"] for f in data["records"]]
    assert "test-fac-01" in facility_ids
    assert "test-fac-02" in facility_ids
    assert "test-fac-03" not in facility_ids  # Inactive


def test_list_facilities_filter_by_city(client, seeded_fixtures):
    """Verify filtering facilities by city name."""
    response = client.get("/api/v1/facilities?city=Patna")
    assert response.status_code == 200
    payload = response.json()
    records = payload["data"]["records"]
    assert len(records) == 1
    assert records[0]["city"] == "Patna"
    assert records[0]["id"] == "test-fac-01"


def test_list_facilities_filter_nonexistent_city(client, seeded_fixtures):
    """Verify filtering by non-existent city returns total=0 and empty records."""
    response = client.get("/api/v1/facilities?city=NonExistentCityXYZ")
    assert response.status_code == 200
    payload = response.json()
    assert payload["data"]["total"] == 0
    assert payload["data"]["records"] == []


def test_get_facility_detail_found(client, seeded_fixtures):
    """Verify retrieving facility details and its listed stock."""
    response = client.get("/api/v1/facilities/test-fac-01")
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    data = payload["data"]
    assert data["facility"]["id"] == "test-fac-01"
    assert data["facility"]["name"] == "Test Patna Apex Center"
    assert len(data["inventory"]) == 2  # 2 records seeded for fac-01
    groups = [item["bloodGroup"] for item in data["inventory"]]
    assert "O+" in groups
    assert "AB-" in groups


def test_get_facility_detail_not_found(client, seeded_fixtures):
    """Verify retrieving a non-existent facility returns 404 with standardized error structure."""
    response = client.get("/api/v1/facilities/non-existent-id")
    assert response.status_code == 404
    payload = response.json()
    assert payload["success"] is False
    assert payload["error"]["code"] == "NOT_FOUND"
    assert "not found" in payload["error"]["message"].lower()
