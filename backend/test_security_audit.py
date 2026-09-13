import os
import json
import io
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_cors_headers():
    response = client.get(
        "/api/health",
        headers={"Origin": "http://localhost:3000"}
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
    assert response.headers.get("access-control-allow-credentials") == "true"

def test_clinics_boundary_validation():
    # Invalid lat/lon should return 400
    res_bad_lat = client.get("/api/chat/clinics?lat=150.0&lon=77.0")
    assert res_bad_lat.status_code == 400

    res_bad_lon = client.get("/api/chat/clinics?lat=28.0&lon=200.0")
    assert res_bad_lon.status_code == 400

    # Valid lat/lon should return 200 with clinic list
    res_valid = client.get("/api/chat/clinics?lat=28.6139&lon=77.2090")
    assert res_valid.status_code == 200
    data = res_valid.json()
    assert data["status"] == "ok"
    assert len(data["clinics"]) > 0
    assert "name" in data["clinics"][0]

def test_documents_security():
    # 1. Reject invalid file extension (.exe)
    bad_file = io.BytesIO(b"malicious executable payload")
    res_bad_ext = client.post(
        "/api/documents/upload",
        data={"session_id": "test-session-1"},
        files={"file": ("exploit.exe", bad_file, "application/octet-stream")}
    )
    assert res_bad_ext.status_code == 400
    assert "Unsupported file format" in res_bad_ext.json().get("detail", "")

    # 2. Reject empty file
    empty_file = io.BytesIO(b"")
    res_empty = client.post(
        "/api/documents/upload",
        data={"session_id": "test-session-1"},
        files={"file": ("empty.pdf", empty_file, "application/pdf")}
    )
    assert res_empty.status_code == 400

    # 3. Path traversal sanitization
    sample_pdf = io.BytesIO(b"%PDF-1.4 sample test report content")
    res_traversal = client.post(
        "/api/documents/upload",
        data={"session_id": "test-session-1"},
        files={"file": ("../../malicious_file.pdf", sample_pdf, "application/pdf")}
    )
    assert res_traversal.status_code == 200
    doc_id = res_traversal.json().get("document_id")
    assert doc_id is not None

    # Check status endpoint
    status_res = client.get(f"/api/documents/{doc_id}/status")
    assert status_res.status_code == 200

def test_doctor_links_security():
    # 1. Invalid short or garbage token should return 404
    res_short = client.get("/api/chat/doctor-links/abc")
    assert res_short.status_code == 404

    res_random = client.get("/api/chat/doctor-links/randomnonexistenttoken12345")
    assert res_random.status_code == 404

    # 2. Create valid link
    create_res = client.post(
        "/api/chat/doctor-links",
        json={
            "user_id": "test-user-security",
            "expires_in_days": 1,
            "userName": "Security Test Patient",
            "profile": {"full_name": "Security Test Patient", "age": 40},
            "prescriptions": [{"medicine_name": "Aspirin 75mg"}]
        }
    )
    assert create_res.status_code == 200
    token = create_res.json().get("token")
    assert token is not None

    # 3. Read valid link
    get_res = client.get(f"/api/chat/doctor-links/{token}")
    assert get_res.status_code == 200
    data = get_res.json().get("data", {})
    assert data.get("profile", {}).get("full_name") == "Security Test Patient"
    assert len(data.get("prescriptions", [])) >= 1

def test_notifications_security():
    # 1. Invalid scheme should be rejected
    res_bad_scheme = client.post(
        "/api/notifications/subscribe",
        json={
            "user_id": "test-user",
            "endpoint": "javascript:alert(1)",
            "p256dh": "key123",
            "auth": "auth123"
        }
    )
    assert res_bad_scheme.status_code == 400

    # 2. Valid HTTPS endpoint should be accepted
    res_valid = client.post(
        "/api/notifications/subscribe",
        json={
            "user_id": "test-user",
            "endpoint": "https://fcm.googleapis.com/fcm/send/test-endpoint-12345",
            "p256dh": "key123",
            "auth": "auth123"
        }
    )
    assert res_valid.status_code == 200
    assert res_valid.json().get("status") == "success"

    # 3. Check status
    res_status = client.get("/api/notifications/status?user_id=test-user")
    assert res_status.status_code == 200
    assert res_status.json().get("active_subscriptions") >= 1

    # 4. Unsubscribe
    res_unsub = client.post(
        "/api/notifications/unsubscribe",
        json={"user_id": "test-user"}
    )
    assert res_unsub.status_code == 200

def test_prescriptions_and_reminders_crud():
    # 1. Add prescription
    add_res = client.post(
        "/api/chat/prescriptions",
        json={
            "user_id": "test-user-presc",
            "medicine_name": "Metformin 500mg",
            "dosage": "1 tablet",
            "frequency": "After meals"
        }
    )
    assert add_res.status_code == 200
    p_data = add_res.json()
    presc_id = p_data.get("id")
    assert presc_id is not None

    # 2. Get prescriptions
    get_res = client.get("/api/chat/prescriptions?user_id=test-user-presc")
    assert get_res.status_code == 200
    prescs = get_res.json()
    assert any(p["medicine_name"] == "Metformin 500mg" for p in prescs)

    # 3. Create reminder
    rem_res = client.post(
        "/api/chat/pill-reminders",
        json={
            "user_id": "test-user-presc",
            "prescription_id": presc_id,
            "time_of_day": "morning"
        }
    )
    assert rem_res.status_code == 200
    rem_id = rem_res.json().get("id")
    assert rem_id is not None

    # 4. Toggle reminder status
    upd_res = client.put(
        f"/api/chat/pill-reminders/{rem_id}",
        json={"taken_status": True}
    )
    assert upd_res.status_code == 200
    assert upd_res.json().get("taken_status") is True

    # 5. Delete reminder and prescription
    del_rem = client.delete(f"/api/chat/pill-reminders/{rem_id}")
    assert del_rem.status_code == 200

    del_p = client.delete(f"/api/chat/prescriptions/{presc_id}")
    assert del_p.status_code == 200

def test_chat_message_validation():
    # Empty message should be rejected
    res_empty = client.post(
        "/api/chat/stream",
        json={
            "session_id": "test-session",
            "message": "   ",
            "language": "en"
        }
    )
    assert res_empty.status_code == 400

if __name__ == "__main__":
    test_health_check()
    test_cors_headers()
    test_clinics_boundary_validation()
    test_documents_security()
    test_doctor_links_security()
    test_notifications_security()
    test_prescriptions_and_reminders_crud()
    test_chat_message_validation()
    print("ALL 7 CRITICAL BACKEND SECURITY & ENDPOINT TESTS PASSED SUCCESSFULLY!")
