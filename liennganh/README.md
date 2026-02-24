# 🛒 Shopee Clone — Hệ thống E-Commerce Full-Stack

> **Dự án thương mại điện tử mô phỏng Shopee** — được xây dựng bằng **Spring Boot** (Backend) + **React + Vite** (Frontend).

---

## 📋 Mục Lục

- [Tổng Quan](#-tổng-quan)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Yêu Cầu Hệ Thống](#-yêu-cầu-hệ-thống)
- [Cài Đặt & Chạy](#-cài-đặt--chạy)
- [Seed Dữ Liệu Mẫu](#-seed-dữ-liệu-mẫu)
- [Tài Khoản Mặc Định](#-tài-khoản-mặc-định)
- [Tính Năng Chính](#-tính-năng-chính)
- [API Endpoints](#-api-endpoints)
- [Cơ Sở Dữ Liệu](#-cơ-sở-dữ-liệu)
- [Frontend Pages](#-frontend-pages)
- [Hướng Dẫn Phát Triển Thêm](#-hướng-dẫn-phát-triển-thêm)
- [Lưu Ý Quan Trọng](#-lưu-ý-quan-trọng)

---

## 🌟 Tổng Quan

Dự án clone Shopee với đầy đủ các chức năng:
- **Người mua**: Duyệt sản phẩm, tìm kiếm, giỏ hàng, đặt hàng, theo dõi đơn, đánh giá
- **Người bán**: Quản lý sản phẩm, thống kê doanh thu, xử lý đơn hàng
- **Admin**: Dashboard thống kê, quản lý users/sellers/products/orders/categories
- **Flash Sale**: Khung flash sale với đếm ngược, sản phẩm giảm giá
- **Đánh giá sản phẩm**: Hệ thống review với rating 1-5 sao

---

## 🛠 Công Nghệ Sử Dụng

### Backend
| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **Java** | 17 | Ngôn ngữ lập trình |
| **Spring Boot** | 3.2.2 | Framework chính |
| **Spring Data JPA** | — | ORM, tương tác database |
| **PostgreSQL** | — | Cơ sở dữ liệu |
| **Lombok** | — | Giảm boilerplate code |
| **JavaFaker** | 1.0.2 | Tạo dữ liệu mẫu |

### Frontend
| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **React** | 19 | UI Library |
| **Vite** | 7 | Build tool |
| **TailwindCSS** | 4 | CSS Framework |
| **React Router DOM** | 7 | Routing |
| **Axios** | — | HTTP Client |
| **Lucide React** | — | Icon library |

---

## 📁 Cấu Trúc Dự Án

```
liennganh/
├── src/main/java/com/liennganh/shopee/
│   ├── ShopeeApplication.java          # Entry point
│   ├── config/                         # Cấu hình (CORS, Database, Security)
│   ├── controller/                     # REST API Controllers (16 files)
│   │   ├── AuthController.java         # Đăng nhập / Đăng ký
│   │   ├── ProductController.java      # CRUD sản phẩm
│   │   ├── CartController.java         # Giỏ hàng
│   │   ├── OrderController.java        # Đơn hàng
│   │   ├── ReviewController.java       # Đánh giá sản phẩm
│   │   ├── FlashSaleController.java    # Flash Sale
│   │   ├── CategoryController.java     # Danh mục
│   │   ├── ShopController.java         # Cửa hàng
│   │   ├── VoucherController.java      # Mã giảm giá
│   │   ├── AddressController.java      # Địa chỉ giao hàng
│   │   ├── FileController.java         # Upload/Download file
│   │   ├── UserController.java         # Quản lý user
│   │   ├── AdminController.java        # API Admin
│   │   ├── AdminOrderController.java   # Admin quản lý đơn
│   │   ├── SellerController.java       # API Seller
│   │   └── DataSeederController.java   # Seed dữ liệu mẫu
│   ├── model/                          # Entity classes (16 files)
│   │   ├── User.java                   # Người dùng
│   │   ├── Product.java                # Sản phẩm
│   │   ├── ProductVariant.java         # Biến thể sản phẩm (size, color...)
│   │   ├── ProductAttribute.java       # Thuộc tính sản phẩm
│   │   ├── ProductAttributeOption.java # Giá trị thuộc tính
│   │   ├── Category.java               # Danh mục
│   │   ├── Shop.java                   # Cửa hàng
│   │   ├── Cart.java                   # Giỏ hàng
│   │   ├── CartItem.java               # Item trong giỏ
│   │   ├── Order.java                  # Đơn hàng
│   │   ├── OrderItem.java              # Chi tiết đơn
│   │   ├── Review.java                 # Đánh giá
│   │   ├── Voucher.java                # Mã giảm giá
│   │   ├── Address.java                # Địa chỉ
│   │   ├── FlashSale.java              # Flash Sale
│   │   └── FlashSaleItem.java          # Sản phẩm Flash Sale
│   ├── repository/                     # JPA Repositories
│   ├── service/                        # Business Logic
│   │   ├── DataSeederService.java      # Seeder tự động
│   │   └── ...
│   └── dto/                            # Data Transfer Objects
│       ├── request/                    # Request DTOs
│       └── response/                   # Response DTOs (ApiResponse)
├── src/main/resources/
│   └── application.yml                 # Cấu hình app
├── pom.xml                             # Maven dependencies
├── uploads/                            # Thư mục lưu ảnh upload
│
├── shopee-frontend/                    # ========== FRONTEND ==========
│   ├── package.json
│   ├── src/
│   │   ├── main.jsx                    # Entry point
│   │   ├── App.jsx                     # Routing config
│   │   ├── api.js                      # Axios instance
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Auth state management
│   │   │   └── CartContext.jsx          # Cart state management
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx           # Layout chung (Header + Footer)
│   │   │   ├── AdminLayout.jsx          # Layout Admin (Sidebar)
│   │   │   └── SellerLayout.jsx         # Layout Seller (Sidebar)
│   │   └── pages/
│   │       ├── Home.jsx                 # Trang chủ (Flash Sale + Gợi ý)
│   │       ├── ProductDetail.jsx        # Chi tiết sản phẩm + Đánh giá
│   │       ├── Cart.jsx                 # Giỏ hàng
│   │       ├── Checkout.jsx             # Thanh toán
│   │       ├── OrderHistory.jsx         # Lịch sử đơn hàng
│   │       ├── SearchResults.jsx        # Kết quả tìm kiếm
│   │       ├── Login.jsx                # Đăng nhập
│   │       ├── Register.jsx             # Đăng ký
│   │       ├── SellerRegister.jsx       # Đăng ký bán hàng
│   │       ├── Admin/
│   │       │   ├── AdminDashboard.jsx   # Dashboard thống kê
│   │       │   ├── AdminUsers.jsx       # Quản lý users
│   │       │   ├── AdminSellers.jsx     # Quản lý sellers
│   │       │   ├── AdminProducts.jsx    # Quản lý sản phẩm
│   │       │   ├── AdminOrders.jsx      # Quản lý đơn hàng
│   │       │   └── AdminCategories.jsx  # Quản lý danh mục
│   │       └── Seller/
│   │           ├── SellerDashboard.jsx   # Dashboard seller
│   │           ├── SellerProducts.jsx    # Quản lý SP của seller
│   │           ├── AddProduct.jsx        # Thêm sản phẩm mới
│   │           └── EditProduct.jsx       # Sửa sản phẩm
│   └── ...
└── .gitignore
```

---

## 💻 Yêu Cầu Hệ Thống

| Phần mềm | Yêu cầu |
|---|---|
| **Java JDK** | ≥ 17 |
| **Maven** | ≥ 3.8 |
| **Node.js** | ≥ 18 |
| **npm** | ≥ 9 |
| **PostgreSQL** | ≥ 14 |
| **Git** | Bất kỳ |

---

## 🚀 Cài Đặt & Chạy

### 1. Clone dự án

```bash
git clone https://github.com/Bao040517/lien.git
cd lien/liennganh
```

### 2. Chạy bằng Docker (Khuyên dùng) 🐳
Đây là cách nhanh nhất và ổn định nhất để chạy toàn bộ hệ thống (Frontend + Backend + Database) với đầy đủ cấu hình Volume (để lưu trữ ảnh upload không bị mất khi restart).

```bash
docker-compose up --build -d
```
> - **Frontend (React)**: Truy cập tại **http://localhost:3000**
> - **Backend API (Spring Boot)**: Truy cập tại **http://localhost:8080/api**
> - **Database (PostgreSQL)**: Port **5433** ở localhost (trong container nội bộ là 5432).

Ngừng chạy Docker:
```bash
docker-compose down
```

#### 🐳 Đẩy cấu hình Docker lên GitHub
Hệ thống đã chuẩn bị sẵn `Dockerfile` ở thư mục gốc (Spring Boot), `Dockerfile` và `nginx.conf` ở `shopee-frontend` (React), cùng với `docker-compose.yml` liên kết mọi thứ. Để đẩy các file cấu hình này lên Github cho người khác cùng chạy:

1. Mở Terminal (Cmd/PowerShell) ở thư mục gốc chứa project.
2. Gõ các lệnh Git sau:
   ```bash
   git add Dockerfile docker-compose.yml shopee-frontend/Dockerfile shopee-frontend/nginx.conf
   git commit -m "Cấu hình Docker Compose cho toàn bộ hệ thống + Volume uploads"
   git push origin main
   ```

### 3. Chạy Thủ công (Dành cho Dev)

### 2. Tạo Database PostgreSQL

```sql
-- Mở pgAdmin hoặc psql, chạy:
CREATE DATABASE liennganhmoi;
```

### 3. Cấu hình kết nối Database

Mở file `src/main/resources/application.yml` và chỉnh sửa:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/liennganhmoi
    username: postgres          # ← Thay bằng username PostgreSQL của bạn
    password: admin             # ← Thay bằng password PostgreSQL của bạn
```

### 4. Chạy Backend

```bash
# Từ thư mục gốc dự án
mvn spring-boot:run
```

> ✅ Backend sẽ chạy tại: **http://localhost:8080**

### 5. Chạy Frontend

```bash
# Mở terminal mới
cd shopee-frontend
npm install
npm run dev
```

> ✅ Frontend sẽ chạy tại: **http://localhost:5173**

### 6. Truy cập ứng dụng

Mở trình duyệt → **http://localhost:5173**

---

## 🌱 Seed Dữ Liệu Mẫu

Dự án có sẵn Data Seeder để tạo dữ liệu mẫu. **Sau khi backend chạy**, dùng Postman hoặc curl:

### Seed toàn bộ (Khuyến nghị cho lần đầu)

```bash
# POST request — Seed tất cả dữ liệu
curl -X POST http://localhost:8080/seed-db/all
```

Sẽ tạo: **10 users, 5 shops, 18 danh mục, 90 sản phẩm (5/danh mục), 5 vouchers, 5 đơn hàng, ~180 reviews**

### Reset toàn bộ (Xoá sạch + Seed lại)

```bash
curl -X POST http://localhost:8080/seed-db/reset
```

### Seed từng phần

```bash
curl -X POST "http://localhost:8080/seed-db/users?count=10"
curl -X POST "http://localhost:8080/seed-db/shops?count=5"
curl -X POST "http://localhost:8080/seed-db/categories?count=18"
curl -X POST "http://localhost:8080/seed-db/products?count=5"       # 5 sản phẩm MỖI danh mục
curl -X POST "http://localhost:8080/seed-db/product-variants"
curl -X POST "http://localhost:8080/seed-db/vouchers?count=5"
curl -X POST "http://localhost:8080/seed-db/orders?count=5"
curl -X POST "http://localhost:8080/seed-db/reviews?maxPerProduct=3"
```

### Xoá toàn bộ dữ liệu

```bash
curl -X POST http://localhost:8080/seed-db/clear
```

---

## 👤 Tài Khoản Mặc Định

Sau khi seed dữ liệu, các tài khoản được tạo tự động:

| Role | Username | Password | Ghi chú |
|---|---|---|---|
| ADMIN | `admin` | `admin123` | Tài khoản quản trị |
| USER | `user1` ~ `user9` | `password123` | Tài khoản người dùng |
| SELLER | — | — | Đăng ký qua giao diện Seller Register |

> **Lưu ý**: Username và password có thể thay đổi tùy theo seed data. Kiểm tra trong `DataSeederService.java` > `seedUsers()` để xem chi tiết.

---

## ✨ Tính Năng Chính

### 🛍 Người Mua (User)
- Duyệt sản phẩm theo danh mục
- Tìm kiếm sản phẩm (theo tên, giá, rating)
- Xem chi tiết sản phẩm (ảnh, mô tả, biến thể, đánh giá)
- Chọn biến thể (size, màu sắc...)
- Thêm vào giỏ hàng, thay đổi số lượng
- Thanh toán (chọn địa chỉ, voucher, phương thức thanh toán)
- Theo dõi đơn hàng (Chờ xác nhận → Đang vận chuyển → Đang giao → Đã giao)
- Đánh giá sản phẩm sau khi mua

### 🏪 Người Bán (Seller)
- Đăng ký trở thành Seller
- Dashboard thống kê doanh thu
- Quản lý sản phẩm (CRUD + upload ảnh + biến thể)
- Xem đơn hàng của shop

### 👨‍💼 Quản Trị (Admin)
- Dashboard tổng quan (doanh thu, đơn hàng, users)
- Quản lý Users (xem, khoá, xoá)
- Quản lý Sellers (duyệt, khoá)
- Quản lý Products (xem, xoá)
- Quản lý Orders (cập nhật trạng thái)
- Quản lý Categories (CRUD)

### ⚡ Flash Sale
- Banner Flash Sale trên trang chủ
- Đếm ngược thời gian
- Sản phẩm giảm giá với badge % giảm
- Thanh tiến trình "Đã bán"

### ⭐ Đánh Giá Sản Phẩm
- Hệ thống rating 1-5 sao
- Comment bằng tiếng Việt
- Thanh tổng hợp đánh giá (điểm trung bình + filter theo sao)

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |

### Products
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/products` | Lấy tất cả sản phẩm |
| GET | `/api/products/{id}` | Chi tiết sản phẩm |
| GET | `/api/products/category/{id}` | SP theo danh mục |
| GET | `/api/products/shop/{id}` | SP theo shop |
| GET | `/api/products/search?keyword=...` | Tìm kiếm |
| POST | `/api/products` | Tạo sản phẩm (Seller) |
| PUT | `/api/products/{id}` | Cập nhật SP |
| DELETE | `/api/products/{id}` | Xoá SP |

### Categories
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/categories` | Tất cả danh mục |
| POST | `/api/categories` | Tạo danh mục |
| PUT | `/api/categories/{id}` | Cập nhật |
| DELETE | `/api/categories/{id}` | Xoá |

### Cart
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/cart/{userId}` | Lấy giỏ hàng |
| POST | `/api/cart/add` | Thêm vào giỏ |
| PUT | `/api/cart/update` | Cập nhật số lượng |
| DELETE | `/api/cart/remove/{cartItemId}` | Xoá item |

### Orders
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/orders/user/{userId}` | Đơn hàng của user |
| GET | `/api/orders/{id}` | Chi tiết đơn hàng |
| POST | `/api/orders` | Tạo đơn hàng |
| PUT | `/api/orders/{id}/status` | Cập nhật trạng thái |

### Reviews
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/reviews/product/{productId}` | Reviews của SP |
| GET | `/api/reviews/product/{id}/rating` | Rating trung bình |
| POST | `/api/reviews` | Tạo đánh giá |

### Shops
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/shops` | Tất cả shops |
| GET | `/api/shops/{id}` | Chi tiết shop |
| POST | `/api/shops` | Tạo shop |

### Flash Sales
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/flash-sales` | Tất cả flash sales |
| GET | `/api/flash-sales/active` | Flash sale đang diễn ra |
| POST | `/api/flash-sales` | Tạo flash sale |

### File Upload
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/files/{filename}` | Lấy file/ảnh |
| POST | `/api/files/upload` | Upload file |

### Vouchers
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/vouchers` | Tất cả vouchers |
| GET | `/api/vouchers/shop/{shopId}` | Voucher theo shop |

### Addresses
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/addresses/user/{userId}` | Địa chỉ của user |
| POST | `/api/addresses` | Thêm địa chỉ |
| PUT | `/api/addresses/{id}` | Cập nhật |
| DELETE | `/api/addresses/{id}` | Xoá |

### Admin
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/admin/statistics` | Thống kê tổng quan |
| GET | `/api/admin/users` | Danh sách users |
| DELETE | `/api/admin/users/{id}` | Xoá user |

### Data Seeder
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/seed-db/all` | Seed tất cả |
| POST | `/seed-db/reset` | Xoá sạch + Seed lại |
| POST | `/seed-db/clear` | Xoá sạch dữ liệu |

---

## 🗄 Cơ Sở Dữ Liệu

### Sơ đồ Entity Relationship

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  Users   │────▶│  Shops   │────▶│  Products    │
│          │     │          │     │              │
│ id       │     │ id       │     │ id           │
│ username │     │ name     │     │ name         │
│ email    │     │ owner_id │     │ price        │
│ password │     │ ...      │     │ category_id  │
│ role     │     └──────────┘     │ shop_id      │
│ phone    │                      │ imageUrl     │
│ ...      │                      │ stockQuantity│
└──────────┘                      └──────────────┘
     │                                   │
     │  ┌──────────────┐                 │
     ├──▶│  Addresses   │                │
     │  └──────────────┘                 │
     │                                   │
     │  ┌──────────┐  ┌─────────────┐    │
     ├──▶│  Cart    ├──▶│ CartItems  │────┘
     │  └──────────┘  └─────────────┘    │
     │                                   │
     │  ┌──────────┐  ┌─────────────┐    │
     ├──▶│  Orders  ├──▶│ OrderItems │────┘
     │  └──────────┘  └─────────────┘    │
     │                                   │
     └──▶┌──────────┐                    │
         │ Reviews  │────────────────────┘
         └──────────┘

┌──────────────┐     ┌────────────────────┐
│  Categories  │────▶│     Products       │
└──────────────┘     └────────────────────┘
                            │
                     ┌──────┴───────┐
                     │              │
              ┌──────────────┐  ┌──────────────────┐
              │ProductVariant│  │ProductAttribute   │
              │              │  │                    │
              │ sku          │  │ name               │
              │ price        │  │                    │
              │ stock        │  └──────────────────┘
              │ attributes   │          │
              └──────────────┘  ┌──────────────────────┐
                                │ProductAttributeOption │
                                └──────────────────────┘
```

### Bảng chính

| Bảng | Mô tả | Quan hệ chính |
|---|---|---|
| `users` | Người dùng | → shops, orders, reviews, addresses, cart |
| `shops` | Cửa hàng | → products, vouchers |
| `categories` | Danh mục | → products |
| `products` | Sản phẩm | → variants, attributes, reviews, order_items |
| `product_variants` | Biến thể SP | Thuộc product |
| `product_attributes` | Thuộc tính SP | Thuộc product |
| `product_attribute_options` | Giá trị thuộc tính | Thuộc attribute |
| `orders` | Đơn hàng | → order_items |
| `order_items` | Chi tiết đơn | Thuộc order + product |
| `cart` | Giỏ hàng | Thuộc user |
| `cart_items` | Item giỏ hàng | Thuộc cart + product |
| `reviews` | Đánh giá | Thuộc user + product + order |
| `vouchers` | Mã giảm giá | Thuộc shop |
| `addresses` | Địa chỉ giao hàng | Thuộc user |
| `flash_sales` | Flash Sale event | → flash_sale_items |
| `flash_sale_items` | SP trong Flash Sale | Thuộc flash_sale + product |

### Trạng thái đơn hàng (Order Status)

```
PENDING → SHIPPING → DELIVERING → DELIVERED
                                → CANCELLED
```

| Trạng thái | Ý nghĩa |
|---|---|
| `PENDING` | Chờ xác nhận |
| `SHIPPING` | Đang vận chuyển |
| `DELIVERING` | Đang giao hàng |
| `DELIVERED` | Giao hàng thành công |
| `CANCELLED` | Đã huỷ |

---

## 🖥 Frontend Pages

### Trang công khai
| Route | Component | Mô tả |
|---|---|---|
| `/` | `Home.jsx` | Trang chủ (Flash Sale + Danh mục + Gợi ý) |
| `/product/:id` | `ProductDetail.jsx` | Chi tiết SP + Đánh giá |
| `/search?keyword=...` | `SearchResults.jsx` | Kết quả tìm kiếm |
| `/login` | `Login.jsx` | Đăng nhập |
| `/register` | `Register.jsx` | Đăng ký |

### Trang User (cần đăng nhập)
| Route | Component | Mô tả |
|---|---|---|
| `/cart` | `Cart.jsx` | Giỏ hàng |
| `/checkout` | `Checkout.jsx` | Thanh toán |
| `/orders` | `OrderHistory.jsx` | Lịch sử đơn hàng |
| `/seller-register` | `SellerRegister.jsx` | Đăng ký bán hàng |

### Trang Admin (`/admin/*`)
| Route | Component | Mô tả |
|---|---|---|
| `/admin` | `AdminDashboard.jsx` | Dashboard thống kê |
| `/admin/users` | `AdminUsers.jsx` | Quản lý users |
| `/admin/sellers` | `AdminSellers.jsx` | Quản lý sellers |
| `/admin/products` | `AdminProducts.jsx` | Quản lý sản phẩm |
| `/admin/orders` | `AdminOrders.jsx` | Quản lý đơn hàng |
| `/admin/categories` | `AdminCategories.jsx` | Quản lý danh mục |

### Trang Seller (`/seller/*`)
| Route | Component | Mô tả |
|---|---|---|
| `/seller` | `SellerDashboard.jsx` | Dashboard seller |
| `/seller/products` | `SellerProducts.jsx` | SP của tôi |
| `/seller/products/add` | `AddProduct.jsx` | Thêm SP mới |
| `/seller/products/edit/:id` | `EditProduct.jsx` | Sửa SP |

---

## 🔧 Hướng Dẫn Phát Triển Thêm

### Thêm Entity mới

1. **Tạo Model** trong `src/main/java/.../model/YourEntity.java`
   ```java
   @Entity
   @Data
   @Table(name = "your_table")
   public class YourEntity {
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
       private Long id;
       // ...
   }
   ```

2. **Tạo Repository** trong `repository/YourEntityRepository.java`
   ```java
   public interface YourEntityRepository extends JpaRepository<YourEntity, Long> {
       // Custom queries here
   }
   ```

3. **Tạo Service** trong `service/YourEntityService.java`

4. **Tạo Controller** trong `controller/YourEntityController.java`
   ```java
   @RestController
   @RequestMapping("/api/your-entities")
   public class YourEntityController {
       // CRUD endpoints
   }
   ```

5. **Restart backend** — JPA Hibernate sẽ tự tạo bảng (do `ddl-auto: update`)

### Thêm trang Frontend mới

1. Tạo file `.jsx` trong `shopee-frontend/src/pages/`
2. Thêm route vào `App.jsx`
3. Nếu cần layout riêng, tạo layout trong `layouts/`

### Quy ước API Response

Tất cả API trả về format thống nhất:

```json
{
  "success": true,
  "code": 1000,
  "message": "Success",
  "data": { ... }
}
```

### Quy ước Frontend API Call

```javascript
import api from '../api';

// GET
const response = await api.get('/products');
const data = response.data.data || response.data;

// POST
await api.post('/orders', orderData);
```

### Upload ảnh sản phẩm

```javascript
const formData = new FormData();
formData.append('file', file);
const response = await api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
const imageUrl = response.data.data; // URL ảnh
```

---

## ⚠️ Lưu Ý Quan Trọng

### Cho Dev mới

1. **Port mặc định**: Backend `8080`, Frontend `5173`
2. **CORS** đã cấu hình sẵn cho `localhost:5173`
3. **Ảnh sản phẩm** được lưu trong thư mục `uploads/` — thư mục này nằm trong `.gitignore`
4. **Database tự tạo bảng** với `ddl-auto: update` — không cần chạy migration
5. **Seed data** chỉ cần gọi 1 lần `POST /seed-db/reset`

### Khi deploy production

- Đổi `ddl-auto` từ `update` sang `validate` hoặc `none`
- Đổi `show-sql` sang `false`
- Thêm Spring Security (hiện chưa có authentication middleware)
- Cấu hình CORS cho domain production
- Sử dụng environment variables cho database credentials

### Các tính năng có thể phát triển thêm

- [ ] Xác thực JWT (JSON Web Token)
- [ ] Payment gateway (VNPay, Momo)
- [ ] Hệ thống chat realtime (WebSocket)
- [ ] Notification system
- [ ] Wishlist / Yêu thích
- [ ] So sánh sản phẩm
- [ ] Coupon / Mã giảm giá nâng cao
- [ ] Hệ thống điểm thưởng
- [ ] Social login (Google, Facebook)
- [ ] Email verification
- [ ] Export báo cáo (PDF, Excel)
- [ ] Đa ngôn ngữ (i18n)

---

## 📝 License

Dự án này được phát triển cho mục đích học tập.

---

**Made with ❤️ by Team Liên Ngành**
