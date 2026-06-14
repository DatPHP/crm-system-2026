# 🚀 CRM Order Management System

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status Active" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License MIT" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Enabled" />
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="CI/CD" />
  <img src="https://img.shields.io/badge/Redis-Upstash-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis Upstash" />
  <img src="https://img.shields.io/badge/WebSocket-Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="WebSocket Socket.io" />
</div>

<br/>

A full-stack CRM system for managing orders, products, customers, and categories — built with modern web technologies as a portfolio project. Features **real-time updates via WebSocket**, a **Redis caching layer** for high-performance reads, a **persistent in-app notification system**, and a **dark / light mode** UI toggle.

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
![React Query](https://img.shields.io/badge/React_Query_v5-FF4154?style=for-the-badge&logo=ReactQuery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand_v5-20232A?style=for-the-badge&logo=react&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io_Client-010101?style=for-the-badge&logo=socket.io&logoColor=white)

| Library | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tool & dev server |
| TailwindCSS | 3 | Utility-first CSS |
| React Query (`@tanstack/react-query`) | 5 | Server-state, caching, mutations |
| Zustand | 5 | Global client-state (auth + theme) |
| Socket.io Client | 4.8 | WebSocket real-time connection |
| React Router DOM | 7 | Client-side routing |
| React Hook Form + Zod | 7 / 4 | Form management & validation |
| shadcn/ui + Radix UI | 4 | Accessible component primitives |
| Sonner | 2 | Toast notifications |
| Lucide React | 1.16 | Icon library |
| Geist Variable Font | – | Typography |
| Axios | 1 | HTTP client |
| Playwright | 1.60 | End-to-end testing |

### ⚙️ Backend

![NestJS](https://img.shields.io/badge/NestJS_11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_6-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-black?style=for-the-badge&logo=minutemailer&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Upstash-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io_Server-010101?style=for-the-badge&logo=socket.io&logoColor=white)

| Library | Version | Purpose |
|---|---|---|
| NestJS | 11 | Backend framework |
| Prisma ORM | 6 | Database ORM & migrations |
| PostgreSQL (Neon) | – | Primary database |
| JWT / Passport | 11 | Authentication & refresh tokens |
| `@nestjs/websockets` + Socket.io | 11 | WebSocket gateway |
| `@upstash/redis` | 1.38 | Serverless Redis cache client |
| Resend | 6 | Transactional email delivery |
| Cloudinary | 2 | Image upload & transformation |
| Swagger / OpenAPI | 11 | Interactive API documentation |
| ExcelJS / PDFKit | 4 / 0.18 | Export reports |
| bcrypt | 6 | Password hashing |
| Helmet | 8 | HTTP security headers |
| `@nestjs/throttler` | 6 | Rate limiting |
| Jest | 30 | Unit & E2E testing |

### ☁️ Infrastructure & Tools

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=postgresql&logoColor=white)
![Upstash](https://img.shields.io/badge/Upstash-00E9A3?style=for-the-badge&logo=upstash&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **JWT Auth + RBAC** | Access/refresh token flow. Three roles: `SUPER_ADMIN`, `ADMIN`, `STAFF` |
| 🛒 **Order Management** | Create orders with multi-item transactions, stock validation, order history audit log |
| 📦 **Product & Category Management** | Hierarchical categories (parent/child), Cloudinary image uploads, stock tracking |
| 👥 **Customer Management** | Full customer CRM with contact details and order history |
| 📊 **Analytics Dashboard** | Real-time stats: total orders, products, customers, revenue, recent orders, orders-by-status |
| 🔔 **Persistent Notification System** | DB-backed per-user notifications for every order lifecycle event; bell icon with unread badge, mark-as-read, delete, clear-read |
| 🌗 **Dark / Light Mode** | One-click theme toggle persisted to `localStorage`; respects `prefers-color-scheme` on first load |
| 🔴 **Real-Time WebSocket** | Socket.io pushes live `order:created`, `order:updated`, `dashboard:updated`, and `notification` events to all connected clients |
| ⚡ **Redis Caching** | Upstash Redis reduces DB load on hot read paths with configurable TTL per resource |
| 📤 **Export Reports** | Download orders/products as Excel (`.xlsx`) or PDF |
| 📧 **Transactional Email** | Order confirmation & status-update emails sent via Resend |
| 🖼️ **Avatar & Profile** | Users can upload/change their avatar (stored on Cloudinary); profile page for name & password management |
| 🔑 **Forgot / Reset Password** | Token-based password reset flow with expiry, delivered via email |
| 📱 **Responsive Layout** | Collapsible sidebar (desktop) + slide-in drawer (mobile) |
| 🐳 **Docker Support** | Single `docker-compose up --build` starts both services locally |
| 🧪 **Testing** | Jest unit tests for services; Playwright E2E test suite for the frontend |

---

## 🏗️ Architecture Diagram

The system follows a modern decoupled architecture. A Redis cache layer (Upstash) reduces database load on hot read paths, while a Socket.io WebSocket gateway pushes real-time events to all connected clients without polling. A dedicated `notifications` module persists per-user notification records in PostgreSQL, fed by business-logic services on every significant order event.

```mermaid
graph TD
    Client[Web Browser] -->|HTTPS / REST| CDN[Vercel CDN - Frontend]
    Client -->|HTTPS / REST| API[Render - NestJS Backend]
    Client <-->|WebSocket / Socket.io| WS[Render - NestJS Backend]

    subgraph Frontend [React 19 SPA]
        CDN --> ThemeStore[useThemeStore - Zustand]
        CDN --> ReactQuery[React Query v5 Cache]
        ReactQuery --> Components[UI Components]
        Components --> AuthStore[useAuthStore - Zustand]
        Components --> useSocket[useSocket Hook]
        useSocket --> useRealtime[useRealtime Hook]
        useRealtime -->|invalidateQueries + toast| ReactQuery
        Components --> NotificationBell[NotificationBell Component]
        Components --> ThemeToggle[ThemeToggle Component]
        NotificationBell -->|GET /notifications| ReactQuery
    end

    subgraph Backend [NestJS 11 Server]
        API --> Guards[JWT Auth & RBAC Guards]
        Guards --> Controllers[Controllers]
        Controllers --> Services[Business Logic Services]
        Services --> Cache[CacheService]
        Cache -->|Cache HIT| Services
        Cache -->|Cache MISS| Prisma[Prisma ORM]
        Services --> Prisma
        Services -->|emit events| Gateway[EventsGateway]
        Gateway -->|broadcast| WS
        Services --> NotifService[NotificationsService]
        NotifService --> Prisma
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

## 🔴 WebSocket Real-Time

The system uses **Socket.io** (via `@nestjs/websockets`) to push live events to every connected browser — no polling required.

### Backend: `EventsGateway`

A single `@Global()` `GatewayModule` registers the `EventsGateway` and exports it so any service can inject it and fire events. The gateway also tracks connected client count for observability.

```typescript
// backend/src/gateway/events.gateway.ts
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', process.env.FRONTEND_URL || ''],
    credentials: true,
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;
  private connectedClients = 0;

  // Tracks active connections in server logs
  handleConnection(client: Socket) { this.connectedClients++; }
  handleDisconnect(client: Socket) { this.connectedClients--; }

  emitOrderCreated(order: { id; orderCode; totalPrice; customerName }) {
    this.server.emit('order:created', { ...order, timestamp: new Date().toISOString() });
  }

  emitOrderUpdated(order: { id; orderCode; status }) {
    this.server.emit('order:updated', { ...order, timestamp: new Date().toISOString() });
  }

  emitDashboardUpdated(stats: { totalOrders; totalProducts; totalCustomers; revenue }) {
    this.server.emit('dashboard:updated', { ...stats, timestamp: new Date().toISOString() });
  }

  emitNotification(message: string, type: 'success' | 'info' | 'warning') {
    this.server.emit('notification', { message, type, timestamp: new Date().toISOString() });
  }
}
```

### Socket events reference

| Event               | Direction            | Payload                                                              | Triggered by                                        |
| ------------------- | -------------------- | -------------------------------------------------------------------- | --------------------------------------------------- |
| `order:created`     | Server → All clients | `{ id, orderCode, totalPrice, customerName, timestamp }`             | `POST /api/orders`                                  |
| `order:updated`     | Server → All clients | `{ id, orderCode, status, timestamp }`                               | `PATCH /api/orders/:id` (status change)             |
| `dashboard:updated` | Server → All clients | `{ totalOrders, totalProducts, totalCustomers, revenue, timestamp }` | Dashboard data change                               |
| `notification`      | Server → All clients | `{ message, type, timestamp }`                                       | `POST /api/orders` and `PATCH /api/orders/:id` (transient toast) |

### Frontend: hooks & components

**`useSocket`** — manages the singleton Socket.io connection with automatic reconnection:

```typescript
// frontend/src/hooks/useSocket.ts
const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export function useSocket() {
  // transports: ['websocket', 'polling']
  // reconnectionAttempts: 5, reconnectionDelay: 1000ms
  return { socket, connected };
}
```

**`useRealtime`** — subscribes to all server events, invalidates React Query caches (including `notifications`), and fires Sonner toast notifications:

```typescript
// frontend/src/hooks/useRealtime.ts
export function useRealtime() {
  const { socket, connected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on('order:created', (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] }); // ← syncs bell
      toast.success(`🛒 New order: ${data.orderCode}`, {
        description: `$${Number(data.totalPrice).toLocaleString()} — ${data.customerName}`,
        duration: 5000,
      });
    });

    socket.on('order:updated', (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['order', String(data.id)] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] }); // ← syncs bell
      toast.info(`📦 Order ${data.orderCode}: ${data.status}`, { duration: 4000 });
    });

    socket.on('dashboard:updated', () =>
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }));

    socket.on('notification', (data) => {
      if (data.type === 'success') toast.success(data.message);
      if (data.type === 'warning') toast.warning(data.message);
      if (data.type === 'info')    toast.info(data.message);
    });

    return () => {
      socket.off('order:created');
      socket.off('order:updated');
      socket.off('dashboard:updated');
      socket.off('notification');
    };
  }, [socket, queryClient]);

  return { connected };
}
```

**`ConnectionStatus`** — a live WebSocket indicator in the header:

```tsx
// frontend/src/components/ConnectionStatus.tsx
export default function ConnectionStatus() {
  const { connected } = useRealtime();
  return (
    <div title={connected ? 'Real-time connected' : 'Connecting...'}>
      <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
      <span>{connected ? 'Live' : 'Connecting...'}</span>
    </div>
  );
}
```

### Real-time flow: creating an order

```mermaid
sequenceDiagram
    participant ClientA as Browser A (Staff)
    participant ClientB as Browser B (Admin)
    participant API as NestJS REST API
    participant GW as EventsGateway (Socket.io)
    participant DB as Prisma / PostgreSQL
    participant Cache as CacheService (Redis)
    participant Notif as NotificationsService

    ClientA->>API: POST /api/orders { items, customerId }
    API->>DB: BEGIN TRANSACTION
    DB-->>API: Validate stock, insert order & items, decrement stock
    API->>DB: COMMIT
    DB-->>API: Order created ✅

    API->>GW: emitOrderCreated({ orderCode, totalPrice, customerName })
    API->>GW: emitNotification("New order created!", "success")
    GW-->>ClientA: order:created event + notification toast
    GW-->>ClientB: order:created event + notification toast

    API->>Notif: createForAllAdmins({ title, message, type: "order_created", metadata })
    Notif->>DB: INSERT INTO notifications (for each ADMIN/SUPER_ADMIN)
    Note over ClientA,ClientB: NotificationBell refetches — unread badge increments

    API->>Cache: del("dashboard:summary")
    API->>Cache: delPattern("orders:*")
    API->>Cache: delPattern("products:*")

    API-->>ClientA: 201 Created (JSON)
