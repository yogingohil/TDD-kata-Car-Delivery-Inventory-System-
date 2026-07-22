# Prompts & Architectural Decision Log

## Initial Assessment Requirements Prompt
- **Goal**: Build foundation and architecture for Premium Car Dealership Inventory Management System.
- **Constraints**: 
  - DO NOT implement business logic or CRUD operations yet.
  - TDD-ready structure.
  - Clean Architecture & SOLID Principles.
  - Strict TypeScript (no `any`).

## Key Architectural Decisions
1. **Monorepo Workspaces**: Configured root `package.json` with npm workspaces (`frontend`, `backend`).
2. **Clean Layering**:
   - `interfaces/`: Type contracts for domain objects, repositories, and services.
   - `repositories/`: Abstract `BaseRepository<T>` with MongoDB Mongoose implementation.
   - `services/`: Use-case business logic layer accepting repositories via Dependency Injection constructor parameters.
   - `controllers/`: Request/response translation layer using `asyncHandler`.
3. **Zod Validation & AppError**:
   - Environment variables verified at boot time using Zod schema.
   - Incoming request bodies validated via Zod middleware before hitting controllers.
   - Operational errors wrapped in `AppError` class and handled centrally by `errorHandler`.
