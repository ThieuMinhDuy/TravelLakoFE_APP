# Tài liệu 06: Design System & Quy chuẩn Giao diện (Modern Natural Travel)

Tài liệu này định nghĩa hệ thống thiết kế (Design System) của TravelLako dựa trên phong cách chủ đạo **"Modern Natural Travel"** — kết hợp sự tối giản tinh tế của **Apple**, tính chân thực du lịch của **Airbnb**, khoảng trắng thư thái của **Notion** và thông tin trực quan từ **Google Travel**.

---

## 1. Bảng Màu "Modern Natural Travel" (Color Palette)

Hệ màu mới loại bỏ hoàn toàn phong cách AI SaaS màu tím đậm hoặc các dải gradient gắt, tập trung vào trải nghiệm dịu mắt, hòa hợp thiên nhiên (biển, bầu trời, cây cỏ, đất cát).

### A. Màu Chính & Nhận Diện Thương Hiệu (Primary & Brand Palette)

| Loại màu | Token CSS | Hex Code | Cảm hứng / Mô tả | Ứng dụng |
| :--- | :--- | :--- | :--- | :--- |
| **Ocean Azure** | `--color-primary-600` | `#0369A1` | **Xanh đại dương sâu** (Sky-700) | Màu thương hiệu chính, Nút bấm CTA, Icon active |
| **Soft Sky** | `--color-primary-50` | `#F0F9FF` | **Xanh bầu trời dịu** (Sky-50) | Nền thẻ active, Highlight nhẹ, State hover |
| **Coastal Teal** | `--color-nature-600` | `#0D9488` | **Xanh ngọc / Cây cỏ** (Teal-600) | Tag địa điểm tự nhiên, Trạng thái an toàn |
| **Sunset Sand** | `--color-sand-500` | `#D97706` | **Màu cát nắng bãi biển** (Amber-600) | *Dùng rất hạn chế*: Đánh giá sao ⭐, Nút thả tim Yêu thích |

*Variants màu phụ phụ trợ*:
*   **Ocean Azure Hover:** `#075985` (Tailwind `sky-800`)
*   **Coastal Teal Light:** `#CCFBF1` (Tailwind `teal-100`)
*   **Sunset Sand Light:** `#FEF3C7` (Tailwind `amber-100`)

### B. Màu Phụ & Trung Tính (Backgrounds & Text Tokens)

| Loại màu | Token CSS | Hex Code | Mô tả | Ứng dụng |
| :--- | :--- | :--- | :--- | :--- |
| **App Background** | `--color-bg-app` | `#FAFAFA` | **Off-White dịu mắt** | Nền toàn bộ màn hình (giảm lóa so với pure white) |
| **Surface White** | `--color-bg-surface` | `#FFFFFF` | **Trắng tinh khiết** | Nền thẻ địa điểm (Card), Header, Bottom Navigation |
| **Subtle Slate** | `--color-bg-subtle` | `#F1F5F9` | **Xám Slate nhạt** (Slate-100) | Nền thanh tìm kiếm, Tab chưa chọn |
| **Primary Text** | `--color-text-main` | `#0F172A` | **Slate đậm** (Apple text) | Tiêu đề chính, Tên địa điểm (Độ tương phản 13.5:1) |
| **Secondary Text** | `--color-text-sub` | `#475569` | **Slate trung tính** (Slate-600) | Mô tả khoảng cách, giá cả, thời gian |
| **Subtle Border** | `--color-border` | `#E2E8F0` | **Viền xám siêu mảnh** | Đường phân cách 1px nhã nhặn |

### C. Màu Trạng Thái (Semantic Colors)
*   **Success (Check-in / Thành công):** `#0D9488` (Coastal Teal)
*   **Error (Thất bại / Cảnh báo lỗi):** `#EF4444` (Tailwind `red-500`)
*   **Warning (Cảnh báo nhạ):** `#D97706` (Sunset Sand)