```

---

## 🔔 Persistent Notification System

Beyond transient toast pop-ups, the system stores a permanent per-user notification record in the database for every significant order event. Admins see a bell icon (🔔) in the header with an animated unread count badge.

### Backend: `NotificationsModule`

The `NotificationsService` is injected into `OrdersService` and creates notifications for **all active ADMIN / SUPER_ADMIN users** on order lifecycle changes:

| Order Event | Notification type | Triggered in |
|---|---|---|
| Order created | `order_created` | `OrdersService.create()` |
| Status → PAID | `order_paid` | `OrdersService.update()` |
| Status → COMPLETED | `order_completed` | `OrdersService.update()` |
| Status → CANCELLED | `order_cancelled` | `OrdersService.update()` |

**Notification API endpoints** (`/api/notifications`, all require JWT):

| Method | Path | Description |
|---|---|---|
| `GET` | `/notifications` | Get all notifications + unread count for the current user |
| `PATCH` | `/notifications/:id/read` | Mark one notification as read |
| `PATCH` | `/notifications/read-all` | Mark all notifications as read |
| `DELETE` | `/notifications/:id` | Delete a single notification |
| `DELETE` | `/notifications/clear/read` | Delete all read notifications |

```typescript
// backend/src/notifications/notifications.service.ts (key methods)
async createForAllAdmins(data: Omit<CreateNotificationDto, 'userId'>) {
  const admins = await this.prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] }, isActive: true },
    select: { id: true },
  });
  await Promise.all(admins.map((admin) => this.create({ ...data, userId: admin.id })));
}

