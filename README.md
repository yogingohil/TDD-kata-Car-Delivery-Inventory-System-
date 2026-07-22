# Premium Car Dealership Inventory Management System

Production-grade monorepo foundation and clean architecture built for the Incubyte technical assessment.

This project enforces **Clean Architecture**, **SOLID Principles**, **TypeScript Strict Typing**, and **Test-Driven Development (TDD) Readiness** across a Node.js/Express backend and a React 19/Vite frontend.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Language**: TypeScript (Strict mode)
- **Styling**: TailwindCSS v4 + Glassmorphism Design System
- **Routing**: React Router v7
- **Data Fetching**: TanStack Query v5 (React Query) & Axios
- **Form Handling**: React Hook Form & Zod
- **State Management**: Zustand
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js & Express
- **Language**: TypeScript
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JWT & Bcrypt (Architecture Wiring)
- **Validation**: Zod Schemas & Middleware
- **Logging**: Winston Structured Logger
- **Security**: Helmet & CORS

### Testing & Developer Tools
- **Testing**: Jest & Supertest
- **Code Quality**: ESLint & Prettier
- **Monorepo**: npm Workspaces

---

## 📁 Monorepo Folder Structure

```
project-root
│
├── frontend/                     # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── animations/          # Framer Motion animation presets
│   │   ├── assets/              # Static assets & icons
│   │   ├── components/          # Reusable UI component library (Button, Card, Input, etc.)
│   │   ├── context/             # React Context providers (AuthContext, ThemeContext)
│   │   ├── hooks/               # Custom hooks (useAuth, useNotification)
│   │   ├── layouts/             # Layout wrappers (MainLayout, AuthLayout)
│   │   ├── pages/               # Page architecture shells (HomePage, LoginPage, InventoryPage)
│   │   ├── routes/              # App routing & protected route guards
│   │   ├── services/            # Axios API client & API service layer
│   │   ├── store/               # Zustand state stores (useAuthStore, useUIStore)
│   │   ├── types/               # TypeScript domain interfaces
│   │   ├── utils/               # Helper utilities (cn, currency formatters)
│   │   ├── App.tsx              # App root component
│   │   └── main.tsx             # DOM entrypoint
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                      # Node.js + Express + TypeScript Backend API
│   ├── src/
│   │   ├── config/              # Env validation (Zod) & DB connection setup
│   │   ├── constants/           # Roles enum & HTTP status codes
│   │   ├── controllers/         # Express Controllers (AuthController stub)
│   │   ├── interfaces/          # Domain contracts (IUser, IVehicle, IPurchase, Repositories)
│   │   ├── middlewares/         # Global Error Handler, Auth JWT guard, Zod Validator
│   │   ├── models/              # Mongoose models (User, Vehicle, Purchase)
│   │   ├── repositories/        # BaseRepository & Concrete Repositories (Clean Architecture)
│   │   ├── routes/              # Router wiring & health check
│   │   ├── services/            # Business Logic Services with Dependency Injection
│   │   ├── tests/               # Jest & Supertest integration and unit tests
│   │   ├── types/               # Express type extensions
│   │   ├── utils/               # AppError, asyncHandler, Logger, Password & JWT utils
│   │   ├── validators/          # Zod payload validation schemas
│   │   ├── app.ts               # Express application configuration
│   │   └── server.ts            # HTTP server entrypoint & graceful shutdown
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.ts
│
├── README.md                    # Project documentation
├── PROMPTS.md                   # AI prompts log & design records
└── package.json                 # Monorepo root configuration
```

---

## 🏛️ Clean Architecture & SOLID Principles

The system strictly decouples concerns across architectural boundaries:

```
[ HTTP Request ] 
       │
       ▼
 [ Controller ]  ──(Delegates)──► [ Service Interface ] ──(Implements)──► [ Service Logic ]
                                                                                │
                                                                           (Uses DI)
                                                                                ▼
                                                                     [ Repository Interface ]
                                                                                │
                                                                           (Implements)
                                                                                ▼
                                                                      [ Base / Mongoose Repos ]
                                                                                │
                                                                                ▼
                                                                       [ MongoDB Database ]
```

1. **Single Responsibility Principle (SRP)**: Controllers handle HTTP serialization, Services orchestrate application use cases, Repositories isolate data persistence queries.
2. **Dependency Inversion Principle (DIP)**: High-level modules (Controllers & Services) depend on abstract interfaces (`IAuthService`, `IUserRepository`), not concrete implementations.
3. **Open/Closed Principle (OCP)**: BaseRepository provides generic CRUD operations while domain-specific queries extend specialized repositories.

---

## ⚙️ Environment Variables

Create `.env` in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/car_inventory_db
JWT_SECRET=super_secret_jwt_key_change_in_production_12345
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Create `.env` in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 🛠️ Installation & Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/yogingohil/TDD-kata-Car-Delivery-Inventory-System-.git
   cd TDD-kata-Car-Delivery-Inventory-System-
   ```

2. **Install Workspace Dependencies**:
   ```bash
   npm install
   ```

---

## 💻 Development Commands

- **Run Both Frontend & Backend concurrently**:
  ```bash
  npm run dev
  ```

- **Run Backend only**:
  ```bash
  npm run dev:backend
  ```

- **Run Frontend only**:
  ```bash
  npm run dev:frontend
  ```

---

## 🧪 Testing

The repository is completely **TDD-ready**. Jest and Supertest are pre-configured in the `backend` package.

- **Execute Test Suite**:
  ```bash
  npm run test
  ```

- **Execute Tests in Watch Mode**:
  ```bash
  npm run test:watch --prefix backend
  ```

---

## 🤖 AI Usage & Pair Programming

This foundation was constructed in collaboration with **Antigravity (Google Deepmind AI)** as a Staff Software Engineer pair programmer, emphasizing clean architecture, strict typing, and Incubyte assessment guidelines.
