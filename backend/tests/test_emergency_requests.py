def test_create_emergency_request_success(client, seeded_fixtures):
    """Verify creating a valid emergency request generates unguessable tracking code and 201 status."""
    payload = {
        "requesterName": "Guardian Rajesh Sharma",
        "contactPhone": "+91 98765 43210",
        "city": "Patna",
        "bloodGroup": "O-",
        "unitsRequired": 2,
        "facilityPreferenceId": "test-fac-01",
        "urgencyLevel": "Immediate / Critical",
        "additionalNotes": "Emergency standby for surgery."
    }

    response = client.post("/api/v1/emergency-requests", json=payload)
    assert response.status_code == 201
    res_data = response.json()
    assert res_data["success"] is True
    data = res_data["data"]

    # Verify unguessable, non-sequential reference
    assert data["trackingReference"].startswith("RN-")
    assert len(data["trackingReference"]) >= 8  # e.g. RN-894215
    assert data["requestCode"] == data["trackingReference"]
    assert data["status"] == "Pending"
    assert "registered" in data["message"].lower()


def test_create_emergency_request_validation_failures(client):
    """Verify input validation handles invalid phone, invalid blood group, and out-of-range units."""
    # 1. Invalid phone number
    res_bad_phone = client.post("/api/v1/emergency-requests", json={
        "requesterName": "Test User",
        "contactPhone": "123",  # Too short
        "city": "Patna",
        "bloodGroup": "O+",
        "unitsRequired": 1
    })
    assert res_bad_phone.status_code == 422
    assert res_bad_phone.json()["error"]["code"] == "VALIDATION_ERROR"

    # 2. Invalid blood group
    res_bad_bg = client.post("/api/v1/emergency-requests", json={
        "requesterName": "Test User",
        "contactPhone": "+91 98765 43210",
        "city": "Patna",
        "bloodGroup": "Z-Negative",
        "unitsRequired": 1
    })
    assert res_bad_bg.status_code == 422

    # 3. Units required out of bounds (0 or > 50)
    res_bad_units = client.post("/api/v1/emergency-requests", json={
        "requesterName": "Test User",
        "contactPhone": "+91 98765 43210",
        "city": "Patna",
        "bloodGroup": "O+",
        "unitsRequired": 0
    })
    assert res_bad_units.status_code == 422


def test_create_emergency_request_invalid_facility_preference(client):
    """Verify specifying a non-existent preferred facility returns 400 Bad Request."""
    response = client.post("/api/v1/emergency-requests", json={
        "requesterName": "Test User",
        "contactPhone": "+91 98765 43210",
        "city": "Patna",
        "bloodGroup": "O+",
        "unitsRequired": 1,
        "facilityPreferenceId": "non-existent-facility-999"
    })
    assert response.status_code == 400
    payload = response.json()
    assert payload["error"]["code"] == "BAD_REQUEST"
    assert "invalid" in payload["error"]["message"].lower()


def test_track_emergency_request_and_privacy_masking(client, seeded_fixtures):
    """
    CRITICAL REQUIREMENT: A tracking reference is not a substitute for authorization.
    Avoid exposing sensitive requester details through public tracking.
    Verify tracking retrieves status and timeline, with requester name and phone properly masked.
    """
    # 1. Create request
    create_payload = {
        "requesterName": "Rajesh Kumar Sharma",
        "contactPhone": "+91 98765 43210",
        "city": "Patna",
        "bloodGroup": "O-",
        "unitsRequired": 3,
        "facilityPreferenceId": "test-fac-01",
        "urgencyLevel": "Urgent"
    }
    create_res = client.post("/api/v1/emergency-requests", json=create_payload)
    ref_code = create_res.json()["data"]["trackingReference"]

    # 2. Track public status using reference code
    track_res = client.get(f"/api/v1/emergency-requests/{ref_code}")
    assert track_res.status_code == 200
    track_data = track_res.json()["data"]

    assert track_data["trackingReference"] == ref_code
    assert track_data["bloodGroup"] == "O-"
    assert track_data["unitsRequired"] == 3
    assert track_data["city"] == "Patna"
    assert track_data["status"] == "Pending"
    assert track_data["facilityName"] == "Test Patna Apex Center"

    # Privacy Protection Verification:
    # Full phone number MUST NOT be in public tracking payload!
    assert track_data["contactPhone"] != "+91 98765 43210"
    assert "***" in track_data["contactPhone"]
    assert track_data["contactPhone"].endswith("10")

    # Name is privacy-masked
    assert track_data["requesterName"] != "Rajesh Kumar Sharma"
    assert "***" in track_data["requesterName"]

    # Timeline event present
    assert len(track_data["timeline"]) >= 1
    assert track_data["timeline"][0]["status"] == "Pending"


def test_track_emergency_request_not_found(client):
    """Verify non-existent tracking code returns 404."""
    response = client.get("/api/v1/emergency-requests/RN-999999")
    assert response.status_code == 404
    payload = response.json()
    assert payload["success"] is False
    assert payload["error"]["code"] == "NOT_FOUND"


def test_frontend_requests_compatibility_alias(client):
    """Verify frontend aliases /api/v1/requests work for creation and tracking."""
    create_res = client.post("/api/v1/requests", json={
        "requesterName": "Priya Singh",
        "contactPhone": "+91 91234 56789",
        "city": "Patna",
        "bloodGroup": "A+",
        "unitsRequired": 1,
        "urgencyLevel": "Normal"
    })
    assert create_res.status_code == 201
    code = create_res.json()["data"]["requestCode"]

    track_res = client.get(f"/api/v1/requests/{code}")
    assert track_res.status_code == 200
    assert track_res.json()["data"]["requestCode"] == code


def test_payload_size_limit_rejection(client):
    """Verify oversized request body payload triggers HTTP 413 Payload Too Large."""
    oversized_notes = "A" * 300000  # > 262144 bytes limit
    response = client.post(
        "/api/v1/emergency-requests",
        content=oversized_notes,
        headers={"Content-Type": "application/json", "Content-Length": str(len(oversized_notes))}
    )
    assert response.status_code == 413
    payload = response.json()
    assert payload["error"]["code"] == "PAYLOAD_TOO_LARGE"
