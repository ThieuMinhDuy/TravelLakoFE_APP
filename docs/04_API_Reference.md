# Tài liệu 04: Tài liệu Tham khảo API (API Reference)

Tài liệu này liệt kê toàn bộ hệ thống API Endpoints của dự án **TravelLako**. Tất cả các endpoint đều có tiền tố mặc định là `/api` (Ví dụ: `http://localhost:5000/api`).

---

## 1. API Xác thực người dùng (Authentication - `/api/auth`)

Tất cả các API này phục vụ việc xác thực. Ở môi trường Web, token tự động lưu vào Cookie. Ở môi trường Mobile, token được trả về trong body và gửi lên qua header `Authorization: Bearer <token>`.

| Phương thức | Endpoint | Yêu cầu Auth | Mô tả | Request Body / Parameters |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Không | Đăng ký tài khoản (Gửi mã OTP về email) | `{ name, email, password }` |
| **POST** | `/auth/login` | Không | Đăng nhập tài khoản | `{ email, password }` |
| **POST** | `/auth/logout` | Có (protect) | Đăng xuất (xóa cookie) | Không |
| **POST** | `/auth/verify-otp` | Không | Nhập mã OTP để kích hoạt tài khoản | `{ email, otp }` |
| **POST** | `/auth/resend-otp` | Không | Gửi lại mã kích hoạt OTP | `{ email }` |
| **POST** | `/auth/forgot-password` | Không | Yêu cầu cấp OTP để quên mật khẩu | `{ email }` |
| **POST** | `/auth/reset-password` | Không | Đặt lại mật khẩu bằng mã OTP | `{ email, otp, newPassword }` |
| **GET** | `/auth/profile` | Có (protect) | Lấy thông tin cá nhân hiện tại | Không |
| **PUT** | `/auth/profile` | Có (protect) | Cập nhật thông tin cá nhân | `{ name, avatar, phone, gender, dateOfBirth, travelPreferences, favoriteBudget, password }` |

---

## 2. API Thành phố & Địa điểm (Cities & Places)

Các API dùng cho việc hiển thị danh sách, tìm kiếm và xem chi tiết.

### A. Thành phố (`/api/cities`)
*   **`GET /cities`** (Không yêu cầu Auth): Lấy danh sách thành phố.
    *   *Query Parameters:* `search` (Tìm kiếm theo tên thành phố - tùy chọn).
*   **`GET /cities/:id`** (Không yêu cầu Auth): Chi tiết thành phố theo ID.

### B. Địa điểm (`/api/places`)
*   **`GET /places/search`** (Không yêu cầu Auth): Tìm kiếm tổng hợp trên tất cả loại địa điểm (Global Search).
    *   *Query Parameters:* `q` (Từ khóa tìm kiếm theo tên), `city` (Lọc theo ID thành phố - tùy chọn).
*   **`GET /places/:type`** (Không yêu cầu Auth): Lấy danh sách địa điểm theo phân loại.
    *   *Path Parameters:* `type` (`attraction`, `hotel`, `restaurant`, `cafe`).
    *   *Query Parameters:* `city` (ID thành phố), `search` (Tên tìm kiếm), `stars` (Số sao - chỉ dành cho hotel), `minPrice` / `maxPrice` (Bộ lọc khoảng giá).
*   **`GET /places/:type/:id`** (Không yêu cầu Auth): Xem chi tiết một địa điểm cụ thể.

---

## 3. API Đánh giá & Yêu thích (Reviews & Favorites)

### A. Đánh giá (`/api/reviews`)
*   **`GET /reviews/:itemType/:itemId`** (Không yêu cầu Auth): Lấy toàn bộ đánh giá của 1 địa điểm.
    *   *Path Parameters:* `itemType` (`Attraction` | `Hotel` | `Restaurant` | `Cafe`), `itemId` (ID của địa điểm).
*   **`POST /reviews`** (Có Auth): Gửi đánh giá mới.
    *   *Request Body:* `{ itemType, itemId, rating, comment }` (Rating từ 1 -> 5).
*   **`DELETE /reviews/:id`** (Có Auth): Xóa đánh giá của chính mình.

### B. Địa điểm Yêu thích (`/api/favorites`)
*   **`GET /favorites`** (Có Auth): Lấy danh sách địa điểm yêu thích của tôi.
*   **`POST /favorites`** (Có Auth): Thêm một địa điểm vào danh sách yêu thích.
    *   *Request Body:* `{ itemType, itemId }`.
*   **`DELETE /favorites/:id`** (Có Auth): Hủy yêu thích (Truyền ID của bản ghi yêu thích).

---

## 4. API Quản lý Chuyến đi (Trip Manager - `/api/trips`)

Các API quản lý hành trình và timeline chuyến đi của người dùng.

*   **`POST /trips`** (Có Auth): Tạo chuyến đi mới (Backend tự tạo `schedule` các ngày trống).
    *   *Request Body:* `{ title, city, startDate, endDate, budget }`.
