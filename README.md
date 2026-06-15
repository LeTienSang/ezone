# Ezone LMS

Ezone là hệ thống quản lý khóa học và đào tạo trực tuyến (LMS) theo kiến trúc tách rời Frontend và Backend.

## Công nghệ sử dụng

- Frontend: React + TypeScript + Vite
- Backend: Spring Boot 3 + Spring Security + Spring Data JPA
- Cơ sở dữ liệu: MySQL
- Xác thực: JWT (kèm Google OAuth2 ID Token verification)

## Kiến trúc tổng quan

- `frontend/`: Giao diện người dùng (Landing + LMS)
- `backend/`: REST API, xử lý nghiệp vụ, phân quyền và truy cập dữ liệu
- `docs/`: Tài liệu đặc tả nghiệp vụ, API, kiến trúc và DB

Frontend giao tiếp Backend qua API theo base path `/api/v1`.
Khi chạy local bằng Vite, các request `/api` và `/uploads` được proxy sang `http://localhost:8080`.

## Yêu cầu môi trường

- Node.js 20+
- npm 10+
- Java 21
- Maven 3.9+
- MySQL 8+

## Cấu hình Backend

File cấu hình chính: `backend/src/main/resources/application.properties`

Thông tin mặc định hiện tại:

- Database URL: `jdbc:mysql://localhost:3306/ezone_lms`
- Username: `root`
- Password: `123456`
- Server port: `8080`

Lưu ý: Nên đổi thông tin database/password phù hợp với môi trường máy bạn trước khi chạy.

## Cách chạy dự án (nhanh)

Mở 2 terminal riêng:

### 1. Chạy Backend

```bash
cd backend
mvn spring-boot:run
```

Backend mặc định tại: `http://localhost:8080`

Swagger UI (nếu bật thành công): `http://localhost:8080/swagger-ui/index.html`

### 2. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend mặc định tại: `http://localhost:5173`

## Quy trình khởi tạo cơ sở dữ liệu

- Backend đang cấu hình:
	- `spring.jpa.hibernate.ddl-auto=none`
	- `spring.sql.init.mode=always`
	- `spring.sql.init.schema-locations=classpath:schema.sql`
- File schema nằm tại: `backend/src/main/resources/schema.sql`

Khi backend khởi động, hệ thống sẽ cố gắng chạy schema để khởi tạo dữ liệu nền.

## Scripts hữu ích

### Frontend

```bash
npm run dev      # Chạy môi trường phát triển
npm run build    # Build production
npm run preview  # Preview bản build
npm run lint     # Kiểm tra lint
```

### Backend

```bash
mvn spring-boot:run   # Chạy ứng dụng
mvn test              # Chạy unit test
mvn clean package     # Build artifact
```

## Phân quyền chính trong hệ thống

- `GUEST`: Xem landing page, đăng ký tài khoản
- `STUDENT`: Xem lịch học, nộp bài, theo dõi điểm và học phí
- `TEACHER`: Quản lý lớp, tài liệu, bài tập, chấm điểm
- `ADMIN`: Quản lý người dùng, khóa học, lớp học, thanh toán, báo cáo

## Tài liệu tham khảo

Toàn bộ tài liệu nằm trong thư mục `docs/`:

- `PRD.md`: Đặc tả yêu cầu sản phẩm
- `ARCHITECTURE.md`: Thiết kế kiến trúc tổng thể
- `DATABASE.md`: Thiết kế cơ sở dữ liệu
- `API_SPEC.md`: Đặc tả API contract Frontend-Backend
- `PROJECT-RULES.md`: Quy chuẩn code dự án

## Cấu trúc thư mục chính

```text
ezone/
|- backend/
|  |- src/main/java/com/ezone
|  |- src/main/resources/application.properties
|  |- src/main/resources/schema.sql
|  |- pom.xml
|- frontend/
|  |- src/
|  |- public/
|  |- package.json
|- docs/
|  |- PRD.md
|  |- API_SPEC.md
|  |- ARCHITECTURE.md
|- README.md
```

## Ghi chú phát triển

- Frontend hiện đang gọi API bằng đường dẫn tương đối (`/api/...`) để tận dụng Vite proxy khi dev.
- Nếu đổi port backend, cần cập nhật `frontend/vite.config.ts`.
- Khi gặp lỗi 401, frontend sẽ tự động xóa session (`token`, `user`) và điều hướng về trang login.

