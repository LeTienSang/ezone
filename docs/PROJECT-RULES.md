# PROJECT-RULES.md — Quy ước & Tiêu chuẩn dự án ezone

> **Mục đích:** Tài liệu này là nguồn sự thật duy nhất (Single Source of Truth) về các quy ước lập trình, đặt tên và quy trình làm việc. Mọi AI agent và lập trình viên **PHẢI** tuân theo trước khi sinh code.

---

## 1. Tổng quan dự án

| Thuộc tính | Giá trị |
|---|---|
| Tên | ezone |
| Mô tả | Hệ thống tích hợp Landing Page + LMS (Learning Management System) |
| Quy mô | 2 lập trình viên |
| Kiến trúc | Decoupled Architecture (Frontend ↔ Backend qua RESTful API / JSON) |
| Ngôn ngữ tài liệu | **Tiếng Việt** (chuỗi UI, tài liệu, chú thích code) |

### Cấu trúc thư mục gốc

```
ezone/
├── .agent/          ← Tài liệu dự án (PROJECT-RULES, ARCHITECTURE, API_SPEC, DATABASE)
├── backend/              ← Backend (Java Spring Boot)
└── frontend/              ← Frontend (ReactJS + TypeScript)
```

---

## 2. Quy ước đặt tên

### 2.1 Tên bảng cơ sở dữ liệu (KHÔNG được thay đổi)

Các định danh sau là **cố định**, dùng nhất quán trong DB, Entity, DTO, API path và comment:

```
USERS | COURSES_CATALOG | INSTRUCTORS | ENROLLMENTS
CLASSES | CLASS_MEMBERS | CLASS_SESSIONS | MATERIALS
ASSIGNMENTS | SUBMISSIONS | SCORES | ATTENDANCE | PAYMENTS
```

### 2.2 Backend (Java / Spring Boot)

| Thành phần | Convention | Ví dụ |
|---|---|---|
| Package gốc | `com.ezone.<module>` | `com.ezone.user` |
| Entity class | `PascalCase`, ánh xạ tên bảng | `User`, `CoursesCatalog` |
| Tên bảng (`@Table`) | `SCREAMING_SNAKE_CASE` | `@Table(name = "COURSES_CATALOG")` |
| Repository | `<Entity>Repository` | `UserRepository` |
| Service | `<Entity>Service` / `<Entity>ServiceImpl` | `EnrollmentService` |
| Controller | `<Entity>Controller` | `ClassSessionController` |
| DTO (request) | `<Action><Entity>Request` | `CreateAssignmentRequest` |
| DTO (response) | `<Entity>Response` | `SubmissionResponse` |
| Tên phương thức | `camelCase`, động từ đầu | `findAllByClassId()` |
| Hằng số | `SCREAMING_SNAKE_CASE` | `MAX_FILE_SIZE_MB` |
| Annotation bảo mật | Luôn dùng `@PreAuthorize` trên Controller | `@PreAuthorize("hasRole('ADMIN')")` |

### 2.3 Frontend (TypeScript / ReactJS)

| Thành phần | Convention | Ví dụ |
|---|---|---|
| Component | `PascalCase`, file `.tsx` | `CourseCard.tsx` |
| Hook | `use` + `PascalCase` | `useAttendance.ts` |
| Service/API call | `<entity>Service.ts` | `submissionService.ts` |
| Interface / Type | `I` prefix hoặc mô tả rõ | `IUser`, `CourseResponse` |
| Biến / hàm | `camelCase` | `handleSubmit`, `courseList` |
| Hằng số | `SCREAMING_SNAKE_CASE` | `API_BASE_URL` |
| Đường dẫn route | `kebab-case` | `/quan-ly-lop-hoc` |
| CSS class (Tailwind) | Utility-first, không viết CSS thuần | — |

---

## 3. Phân quyền & Vai trò (Role-based)

| Role | Mô tả | Phạm vi truy cập |
|---|---|---|
| `ADMIN` | Quản trị viên | Toàn bộ hệ thống, Dashboard |
| `TEACHER` | Giảng viên | Lớp học phụ trách, bài tập, điểm danh |
| `STUDENT` | Học viên | LMS cá nhân, nộp bài, xem điểm |
| `GUEST` | Khách vãng lai | Landing Page công khai |

**Quy tắc bắt buộc:**
- Mọi endpoint Backend (trừ `/api/auth/**` và public GET) phải có `@PreAuthorize`.
- Frontend phải kiểm tra Role từ JWT payload trước khi render route/component nhạy cảm.
- Không bao giờ để lộ thông tin Role trong URL.

---

## 4. Quy ước API

*(Chi tiết đầy đủ tại `API_SPEC.md`)*

- **Base URL:** `/api/v1`
- **Định dạng:** JSON (`Content-Type: application/json`)
- **Xác thực:** `Authorization: Bearer <JWT>`
- **HTTP Method:** `GET` đọc, `POST` tạo, `PUT` cập nhật toàn bộ, `PATCH` cập nhật một phần, `DELETE` xóa
- **Mã lỗi:** Trả về đối tượng `{ "code": "ERR_CODE", "message": "Mô tả lỗi bằng tiếng Việt" }`

---

## 5. Giới hạn hệ thống (Không vượt phạm vi)

> AI agent **KHÔNG ĐƯỢC** tự ý tích hợp các tính năng ngoài danh sách sau:

| Tính năng ngoài phạm vi | Lý do |
|---|---|
| Cổng thanh toán tự động (VNPay, Momo, Paypal) | Chỉ dùng upload hóa đơn + Admin duyệt thủ công |
| Real-time Video Call / Video Streaming nội bộ | Chỉ đính kèm link Zoom/Meet ngoài vào `CLASS_SESSIONS` |
| Video Streaming dung lượng lớn | Chỉ lưu PDF, Word, Image |
| WebSocket / Push Notification | Không trong phạm vi MVP hiện tại |

---

## 6. Quy ước Git

```
feat/<ten-tinh-nang>     ← Tính năng mới
fix/<mo-ta-loi>          ← Sửa lỗi
refactor/<mo-ta>         ← Tái cấu trúc code
docs/<mo-ta>             ← Cập nhật tài liệu
```

**Commit message:** `[BE/FE] <loại>: <mô tả ngắn bằng tiếng Việt>`
Ví dụ: `[BE] feat: Thêm API chấm điểm bài nộp`

---

## 7. Quy ước chú thích code

- **Tiếng Việt** cho mọi chú thích giải thích nghiệp vụ.
- `// TODO:` cho công việc còn dang dở.
- `// FIXME:` cho lỗi đã biết cần sửa.
- Javadoc/TSDoc cho mọi public method/function có logic phức tạp.

---

## 8. Checklist trước khi commit

- [ ] Code đã qua Postman test (đối với BE endpoint mới)
- [ ] TypeScript không có lỗi `tsc --noEmit` (FE)
- [ ] Không có thông tin nhạy cảm (token, password, key) trong code
- [ ] Tên bảng DB khớp với 13 định danh cố định ở mục 2.1
- [ ] Phân quyền `@PreAuthorize` đã được thêm vào Controller mới