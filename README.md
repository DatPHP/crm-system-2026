# 🚀 CRM Order Management System

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status Active" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License MIT" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" alt="PRs Welcome" />
</div>

<br/>

A full-stack CRM system for managing orders, products, customers, and categories — built with modern web technologies as a portfolio project.

🌐 **Live Demo:** [https://crm-system-2026.vercel.app](https://crm-system-2026.vercel.app)

> **Demo Account**
> - **Email:** `admin@gmail.com`
> - **Password:** `password123`

---

## 📸 Feature Screenshots

*(Add your actual screenshots below)*

<div align="center">
  <img src="https://via.placeholder.com/800x400.png?text=Dashboard+Overview" alt="Dashboard" width="800" />
  <br/>
  <i>Dashboard Overview & Analytics</i>
</div>

<br/>

<div align="center">
  <img src="https://via.placeholder.com/800x400.png?text=Order+Management" alt="Orders" width="800" />
  <br/>
  <i>Order Management & Tracking</i>
</div>

---

## 🛠️ Tech Stack

Our tech stack is carefully chosen to ensure scalability, type safety, and an excellent developer experience.

### 💻 Frontend
![React](https://img.shields.io/badge/React_19-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=ReactQuery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-20232A?style=for-the-badge&logo=react&logoColor=white)

### ⚙️ Backend
![NestJS](https://img.shields.io/badge/NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_6-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

### ☁️ Infrastructure & Tools
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=postgresql&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

---

## 🏗️ Architecture Diagram

The system follows a modern decoupled architecture where the React frontend communicates with the NestJS REST API.

```mermaid
graph TD
    Client[Web Browser] -->|HTTPS / REST| CDN[Vercel CDN - Frontend]
    Client -->|HTTPS / REST| API[Render - NestJS Backend]
    
    subgraph Frontend [React SPA]
        CDN --> ReactQuery[React Query Cache]
        ReactQuery --> Components[UI Components]
        Components --> Zustand[Global State]
    end
    
    subgraph Backend [NestJS Server]
        API --> Guards[JWT Auth & RBAC Guards]
        Guards --> Controllers[Controllers]
        Controllers --> Services[Business Logic Services]
        Services --> Prisma[Prisma ORM]
    end
    
    subgraph External Services
        Services -->|Upload Image| Cloudinary[Cloudinary]
    end

    subgraph Database
        Prisma -->|TCP / Connection Pool| DB[(Neon Serverless PostgreSQL)]
    end
```

---

## 🔐 Role-Based Access Control (RBAC)

The system enforces security using a strict JWT-based Role-Based Access Control mechanism.

We define three primary roles:
- **`SUPER_ADMIN`**: Complete access to all system features, including system configuration and promoting users.
- **`ADMIN`**: Can manage orders, products, categories, and customers.
- **`STAFF`**: Restricted access. Can view orders and create new ones, but cannot delete records or manage users.

**Implementation Highlight:**
```typescript
// Roles are enforced at the controller level using custom decorators
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Delete(':id')
remove(@Param('id') id: string) {
  return this.productsService.remove(+id);
}
```

---

## 🗄️ Database ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    users {
        Int id PK
        String name
        String email
        String password
        Role role
        Boolean isActive
    }
    
    customers {
        Int id PK
        String fullName
        String email
        String phone
        String address
    }

    categories {
        Int id PK
        String name
        String slug
        Int parentId FK
    }

    products {
        Int id PK
        String title
        String sku
        Decimal price
        Int stockQuantity
        Boolean isActive
        Int categoryId FK
    }

    orders {
        Int id PK
        String orderCode
        Decimal totalPrice
        OrderStatus status
        Int customerId FK
        Int createdById FK
    }

    order_items {
        Int id PK
        Int quantity
        Decimal unitPrice
        Decimal subtotal
        Int orderId FK
        Int productId FK
    }

    order_histories {
        Int id PK
        String action
        Int orderId FK
        Int createdById FK
    }

    refresh_tokens {
        Int id PK
        String token
        Int userId FK
    }

    users ||--o{ orders : "creates"
    users ||--o{ order_histories : "logs"
    users ||--o{ refresh_tokens : "owns"
    
    customers ||--o{ orders : "places"
    
    categories ||--o{ categories : "parent/child"
    categories ||--o{ products : "contains"
    
    products ||--o{ order_items : "included_in"
    
    orders ||--|{ order_items : "has"
    orders ||--o{ order_histories : "tracks"
```

---

## 🔄 API Request Flow

A typical flow for creating an order (with transaction and validation):

```mermaid
sequenceDiagram
    participant Client as React App
    participant Guard as JWT & RBAC Guard
    participant Controller as OrdersController
    participant Service as OrdersService
    participant DB as Prisma (PostgreSQL)

    Client->>Guard: POST /api/orders (JWT Token)
    Guard-->>Client: 401 Unauthorized (If invalid)
    Guard->>Controller: Token Valid (User Info Injected)
    Controller->>Service: createOrder(dto, userId)
    
    Service->>DB: BEGIN TRANSACTION
    DB-->>Service: Transaction Started
    
    Service->>DB: Verify Customer & Product Stock
    DB-->>Service: Stock Available
    
    Service->>DB: Insert Order & OrderItems
    Service->>DB: Decrement Product Stock
    Service->>DB: Insert OrderHistory (Audit Log)
    
    Service->>DB: COMMIT TRANSACTION
    DB-->>Service: Success
    
    Service-->>Controller: Return Order Data
    Controller-->>Client: 201 Created (JSON)
```

---

## 📁 Folder Structure

```text
crm-system/
├── frontend/                     # React application
│   ├── e2e/                      # Playwright E2E tests
│   ├── src/
│   │   ├── assets/               # Static assets & icons
│   │   ├── components/           # Reusable UI (shadcn/ui & custom)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── layouts/              # App layouts (Sidebar, Header)
│   │   ├── lib/                  # Utilities (Axios, formatting)
│   │   ├── pages/                # Route components (Dashboard, Orders)
│   │   ├── routes/               # Protected route definitions
│   │   ├── services/             # API communication layer
│   │   ├── store/                # Zustand global state (Auth)
│   │   └── types/                # TypeScript interfaces
│   └── playwright.config.ts
│
└── backend/                      # NestJS application
    ├── prisma/
    │   └── schema.prisma         # Database schema & migrations
    ├── src/
    │   ├── auth/                 # JWT Authentication & Tokens
    │   ├── categories/           # Category management API
    │   ├── common/               # Shared DTOs, interfaces
    │   ├── config/               # Environment & Cloudinary config
    │   ├── customers/            # Customer management API
    │   ├── dashboard/            # Analytics & statistics API
    │   ├── decorators/           # Custom decorators (@CurrentUser, @Roles)
    │   ├── export/               # Excel & PDF generation logic
    │   ├── filters/              # Global exception handling
    │   ├── guards/               # AuthGuard & RolesGuard
    │   ├── orders/               # Order & Inventory management API
    │   ├── prisma/               # Prisma service wrapper
    │   ├── products/             # Product management API
    │   ├── upload/               # Image upload handling
    │   └── users/                # User management API
    └── test/                     # Jest E2E tests
```

---

## 🚀 Environment Setup & Local Development

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** database (Local or Neon)
- **Cloudinary** account (for image uploads)

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and setup your `.env` file:

```bash
cd backend
npm install
cp .env.example .env
```

**Required `.env` variables (Backend):**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/crm?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_SECRET="your_refresh_secret"
JWT_REFRESH_EXPIRES_IN="7d"

# Cloudinary (Optional, for product images)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

**Run Database Migrations & Start Server:**
```bash
npx prisma migrate dev --name init
npx prisma db seed # If you have a seed script
npm run start:dev
```
- API is now running at `http://localhost:3000/api`
- Swagger Documentation is at `http://localhost:3000/api/docs`

### 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and configure environment variables:

```bash
cd frontend
npm install
cp .env.example .env
```

**Required `.env` variables (Frontend):**
```env
VITE_API_URL="http://localhost:3000/api"
```

**Start the Development Server:**
```bash
npm run dev
```
- App is running at `http://localhost:5173`

---

## 🛳️ Deployment Architecture

We utilize continuous deployment mechanisms for rapid delivery:

- **Frontend (Vercel):** Automatically builds and deploys the React SPA on every push to the `main` branch. Environment variables for production are managed in the Vercel dashboard.
- **Backend (Render):** Connected to the GitHub repository. It builds the NestJS app, runs Prisma database migrations during the build step, and deploys the web service.
- **Database (Neon.tech):** Serverless Postgres scales automatically and connects to the Render backend via secure connection pooling.

---

## 👨‍💻 Author

**Dat**
- GitHub: [@DatPHP](https://github.com/DatPHP)
- Live Demo: [crm-system-2026.vercel.app](https://crm-system-2026.vercel.app)

---

## 📄 License

This project is licensed under the MIT License.
