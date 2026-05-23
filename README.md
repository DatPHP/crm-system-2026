# CRM Order Management System

A full-stack CRM system for managing orders, products, customers, and categories — built as a portfolio project.

🌐 **Live Demo:** [https://crm-system-2026.vercel.app](https://crm-system-2026.vercel.app)

> **Demo Account**
> Email: `admin@gmail.com`
> Password: `password123`

---

## 📸 Screenshots

> Dashboard, Orders, Products pages screenshots (bạn chụp màn hình thêm vào sau)

---

## ✨ Features

- 🔐 **Authentication** — Register, Login, JWT-based protected routes
- 📦 **Product Management** — CRUD with SKU, stock tracking, categories, image uploads (Cloudinary)
- 👥 **Customer Management** — Full customer profiles
- 🛒 **Order Management** — Create orders with multiple products, auto stock deduction
- 📊 **Dashboard** — Real-time stats: revenue, orders, products, customers
- 🔄 **Order History** — Automatic audit trail for every status change
- 📤 **Data Export** — Export data to Excel and PDF formats
- 📱 **Responsive** — Works on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend

| Tech                    | Usage                  |
| ----------------------- | ---------------------- |
| React 19 + TypeScript   | UI framework           |
| Vite 8                  | Build tool             |
| TailwindCSS + shadcn/ui | Styling                |
| React Query v5          | Server state & caching |
| React Hook Form + Zod   | Form validation        |
| Zustand                 | Auth state management  |
| Axios                   | HTTP client            |
| React Router v7         | Client-side routing    |

### Backend

| Tech                | Usage             |
| ------------------- | ----------------- |
| NestJS 11 + TypeScript| API framework     |
| Prisma ORM 6        | Database access   |
| PostgreSQL          | Database          |
| JWT + Passport      | Authentication    |
| bcrypt              | Password hashing  |
| Swagger             | API documentation |
| class-validator     | DTO validation    |
| Cloudinary + Multer | Image uploads     |
| ExcelJS + PDFKit    | Data export       |
| Helmet + Throttler  | Security          |

### Infrastructure

| Service | Usage                 |
| ------- | --------------------- |
| Vercel  | Frontend hosting      |
| Render  | Backend hosting       |
| Neon    | Serverless PostgreSQL |
| GitHub  | Source control        |

---

## 🏗️ Architecture

---

## 📁 Project Structure

```text
crm-system/
├── frontend/                 # React application
│   ├── src/
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── layouts/          # CRM layouts
│   │   ├── lib/              # Utility libraries & Axios instance
│   │   ├── pages/            # Page components
│   │   ├── routes/           # Protected routing logic
│   │   ├── services/         # API service calls
│   │   ├── store/            # Zustand state management
│   │   ├── types/            # TypeScript type definitions
│   │   └── utils/            # Helper functions
│   └── vercel.json
│
└── backend/                  # NestJS application
    ├── src/
    │   ├── auth/             # JWT authentication
    │   ├── categories/       # Category CRUD
    │   ├── common/           # Shared modules/utils
    │   ├── config/           # App configuration
    │   ├── customers/        # Customer CRUD
    │   ├── dashboard/        # Stats & analytics
    │   ├── decorators/       # Custom decorators
    │   ├── export/           # Excel/PDF export services
    │   ├── filters/          # Exception filters
    │   ├── guards/           # JWT guard & strategies
    │   ├── orders/           # Order management
    │   ├── prisma/           # Database service
    │   ├── products/         # Product CRUD
    │   ├── upload/           # Cloudinary file upload
    │   └── users/            # User management
    └── prisma/
        └── schema.prisma     # Database schema
```

---

## 🗄️ Database Schema

- **users** → admins who manage the CRM
- **customers** → customers who place orders
- **categories** → product categories (with parent/child)
- **products** → products with stock tracking
- **orders** → orders linked to customers
- **order_items** → products within each order
- **order_histories** → audit log for order changes

---

## 🚀 Local Development

### Prerequisites

- Node.js >= 18
- PostgreSQL database (or Neon free tier)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET in .env

npx prisma migrate dev
npm run start:dev
```

API running at: `http://localhost:3000/api`
Swagger docs at: `http://localhost:3000/api/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App running at: `http://localhost:5173`

---

## 📡 API Documentation

Full API docs available at:
`https://crm-system-2026-5nqq.onrender.com/api/docs`

### Key Endpoints

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/categories
POST   /api/categories
PATCH  /api/categories/:id
DELETE /api/categories/:id
GET    /api/products
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
GET    /api/customers
POST   /api/customers
PATCH  /api/customers/:id
DELETE /api/customers/:id
GET    /api/orders
POST   /api/orders
GET    /api/orders/:id
PATCH  /api/orders/:id
PATCH  /api/orders/:id/cancel
GET    /api/dashboard/summary
```

---

## 💡 Key Implementation Highlights

**Prisma Transaction for Orders**

```typescript
// Ensures stock deduction and order creation are atomic
await prisma.$transaction(async (tx) => {
  // 1. Validate stock availability
  // 2. Create order + order items
  // 3. Decrement product stock
  // 4. Log order history
});
```

**JWT Protected Routes**

```typescript
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController { ... }
```

**React Query for Data Fetching**

```typescript
const { data, isLoading } = useQuery({
  queryKey: ["orders"],
  queryFn: orderService.getAll,
});
```

---

## 👨‍💻 Author

**Dat**

- GitHub: [@DatPHP](https://github.com/DatPHP)
- Live Demo: [crm-system-2026.vercel.app](https://crm-system-2026.vercel.app)

---

## 📄 License

MIT License
