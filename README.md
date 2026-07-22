# 🏎️ Premium Car Dealership Inventory Management System

An enterprise-grade, production-ready Car Delivery & Inventory Management System engineered for the **Incubyte Technical Assessment**. Built with **TypeScript**, **Clean Architecture**, **SOLID Principles**, **Dependency Injection**, **Repository Pattern**, and strict **Test Driven Development (TDD: Red → Green → Refactor)**.

---

## 🌟 Tech Stack

### Frontend
- **React 19** with **Vite** & **TypeScript**
- **TailwindCSS v4** with custom Glassmorphism SaaS Dark UI
- **React Router v7** with RBAC Protected Routes
- **TanStack Query (React Query v5)**
- **Axios** with Request Interceptors & JWT token handling
- **Zustand** for global Auth & Toast notification state management
- **Framer Motion** for smooth micro-animations

### Backend
- **Node.js** & **Express** with ESM TypeScript
- **MongoDB Atlas** & **Mongoose 8**
- **JWT (JSON Web Tokens)** & **Bcrypt** password hashing
- **Zod** schema validation
- **Helmet**, **Cors**, & **Express-Rate-Limit** security headers
- **Winston** structured logging & **OpenAPI / Swagger** documentation (`/api-docs`)

### Testing & Quality Assurance
- **Jest** & **Supertest**
- **40/40 Passing Unit & Integration Tests** across 11 Test Suites
- **>90% Core Code Coverage**

---

## 🏛️ Architecture & SOLID Principles

```
project-root
│
├── backend
│   └── src
│       ├── config          # Database, Swagger, & Environment Config
│       ├── constants       # HttpStatus codes & Role Enums
│       ├── controllers     # HTTP Controllers (Dependency Injected)
│       ├── interfaces      # Core Domain Contracts & Service Interfaces
│       ├── middlewares      # Auth JWT, RBAC, Rate Limiter, Validation, Request ID
│       ├── models          # Mongoose Schemas & MongoDB Models
│       ├── repositories    # Generic Base Repository & Entity Repositories
│       ├── routes          # Express Central Router Pipeline
│       ├── services        # Domain Business Logic Layer
│       ├── tests           # Integration & Unit Test Suites
│       ├── utils           # ApiResponse, JwtUtil, PasswordUtil, AppError
│       └── validators      # Zod Validation Schemas
│
└── frontend
    └── src
        ├── components      # Navbar, Footer, VehicleCard, ToastContainer, SkeletonGrid
        ├── pages           # Home, Login, Register, Inventory, Details, Dashboard, Admin, 404
        ├── routes          # React Router v7 with Protected & Admin Routes
        ├── services        # Axios API Client & Services
        ├── store           # Zustand Auth & UI Toast Stores
        └── types           # Shared TypeScript Interfaces
```

### Key Architectural Highlights:
1. **Single Responsibility Principle (SRP)**: Controllers handle HTTP translation, Services execute business rules, and Repositories handle database interactions.
2. **Open/Closed Principle (OCP)**: Extensible BaseRepository interface for data access.
3. **Liskov Substitution Principle (LSP)**: Derived repositories satisfy base repository interfaces cleanly.
4. **Interface Segregation Principle (ISP)**: Specific contracts (`IUserRepository`, `IVehicleRepository`, `IPurchaseRepository`).
5. **Dependency Inversion Principle (DIP)**: Controllers and services depend on abstractions (`IAuthService`, `IVehicleRepository`).

---

## 📡 API Endpoints Documentation

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new user account | Public |
| `POST` | `/api/v1/auth/login` | Authenticate user & return JWT token | Public |

### Vehicle Management (`/api/v1/vehicles`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/vehicles` | Paginated search & multi-filter catalog | Public |
| `GET` | `/api/v1/vehicles/:id` | Retrieve vehicle details | Public |
| `POST` | `/api/v1/vehicles` | Add new vehicle (Unique VIN enforced) | Admin Only |
| `PUT` | `/api/v1/vehicles/:id` | Update vehicle details | Admin Only |
| `DELETE` | `/api/v1/vehicles/:id` | Delete vehicle | Admin Only |
| `POST` | `/api/v1/vehicles/:id/restock` | Restock inventory quantity | Admin Only |
| `POST` | `/api/v1/vehicles/:id/purchase` | Purchase vehicle & decrease stock | User / Admin |

### Purchases & Analytics (`/api/v1/purchases`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/purchases/my` | View user purchase history | User / Admin |
| `GET` | `/api/v1/purchases` | View all customer orders | Admin Only |
| `GET` | `/api/v1/purchases/analytics/summary` | Analytics & inventory metrics | Admin Only |

### API Documentation UI
Open **`http://localhost:5000/api-docs`** in your browser to view the interactive **Swagger / OpenAPI** documentation.

---

## 🧪 TDD Test Verification

Run all unit & integration test suites:
```bash
npm run test:backend
```

**Results**:
- **Test Suites**: `11 passed, 11 total`
- **Tests**: `40 passed, 40 total`

Run test coverage report:
```bash
npm run test:coverage --prefix backend
```

---

## 🚀 Running Locally

### 1. Prerequisites
- Node.js $\ge 18.0.0$
- npm $\ge 9.0.0$

### 2. Installation & Setup
```bash
# Clone the repository
git clone https://github.com/yogingohil/TDD-kata-Car-Delivery-Inventory-System-.git
cd TDD-kata-Car-Delivery-Inventory-System-

# Install monorepo dependencies
npm run install:all
```

### 3. Start Backend Development Server
```bash
npm run dev:backend
# Server runs on http://localhost:5000
# Swagger docs at http://localhost:5000/api-docs
```

### 4. Start Frontend Development Server
```bash
npm run dev:frontend
# Vite dev server runs on http://localhost:5173
```

---

## 📄 License
This repository is created as part of an incubator technical assessment.