async findAll(userId: number) {
  const [notifications, unreadCount] = await Promise.all([
    this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    this.prisma.notification.count({ where: { userId, isRead: false } }),
  ]);
  return { notifications, unreadCount };
}
```

### Frontend: `NotificationBell`

The `NotificationBell` component in the header:

- Polls every **30 seconds** via React Query for fresh data
- Also **reacts immediately** to `order:created` / `order:updated` WebSocket events by invalidating the `notifications` query key
- Shows a **red animated badge** for unread count (capped display at `99+`)
- Displays a **dropdown panel** with up to 50 notifications, colour-coded by type:

| Type | Icon | Colour |
|---|---|---|
| `order_created` | 🛒 ShoppingCart | Blue |
| `order_paid` | 💳 CreditCard | Green |
| `order_completed` | ✅ Check | Purple |
| `order_cancelled` | ❌ XCircle | Red |

- Clicking a notification **marks it as read** and **navigates** to the relevant order (`/orders/:id`) if `metadata.orderId` is present
- Header actions: **Mark all as read** (CheckCheck icon), **Clear read** (Trash2 icon)

---

## 🌗 Dark / Light Mode

The UI supports a full dark / light theme toggle powered by **Zustand** (`useThemeStore`) and **Tailwind CSS** `dark:` variants.

### How it works

1. On app load, `theme.store.ts` reads the saved preference from `localStorage` (`"theme"` key).  
2. If no preference is found, it falls back to the system's `prefers-color-scheme` media query.
3. The resolved theme is applied immediately by toggling the `dark` class on `<html>` before React renders — **no flash of wrong theme**.
4. Clicking `ThemeToggle` (☀️ / 🌙 button in the header) calls `toggle()`, which flips the class and persists the new value to `localStorage`.

```typescript
// frontend/src/store/theme.store.ts
function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
}

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem('theme');
  if (saved) return saved as 'light' | 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Applied before React hydrates — eliminates FOUC