### D. Nguyên tắc Áp dụng Màu sắc (Color Usage Principles)
*   **Ocean Azure (`#0369A1`):** Chỉ dành cho các tương tác hành động chính (nút CTA chính, tab active, liên kết điều hướng).
*   **Sunset Sand (`#D97706`):** Đóng vai trò là màu nhấn Accent hạn chế. Tuyệt đối **không lạm dụng** trên diện tích lớn để tránh gây chói mắt.
*   **Nền ứng dụng (App Background):** Sử dụng màu Off-White `#FAFAFA` giúp mắt thư thái khi lướt thông tin du lịch lâu dài.
*   **Thẻ thông tin (Cards):** Nền trắng tinh khôi `#FFFFFF` đặt nổi trên nền `#FAFAFA` với đường viền mảnh `#E2E8F0` tạo chiều sâu gọn gàng.
*   **Triết lý giao diện (Visual Philosophy):** Ưu tiên "Light, Minimal, Typographic". Hạn chế tối đa dải màu gradient gắt và giữ khoảng trống thở (whitespace) lớn chuẩn phong cách Notion & Apple.

---

## 2. Phông Chữ & Định Dạng (Typography)

*   **Font Family chính:**
    *   **Headings (Tiêu đề):** `Outfit`, sans-serif (Nét chữ hiện đại, năng động).
    *   **Body Text (Nội dung):** `Inter`, sans-serif (Sắc nét, chuẩn typographic Apple).
    *   **Mobile App:** San Francisco (iOS) / Roboto (Android) hoặc Inter font.
*   **C cỡ chữ tiêu chuẩn (Font Sizes):**
    *   `text-xs` (12px): Chú thích, nhãn phụ, thời gian.
    *   `text-sm` (14px): Dữ liệu chi tiết, mô tả phụ, giá tiền nhỏ.
    *   `text-base` (16px): Nội dung chính body, bài viết, input form.
    *   `text-lg` (18px): Tên địa điểm, sub-header.
    *   `text-xl` (20px): Tiêu đề card, tiêu đề bài viết.
    *   `text-2xl` đến `text-4xl` (24px - 36px): Tiêu đề màn hình chính, hero banner.

---

## 3. Khoảng Cách & Bo Góc (Spacing & Border Radius)

*   **Spacing Scale:** Chuẩn hệ số 4px của Tailwind: `4px`, `8px`, `12px`, `16px` (khoảng cách chuẩn), `24px`, `32px`.
*   **Bo góc (Border Radius):**
    *   Button & Input: `rounded-xl` (12px).
    *   Cards & Modals: `rounded-2xl` (16px) hoặc `rounded-3xl` (24px).
    *   Pill badges & Status: `rounded-full` (9999px).

---

## 4. Công Nghệ & Thư Viện UI

### A. Web Frontend (`web/public/`)
*   **Tailwind CSS**: Utility-first CSS với custom colors (`oceanBlue`, `softSky`, `coastalTeal`, `sunsetSand`).
*   **Custom CSS Variables**: Định nghĩa sẵn tại `:root` trong `style.css` (`--color-primary-600`, `--color-primary-50`,...).
*   **Lucide Icons**: Bộ SVG Icon tối giản, sắc nét.
*   **Canvas Confetti**: Hoạt ảnh chúc mừng khi tạo chuyến đi thành công.

### B. Mobile App (Expo / React Native)
*   **NativeWind**: Cấu hình bảng màu Tailwind tương thích chuẩn với nền tảng React Native.

---

## 5. Quy Chuẩn Thành Phần Giao Diện (Component Specs)

### A. Button (Nút bấm)
*   **Primary Button:** Background Ocean Azure (`#0369A1`), chữ trắng, bo góc `rounded-xl` / `rounded-full`. Hover: Ocean Azure Dark (`#075985`).
*   **Secondary Button:** Background Soft Sky (`#F0F9FF`), chữ Ocean Azure (`#0369A1`), viền nhạt.
*   **Outline Button:** Viền xám mảnh (`#E2E8F0`), nền trắng, chữ Slate Dark (`#0F172A`).

### B. Cards (Thẻ địa điểm & Chuyến đi)
*   Nền: White Surface (`#FFFFFF`).
*   Viền: `border border-borderGray` (`#E2E8F0`).
*   Bo góc: `rounded-2xl` (16px).
*   Đổ bóng: Soft Shadow (`shadow-sm`, nâng lên `shadow-md` khi hover).
*   Gợi ý ảnh: Hover hiệu ứng phóng nhẹ (`transform scale-105`).
