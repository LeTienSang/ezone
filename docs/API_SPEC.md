# API_SPEC.md — Đặc tả API Contract (Frontend ↔ Backend)

> **Mục đích:** Là hợp đồng kỹ thuật giữa FE và BE. Mọi thay đổi endpoint phải cập nhật file này trước.

---

## Quy ước chung

| Thuộc tính | Giá trị |
|---|---|
| Base URL | `/api/v1` |
| Định dạng | `Content-Type: application/json` |
| Xác thực | `Authorization: Bearer <JWT>` |
| Ngôn ngữ message lỗi | Tiếng Việt |

### Cấu trúc Response chuẩn

```json
// Thành công
{
  "success": true,
  "data": { ... },
  "message": "Thao tác thành công"
}

// Thất bại
{
  "success": false,
  "data": null,
  "code": "ERR_NOT_FOUND",
  "message": "Không tìm thấy tài nguyên yêu cầu"
}
```

### HTTP Status Code

| Code | Ý nghĩa |
|---|---|
| `200` | Thành công (GET, PUT, PATCH) |
| `201` | Tạo mới thành công (POST) |
| `400` | Dữ liệu đầu vào không hợp lệ |
| `401` | Chưa xác thực (thiếu/hết hạn JWT) |
| `403` | Không có quyền truy cập |
| `404` | Không tìm thấy tài nguyên |
| `409` | Xung đột dữ liệu (email trùng, lớp đầy...) |
| `500` | Lỗi server nội bộ |

---

## Nhóm 1: Xác thực (`/auth`)

### POST `/api/v1/auth/login` — Đăng nhập

**Quyền:** Public

**Request Body:**
```json
{
  "email": "nguoidung@email.com",
  "password": "matkhau123"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "userId": 1,
    "fullName": "Nguyễn Văn A",
    "role": "STUDENT"
  }
}
```

**Lỗi:** `401` — Sai tài khoản hoặc mật khẩu | `403` — Tài khoản bị khóa

---

### POST `/api/v1/auth/register` — Đăng ký tài khoản mới

**Quyền:** Public (Guest)

**Request Body:**
```json
{
  "fullName": "Lê Văn B",
  "email": "levb@email.com",
  "phone": "0901234567",
  "password": "matkhau123"
}
```

**Response 201:** Trả về thông tin user mới tạo (không có password).

**Lỗi:** `409` — Email đã tồn tại

---

## Nhóm 2: Người dùng & Hồ sơ (`/users`)

### GET `/api/v1/users/me` — Lấy thông tin cá nhân

**Quyền:** STUDENT, TEACHER, ADMIN

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Lê Văn B",
    "email": "levb@email.com",
    "phone": "0901234567",
    "role": "STUDENT",
    "avatar": "/uploads/avatars/1.jpg"
  }
}
```

---

### PATCH `/api/v1/users/me` — Cập nhật hồ sơ cá nhân

**Quyền:** STUDENT, TEACHER, ADMIN

**Request Body** (chỉ gửi trường cần thay đổi):
```json
{
  "phone": "0909999999",
  "avatar": "/uploads/avatars/1_new.jpg"
}
```

---

### GET `/api/v1/users` — Danh sách tất cả người dùng

**Quyền:** ADMIN

**Query params:** `?role=STUDENT&page=0&size=20`

---

### PATCH `/api/v1/users/{id}/toggle-active` — Khóa/Mở tài khoản

**Quyền:** ADMIN

**Lỗi:** `400` — Không thể khóa tài khoản đang đăng nhập

---

## Nhóm 3: Khóa học Landing Page (`/courses`)

### GET `/api/v1/courses` — Danh mục khóa học

**Quyền:** Public

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "courseName": "IELTS Foundation",
      "description": "Khóa học nền tảng cho người mới bắt đầu",
      "price": 3500000,
      "duration": "3 tháng",
      "level": "Beginner",
      "thumbnail": "/uploads/courses/ielts.jpg"
    }
  ]
}
```

---

### GET `/api/v1/courses/{id}` — Chi tiết khóa học

**Quyền:** Public

---

### POST `/api/v1/courses` — Tạo khóa học mới

**Quyền:** ADMIN

---

