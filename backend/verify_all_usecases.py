import urllib.request
import urllib.parse
import json
import time
import sys

# Avoid UnicodeEncodeError on Windows command prompt
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(errors='replace')

BASE_URL = "http://localhost:8080/api/v1"

def send_request(url, method="GET", data=None, headers=None, is_json=True):
    if headers is None:
        headers = {}
    req_data = None
    if data is not None:
        if is_json:
            req_data = json.dumps(data).encode("utf-8")
            headers["Content-Type"] = "application/json"
        else:
            req_data = data
    
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            resp_body = response.read().decode("utf-8")
            if response.getheader("Content-Type") and "application/json" in response.getheader("Content-Type"):
                return response.status, json.loads(resp_body)
            return response.status, resp_body
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_body)
        except Exception:
            return e.code, err_body
    except Exception as e:
        return 500, str(e)

def encode_multipart_formdata(fields, files):
    boundary = b'----WebKitFormBoundary7MA4YWxkTrZu0gW'
    lines = []
    for name, value in fields.items():
        lines.append(b'--' + boundary)
        lines.append(f'Content-Disposition: form-data; name="{name}"'.encode('utf-8'))
        lines.append(b'')
        lines.append(str(value).encode('utf-8'))
    for name, (filename, content) in files.items():
        lines.append(b'--' + boundary)
        lines.append(f'Content-Disposition: form-data; name="{name}"; filename="{filename}"'.encode('utf-8'))
        lines.append(b'Content-Type: application/octet-stream')
        lines.append(b'')
        lines.append(content)
    lines.append(b'--' + boundary + b'--')
    lines.append(b'')
    body = b'\r\n'.join(lines)
    content_type = f'multipart/form-data; boundary={boundary.decode("utf-8")}'
    return content_type, body

