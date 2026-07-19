def test_health_check(client, settings):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
    }

def test_root(client, settings):
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome to" in response.json()["message"]