### PUT `/api/v1/courses/{id}` — Cập nhật khóa học

**Quyền:** ADMIN

---

## Nhóm 4: Giảng viên (`/instructors`)

### GET `/api/v1/instructors` — Danh sách giảng viên

**Quyền:** Public

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 5,
      "fullName": "Trần Thị C",
      "avatar": "/uploads/avatars/5.jpg",
      "specialization": "IELTS",
      "experienceYears": 7,
      "bio": "Giảng viên IELTS với 7 năm kinh nghiệm...",
      "rating": 4.85
    }
  ]
}
```

---

## Nhóm 5: Đăng ký tư vấn (`/enrollments`)

### POST `/api/v1/enrollments` — Gửi yêu cầu tư vấn

**Quyền:** Public (Guest)

**Request Body:**
```json
{
  "fullName": "Nguyễn Thị D",
  "phone": "0912345678",
  "email": "ntd@email.com",
  "courseId": 1
}
```

**Response 201:** Bản ghi `ENROLLMENTS` trạng thái `pending`

---

### GET `/api/v1/enrollments` — Danh sách đơn đăng ký

**Quyền:** ADMIN

**Query params:** `?status=pending&page=0&size=20`

---

### PATCH `/api/v1/enrollments/{id}/approve` — Phê duyệt xếp lớp

**Quyền:** ADMIN

**Request Body:**
```json
{
  "classId": 3
}
```

**Lỗi:** `409` — Lớp học đã đầy sĩ số

---

### PATCH `/api/v1/enrollments/{id}/reject` — Từ chối đơn

**Quyền:** ADMIN

---

## Nhóm 6: Lớp học (`/classes`)

### GET `/api/v1/classes` — Danh sách lớp học

**Quyền:** ADMIN

---

### POST `/api/v1/classes` — Tạo lớp học mới

**Quyền:** ADMIN

**Request Body:**
```json
{
  "courseId": 1,
  "instructorId": 2,
  "className": "IELTS-2024-K01",
  "startDate": "2024-09-01",
  "endDate": "2024-12-01",
  "maxStudents": 20
}
```

---

### GET `/api/v1/classes/my` — Lớp học của tôi

**Quyền:** STUDENT (lớp đang tham gia), TEACHER (lớp đang phụ trách)

---

### GET `/api/v1/classes/{id}/sessions` — Lịch buổi học của lớp

**Quyền:** STUDENT (thành viên lớp), TEACHER (phụ trách lớp), ADMIN

---

### PUT `/api/v1/classes/{classId}/sessions/{sessionId}` — Cập nhật buổi học

**Quyền:** TEACHER (phụ trách lớp)

**Request Body:**
```json
{
  "title": "Bài 5: Reading Comprehension",
  "content": "Luyện tập đọc hiểu dạng bài True/False/Not Given",
  "room": "https://meet.google.com/abc-xyz"
}
```

---

## Nhóm 7: Thành viên lớp (`/classes/{classId}/members`)

### GET `/api/v1/classes/{classId}/members` — Danh sách học viên trong lớp

**Quyền:** TEACHER (phụ trách), ADMIN

---

## Nhóm 8: Điểm danh (`/attendance`)

### GET `/api/v1/classes/{classId}/sessions/{sessionId}/attendance` — Xem điểm danh buổi học

**Quyền:** TEACHER (phụ trách), ADMIN

---

### POST `/api/v1/classes/{classId}/sessions/{sessionId}/attendance` — Ghi nhận điểm danh

**Quyền:** TEACHER

**Request Body:**
```json
{
  "records": [
    { "studentId": 10, "status": "present", "note": "" },
    { "studentId": 11, "status": "absent", "note": "Xin phép" },
    { "studentId": 12, "status": "late",   "note": "Muộn 15 phút" }
  ]
}
```

---

### GET `/api/v1/student/me/attendance` — Lịch sử điểm danh của học viên

**Quyền:** STUDENT

---

## Nhóm 9: Tài liệu (`/materials`)

### GET `/api/v1/classes/{classId}/materials` — Danh sách tài liệu lớp

**Quyền:** STUDENT (thành viên), TEACHER (phụ trách), ADMIN

---

### POST `/api/v1/classes/{classId}/materials` — Đăng tải tài liệu mới

**Quyền:** TEACHER

**Request:** `multipart/form-data` — trường `file` + `title` + `materialType`

**Lỗi:** `400` — Định dạng file không được hỗ trợ (.exe, .bat, ...)

---

### DELETE `/api/v1/classes/{classId}/materials/{materialId}` — Xóa tài liệu

**Quyền:** TEACHER (phụ trách lớp), ADMIN

---

## Nhóm 10: Bài tập (`/assignments`)

### GET `/api/v1/classes/{classId}/assignments` — Danh sách bài tập lớp

**Quyền:** STUDENT (thành viên), TEACHER (phụ trách), ADMIN

**Response 200** (dành cho STUDENT, kèm trạng thái nộp bài):
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "title": "Bài tập Reading Unit 3",
      "description": "Làm bài tập trang 45–47 SGK",
      "dueDate": "2024-10-15T23:59:00",
      "maxScore": 10,
      "submissionStatus": "submitted"
    }
  ]
}
```

