# Tài liệu 07: Danh sách Đặc tả Yêu cầu Chức năng (Feature Requirements)

Tài liệu này đóng vai trò là danh sách kiểm tra (Checklist) toàn bộ các tính năng cần phát triển của hệ thống TravelLako trên cả Web Frontend và Mobile App.

---

## 1. Phân hệ Khách vãng lai (Guest - Chưa đăng nhập)
Đây là người dùng mới truy cập ứng dụng, có quyền xem các thông tin công khai để khám phá dịch vụ.

### Quản lý Tài khoản Cơ bản
- [ ] **Đăng ký tài khoản**: Form nhập Tên, Email, Mật khẩu.
- [ ] **Xác thực tài khoản (OTP)**: Nhập mã OTP 6 số gửi về Email sau khi đăng ký thành công.
- [ ] **Gửi lại mã OTP**: Nút yêu cầu gửi lại mã xác thực nếu quá hạn 60 giây.
- [ ] **Đăng nhập hệ thống**: Form đăng nhập bằng Email và Mật khẩu.
- [ ] **Khôi phục mật khẩu**: Yêu cầu khôi phục mật khẩu thông qua mã OTP (Forgot & Reset Password).

### Khám phá Điểm đến (Cities)
- [ ] **Danh sách thành phố**: Xem tất cả các thành phố đang được hệ thống hỗ trợ (Đà Nẵng, Hà Nội, TP.HCM...).
- [ ] **Chi tiết thành phố**: Xem thông tin chi tiết một thành phố bao gồm: hình ảnh banner, mô tả, tọa độ địa lý.

### Tìm kiếm & Tra cứu Địa điểm (Places)
- [ ] **Global Search**: Ô tìm kiếm nhanh tổng hợp mọi địa điểm (Khách sạn, Điểm tham quan, Nhà hàng, Quán cafe) theo từ khóa hoặc theo thành phố.
- [ ] **Bộ lọc nhóm địa điểm chuyên biệt**:
  - [ ] **Khách sạn (Hotel)**: Lọc theo số sao (1-5★), khoảng giá phòng/đêm.
  - [ ] **Điểm tham quan (Attraction)**: Lọc theo khoảng giá vé vào cửa.
  - [ ] **Nhà hàng (Restaurant)**: Lọc theo loại hình ẩm thực (`cuisineType`), khoảng giá ăn uống trung bình.
  - [ ] **Quán Cafe (Cafe)**: Lọc theo khoảng giá đồ uống trung bình.
- [ ] **Chi tiết địa điểm**: Xem thư viện ảnh slide (Carousel), mô tả, mức giá tham khảo, địa chỉ, bản đồ định vị ghim vị trí, điểm đánh giá trung bình và danh sách các review từ người dùng.

### Xem Đánh giá (Reviews)
- [ ] **Xem review**: Xem danh sách tất cả các đánh giá (số sao và nội dung bình luận) của người dùng tại mỗi địa điểm cụ thể.

---

## 2. Phân hệ Thành viên (Customer - Đã đăng nhập)
Thành viên sở hữu toàn bộ quyền của Khách vãng lai và các tính năng tương tác cá nhân hóa sâu.

### Quản lý Hồ sơ Cá nhân (Profile)
- [ ] **Cập nhật thông tin**: Thay đổi ảnh đại diện (Avatar), số điện thoại, ngày sinh, giới tính.
- [ ] **Thiết lập sở thích du lịch**: Lưu thông tin Sở thích (Travel Preferences) và Ngân sách mong muốn (Favorite Budget) để AI cá nhân hóa gợi ý.
- [ ] **Thay đổi mật khẩu**: Form đổi mật khẩu bảo mật trong trang cá nhân.
- [ ] **Tải lên hình ảnh**: Tải ảnh cá nhân/avatar lên server thông qua Cloudinary.

### Quản lý Địa điểm Yêu thích (Favorites)
- [ ] **Thêm yêu thích**: Lưu địa điểm bất kỳ vào danh sách yêu thích cá nhân (bật/tắt nút trái tim).
- [ ] **Xem danh sách yêu thích**: Hiển thị toàn bộ địa điểm đã lưu.
- [ ] **Xóa yêu thích**: Xóa địa điểm khỏi danh sách đã lưu.

