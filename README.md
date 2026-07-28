# ✨ Glow Aura — Luxury Cosmetics E-commerce Frontend

![Tech Stack](.\image\homepage.png)

Giao diện frontend cho nền tảng thương mại điện tử mỹ phẩm **Glow Aura**: UI sang trọng, đăng nhập Google/Facebook, giỏ hàng, checkout nhiều cổng thanh toán (COD/MoMo/ZaloPay/VNPay/PayOS), tra cứu đơn hàng và khảo sát/phân tích da bằng AI.

> Khoá luận tốt nghiệp — Vũ Ngọc Quỳnh Giang — MSSV 22DH114506

## Công nghệ sử dụng

| Nhóm | Công nghệ |
|---|---|
| Core | React 18+, TypeScript, Vite |
| Styling | Tailwind CSS 3.4 |
| Routing | React Router DOM v6 (HashRouter — phù hợp GitHub Pages) |
| State | Zustand, React Context (`CartContext`, `AuthContext`) |
| Data fetching | Axios, TanStack React Query |
| Bản đồ / địa chỉ | Leaflet, React-Leaflet |
| UI phụ trợ | Lucide React (icon), Swiper, Recharts |
| Deploy | GitHub Pages (`gh-pages`) qua GitHub Actions |

## Yêu cầu môi trường

- Node.js LTS ≥ 18
- npm (đi kèm Node.js)

## Cài đặt

```bash
git clone <repo-url>
cd client_web
npm install
```

> Nếu máy báo thiếu type hoặc lỗi phiên bản Tailwind sau khi `npm install`, cài lại đúng bản đã khoá trong `package.json`:
> ```bash
> npm install -D tailwindcss@3.4.1 postcss autoprefixer
> npm install -D @types/react @types/react-dom
> ```

## Cấu hình môi trường

Tạo/sửa file `.env` (dev) — dự án đã có sẵn `.env` và `.env.production` mẫu:

```env
VITE_API_BASE_URL=http://localhost:5278/api
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
VITE_FACEBOOK_APP_ID=<facebook-app-id>
```

| Biến | Ý nghĩa |
|---|---|
| `VITE_API_BASE_URL` | Base URL của backend (`CosmeticStore.API`), luôn kết thúc bằng `/api` |
| `VITE_GOOGLE_CLIENT_ID` | Client ID cho đăng nhập Google |
| `VITE_FACEBOOK_APP_ID` | App ID cho đăng nhập Facebook |

- **Dev + backend local:** `http://localhost:5278/api`
- **Dev/build + backend Railway:** `https://glowauraapimongodb-production.up.railway.app/api`

`.env.production` được dùng khi `npm run build` (GitHub Pages) — mặc định đã trỏ sẵn tới Railway.

## Chạy dự án (dev)

```bash
npm run dev
```

Mặc định Vite chạy ở `http://localhost:5173`.

## Build & Deploy

```bash
npm run build      # tsc -b && vite build → dist/
npm run preview    # xem thử bản build
npm run deploy      # build + publish thủ công lên nhánh gh-pages
```

**Deploy tự động:** push lên nhánh `main` → GitHub Actions workflow `Deploy GitHub Pages` (`.github/workflows/deploy-pages.yml`) tự build và publish thư mục `dist/` lên nhánh `gh-pages`. Có thể chạy lại thủ công ở tab **Actions → Deploy GitHub Pages → Run workflow**.

Base path GitHub Pages được cấu hình ở `vite.config.ts` (`base: '/glow_aura_frontend/'`) — đổi giá trị này nếu đổi tên repo.

> Sau khi deploy xong, mở lại site và **Ctrl+F5** để tránh dùng nhầm bundle JS cũ trong cache trình duyệt.

## Cấu trúc thư mục

Tổ chức theo hướng **feature-based**:

```
src/
├── components/
│   ├── layout/         # Header (mega menu, search), Footer, MainLayout
│   └── ui/, form/       # UI/form dùng lại nhiều nơi (AddressMapPicker...)
├── context/             # CartContext, AuthContext
├── stores/              # Zustand stores
├── features/
│   ├── auth/            # Đăng nhập/đăng ký, Google & Facebook login
│   ├── cart/            # Giỏ hàng
│   ├── home/             # Hero, New Arrivals, Brand Philosophy...
│   ├── products/         # Product Card/Grid/Filter
│   ├── admin/            # Trang quản trị (sản phẩm, đơn hàng, thống kê)
│   └── user/              # Hồ sơ, đơn hàng của người dùng
├── pages/                # HomePage, ProductListPage, CartPage, CheckoutPage,
│   └── admin/            # OrderSuccessPage, admin order detail...
├── services/              # apiClient (Axios + interceptor JWT refresh),
│                           # checkoutService, các service gọi API khác
├── routes/                # Khai báo route (HashRouter)
├── hooks/, utils/, lib/, config/, constants/, data/, types/, assets/
├── App.tsx               # Cấu hình routing
└── main.tsx               # Entry point
```

## Ghi chú kỹ thuật quan trọng

- **Auth:** JWT lưu ở `localStorage` (`accessToken`, `refreshToken`); `apiClient` tự refresh token khi gặp lỗi 401 (trừ các route `/auth/*`).
- **Checkout:** `CheckoutPage.tsx` gọi `POST /checkout/preview` (debounce 800ms) để tính tổng tiền real-time, và `POST /checkout` khi đặt hàng. `returnUrl`/`cancelUrl` gửi kèm phải dùng **template literal** (dấu backtick `` ` ``), không dùng nháy đơn `'...'` — nếu không sẽ gửi literal `${...}` sai định dạng URL tới các cổng thanh toán online.
- **Routing:** Dùng `HashRouter` (`#/...`) để tương thích với GitHub Pages (không hỗ trợ server-side rewrite).

## Tác giả

- **Họ tên:** Vũ Ngọc Quỳnh Giang
- **MSSV:** 22DH114506
- **Môn học:** Mẫu thiết kế phần mềm — Khoá luận tốt nghiệp