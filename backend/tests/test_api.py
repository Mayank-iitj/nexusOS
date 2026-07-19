def test_get_projects_unauthorized(client):
    response = client.get("/api/v1/projects")
    assert response.status_code == 401

def test_get_tasks_unauthorized(client):
    response = client.get("/api/v1/tasks")
    assert response.status_code == 401

def test_get_workflows_unauthorized(client):
    response = client.get("/api/v1/workflows")
    assert response.status_code == 401