const initialTheme = getInitialTheme();
applyTheme(initialTheme);
```

### Theme-aware global CSS

`index.css` provides smooth cross-component transitions and a styled dark-mode scrollbar:

```css
/* Smooth theme transition on every element */
*, *::before, *::after {
  transition-property: background-color, border-color, color;
  transition-duration: 150ms;
  transition-timing-function: ease;
}

/* Dark mode custom scrollbar */
.dark ::-webkit-scrollbar       { width: 6px; }
.dark ::-webkit-scrollbar-track { background: #1e293b; }
.dark ::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
```

The entire component library uses Tailwind's `dark:` variants (e.g. `bg-white dark:bg-gray-800`, `text-gray-900 dark:text-white`), ensuring consistent theming across the Sidebar, Header, all pages, and every dropdown/modal.

---

## ⚡ Redis Caching Layer

The backend features a global **`CacheModule`** powered by [Upstash Redis](https://upstash.com/) — a serverless Redis service that works seamlessly with Render deployments without any self-hosted infrastructure.

### How it works

The `CacheService` wraps Upstash's HTTP-based Redis client and is registered as a **`@Global()`** NestJS module, making it injectable anywhere in the application without extra imports.

```typescript
// Predefined TTL constants (seconds)
static readonly TTL = {
  DASHBOARD: 60 * 5,    // 5 minutes
  CATEGORIES: 60 * 30,  // 30 minutes
  PRODUCTS: 60 * 5,     // 5 minutes
  ORDERS: 60 * 2,       // 2 minutes
  CUSTOMERS: 60 * 5,    // 5 minutes
};
```

### Cache operations

| Method | Description |
|---|---|
| `get<T>(key)` | Read a value from Redis. Returns `null` on miss or error. |
| `set(key, value, ttl)` | Write a value with a TTL using `SETEX`. |
| `del(key)` | Invalidate a single cache key. |
| `delPattern(pattern)` | Invalidate all keys matching a glob pattern (e.g. `orders:*`). |
| `getOrSet(key, ttl, fetcher)` | Read-through helper: returns cached value or calls `fetcher()`, stores result, and returns it. |

### Cache strategy per module

| Module | Keys | TTL | Invalidated on |
|---|---|---|---|
| **Dashboard** | `dashboard:summary` | 5 min | Order create / update / delete |
| **Orders** | `orders:<search>:<page>:<limit>`, `orders:<id>` | 2 min | Order create / update / cancel |
| **Products** | `products:list:*`, `products:detail:*` | 5 min | Product create / update / delete |
| **Categories** | `categories:all`, `categories:<id>` | 30 min | Category / product mutation |
| **Customers** | `customers:*` | 5 min | Customer create / update / delete |

> **Graceful degradation:** If `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN` are not set, `CacheService` silently disables itself — the application continues to work normally without caching.

---

## 🔐 Role-Based Access Control (RBAC)

The system enforces security using a strict JWT-based Role-Based Access Control mechanism.

We define three primary roles:

- **`SUPER_ADMIN`**: Complete access to all system features, including system configuration and promoting users.
- **`ADMIN`**: Can manage orders, products, categories, and customers. Receives all in-app notifications.
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

> **Notifications are role-scoped:** `NotificationsService.createForAllAdmins()` queries `users` filtered by `role: { in: ['ADMIN', 'SUPER_ADMIN'] }` and `isActive: true`, so `STAFF` users never receive admin-level notifications.

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
        String avatar
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }

    customers {
        Int id PK
        String fullName
        String email
        String phone
        String address
        String note
        DateTime createdAt
        DateTime updatedAt
    }

    categories {
        Int id PK
        String name
        String slug
        String description
        Int parentId FK
        DateTime createdAt
    }

    products {
        Int id PK
        String title
        String sku
        String description
        String image
        String imagePublicId
        String thumbnail
        Decimal price
        Int stockQuantity
        Boolean isActive
        Int categoryId FK
        DateTime createdAt
        DateTime updatedAt
    }

    orders {
        Int id PK
        String orderCode
        Decimal totalPrice
        OrderStatus status
        Int customerId FK
        Int createdById FK
        DateTime createdAt
        DateTime updatedAt
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
        String description
        Int orderId FK
        Int createdById FK
        DateTime createdAt
    }

    refresh_tokens {
        Int id PK
        String token
        Int userId FK
        DateTime expiresAt
        DateTime createdAt
    }

    password_reset_tokens {
        Int id PK
        String token
        Int userId FK
        DateTime expiresAt
        DateTime createdAt
    }

    notifications {
        Int id PK
        String title
        String message
        String type
        Boolean isRead
        Json metadata
        Int userId FK
        DateTime createdAt
    }

    users ||--o{ orders : "creates"
    users ||--o{ order_histories : "logs"
    users ||--o{ refresh_tokens : "owns"
    users ||--o| password_reset_tokens : "owns"
    users ||--o{ notifications : "receives"

    customers ||--o{ orders : "places"

    categories ||--o{ categories : "parent/child"
    categories ||--o{ products : "contains"

    products ||--o{ order_items : "included_in"

    orders ||--|{ order_items : "has"
    orders ||--o{ order_histories : "tracks"
```

### `notifications` table — new in this release

| Column | Type | Description |
|---|---|---|
| `id` | `Int PK` | Auto-increment primary key |
| `title` | `String` | Short notification title (e.g. `"🛒 New Order Received"`) |
| `message` | `String` | Full human-readable message |
| `type` | `String` | Event type: `order_created`, `order_paid`, `order_completed`, `order_cancelled` |
| `isRead` | `Boolean` | Read/unread flag, defaults to `false` |
| `metadata` | `Json?` | Arbitrary context — e.g. `{ orderId, orderCode, status }` for navigation |
| `userId` | `Int FK` | Recipient user (cascades on user delete) |
| `createdAt` | `DateTime` | Timestamp |

---

## 🔄 API Request Flow

### Cached read (e.g. listing orders)

```mermaid
sequenceDiagram
    participant Client as React App
    participant Guard as JWT & RBAC Guard
    participant Service as OrdersService
    participant Cache as CacheService (Redis)
    participant DB as Prisma (PostgreSQL)

    Client->>Guard: GET /api/orders (JWT Token)
    Guard-->>Client: 401 Unauthorized (if invalid)
    Guard->>Service: Token valid

    Service->>Cache: get("orders:all:1:10")
    alt Cache HIT
        Cache-->>Service: Cached JSON ✅
        Service-->>Client: 200 OK (from cache, ~5ms)
    else Cache MISS
        Cache-->>Service: null
        Service->>DB: SELECT orders ...
        DB-->>Service: Rows
        Service->>Cache: set("orders:all:1:10", data, 120s)
        Service-->>Client: 200 OK (from DB)
    end
```

### Write path (create order → invalidate cache → emit WebSocket → persist notification)

```mermaid
sequenceDiagram
    participant Client as React App
    participant Guard as JWT & RBAC Guard
    participant Controller as OrdersController
    participant Service as OrdersService
    participant DB as Prisma (PostgreSQL)
    participant Cache as CacheService (Redis)
    participant GW as EventsGateway
    participant Notif as NotificationsService
    participant Mail as MailService

    Client->>Guard: POST /api/orders (JWT Token)
    Guard->>Controller: Token Valid
    Controller->>Service: createOrder(dto, userId)

    Service->>DB: BEGIN TRANSACTION
    DB-->>Service: Validate customer, validate stock per item
    Service->>DB: INSERT order + order_items, DECREMENT stock, INSERT order_history
    Service->>DB: COMMIT
    DB-->>Service: Order ✅

    Service->>GW: emitOrderCreated(...)
    Service->>GW: emitNotification("New order created!", "success")
    GW-->>Client: order:created (WebSocket broadcast to all tabs)

    Service->>Notif: createForAllAdmins({ title, message, type, metadata })
    Notif->>DB: INSERT notifications (one row per ADMIN/SUPER_ADMIN)

    Service->>Mail: sendOrderConfirmation(customer.email, ...) [async, fire-and-forget]

    Service->>Cache: del("dashboard:summary")
    Service->>Cache: delPattern("orders:*")
    Service->>Cache: delPattern("products:*")

    Service-->>Controller: Return Order
    Controller-->>Client: 201 Created (JSON)
```

---

## 📁 Folder Structure

```text
crm-system/
├── docker-compose.yml            # Local dev: spins up frontend + backend
├── .env                          # Root-level env (Docker references)
├── .env.docker                   # Docker-specific env overrides
│
├── frontend/                     # React 19 + Vite 8 SPA
│   ├── e2e/                      # Playwright E2E test specs
│   ├── public/                   # Static public assets
│   ├── src/
│   │   ├── App.tsx               # Root router (BrowserRouter + QueryClientProvider)
│   │   ├── main.tsx              # React entry point
│   │   ├── index.css             # Global CSS, Tailwind layers, dark-mode scrollbar
│   │   │
│   │   ├── assets/               # Static assets & icons
│   │   │
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ConnectionStatus.tsx  # 🔴 Live WebSocket indicator (green pulse / gray)
│   │   │   ├── DataTable.tsx         # Generic sortable table
│   │   │   ├── EmptyState.tsx        # Empty-list placeholder
│   │   │   ├── ErrorBoundary.tsx     # React error boundary wrapper
│   │   │   ├── ExportButton.tsx      # Excel / PDF export trigger
│   │   │   ├── Header.tsx            # Top bar: menu toggle, ConnectionStatus,
│   │   │   │                         #   ThemeToggle, NotificationBell, avatar dropdown
│   │   │   ├── LoadingSpinner.tsx    # Spinner for async states
│   │   │   ├── NotificationBell.tsx  # 🔔 Bell icon, unread badge, dropdown panel
│   │   │   ├── Pagination.tsx        # Page navigation control
│   │   │   ├── SearchInput.tsx       # Debounced search field
│   │   │   ├── Sidebar.tsx           # Collapsible navigation sidebar (dark bg)
│   │   │   ├── ThemeToggle.tsx       # 🌗 Sun/Moon toggle button
│   │   │   └── ui/                   # shadcn/ui primitive components
│   │   │
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useSocket.ts      # 🔌 Singleton Socket.io connection manager
│   │   │   ├── useRealtime.ts    # 📡 Event subscriptions, query invalidation, toasts
│   │   │   └── useDebounce.ts    # Search input debounce utility
│   │   │
│   │   ├── layouts/
│   │   │   └── CRMLayout.tsx     # Shell: Sidebar (desktop/mobile) + Header + <Outlet>
│   │   │
│   │   ├── lib/                  # Shared utilities
│   │   │   └── axios.ts          # Axios instance with base URL + JWT interceptors
│   │   │
│   │   ├── pages/                # Route-level page components
│   │   │   ├── DashboardPage.tsx     # Stats cards + recent orders + orders by status
│   │   │   ├── CategoriesPage.tsx    # Category CRUD with parent/child hierarchy
│   │   │   ├── ProductsPage.tsx      # Product CRUD with image upload
│   │   │   ├── CustomersPage.tsx     # Customer management
│   │   │   ├── OrdersPage.tsx        # Order list with search & pagination
│   │   │   ├── CreateOrderPage.tsx   # Multi-item order creation wizard
│   │   │   ├── OrderDetailPage.tsx   # Order detail, status change, history timeline
│   │   │   ├── ProfilePage.tsx       # Avatar upload, name edit, password change
│   │   │   ├── LoginPage.tsx         # Email/password login
│   │   │   ├── RegisterPage.tsx      # Account registration
│   │   │   ├── ForgotPasswordPage.tsx  # Request password reset email
│   │   │   └── ResetPasswordPage.tsx   # Token-based password reset
│   │   │
│   │   ├── routes/
│   │   │   └── ProtectedRoute.tsx    # Guards authenticated pages; redirects to /login
│   │   │
│   │   ├── services/             # API communication layer (Axios wrappers)
│   │   │   ├── category.service.ts
│   │   │   ├── customer.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── notification.service.ts  # 🔔 GET, mark-read, delete notifications
│   │   │   ├── order.service.ts
│   │   │   ├── product.service.ts
│   │   │   └── user.service.ts          # Profile, avatar, password change
│   │   │
│   │   ├── store/                # Zustand global state
│   │   │   ├── auth.store.ts     # User session: tokens, user object, login/logout
│   │   │   └── theme.store.ts    # 🌗 Theme: light/dark, persist to localStorage
│   │   │
│   │   ├── types/                # Shared TypeScript interfaces & enums
│   │   └── utils/                # Helper utilities (formatting, etc.)
│   │
│   ├── playwright.config.ts      # E2E test configuration
│   ├── tailwind.config.js        # Tailwind config (dark mode: 'class')
│   ├── vite.config.ts            # Vite build configuration
│   └── nginx.conf                # Nginx config for production Docker image
│
└── backend/                      # NestJS 11 application
    ├── prisma/
    │   ├── schema.prisma         # Database schema & enums (all models)
    │   └── migrations/           # Prisma migration history
    ├── src/
    │   ├── main.ts               # Bootstrap: Swagger, CORS, pipes, Helmet
    │   ├── app.module.ts         # Root module (imports all feature modules)
    │   │
    │   ├── auth/                 # JWT auth: login, register, refresh, forgot/reset password
    │   ├── cache/                # ⚡ Global Redis cache (Upstash)
    │   │   ├── cache.module.ts   #   @Global() module
    │   │   └── cache.service.ts  #   get / set / del / delPattern / getOrSet
    │   ├── categories/           # Category CRUD (parent/child hierarchy)
    │   ├── common/               # Shared DTOs, pagination helpers, interfaces
    │   ├── config/               # Environment & Cloudinary configuration
    │   ├── customers/            # Customer CRUD
    │   ├── dashboard/            # Analytics aggregation (stats, recent orders)
    │   ├── decorators/           # @CurrentUser(), @Roles()
    │   ├── export/               # Excel (.xlsx) & PDF generation
    │   ├── filters/              # Global HTTP exception filter
    │   ├── gateway/              # 🔴 WebSocket real-time (Socket.io)
    │   │   ├── gateway.module.ts #   @Global() module
    │   │   └── events.gateway.ts #   emitOrderCreated / emitOrderUpdated /
    │   │                         #   emitDashboardUpdated / emitNotification
    │   ├── guards/               # JwtAuthGuard, RolesGuard
    │   ├── mail/                 # Transactional email (Resend) + HTML templates
    │   ├── notifications/        # 🔔 Persistent notification system
    │   │   ├── notifications.module.ts
    │   │   ├── notifications.service.ts  # create / createForAllAdmins / findAll /
    │   │   │                             # markAsRead / markAllAsRead / remove / clearRead
    │   │   ├── notifications.controller.ts  # REST endpoints for the notification bell
    │   │   ├── notifications.controller.spec.ts
    │   │   └── notifications.service.spec.ts
    │   ├── orders/               # Order lifecycle (create tx, update, cancel, history)
    │   ├── prisma/               # PrismaService wrapper
    │   ├── products/             # Product CRUD + Cloudinary image management
    │   ├── upload/               # Multipart image upload handling (Multer)
    │   └── users/                # User management, profile, avatar, password
    └── test/                     # Jest E2E integration tests
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

# 2. Start the application (builds both services)
docker-compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Swagger Docs: `http://localhost:3000/api/docs`
- WebSocket: `ws://localhost:3000`

### 3. Manual Setup (Without Docker)

#### Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in values below
```

**Required `.env` variables (Backend):**

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/crm?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_SECRET="your_refresh_secret"
JWT_REFRESH_EXPIRES_IN="7d"

# Cloudinary (for product & avatar images)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Resend API (for order confirmation & status emails)
RESEND_API_KEY="re_123456789"
MAIL_FROM="CRM System <onboarding@resend.dev>"
FRONTEND_URL="http://localhost:5173"

# Upstash Redis (optional — caching is disabled gracefully if omitted)
UPSTASH_REDIS_REST_URL="https://<your-db>.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_token"
```

> **Note:** `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are **optional**. If omitted, `CacheService` logs a warning and the app runs normally without caching.
>
> **WebSocket** requires no extra configuration — it shares the same HTTP port as the REST API.

**Run Database Migrations & Start Server:**

```bash
npx prisma migrate dev --name init
npx prisma db seed        # optional seed script
npm run start:dev
```

- API: `http://localhost:3000/api`
- Swagger Docs: `http://localhost:3000/api/docs`
- WebSocket: `ws://localhost:3000`

#### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local   # then fill in values below
```

**Required `.env.local` variables (Frontend):**

```env
VITE_API_URL="http://localhost:3000/api"
```

> The WebSocket URL is derived automatically from `VITE_API_URL` by stripping `/api` — no extra variable needed.

**Start the Development Server:**

```bash
npm run dev
```

- App: `http://localhost:5173`

#### Running Tests

```bash
# Backend unit tests
cd backend && npm test

# Backend unit tests with coverage
cd backend && npm run test:cov

# Frontend E2E tests (requires a running app)
cd frontend && npm run test:e2e
```

---

## 🛳️ Deployment Architecture

We utilize continuous deployment mechanisms and GitHub Actions for rapid and safe delivery:

- **CI/CD (GitHub Actions):** Automated workflows (`ci.yml`, `deploy.yml`) run on every push and pull request to ensure code quality (linting, tests) and trigger deployments.
- **Frontend (Vercel):** Automatically builds and deploys the React SPA on every push to the `main` branch. Environment variables for production are managed in the Vercel dashboard. `vercel.json` handles SPA routing rewrites.
- **Backend (Render):** Connected to the GitHub repository. Builds the NestJS app, runs Prisma migrations during the build step, and serves both the REST API and the WebSocket server on the same port.
- **Database (Neon.tech):** Serverless Postgres scales automatically and connects to the Render backend via secure connection pooling.
- **Cache (Upstash):** Serverless Redis accessed over HTTPS REST API. Set two environment variables in Render and caching is enabled automatically.
- **Image Storage (Cloudinary):** Product images and user avatars are uploaded to Cloudinary. Public IDs are stored in the database for deletion management.
- **WebSocket:** Served by the same NestJS process on Render — no additional infrastructure needed. Socket.io falls back to HTTP long-polling if WebSocket connections are restricted.

```mermaid
graph LR
    GitHub -->|push to main| GH_Actions[GitHub Actions CI/CD]
    GH_Actions -->|deploy| Vercel[Vercel - Frontend]
    GH_Actions -->|deploy| Render[Render - Backend]
    Vercel -->|API calls| Render
    Render -->|query| Neon[(Neon PostgreSQL)]
    Render -->|cache| Upstash[(Upstash Redis)]
    Render -->|images| Cloudinary[Cloudinary]
    Render -->|emails| Resend[Resend]
```

---

## 👨‍💻 Author

**Dat**

- GitHub: [@DatPHP](https://github.com/DatPHP)
- Live Demo: [crm-system-2026.vercel.app](https://crm-system-2026.vercel.app)
- Henry here - 2026

---

## 📄 License

This project is licensed under the MIT License.
