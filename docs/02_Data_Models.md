# Tài liệu 02: Cấu trúc Dữ liệu & TypeScript Interfaces

Tài liệu này định nghĩa chi tiết cấu trúc dữ liệu trả về từ các API của Backend dưới dạng các Interface của **TypeScript** để Frontend tiện sử dụng.

---

## 1. Người dùng (User)

```typescript
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string; // URL ảnh đại diện (Cloudinary hoặc Local)
  phone: string;
  gender: 'Nam' | 'Nữ' | 'Khác' | '';
  dateOfBirth: string | null; // ISO Date String (yyyy-MM-dd)
  travelPreferences: string[]; // Ví dụ: ["Biển", "Ẩm thực", "Di tích"]
  favoriteBudget: 'Tiết kiệm' | 'Trung bình' | 'Cao cấp' | '';
  isVerified: boolean; // Trạng thái xác thực OTP
  isAdmin: boolean; // Quyền quản trị
  isBlocked: boolean; // Trạng thái khóa tài khoản
  createdAt: string;
  updatedAt: string;
}
```

---

## 2. Thành phố (City)

```typescript
export interface City {
  _id: string;
  name: string;
  description: string;
  image: string; // URL ảnh đại diện cho thành phố
  coordinates: {
    lat: number; // Vĩ độ
    lng: number; // Kinh độ
  };
  createdAt: string;
  updatedAt: string;
}
```

---

## 3. Các loại Địa điểm (Places)

Hệ thống quản lý 4 nhóm địa điểm cụ thể. Tất cả các địa điểm đều chia sẻ một cấu trúc chung, nhưng có các trường đặc thù riêng biệt:

### A. Điểm Tham Quan (Attraction)
```typescript
export interface Attraction {
  _id: string;
  name: string;
  city: string | City; // ID của Thành phố hoặc Object City đã populate
  description: string;
  images: string[]; // Mảng chứa danh sách URL ảnh địa điểm
  admissionFee: number; // Giá vé vào cổng (0đ nếu miễn phí)
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number; // Điểm đánh giá trung bình từ 1 - 5
  numReviews: number; // Tổng số lượt đánh giá
  createdAt: string;
  updatedAt: string;
}
```

### B. Khách sạn (Hotel)
```typescript
export interface Hotel {
  _id: string;
  name: string;
  city: string | City;
  description: string;
  images: string[];
  stars: number; // Số sao từ 1 - 5 (mặc định: 3)
  pricePerNight: number; // Giá phòng trung bình mỗi đêm
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
}
```

### C. Nhà Hàng (Restaurant)
```typescript
export interface Restaurant {
  _id: string;
  name: string;
  city: string | City;
  description: string;
  images: string[];
  cuisineType: string; // Loại ẩm thực (Ví dụ: "Đặc sản Hội An", "Hải sản")
  price: number; // Giá ăn trung bình của khách hàng
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
}
```

### D. Quán Cafe (Cafe)
```typescript
export interface Cafe {
  _id: string;
  name: string;
  city: string | City;
  description: string;
  images: string[];
  price: number; // Giá đồ uống trung bình
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
}
```

> **Lưu ý ở FE:** Bạn có thể định nghĩa 1 type chung `Place = Attraction | Hotel | Restaurant | Cafe` và dùng trường `placeType` để hiển thị các trường đặc thù tương ứng.

---

## 4. Chuyến đi & Kế hoạch (Trip & Itinerary)

Đây là model phức tạp nhất, dùng để vẽ ra toàn bộ lịch trình chuyến đi của người dùng.

```typescript
export type PlaceType = 'Attraction' | 'Hotel' | 'Restaurant' | 'Cafe';

export interface PlaceInSchedule {
  _id: string;
  placeType: PlaceType;
  placeId: string | Attraction | Hotel | Restaurant | Cafe; // Populate tùy API
  order: number; // Thứ tự đi trong ngày (0, 1, 2...)
  note: string; // Chỉ dẫn di chuyển hoặc lưu ý riêng tại điểm đi
  visited: boolean; // Trạng thái đã tham quan (dùng cho tính năng Check-in trên mobile)
  checkInTime?: string; // Thời gian check-in thực tế
}

export interface DaySchedule {
  _id: string;
  day: number; // Số thứ tự ngày (Ngày 1, Ngày 2...)
  date: string; // ISO Date (yyyy-MM-dd) tương ứng của ngày hôm đó
  places: PlaceInSchedule[]; // Mảng các địa điểm được xếp lịch đi
}

export interface TripDiary {
  notes: string; // Cảm nhận, chia sẻ sau chuyến đi
  photos: string[]; // Mảng chứa URL ảnh chụp trong chuyến đi được tải lên
}

export interface Trip {
  _id: string;
  user: string | User;
  title: string; // Tên chuyến đi (Ví dụ: "Khám phá Đà Nẵng 3 ngày 2 đêm")
  city: string | City; // Thành phố đến thăm
  startDate: string; // Ngày đi
  endDate: string; // Ngày về
  budget: number; // Ngân sách dự kiến
  schedule: DaySchedule[]; // Lịch trình chi tiết các ngày
  diary: TripDiary; // Nhật ký chuyến đi
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. Đánh giá (Review) và Danh sách yêu thích (Favorite)

```typescript
export interface Review {
  _id: string;
  user: string | User; // Người đánh giá
  itemType: PlaceType; // Loại địa điểm được đánh giá
  itemId: string; // ID của địa điểm tương ứng
  rating: number; // Điểm số từ 1 - 5
  comment: string; // Nội dung đánh giá
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  _id: string;
  user: string;
  itemType: PlaceType;
  itemId: string | Attraction | Hotel | Restaurant | Cafe; // Địa điểm được yêu thích
  createdAt: string;
}
```

---

## 6. Lịch sử Chat với Trợ lý AI (Chat History)

Dùng để hiển thị lịch sử đối thoại trong màn hình Chat Assistant.

```typescript
export interface ChatMessage {
  _id: string;
  role: 'user' | 'model'; // 'user' là khách hàng, 'model' là Trợ lý AI
  parts: [
    {
      text: string; // Nội dung tin nhắn dạng chữ hoặc markdown
    }
  ];
  createdAt?: string;
}

export interface Chat {
  _id: string;
  user: string;
  messages: ChatMessage[];
}
```