def run_tests():
    print("=== STARTING LMS BACKEND VERIFICATION SCRIPT ===")
    
    # ----------------------------------------------------
    # UC04: Xem danh mục khóa học (Public)
    # ----------------------------------------------------
    print("\n[UC04] Viewing course catalog...")
    status, res = send_request(f"{BASE_URL}/courses")
    assert status == 200, f"Expected 200, got {status}"
    assert res["success"] is True
    
    # Handle paginated PageResponse if present
    if isinstance(res["data"], dict) and "content" in res["data"]:
        courses_list = res["data"]["content"]
    else:
        courses_list = res["data"]
        
    assert len(courses_list) >= 2, "Should have at least 2 seeded courses"
    print("  => OK (Courses found: {})".format([c["courseName"] for c in courses_list]))
    
    # ----------------------------------------------------
    # UC05: Xem chi tiết khóa học (Public)
    # ----------------------------------------------------
    course_id = courses_list[0]["id"]
    print(f"\n[UC05] Viewing course details for ID {course_id}...")
    status, res = send_request(f"{BASE_URL}/courses/{course_id}")
    assert status == 200, f"Expected 200, got {status}"
    assert res["success"] is True
    assert res["data"]["id"] == course_id
    print("  => OK (Course: {})".format(res["data"]["courseName"]))
    
    # ----------------------------------------------------
    # UC06: Xem thông tin giảng viên (Public)
    # ----------------------------------------------------
    print("\n[UC06] Viewing instructor bios...")
    status, res = send_request(f"{BASE_URL}/instructors")
    assert status == 200, f"Expected 200, got {status}"
    assert res["success"] is True
    assert len(res["data"]) >= 1, "Should have at least 1 seeded instructor"
    print("  => OK (Instructor: {})".format(res["data"][0]["fullName"]))
    
    # ----------------------------------------------------
    # UC07: Đăng ký tài khoản mới
    # ----------------------------------------------------
    print("\n[UC07] Registering new student account...")
    reg_data = {
        "fullName": "Student Test",
        "email": "student_test@ezone.com",
        "phone": "0900000001",
        "password": "studentpassword"
    }
    status, res = send_request(f"{BASE_URL}/auth/register", method="POST", data=reg_data)
    if status == 400 or status == 500:
        # Maybe already exists from a previous run, check message or skip
        print("  => Register returned {}, possibly already exists.".format(status))
    else:
        assert status == 201, f"Expected 201, got {status}"
        assert res["success"] is True
        print("  => OK (Registered username: {})".format(res["data"]["username"]))
        
    # ----------------------------------------------------
    # UC01: Đăng nhập
    # ----------------------------------------------------
    print("\n[UC01] Logging in as Admin...")
    status, admin_res = send_request(f"{BASE_URL}/auth/login", method="POST", data={"email": "admin@ezone.com", "password": "admin123"})
    assert status == 200, f"Failed admin login: {admin_res}"
    admin_token = admin_res["data"]["token"]
    print("  => Admin Logged In.")

    print("[UC01] Logging in as Teacher...")
    status, teacher_res = send_request(f"{BASE_URL}/auth/login", method="POST", data={"email": "teacher@ezone.com", "password": "teacher123"})
    assert status == 200, f"Failed teacher login: {teacher_res}"
    teacher_token = teacher_res["data"]["token"]
    print("  => Teacher Logged In.")

    print("[UC01] Logging in as Student...")
    status, student_res = send_request(f"{BASE_URL}/auth/login", method="POST", data={"email": "student_test@ezone.com", "password": "studentpassword"})
    assert status == 200, f"Failed student login: {student_res}"
    student_token = student_res["data"]["token"]
    student_id = student_res["data"]["userId"]
    print("  => Student Logged In. ID = {}".format(student_id))
    
    # ----------------------------------------------------
    # UC03: Quản lý hồ sơ cá nhân
    # ----------------------------------------------------
    print("\n[UC03] Checking and updating profile...")
    # Get profile
    status, profile_res = send_request(f"{BASE_URL}/users/me", headers={"Authorization": f"Bearer {student_token}"})
    assert status == 200
    
    current_name = profile_res["data"]["fullName"]
    target_name = "Student Test Updated" if current_name == "Student Test" else "Student Test"
    
    # Update profile
    update_data = {
        "fullName": target_name,
        "phone": "0999999999"
    }
    status, update_res = send_request(f"{BASE_URL}/users/me", method="PATCH", data=update_data, headers={"Authorization": f"Bearer {student_token}"})
    assert status == 200
    assert update_res["data"]["fullName"] == target_name
    print(f"  => OK (Profile updated to {target_name})")
    
    # ----------------------------------------------------
    # UC08: Gửi yêu cầu tư vấn / nhập học (Guest/Public)
    # ----------------------------------------------------
    print("\n[UC08] Requesting enrollment consultation for student...")
    consult_data = {
        "fullName": "Student Test Updated",
        "phone": "0999999999",
        "email": "student_test@ezone.com",
        "courseId": course_id
    }
    status, enroll_res = send_request(f"{BASE_URL}/enrollments", method="POST", data=consult_data)
    assert status == 201, f"Expected 201, got {status}"
    enrollment_id = enroll_res["data"]["id"]
    print("  => OK (Enrollment ID: {})".format(enrollment_id))
    
    # ----------------------------------------------------
    # UC09: Thanh toán học phí & Phê duyệt đăng ký học
    # ----------------------------------------------------
    print("\n[UC09] Submitting payment proof...")
    # Submit payment proof
    fields = {
        "enrollmentId": enrollment_id,
        "amount": "12000000.00",
        "paymentMethod": "Banking",
        "transactionId": "TXN_STUDENT_TEST_" + str(int(time.time()))
    }
    files = {
        "receiptImage": ("receipt.png", b"fake image bytes")
    }
    content_type, body = encode_multipart_formdata(fields, files)
    status, pay_res = send_request(
        f"{BASE_URL}/payments", 
        method="POST", 
        data=body, 
        headers={"Content-Type": content_type, "Authorization": f"Bearer {student_token}"},
        is_json=False
    )
    assert status == 201, f"Expected 201, got {status} - {pay_res}"
    payment_id = pay_res["data"]["id"]
    print("  => Payment submitted. Payment ID: {}".format(payment_id))
    
    # Approve registration/payment as Admin
    print("[UC09] Confirming payment as Admin...")
    status, confirm_res = send_request(
        f"{BASE_URL}/payments/{payment_id}/confirm",
        method="PATCH",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert status == 200, f"Expected 200, got {status} - {confirm_res}"
    assert confirm_res["data"]["status"] == "SUCCESS"
    print("  => Payment confirmed successfully.")
    
    # Check if student is enrolled in Class 1 (seeded class is IELTS-2024-K01, ID 1)
    # Admin approves enrollment and adds to class
    print("[UC09/UC08] Xep lop cho hoc vien...")
    approve_data = {
        "classId": 1
    }
    status, app_res = send_request(
        f"{BASE_URL}/enrollments/{enrollment_id}/approve",
        method="PATCH",
        data=approve_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert status == 200, f"Expected 200, got {status} - {app_res}"
    print("  => OK (Student enrolled into Class 1)")
    
    # ----------------------------------------------------
    # UC10: Xem thời khóa biểu
    # ----------------------------------------------------
    print("\n[UC10] Getting student timetable...")
    status, timetable_res = send_request(
        f"{BASE_URL}/classes/timetable",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert status == 200
    assert len(timetable_res["data"]) >= 1
    print("  => OK (Timetable contains: {})".format([s["title"] for s in timetable_res["data"]]))
    
    # ----------------------------------------------------
    # UC11: Tải tài liệu học tập
    # ----------------------------------------------------
    print("\n[UC11] Teacher uploads material to Class 1...")
    m_fields = {
        "title": "Introduction Syllabus",
        "materialType": "PDF"
    }
    m_files = {
        "file": ("syllabus.pdf", b"fake pdf syllabus content")
    }
    m_content_type, m_body = encode_multipart_formdata(m_fields, m_files)
    status, mat_upload_res = send_request(
        f"{BASE_URL}/classes/1/materials",
        method="POST",
        data=m_body,
        headers={"Content-Type": m_content_type, "Authorization": f"Bearer {teacher_token}"},
        is_json=False
    )
    assert status == 201, f"Expected 201, got {status} - {mat_upload_res}"
    print("  => Material uploaded.")
    
    print("[UC11] Student downloads/views materials of Class 1...")
    status, mat_res = send_request(
        f"{BASE_URL}/classes/1/materials",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert status == 200
    assert len(mat_res["data"]) >= 1
    print("  => OK (Materials list: {})".format([m["title"] for m in mat_res["data"]]))
    
    # ----------------------------------------------------
    # UC12: Xem và nộp bài tập
    # ----------------------------------------------------
    print("\n[UC12] Teacher creates an assignment for Class 1...")
    assign_data = {
        "title": "IELTS Essay Writing 1",
        "description": "Write a 250-word essay about environment.",
        "dueDate": "2028-12-31T23:59:59",  # far in future
        "maxScore": 10
    }
    status, assign_create_res = send_request(
        f"{BASE_URL}/classes/1/assignments",
        method="POST",
        data=assign_data,
        headers={"Authorization": f"Bearer {teacher_token}"}
    )
    assert status == 201, f"Expected 201, got {status} - {assign_create_res}"
    assignment_id = assign_create_res["data"]["id"]
    print("  => Assignment created. ID: {}".format(assignment_id))
    
    print("[UC12] Student views assignments...")
    status, view_assign_res = send_request(
        f"{BASE_URL}/classes/1/assignments",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert status == 200
    assert len(view_assign_res["data"]) >= 1
    print("  => OK (Assignments: {})".format([a["title"] for a in view_assign_res["data"]]))
    
    print("[UC12] Student submits assignment...")
    sub_fields = {
        "content": "Here is my 250-word essay draft."
    }
    sub_files = {
        "file": ("my_essay.pdf", b"fake essay content")
    }
    sub_content_type, sub_body = encode_multipart_formdata(sub_fields, sub_files)
    status, sub_res = send_request(
        f"{BASE_URL}/assignments/{assignment_id}/submissions",
        method="POST",
        data=sub_body,
        headers={"Content-Type": sub_content_type, "Authorization": f"Bearer {student_token}"},
        is_json=False
    )
    assert status == 200, f"Expected 200, got {status} - {sub_res}"
    submission_id = sub_res["data"]["id"]
    print("  => OK (Submission ID: {})".format(submission_id))
    
    # ----------------------------------------------------
    # UC13: Tra cứu kết quả học tập & Chấm điểm & Điểm danh
    # ----------------------------------------------------
    print("\n[UC13] Teacher grades the submission...")
    grade_data = {
        "score": 9.00,
        "teacherFeedback": "Very good arguments, minor grammatical errors."
    }
    status, grade_res = send_request(
        f"{BASE_URL}/submissions/{submission_id}/score",
        method="POST",
        data=grade_data,
        headers={"Authorization": f"Bearer {teacher_token}"}
    )
    assert status == 200, f"Expected 200, got {status} - {grade_res}"
    print("  => Submission graded.")
    
    print("[UC13] Student checks scores...")
    status, scores_res = send_request(
        f"{BASE_URL}/student/me/scores",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert status == 200
    assert len(scores_res["data"]) >= 1
    print("  => OK (Grades feedback: {})".format(scores_res["data"][0]["teacherFeedback"]))
    
    print("[UC13] Teacher takes attendance for Session 1...")
    # Session 1 was seeded in Class 1
    att_data = {
        "records": [
            {
                "studentId": student_id,
                "status": "present",
                "note": "On time"
            }
        ]
    }
    status, att_take_res = send_request(
        f"{BASE_URL}/classes/1/sessions/1/attendance",
        method="POST",
        data=att_data,
        headers={"Authorization": f"Bearer {teacher_token}"}
    )
    assert status == 200, f"Expected 200, got {status} - {att_take_res}"
    print("  => Attendance taken.")
    
    print("[UC13] Student checks attendance...")
    status, att_res = send_request(
        f"{BASE_URL}/student/me/attendance",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert status == 200
    assert len(att_res["data"]) >= 1
    print("  => OK (Attendance status: {})".format(att_res["data"][0]["status"]))
    
    # ----------------------------------------------------
    # UC02: Đăng xuất
    # ----------------------------------------------------
    print("\n[UC02] Student logging out...")
    status, logout_res = send_request(
        f"{BASE_URL}/auth/logout",
        method="POST",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert status == 200
    assert logout_res["success"] is True
    print("  => OK (Logout response: {})".format(logout_res["message"]))
    
    print("\n=== ALL 13 USE CASES VERIFIED SUCCESSFULLY ===")

if __name__ == "__main__":
    run_tests()
