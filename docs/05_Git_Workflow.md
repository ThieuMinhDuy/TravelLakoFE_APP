# Tài liệu 05: Quy Trình Git Workflow - TravelLako Frontend

Quy trình quản lý nhánh (branching strategy) và làm việc nhóm trên Git giúp mã nguồn luôn ổn định và tránh conflict.

---

## 1. Các Nhánh Chính (Main Branches)

1. **`main`**: Nhánh chứa mã nguồn ổn định nhất đang chạy trên production. Chỉ nhận code từ các đợt phát hành (releases) lớn.
2. **`develop`**: Nhánh tích hợp chính. Các tính năng mới sau khi hoàn thành sẽ được merge vào đây để chạy test trên môi trường Staging.

---

## 2. Nhánh Tính Năng và Sửa Lỗi (Supporting Branches)

Mọi thay đổi code bắt buộc phải được thực hiện trên nhánh phụ và tạo Pull Request (PR) về nhánh `develop`.

### Quy tắc đặt tên nhánh:
- Nhánh tính năng mới: `feature/[tên-tính-năng]` hoặc `feat/[tên-tính-năng]`
  *Ví dụ: `feat/tour-listing`, `feature/booking-payment`*
- Nhánh sửa lỗi: `bugfix/[tên-lỗi]` hoặc `fix/[tên-lỗi]`
  *Ví dụ: `fix/login-crash`, `bugfix/mobile-tab-bar`*
- Nhánh tối ưu/tái cấu trúc: `refactor/[tên-nội-dung]`
  *Ví dụ: `refactor/api-services`*

---

## 3. Quy Quy Trình Commit (Commit Message Standards)

Chúng tôi khuyến nghị sử dụng quy chuẩn **Conventional Commits** để tự động hóa việc theo dõi lịch sử thay đổi:

`type(scope): description`

### Các Type phổ biến:
- `feat`: Tính năng mới.
- `fix`: Sửa lỗi.
- `docs`: Chỉnh sửa tài liệu.
- `style`: Định dạng code (whitespace, formatting, missing semi-colons, không ảnh hưởng logic).
- `refactor`: Tái cấu trúc code nhưng không thay đổi hành vi bên ngoài.
- `chore`: Cập nhật cấu hình build, thêm thư viện phụ trợ, v.v.

### Ví dụ:
- `feat(web): add tour filters component`
- `fix(mobile): resolve touch overlap on tour card`
- `docs(root): update readme with port settings`
