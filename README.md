# Node MVC CRUD - Suppliers & Products

## Setup
1. Copy `.env.example` to `.env` and adjust `MONGO_URI` if needed.
2. Install dependencies: `npm install`
3. (Optional) Seed sample data: `npm run seed`
4. Start: `npm start`
5. Open http://localhost:3000

Project structure follows MVC pattern.
# Node MVC CRUD: Product & Supplier App

## Mô tả dự án
Dự án là một **website CRUD** để quản lý **nhà cung cấp (Supplier)** và **sản phẩm (Product)**.  
- **Nhà cung cấp (Supplier)**: `name`, `address`, `phone`.  
- **Sản phẩm (Product)**: `name`, `price`, `quantity`, `supplierId` (tham chiếu đến nhà cung cấp).  

Dự án được xây dựng bằng **Node.js, Express, MongoDB và Mongoose** theo **kiến trúc MVC**.  
Giao diện sử dụng **Bootstrap** để responsive và đẹp mắt.

---

## Cấu trúc dự án
