
# Kiến Trúc & Quy Chuẩn Phát Triển - TravelLako Mobile

Tài liệu này là **kim chỉ nam bắt buộc** dành cho tất cả các Developer tham gia phát triển ứng dụng di động **TravelLako** (React Native CLI). 

Tất cả các màn hình, component, API call và luồng dữ liệu phải tuân thủ nghiêm ngặt các quy chuẩn dưới đây để đảm bảo ứng dụng đồng nhất 100% về UI/UX và không phát sinh xung đột Git (Merge conflicts).

---

## 1. Bản Đồ Cấu Trúc Thư Mục Chuẩn (`mobile/src/`)

```text
src/
├── assets/                  # Hình ảnh, icons tĩnh
├── components/              # Atomic UI Components dùng chung (Dumb Components)
│   └── common/
│       ├── AppText.tsx          # Typography chuẩn
│       ├── AppButton.tsx        # Nút bấm theo Design System
│       ├── AppTextInput.tsx     # Ô nhập liệu có label, focus & error border
│       ├── AppCard.tsx          # Thẻ trắng Surface bo góc & đổ bóng nhẹ
│       ├── AppBadge.tsx         # Tag danh mục, rating, trạng thái
│       ├── AppHeader.tsx        # Header cố định có back button & title
│       ├── ScreenWrapper.tsx    # MASTER LAYOUT: SafeArea, Scroll, Keyboard handling
│       ├── LoadingOverlay.tsx   # Loading spinner toàn màn hình
│       └── EmptyState.tsx       # Hiển thị khi danh sách rỗng
│
├── constants/               # Hằng số toàn hệ thống (CẤM hardcode string)
│   ├── screenNames.ts       # Tên định danh màn hình (SCREEN_NAMES)
│   ├── apiUrls.ts           # Endpoints API (API_URLS)
│   ├── storageKeys.ts       # Keys lưu trữ Storage (STORAGE_KEYS)
│   └── queryKeys.ts         # Keys lưu cache React Query (QUERY_KEYS)
│
├── navigation/              # Type-Safe React Navigation
│   ├── types.ts             # RootStackParamList, AuthStackParamList, MainTabParamList
│   ├── RootNavigator.tsx    # Chuyển đổi Auth Flow <-> Main Tabs
│   ├── AuthNavigator.tsx    # Stack Login, Register, VerifyOtp...
│   └── MainTabNavigator.tsx # Bottom Tabs: Home, Explore, AI Planner, My Trips, Profile
│
├── screens/                 # Mỗi màn hình là một module độc lập
│   ├── Template/
│   │   └── TemplateScreen.tsx # MÀN HÌNH MẪU CHUẨN ĐỂ COPY & THAM KHẢO
│   ├── Auth/
│   ├── Home/
│   ├── Explore/
│   ├── TripPlanner/
│   ├── AIChat/
│   └── Profile/
│
├── services/                # Tầng giao tiếp Network & API
│   ├── api/
│   │   ├── apiClient.ts     # Axios instance với timeout & baseURL
│   │   └── interceptors.ts  # Tự gắn Bearer Token & bắt 401 tự động logout
│   ├── auth.service.ts
│   ├── city.service.ts
│   ├── place.service.ts
│   ├── trip.service.ts
│   └── ai.service.ts
│
├── types/                   # TypeScript Interfaces & DTOs (Docs 02)
│   ├── index.ts             # Re-export toàn bộ models (Alias: @appTypes)
│   ├── api.types.ts
│   ├── user.types.ts
│   ├── city.types.ts
│   ├── place.types.ts
│   ├── trip.types.ts
│   └── ai.types.ts
│
├── store/                   # Global Client State (Zustand)
│   └── useAuthStore.ts      # Auth state, login/logout, profile
│
├── hooks/                   # Custom Hooks tái sử dụng
│   └── useAppNavigation.ts  # Typed Navigation Hook
│
├── theme/                   # Tokens của Design System (Gom chung 1 file duy nhất)
│   └── index.ts             # colors, typography, spacing, radius, shadows, theme (Alias: @theme)
│
└── utils/                   # Pure utility functions (Gom chung 1 file)
    └── index.ts             # formatCurrency, formatDate, geoDistance (Alias: @utils)
```

---

## 2. Quy Chuẩn Xây Dựng Màn Hình Mới (Screen Pattern)