*   **`GET /trips`** (Có Auth): Lấy danh sách chuyến đi của tôi (Trả về phân nhóm: `upcoming` - sắp tới, `ongoing` - đang đi, `past` - lịch sử).
*   **`GET /trips/:id`** (Có Auth): Xem chi tiết lịch trình chuyến đi (Tự động populate toàn bộ thông tin địa điểm).
*   **`PUT /trips/:id`** (Có Auth): Cập nhật thông tin cơ bản chuyến đi (Tên, ngày, ngân sách).
*   **`DELETE /trips/:id`** (Có Auth): Xóa chuyến đi.
*   **`POST /trips/:id/schedule/places`** (Có Auth): Thêm một địa điểm vào timeline ngày.
    *   *Request Body:* `{ day, placeType, placeId, note }`.
*   **`PUT /trips/:id/schedule/reorder`** (Có Auth): Sắp xếp lại thứ tự kéo thả trong ngày.
    *   *Request Body:* `{ day, placesOrder }` (Với `placesOrder` là mảng các chuỗi ID phụ `places._id` theo thứ tự mới).
*   **`DELETE /trips/:id/schedule/places/:subId`** (Có Auth): Xóa địa điểm khỏi timeline.
*   **`PATCH /trips/:id/schedule/places/:subId/check-in`** (Có Auth - Dành cho Mobile App): Đánh dấu đã tham quan địa điểm.
    *   *Request Body:* `{ visited: true | false }`.
*   **`PUT /trips/:id/diary`** (Có Auth): Viết nhật ký và cập nhật danh sách ảnh sau chuyến đi.
    *   *Request Body:* `{ notes, photos }` (`photos` là mảng URL ảnh đã upload).

---

## 5. API Trợ lý ảo AI (AI Assistant - `/api/ai`)

Tích hợp tính năng lập kế hoạch tự động và chat thông minh bằng mô hình Gemini AI.

*   **`POST /ai/chat`** (Có Auth): Gửi tin nhắn và nhận câu trả lời dạng chữ từ chatbot.
    *   *Request Body:* `{ message }`.
*   **`GET /ai/chat`** (Có Auth): Tải lịch sử cuộc trò chuyện của người dùng hiện tại để hiển thị lại.
*   **`DELETE /ai/chat`** (Có Auth): Xóa sạch lịch sử cuộc trò chuyện.
*   **`POST /ai/suggest`** (Có Auth): Sinh lịch trình đề xuất dạng cấu trúc JSON.
    *   *Chế độ 1 - Tạo mới tự động:* Gửi `{ cityId, startDate, endDate, budget, preferences, notes, isParse: false }`.
    *   *Chế độ 2 - Phân tách từ chat chữ:* Gửi `{ notes: "nội dung Markdown lịch trình chữ", isParse: true }`.
*   **`POST /ai/optimize/:tripId`** (Có Auth): Sắp xếp lại thứ tự di chuyển trong ngày của chuyến đi hiện có để tối ưu hóa quãng đường ngắn nhất.
    *   *Request Body:* `{ notes: "yêu cầu đặc biệt", preview: true | false, optimizedSchedule }` (Nếu `preview: true` chỉ trả về kết quả gợi ý sắp xếp, nếu `preview: false` sẽ lưu thẳng vào Database).

---

## 6. API Tải lên hình ảnh (File Upload - `/api/upload`)

Hệ thống hỗ trợ tải lên file ảnh lên Cloudinary CDN (nếu đã cấu hình) hoặc lưu cục bộ tại thư mục `/uploads` của server.

*   **`POST /upload`** (Có Auth): Tải lên file ảnh đơn lẻ.
    *   *Format:* `multipart/form-data`.
    *   *Key:* `image` (chứa dữ liệu file nhị phân).
    *   *Response mẫu:*
        ```json
        {
          "message": "Image uploaded to Cloudinary successfully",
          "url": "https://res.cloudinary.com/travel-lako/image/upload/v12345/my_avatar.png"
        }
        ```

---

## 7. Phân hệ API dành cho Admin (Admin Operations - `/api/admin`)

Tất cả các API này yêu cầu quyền đăng nhập Admin (`isAdmin: true`). Nếu không thỏa mãn sẽ trả về lỗi **403 Forbidden**.

*   **`GET /admin/dashboard/stats`**: Lấy số liệu thống kê tổng hợp (tổng user, tổng review, biểu đồ phân loại địa điểm...).
*   **`GET /admin/users`**: Xem danh sách tất cả người dùng.
*   **`PUT /admin/users/:id`**: Khóa/Mở khóa tài khoản người dùng (`{ isBlocked: true | false }`) hoặc thăng quyền Admin (`{ isAdmin: true | false }`).
*   **`DELETE /admin/users/:id`**: Xóa tài khoản người dùng.
*   **`GET /admin/reviews`**: Lấy toàn bộ danh sách đánh giá của hệ thống để kiểm duyệt.
*   **`DELETE /admin/reviews/:id`**: Xóa đánh giá không phù hợp.
*   **`POST /admin/import/osm`**: Tự động lấy dữ liệu địa điểm du lịch thực tế từ OpenStreetMap cào về hệ thống theo thành phố.
    *   *Request Body:* `{ cityId, limit }`.
