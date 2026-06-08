# 🚀 CRM Order Management System

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status Active" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License MIT" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Enabled" />
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="CI/CD" />
  <img src="https://img.shields.io/badge/Redis-Upstash-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis Upstash" />
</div>

<br/>

A full-stack CRM system for managing orders, products, customers, and categories — built with modern web technologies as a portfolio project.

🌐 **Live Demo:** [https://crm-system-2026.vercel.app](https://crm-system-2026.vercel.app)

> **Demo Account**
>
> - **Email:** `admin@gmail.com`
> - **Password:** `password123`

---

## 📸 Feature Screenshots

<div align="center">
  <img src="https://drive.google.com/file/d/1mR2IG6JJ0sOaG0OPiuFxPHAqYrwa279U/view?text=Dashboard+Overview" alt="Dashboard" width="800" />
  <br/>
  <i>Dashboard Overview & Analytics</i>
</div>

<br/>

<div align="center">
  <img src="https://drive.google.com/file/d/10uLKm9kOIhz4SjD_CXA2Z_7IpQ_IFVto/view" alt="Orders" width="800" />
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
![Resend](https://img.shields.io/badge/Resend-black?style=for-the-badge&logo=minutemailer&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?style=for-the-badge&logo=redis&logoColor=white)

### ☁️ Infrastructure & Tools

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=postgresql&logoColor=white)
![Upstash](https://img.shields.io/badge/Upstash-00E9A3?style=for-the-badge&logo=upstash&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

---

## 🏗️ Architecture Diagram

The system follows a modern decoupled architecture where the React frontend communicates with the NestJS REST API. A Redis cache layer (via Upstash) sits between the business logic and the database to minimize latency on hot read paths.

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
        Services --> Cache[CacheService]
        Cache -->|Cache HIT| Services
        Cache -->|Cache MISS| Prisma[Prisma ORM]
        Services --> Prisma
    end

    subgraph External Services
        Services -->|Upload Image| Cloudinary[Cloudinary]
        Services -->|Send Email| Resend[Resend API]
        Cache -->|GET / SET / DEL| Redis[(Upstash Redis)]
    end

    subgraph Database
        Prisma -->|TCP / Connection Pool| DB[(Neon Serverless PostgreSQL)]
    end
```

---

## ⚡ Redis Caching Layer

The backend features a global **`CacheModule`** powered by [Upstash Redis](https://upstash.com/) — a serverless Redis service that works seamlessly with Render deployments without any self-hosted infrastructure.

### How it works

The `CacheService` wraps Upstash's HTTP-based Redis client and is registered as a **`@Global()`** NestJS module, making it injectable anywhere in the application without extra imports.

```typescript
// Predefined TTL constants (in seconds)
static readonly TTL = {
  DASHBOARD: 60 * 5,    // 5 minutes
  CATEGORIES: 60 * 30,  // 30 minutes
  PRODUCTS: 60 * 5,     // 5 minutes
  ORDERS: 60 * 2,       // 2 minutes
  CUSTOMERS: 60 * 5,    // 5 minutes
};
```

### Cache operations

| Method                        | Description                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| `get<T>(key)`                 | Read a value from Redis. Returns `null` on miss or error.                                      |
| `set(key, value, ttl)`        | Write a value with a TTL using `SETEX`.                                                        |
| `del(key)`                    | Invalidate a single cache key.                                                                 |
| `delPattern(pattern)`         | Invalidate all keys matching a glob pattern (e.g. `orders:*`).                                 |
| `getOrSet(key, ttl, fetcher)` | Read-through helper: returns cached value or calls `fetcher()`, stores result, and returns it. |

### Cache strategy per module

| Module         | Keys                                   | TTL    | Invalidated on                   |
| -------------- | -------------------------------------- | ------ | -------------------------------- |
| **Dashboard**  | `dashboard:summary`                    | 5 min  | Order create / update / delete   |
| **Orders**     | `orders:list:*`, `orders:detail:*`     | 2 min  | Order create / update / delete   |
| **Products**   | `products:list:*`, `products:detail:*` | 5 min  | Product create / update / delete |
| **Categories** | `categories:all`, `categories:<id>`    | 30 min | Category / product mutation      |

> **Graceful degradation:** If `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN` are not set, `CacheService` silently disables itself — the application continues to work normally without caching. No restart required.

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

    password_reset_tokens {
        Int id PK
        String token
        Int userId FK
        DateTime expiresAt
    }

    users ||--o{ orders : "creates"
    users ||--o{ order_histories : "logs"
    users ||--o{ refresh_tokens : "owns"
    users ||--o| password_reset_tokens : "owns"

    customers ||--o{ orders : "places"

    categories ||--o{ categories : "parent/child"
    categories ||--o{ products : "contains"

    products ||--o{ order_items : "included_in"

    orders ||--|{ order_items : "has"
    orders ||--o{ order_histories : "tracks"
```

---

## 🔄 API Request Flow

A typical flow for a cached read (e.g. listing orders):

```mermaid
sequenceDiagram
    participant Client as React App
    participant Guard as JWT & RBAC Guard
    participant Service as OrdersService
    participant Cache as CacheService (Redis)
    participant DB as Prisma (PostgreSQL)

    Client->>Guard: GET /api/orders (JWT Token)
    Guard-->>Client: 401 Unauthorized (If invalid)
    Guard->>Service: Token valid

    Service->>Cache: get("orders:list:...")
    alt Cache HIT
        Cache-->>Service: Cached JSON ✅
        Service-->>Client: 200 OK (from cache)
    else Cache MISS
        Cache-->>Service: null
        Service->>DB: SELECT orders ...
        DB-->>Service: Rows
        Service->>Cache: set("orders:list:...", data, 120s)
        Service-->>Client: 200 OK (from DB)
    end
```

A typical flow for creating an order (write path with cache invalidation):

```mermaid
sequenceDiagram
    participant Client as React App
    participant Guard as JWT & RBAC Guard
    participant Controller as OrdersController
    participant Service as OrdersService
    participant DB as Prisma (PostgreSQL)
    participant Cache as CacheService (Redis)

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

    Service->>Cache: del("dashboard:summary")
    Service->>Cache: delPattern("orders:*")
    Service->>Cache: delPattern("products:*")

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
    │   ├── cache/                # ⚡ Redis cache layer (Upstash)
    │   │   ├── cache.module.ts   #   Global @Module
    │   │   └── cache.service.ts  #   get / set / del / delPattern / getOrSet
    │   ├── categories/           # Category management API
    │   ├── common/               # Shared DTOs, interfaces
    │   ├── config/               # Environment & Cloudinary config
    │   ├── customers/            # Customer management API
    │   ├── dashboard/            # Analytics & statistics API
    │   ├── decorators/           # Custom decorators (@CurrentUser, @Roles)
    │   ├── export/               # Excel & PDF generation logic
    │   ├── filters/              # Global exception handling
    │   ├── guards/               # AuthGuard & RolesGuard
    │   ├── mail/                 # Email delivery via Resend & templates
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
- **Docker** and **Docker Compose** (optional, for containerized setup)
- **Cloudinary** account (for image uploads)
- **Upstash** account (optional, for Redis caching)

### 2. Quick Start with Docker 🐳

The easiest way to run the application locally is using Docker Compose.

```bash
# 1. Copy the Docker environment file
cp .env.docker .env

# 2. Start the application
docker-compose up --build
```

- Frontend will be available at `http://localhost:5173`
- Backend API will be available at `http://localhost:3000/api`

### 3. Manual Setup (Without Docker)

#### Backend Setup

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

# Cloudinary (for product images)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Resend API (for email sending)
RESEND_API_KEY="re_123456789"
MAIL_FROM="CRM System <onboarding@resend.dev>"
FRONTEND_URL="http://localhost:5173"

# Upstash Redis (optional — caching is disabled if omitted)
UPSTASH_REDIS_REST_URL="https://<your-db>.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_token"
```

> **Note:** The `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` variables are **optional**. If they are not provided, the `CacheService` will log a warning and the application will operate normally without caching.

**Run Database Migrations & Start Server:**

```bash
npx prisma migrate dev --name init
npx prisma db seed # If you have a seed script
npm run start:dev
```

- API is now running at `http://localhost:3000/api`
- Swagger Documentation is at `http://localhost:3000/api/docs`

#### Frontend Setup

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

We utilize continuous deployment mechanisms and GitHub Actions for rapid and safe delivery:

- **CI/CD (GitHub Actions):** Automated workflows (`ci.yml`, `deploy.yml`) run on every push and pull request to ensure code quality (linting, tests) and trigger deployments.
- **Frontend (Vercel):** Automatically builds and deploys the React SPA on every push to the `main` branch. Environment variables for production are managed in the Vercel dashboard.
- **Backend (Render):** Connected to the GitHub repository. It builds the NestJS app (either via Docker or Node), runs Prisma database migrations during the build step, and deploys the web service.
- **Database (Neon.tech):** Serverless Postgres scales automatically and connects to the Render backend via secure connection pooling.
- **Cache (Upstash):** Serverless Redis accessed over HTTPS REST API. No additional infrastructure needed — set two environment variables in Render and caching is enabled automatically.

---

## 👨‍💻 Author

**Dat**

- GitHub: [@DatPHP](https://github.com/DatPHP)
- Live Demo: [crm-system-2026.vercel.app](https://crm-system-2026.vercel.app)
- Henry here - 2026

---

## 📄 License

This project is licensed under the MIT License.
