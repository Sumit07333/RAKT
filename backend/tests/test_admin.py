def test_operator_login(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "operator@raktnavi.iitp.ac.in", "password": "anypassword"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "token" in data
    assert data["user"]["role"] == "Blood Bank Operator"
    assert data["user"]["facilityId"] == "fac-patna-01"


def test_admin_list_requests_and_update_status(client, seeded_fixtures, db_session):
    # 1. Create an emergency request first
    create_resp = client.post(
        "/api/v1/emergency-requests",
        json={
            "requesterName": "Guardian Amit",
            "contactPhone": "+91 98765 43210",
            "city": "Patna",
            "bloodGroup": "O+",
            "unitsRequired": 2,
            "facilityPreferenceId": "test-fac-01",
            "urgencyLevel": "Urgent"
        }
    )
    assert create_resp.status_code == 201
    created_data = create_resp.json()["data"]
    request_id = created_data["id"]

    # 2. Operator lists requests
    list_resp = client.get("/api/v1/admin/requests")
    assert list_resp.status_code == 200
    list_data = list_resp.json()["data"]
    assert list_data["total"] >= 1
    target = next((r for r in list_data["records"] if r["id"] == request_id), None)
    assert target is not None
    assert target["status"] == "Pending"
    # Operator sees full unmasked details
    assert target["requesterName"] == "Guardian Amit"
    assert target["contactPhone"] == "+91 98765 43210"

    # 3. Operator updates request status to Contacted
    update_resp = client.patch(
        f"/api/v1/admin/requests/{request_id}",
        json={"status": "Contacted", "note": "Contacted ICU nursing station."}
    )
    assert update_resp.status_code == 200
    updated = update_resp.json()["data"]
    assert updated["status"] == "Contacted"
    assert len(updated["timeline"]) == 2
    assert updated["timeline"][-1]["status"] == "Contacted"
    assert "Contacted ICU" in updated["timeline"][-1]["description"]


def test_admin_inventory_update(client, seeded_fixtures):
    # Update test-inv-01
    resp = client.patch(
        "/api/v1/admin/inventory/test-inv-01",
        json={"unitsAvailable": 25, "availabilityStatus": "Available", "notes": "Restocked"}
    )
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["unitsAvailable"] == 25
    assert data["availabilityStatus"] == "Available"


def test_admin_inventory_upsert_new(client, seeded_fixtures):
    # Upsert new stock for test-fac-01 (e.g. A+)
    resp = client.post(
        "/api/v1/admin/inventory",
        json={
            "facilityId": "test-fac-01",
            "bloodGroup": "A+",
            "unitsAvailable": 10,
            "availabilityStatus": "Available"
        }
    )
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["bloodGroup"] == "A+"
    assert data["unitsAvailable"] == 10
    assert data["facilityId"] == "test-fac-01"