---

### POST `/api/v1/classes/{classId}/assignments` — Tạo bài tập mới

**Quyền:** TEACHER

**Request Body:**
```json
{
  "title": "Bài tập Writing Task 2",
  "description": "Viết essay 250 từ về chủ đề môi trường",
  "dueDate": "2024-10-20T23:59:00",
  "maxScore": 10
}
```

**Lỗi:** `400` — Hạn nộp bài không được nhỏ hơn thời gian hiện tại

---

## Nhóm 11: Bài nộp (`/submissions`)

### POST `/api/v1/assignments/{assignmentId}/submissions` — Nộp bài tập

**Quyền:** STUDENT

**Request:** `multipart/form-data` — trường `file` (tùy chọn) + `content` (mô tả)

**Lỗi:** `400` — Quá hạn nộp bài | `400` — Định dạng/dung lượng file không hợp lệ

---

### GET `/api/v1/assignments/{assignmentId}/submissions` — Danh sách bài nộp

**Quyền:** TEACHER (phụ trách lớp), ADMIN

---

### GET `/api/v1/assignments/{assignmentId}/submissions/me` — Bài nộp của tôi

**Quyền:** STUDENT

---

## Nhóm 12: Chấm điểm (`/scores`)

### POST `/api/v1/submissions/{submissionId}/score` — Chấm điểm bài nộp

**Quyền:** TEACHER

**Request Body:**
```json
{
  "score": 8.5,
  "teacherFeedback": "Bài viết có cấu trúc tốt, cần cải thiện từ vựng học thuật."
}
```

**Lỗi:** `400` — Điểm số vượt thang điểm tối đa

---

### GET `/api/v1/student/me/scores` — Kết quả học tập của học viên

**Quyền:** STUDENT

---

## Nhóm 13: Thanh toán (`/payments`)

### POST `/api/v1/payments` — Học viên gửi minh chứng thanh toán

**Quyền:** STUDENT

**Request:** `multipart/form-data` — trường `enrollmentId` + `amount` + `paymentMethod` + `transactionId` + `receiptImage`

**Lỗi:** `400` — Chưa tải lên ảnh minh chứng

---

### GET `/api/v1/payments` — Danh sách thanh toán cần xác nhận

**Quyền:** ADMIN

**Query params:** `?status=pending`

---

### PATCH `/api/v1/payments/{id}/confirm` — Xác nhận thanh toán thành công

**Quyền:** ADMIN

---

### PATCH `/api/v1/payments/{id}/reject` — Từ chối thanh toán

**Quyền:** ADMIN

**Request Body:**
```json
{
  "reason": "Ảnh minh chứng không khớp số tiền thực tế"
}
```

---

## Nhóm 14: Thống kê (`/reports`)

### GET `/api/v1/reports/revenue` — Thống kê doanh thu theo tháng

**Quyền:** ADMIN

**Query params:** `?year=2024`

---

### GET `/api/v1/reports/attendance` — Thống kê chuyên cần

**Quyền:** ADMIN

**Query params:** `?classId=3`

---

### GET `/api/v1/reports/enrollments` — Thống kê đăng ký mới

**Quyền:** ADMIN

**Query params:** `?month=10&year=2024`