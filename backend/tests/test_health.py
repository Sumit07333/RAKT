def test_health_check_endpoint(client):
    """Verify application health endpoint returns healthy status and service name."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["service"] == "raktnavi-api"
    assert "timestamp" in data
    assert "database" in data
    assert data["version"] == "1.0.0"