### Tự xây dựng Lịch trình chuyến đi (Trip Itinerary)
- [ ] **Khởi tạo chuyến đi**: Nhập tên chuyến đi, thành phố đích, ngày bắt đầu - ngày kết thúc (hệ thống tự động sinh số lượng ngày trống tương ứng), thiết lập tổng ngân sách.
- [ ] **Phân nhóm trạng thái chuyến đi**: Quản lý chuyến đi theo 3 nhóm: Sắp tới (Upcoming), Đang đi (Ongoing), Lịch sử chuyến đi (Past).
- [ ] **Chỉnh sửa lịch trình chi tiết hàng ngày**:
  - [ ] Thêm địa điểm bất kỳ vào lịch trình của một ngày cụ thể (có kèm ghi chú riêng cho điểm đó).
  - [ ] Xóa địa điểm khỏi lịch trình.
  - [ ] Thay đổi thứ tự (Reorder) các điểm trong ngày bằng thao tác kéo thả (Drag & Drop).

### Check-in & Nhật ký hành trình
- [ ] **Check-in thực tế (Chỉ trên Mobile)**: Nhấn nút Check-in tại các địa điểm trong lịch trình (sử dụng định vị GPS từ điện thoại, so khớp khoảng cách dưới 200m để xác nhận thành công).
- [ ] **Viết nhật ký chuyến đi (Trip Diary)**: Viết cảm xúc trải nghiệm, ghi chú hoạt động và tải lên tối đa 10 ảnh lưu niệm đính kèm.

### Trợ lý ảo AI thông minh (AI Assistant - Gemini API)
- [ ] **Chatbot AI**: Trò chuyện tự nhiên về kinh nghiệm du lịch, hỏi giá, tìm địa chỉ. AI lấy dữ liệu thực tế từ Database và bắt buộc hiển thị kèm giá tiền kế bên tên địa điểm.
- [ ] **Sinh lịch trình tự động bằng AI**: Nhập số ngày đi, sở thích, ngân sách -> AI tự động lập lịch trình chi tiết từ các địa điểm có thật trong database kèm chi phí ước tính.
- [ ] **Trích xuất lịch trình từ Chat**: Một click để tự động chuyển đoạn chat lịch trình thô từ AI thành cấu trúc lịch trình chuẩn của hệ thống (đã đối chiếu địa điểm trong database).
- [ ] **Tối ưu hóa đường đi bằng AI**: Tự động tính toán sắp xếp thứ tự các điểm trong ngày sao cho quãng đường di chuyển ngắn nhất, ưu tiên ghé khách sạn trước và xen kẽ hợp lý giữa ăn uống - vui chơi.

---

## 3. Phân hệ Quản trị viên (Admin Portal - Web Chỉ định)
Vai trò quản lý hệ thống, kiểm duyệt nội dung và làm giàu dữ liệu.

### Bảng điều khiển (Dashboard Stats)
- [ ] **Thống kê tổng quan**: Tổng số tài khoản, tổng số chuyến đi đã tạo, tổng số đánh giá.
- [ ] **Thống kê phân loại**: Số lượng địa điểm theo từng nhóm (Khách sạn, Điểm tham quan, Nhà hàng, Quán cafe).

### Quản lý Thành phố (City CRUD)
- [ ] **Thêm mới thành phố**: Tên, mô tả, hình ảnh banner, tọa độ địa lý.
- [ ] **Chỉnh sửa / Xóa thành phố**: Thay đổi thông tin hoặc xóa thành phố khỏi hệ thống.

### Quản lý Địa điểm du lịch (Place CRUD)
- [ ] **CRUD Địa điểm**: Thêm mới, chỉnh sửa, xóa địa điểm thuộc cả 4 nhóm (Attraction, Hotel, Restaurant, Cafe) với các trường dữ liệu đặc thù tương ứng.

### Quản lý Người dùng & Tài khoản
- [ ] **Xem danh sách**: Xem chi tiết toàn bộ người dùng trong hệ thống.
- [ ] **Khóa / Mở khóa tài khoản**: Block/Unblock tài khoản vi phạm tiêu chuẩn cộng đồng.
- [ ] **Xóa tài khoản**: Xóa tài khoản người dùng khỏi hệ thống.

### Kiểm duyệt Đánh giá (Review Moderation)
- [ ] **Xem toàn bộ đánh giá**: Hỗ trợ lọc nhanh theo Thành phố, theo loại địa điểm, hoặc theo ID địa điểm cụ thể.
- [ ] **Xóa đánh giá**: Xóa bỏ các đánh giá không phù hợp, chứa từ ngữ thô tục hoặc spam.

### Công cụ Import tự động (OSM + AI Data Seeding)
- [ ] **Cào dữ liệu OpenStreetMap (OSM)**: Nhập tên thành phố, hệ thống tự động cào dữ liệu thực tế (kinh độ, vĩ độ, địa chỉ, tên địa điểm).
- [ ] **Làm giàu dữ liệu bằng AI**: Sử dụng Gemini AI viết mô tả hấp dẫn bằng tiếng Việt, phân loại chính xác nhóm địa điểm, và gán giá phòng/giá vé tham khảo phù hợp rồi lưu vào database.
