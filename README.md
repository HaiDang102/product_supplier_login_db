
---

# Product & Supplier Management System 

## Mô tả dự án

Đây là một **ứng dụng web quản lý sản phẩm và nhà cung cấp** được xây dựng bằng Node.js, Express, MongoDB và EJS. Dự án hỗ trợ các tính năng cơ bản và nâng cao:

* **Quản lý người dùng**: đăng ký, đăng nhập, đăng xuất, quên mật khẩu, reset password bằng email.
* **CRUD Nhà cung cấp (Supplier)**: tạo, đọc, cập nhật, xóa thông tin nhà cung cấp.
* **CRUD Sản phẩm (Product)**: tạo, đọc, cập nhật, xóa sản phẩm, liên kết với nhà cung cấp.
* **Tìm kiếm và lọc sản phẩm** theo tên hoặc theo nhà cung cấp.
* **Session-based authentication** với express-session và lưu trữ session trong MongoDB.
* **Giao diện VIP, responsive**, sử dụng Bootstrap 5.
* **Swagger API documentation** cho tất cả các route RESTful.
* **Email notification** khi người dùng yêu cầu reset mật khẩu (sử dụng Nodemailer).

---

## Công nghệ sử dụng

* Node.js & Express.js
* MongoDB & Mongoose
* EJS (Embedded JavaScript Templates)
* Bootstrap 5 (responsive)
* Express-session + Connect-mongo
* Body-parser & Method-override
* Nodemailer (gửi email reset password)
* Swagger (API documentation)

---

## Cấu trúc dự án

```
node-mvc-crud-login-logout-register/
│
├─ app.js                    # Entry point của ứng dụng
├─ package.json
├─ .env                      # Biến môi trường (MONGO_URI, SESSION_SECRET, EMAIL_USER, EMAIL_PASS)
│
├─ controllers/              # Xử lý logic cho các route
│   ├─ authController.js
│   ├─ productController.js
│   ├─ supplierController.js
│   └─ indexController.js
│
├─ models/                   # Mongoose models
│   ├─ User.js
│   ├─ Product.js
│   └─ Supplier.js
│
├─ routes/                   # Express routers
│   ├─ auth.js
│   ├─ productRoutes.js
│   ├─ supplierRoutes.js
│   └─ index.js
│
├─ views/                    # EJS templates
│   ├─ partials/             # Header, Footer, Navbar
│   ├─ auth/                 # Login, Register, Forgot, Reset
│   ├─ products/             # Product forms, lists
│   ├─ suppliers/            # Supplier forms, lists
│   └─ index.ejs             # Trang chủ
│
├─ public/                   # Static files
│   ├─ css/
│   ├─ js/
│   └─ images/
│
└─ README.md                 # Hướng dẫn và mô tả dự án
```

---

## Hướng dẫn cài đặt

1. Clone repo:

```bash
git clone <repository_url>
cd node-mvc-crud-login-logout-register
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/product_supplier_login_db
SESSION_SECRET=your_session_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

4. Chạy ứng dụng:

```bash
node app.js
```

5. Truy cập: `http://localhost:3000`

6. Swagger docs: `http://localhost:3000/api-docs`

---


