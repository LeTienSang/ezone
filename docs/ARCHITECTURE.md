# ARCHITECTURE.md — Thiết kế tổng thể hệ thống ezone

> **Mục đích:** Mô tả kiến trúc, luồng dữ liệu, phân tầng trách nhiệm và các quyết định kỹ thuật cốt lõi của hệ thống.

---

## 1. Sơ đồ kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                                                                 │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │              ReactJS + TypeScript + Tailwind CSS         │  │
│   │                                                          │  │
│   │  ┌─────────────────┐    ┌──────────────────────────────┐ │  │
│   │  │  Landing Page   │    │   LMS (Admin/Teacher/Student)│ │  │
│   │  │  (Public)       │    │   (Protected Routes)         │ │  │
│   │  └─────────────────┘    └──────────────────────────────┘ │  │
│   └──────────────────────────────────────────────────────────┘  │
│                    ↕ RESTful API (JSON)                          │
│                    ↕ Authorization: Bearer <JWT>                 │
└─────────────────────────────────────────────────────────────────┘
                             ↕
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                             │
│                                                                 │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │               Java Spring Boot                           │  │
│   │                                                          │  │
│   │  Spring Security (JWT Filter) → Controller → Service     │  │
│   │         ↓                                                │  │
│   │  Spring Data JPA (Repository)                            │  │
│   └──────────────────────────────────────────────────────────┘  │
│                             ↕                                   │
└─────────────────────────────────────────────────────────────────┘
                             ↕
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                │
│                       MySQL Database                            │
│  (13 bảng, ràng buộc khóa ngoại, đảm bảo toàn vẹn dữ liệu)    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Phân tầng Backend (Spring Boot)

### Cấu trúc thư mục `backend/`

```
backend/
└── src/main/java/com/ezone/
    ├── config/
    │   ├── SecurityConfig.java       ← Cấu hình Spring Security + JWT filter
    │   ├── CorsConfig.java           ← Cho phép FE gọi API
    │   └── AppConfig.java
    ├── auth/
    │   ├── AuthController.java       ← POST /api/v1/auth/login, /register
    │   ├── AuthService.java
    │   └── JwtUtil.java              ← Tạo / xác thực JWT
    ├── user/                         ← Module USERS + INSTRUCTORS
    ├── course/                       ← Module COURSES_CATALOG
    ├── enrollment/                   ← Module ENROLLMENTS
    ├── payment/                      ← Module PAYMENTS
    ├── classroom/                    ← Module CLASSES + CLASS_MEMBERS + CLASS_SESSIONS
    ├── attendance/                   ← Module ATTENDANCE
    ├── material/                     ← Module MATERIALS
    ├── assignment/                   ← Module ASSIGNMENTS + SUBMISSIONS + SCORES
    └── common/
        ├── exception/                ← GlobalExceptionHandler, custom exceptions
        ├── dto/                      ← BaseResponse<T>
        └── util/
```

### Luồng xử lý request BE

```
HTTP Request
    → JwtAuthFilter (xác thực token, set SecurityContext)
    → Controller (@PreAuthorize kiểm tra Role)
    → Service (xử lý logic nghiệp vụ)
    → Repository (truy vấn DB qua Spring Data JPA)
    → Entity → DB (MySQL)
    ← DTO Response (JSON)
```

---

## 3. Phân tầng Frontend (ReactJS)

### Cấu trúc thư mục `frontend/`

