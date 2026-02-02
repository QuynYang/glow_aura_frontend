# ✨ Glow Aura - Luxury Cosmetics E-commerce Frontend

![Project Status](https://img.shields.io/badge/Status-In_Development-yellow)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_Vite_|_Tailwind-blue)

**Glow Aura** là giao diện Frontend hiện đại dành cho nền tảng thương mại điện tử chuyên về mỹ phẩm và chăm sóc da. Dự án được xây dựng với mục tiêu đem lại trải nghiệm người dùng mượt mà, giao diện sang trọng (Luxury UI) và hiệu suất cao.

---

## 🛠️ Công Nghệ Sử Dụng

* **Core:** React (v18+), TypeScript
* **Build Tool:** Vite (Tốc độ build siêu nhanh)
* **Styling:** Tailwind CSS (Utility-first framework)
* **Routing:** React Router DOM (v6) - *Xử lý điều hướng trang*
* **Icons:** Lucide React - *Bộ icon nhẹ và hiện đại*
* **Package Manager:** npm

---

## ⚙️ Hướng Dẫn Cài Đặt Chi Tiết (Step-by-Step)

Để dự án chạy mượt mà và không gặp lỗi phiên bản (màn hình đen, lỗi đỏ code), hãy làm theo đúng trình tự sau:

### 1. Yêu cầu tiên quyết
* **Node.js**: Khuyên dùng bản LTS v18 trở lên.
* **npm**: Trình quản lý gói đi kèm mặc định với Node.js.

### 2. Cài đặt thư viện & Sửa lỗi phiên bản
Mở Terminal (cửa sổ dòng lệnh) tại thư mục `client_web` và chạy lần lượt 4 lệnh sau:

**Bước 2.1: Cài đặt các thư viện cơ bản**
```bash
npm install
```

**Bước 2.2: Cài đặt React Router (Quan trọng) Bắt buộc để chuyển từ Trang Chủ sang trang Best Sellers.
```bash
npm install react-router-dom
```

**Bước 2.3: Cài đặt chuẩn phiên bản Tailwind CSS Khắc phục lỗi màn hình đen do xung đột Tailwind v4.
```bash
npm install -D tailwindcss@3.4.1 postcss autoprefixer
```

**Bước 2.4: Cài đặt Type Definitions Khắc phục lỗi báo đỏ gạch chân trong VS Code.
```bash
npm install -D @types/react @types/react-dom
```

### 3. Chạy server
Sau khi cài đặt xong các bước trên, khởi chạy dự án bằng lệnh:
```bash
npm run dev
```



```markdown

---

## 📂 Cấu Trúc Thư Mục Dự Án

Dự án được tổ chức theo kiến trúc **Feature-based** giúp dễ dàng bảo trì:

```bash
client_web/
├── src/
│   ├── components/
│   │   ├── layout/      # Các bố cục chung
│   │   │   ├── Header.tsx        # Chứa Mega Menu & Search Logic
│   │   │   ├── Footer.tsx        # Chân trang thông tin
│   │   │   ├── MainLayout.tsx    # Khung sườn chính
│   │   │   └── SearchOverlay.tsx # Màn hình tìm kiếm phủ trùm
│   │   └── ui/          # Các UI nhỏ tái sử dụng (Button, Input...)
│   ├── features/        # Tính năng nghiệp vụ
│   │   ├── home/        # Component trang chủ (Hero, NewArrivals, BrandPhilosophy...)
│   │   └── products/    # Component sản phẩm (Card, Grid, Filter, AwardedBanner...)
│   ├── data/            # Dữ liệu giả lập (mockData.ts)
│   ├── pages/           # Các trang chính
│   │   ├── HomePage.tsx          # Trang chủ
│   │   └── ProductListPage.tsx   # Trang Best Sellers
│   ├── App.tsx          # Cấu hình Routing (Đường dẫn)
│   └── main.tsx         # Entry point