Mỗi khi tạo một màn hình mới, **BẮT BUỘC** phải tuân theo mẫu dưới đây (hoặc xem file [TemplateScreen.tsx](file:///c:/Users/Dell/Desktop/Tài%20liệu%20học%20tập/TravelLakoFE_APP/mobile/src/screens/Template/TemplateScreen.tsx)):

```tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ScreenWrapper,
  AppHeader,
  AppText,
  AppButton,
  AppCard,
} from '@components/common';
import { spacing } from '@theme/spacing';
import { useAppNavigation } from '@hooks/useAppNavigation';

export const ExampleScreen: React.FC = () => {
  const navigation = useAppNavigation();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ScreenWrapper
      scrollable={true}            // Bật nếu màn hình có cuộn nội dung
      isLoading={isLoading}        // Bật loading overlay khi đang call API
      header={
        <AppHeader
          title="Tiêu Đề Màn Hình"
          showBack
          onBack={() => navigation.goBack()}
        />
      }
      footer={
        <AppButton
          title="Nút Hành Động Ở Đáy"
          onPress={() => {}}
          variant="primary"
          size="lg"
        />
      }
    >
      <View style={styles.content}>
        <AppCard>
          <AppText variant="h3" color="main">Thẻ Nội Dung</AppText>
          <AppText variant="body" color="sub">Mô tả nội dung</AppText>
        </AppCard>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: spacing.md,
  },
});
```

### Tại sao phải dùng `ScreenWrapper`?
* Tự động quản lý Safe Area (tai thỏ iPhone, thanh điều hướng Android).
* Tự động đặt nền chuẩn `#FAFAFA` (giảm lóa mắt).
* Tự động xử lý chạm ra ngoài để đóng bàn phím (`dismissKeyboardOnTap`).
* Tự động xử lý `KeyboardAvoidingView` trên iOS và Android.
* Có sẵn vị trí `header` và `footer` cố định (không bị cuộn theo nội dung).

---

## 3. Quy Chuẩn Thành Phần Giao Diện (Atomic UI Components)

Tuyệt đối **KHÔNG** dùng các thẻ gốc `Text`, `Button`, `TextInput` của React Native mà phải dùng các component bọc chuẩn:

### A. `<AppText>`:
```tsx
<AppText variant="h1" color="main">Tiêu đề lớn</AppText>
<AppText variant="body" color="sub">Đoạn văn mô tả</AppText>
<AppText variant="captionMedium" color="primary">Nhãn xanh nhấn mạnh</AppText>
```
* **Variants:** `h1` (26px), `h2` (20px), `h3` (17px), `subtitle` (15px), `body` (15px), `bodyBold` (15px bold), `caption` (13px), `tiny` (11px).
* **Colors:** `main`, `sub`, `muted`, `primary`, `white`, `success`, `danger`, `sand`.

### B. `<AppButton>`:
```tsx
<AppButton
  title="Xác nhận"
  onPress={handleConfirm}
  variant="primary"   // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size="md"           // 'sm' | 'md' | 'lg'
  isLoading={loading} // Tự động hiển thị spinner xoay và vô hiệu hóa nút
/>
```

### C. `<AppTextInput>`:
```tsx
<AppTextInput
  label="Email đăng nhập"
  placeholder="nhap@email.com"
  value={email}
  onChangeText={setEmail}
  error={emailError} // Tự động đổi màu viền sang đỏ và hiển thị dòng lỗi bên dưới
/>
```

### D. `<AppCard>`:
Thẻ trắng nền Surface `#FFFFFF`, viền mảnh 1px `#E2E8F0`, bo góc chuẩn `radius.xl` (16px), đổ bóng tinh tế.
```tsx
<AppCard onPress={() => handleSelect(item)}>
  {/* Nội dung bên trong */}
</AppCard>
```

### E. `<AppBadge>`:
Dùng để gắn nhãn loại hình du lịch hoặc trạng thái:
```tsx
<AppBadge label="Attraction" variant="teal" size="sm" />
<AppBadge label="4.8 ★" variant="sand" size="sm" />
<AppBadge label="Khách sạn 5 sao" variant="primary" size="md" />
```

---

## 4. Quy Chuẩn Điều Hướng (Type-Safe React Navigation)

### CẤM:
* Không truyền string thô vào `navigation.navigate('ChiTiet')`.

### BẮT BUỘC:
1. Đăng ký tên màn hình trong [screenNames.ts](file:///c:/Users/Dell/Desktop/Tài%20liệu%20học%20tập/TravelLakoFE_APP/mobile/src/constants/screenNames.ts).
2. Khai báo tham số trong [types.ts](file:///c:/Users/Dell/Desktop/Tài%20liệu%20học%20tập/TravelLakoFE_APP/mobile/src/navigation/types.ts).
3. Sử dụng hook `useAppNavigation()`:
```tsx
import { useAppNavigation } from '@hooks/useAppNavigation';
import { SCREEN_NAMES } from '@constants/screenNames';

const navigation = useAppNavigation();

// Tự động gợi ý tham số truyền vào
navigation.navigate(SCREEN_NAMES.PLACE_DETAIL, {
  placeId: '123',
  type: 'attraction',
});
```

---

## 5. Quy Chuẩn Tầng Mạng & Gọi API

Tất cả các API calls phải viết trong `src/services/` (không gọi `axios` trực tiếp trong component màn hình).

```tsx
// 1. Viết API method trong src/services/city.service.ts
export const cityService = {
  async getCities(search?: string): Promise<ApiResponse<City[]>> {
    const res = await apiClient.get<ApiResponse<City[]>>(API_URLS.CITIES.BASE, {
      params: search ? { search } : undefined,
    });
    return res.data;
  },
};

// 2. Sử dụng trong Component với TanStack React Query
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@constants/queryKeys';
import { cityService } from '@services/city.service';

const { data, isLoading, error } = useQuery({
  queryKey: [QUERY_KEYS.CITIES_LIST, searchTerm],
  queryFn: () => cityService.getCities(searchTerm),
});
```

* **Token Interceptor**: Tự động lấy JWT Token từ Storage gắn vào header `Authorization: Bearer <token>`.
* **401 Interceptor**: Khi token hết hạn, tự động gọi `useAuthStore.getState().logout()` và đưa người dùng về màn hình Login.

---

## 6. Quy Tắc "5 KHÔNG" Cho Mọi Developer

1. **KHÔNG** hardcode mã màu Hex (`#...`) trong component. Phải import `colors` từ `@theme/colors`.
2. **KHÔNG** đặt padding/margin tùy ý (`padding: 13`). Phải dùng `spacing` từ `@theme/spacing` (4, 8, 12, 16, 20, 24, 32).
3. **KHÔNG** dùng `../../../../` để import. Phải dùng Path Alias: `@components`, `@screens`, `@theme`, `@services`, `@appTypes`, `@constants`.
4. **KHÔNG** gọi API trực tiếp trong UI component. Phải đi qua `src/services/`.
5. **KHÔNG** tự ý cài đặt thêm các thư viện Native cũ thiếu hỗ trợ React Native 0.88 / React 19 / New Architecture.