```
frontend/
└── src/
    ├── components/           ← UI components tái sử dụng
    │   ├── common/           ← Button, Input, Modal, Table, ...
    │   ├── landing/          ← CourseCard, InstructorCard, EnrollForm
    │   └── lms/              ← AssignmentCard, AttendanceTable, ScorePanel
    ├── pages/
    │   ├── public/           ← Trang Landing Page (Guest)
    │   │   ├── HomePage.tsx
    │   │   ├── CoursesPage.tsx
    │   │   └── InstructorsPage.tsx
    │   ├── student/          ← Trang LMS học viên
    │   ├── teacher/          ← Trang LMS giảng viên
    │   └── admin/            ← Trang Dashboard quản trị
    ├── services/             ← Gọi API (axios wrapper)
    │   ├── authService.ts
    │   ├── courseService.ts
    │   ├── classService.ts
    │   ├── assignmentService.ts
    │   └── ...
    ├── hooks/                ← Custom React Hooks
    ├── types/                ← TypeScript Interface (khớp với BE DTO)
    │   ├── user.types.ts
    │   ├── course.types.ts
    │   └── ...
    ├── context/              ← AuthContext (lưu JWT, Role)
    ├── router/               ← Route definitions + ProtectedRoute
    └── utils/                ← Format date, format tiền tệ VND, ...
```

### Luồng xác thực FE

```
1. User nhập email + password
2. POST /api/v1/auth/login
3. Nhận JWT → lưu vào localStorage (key: "ezone_token")
4. Decode JWT payload → lấy role, userId
5. AuthContext cung cấp { user, role, isAuthenticated }
6. ProtectedRoute kiểm tra role → render đúng trang hoặc redirect
```

---

## 4. Xác thực & Phân quyền

### JWT Payload

```json
{
  "sub": "user@example.com",
  "userId": 1,
  "role": "STUDENT",
  "iat": 1700000000,
  "exp": 1700086400
}
```

### Ma trận phân quyền (Route → Role)

| Nhóm route | GUEST | STUDENT | TEACHER | ADMIN |
|---|---|---|---|---|
| `/` (Landing Page) | ✅ | ✅ | ✅ | ✅ |
| `/courses` | ✅ | ✅ | ✅ | ✅ |
| `/auth/login` | ✅ | — | — | — |
| `/student/**` | ❌ | ✅ | ❌ | ❌ |
| `/teacher/**` | ❌ | ❌ | ✅ | ❌ |
| `/admin/**` | ❌ | ❌ | ❌ | ✅ |

---

## 5. Chiến lược lưu trữ file

| Loại file | Định dạng cho phép | Nơi lưu |
|---|---|---|
| Tài liệu học tập (`MATERIALS`) | PDF, DOCX, Image | Server local / Cloud storage |
| Bài nộp học viên (`SUBMISSIONS`) | PDF, DOCX, Image | Server local / Cloud storage |
| Minh chứng thanh toán (`PAYMENTS`) | Image (JPG, PNG) | Server local / Cloud storage |
| Ảnh đại diện (`USERS`) | Image (JPG, PNG) | Server local / Cloud storage |

> ⚠️ **Không hỗ trợ** Video Streaming dung lượng lớn. Với video bài giảng, chỉ lưu URL liên kết ngoài vào trường `file_url` của `MATERIALS`.

---

## 6. Các quyết định kỹ thuật quan trọng

| Quyết định | Lý do |
|---|---|
| Decoupled FE/BE | Dễ phát triển song song với 2 dev, dễ deploy độc lập |
| TypeScript (FE) | Phát hiện lỗi sớm, Interface khớp với DTO của BE |
| JWT Stateless | Phù hợp kiến trúc REST, không cần session server-side |
| Spring Data JPA | Giảm boilerplate SQL, đảm bảo type-safe query |
| MySQL | RDBMS mạnh, ràng buộc FK đảm bảo toàn vẹn 13 bảng |
| Tailwind CSS | Responsive nhanh, không cần viết CSS thuần |
| Thanh toán thủ công | Đơn giản hóa MVP, tránh phụ thuộc cổng bên thứ ba |

---

## 7. Môi trường & Cổng mặc định

| Service | Cổng | Ghi chú |
|---|---|---|
| Frontend (React dev) | `3000` | `npm run dev` |
| Backend (Spring Boot) | `8080` | `mvn spring-boot:run` |
| MySQL | `3306` | Database: `ezone_db` |

**CORS:** BE chỉ chấp nhận request từ `http://localhost:3000` (dev) và domain production được cấu hình trong `CorsConfig.java`.