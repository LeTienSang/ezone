---
name: build-feature
description: >
  Build a complete feature from A-Z: scaffold, types, service, hook, UI component,
  and API integration if needed. Enforces layer boundaries automatically.
  Use when user says "build feature", "create feature", "add screen",
  "xây dựng tính năng", "làm tính năng", "tạo feature", or describes a new feature to implement.
---

# Skill: build-feature

Build a feature end-to-end for the **ezone** platform (Landing Page + LMS).
Stack: ReactJS + TypeScript (FE) / Java Spring Boot (BE) / MySQL.

## Before You Start

1. Read `@.agent/PRD.md` — confirm the feature is within UC01–UC24 scope and not in the **Won't Have** list.
2. Read `@.agent/PROJECT-RULES.md` — apply all naming conventions and Role-based authorization rules.
3. Read `@.agent/ARCHITECTURE.md` — understand which layer (Landing Page / LMS / Admin Dashboard) the feature belongs to and the correct folder path.

---

## Steps (in order)

### 1. Scaffold

Determine which layer the feature belongs to, then create under the correct path:

```
fe/src/
├── pages/
│   ├── public/        ← Landing Page features (Guest)
│   ├── student/       ← LMS features (Student)
│   ├── teacher/       ← LMS features (Teacher)
│   └── admin/         ← Dashboard features (Admin)
└── components/
    ├── common/        ← Shared UI components
    ├── landing/       ← Landing Page-specific components
    └── lms/           ← LMS-specific components
```

For each new feature, create:
```
components/<feature-name>/
  <FeatureName>.tsx       ← Main UI component
  <FeatureName>Props.ts   ← Props interface (if complex)
hooks/
  use<FeatureName>.ts     ← React hook connecting service to UI state
services/
  <featureName>Service.ts ← API call logic (axios), no React
types/
  <featureName>.types.ts  ← Feature-scoped TypeScript interfaces
```

### 2. Types

Read `@.agent/API_SPEC.md` and `@.agent/DATABASE.md` first.
Define all interfaces in `<featureName>.types.ts` to match the API response shapes exactly.
- No `any` types.
- Use `| null` only for fields that are explicitly nullable in `DATABASE.md`.
- Name request interfaces `<Action><Entity>Request`, response interfaces `<Entity>Response`.

### 3. Service

Create `<featureName>Service.ts` — pure TypeScript, no React.
- All API calls go through the shared axios instance (with JWT interceptor).
- Function names: verb-first camelCase — `getClassSessions()`, `submitAssignment()`.
- Handle errors explicitly; never let axios errors bubble unhandled to the component.
- Reference `@.agent/API_SPEC.md` for the exact endpoint, method, and payload.

### 4. Hook

Create `use<FeatureName>.ts`:
- Manage loading / success / error state with `useState`.
- Call service functions only — never call axios or fetch directly.
- Expose only what the component needs (data, loading, error, action handlers).
- Check Role from `AuthContext` before calling protected actions.

### 5. UI Component

- One component per file, named `PascalCase.tsx`.
- Tailwind CSS only — no inline styles, no separate CSS files.
- Props interface named `<ComponentName>Props` defined in the same file.
- Components call hooks only — never services or axios directly.
- All user-facing strings (labels, messages, placeholders) in **Vietnamese**.
- Apply `@PreAuthorize`-equivalent Role guard on the route level via `ProtectedRoute`.

### 6. Backend (if new endpoint needed)

Read `@.agent/API_SPEC.md` — check if the endpoint already exists before creating a new one.

If a new endpoint is required, implement in order:
```
Entity        → already defined in DATABASE.md, do not rename
Repository    → <Entity>Repository.java (extends JpaRepository)
Service       → <Entity>Service.java + <Entity>ServiceImpl.java
DTO           → <Action><Entity>Request.java + <Entity>Response.java
Controller    → <Entity>Controller.java with @PreAuthorize on every method
```

Then update `@.agent/API_SPEC.md` with the new endpoint contract.

### 7. Authorization

- Every BE controller method must have `@PreAuthorize("hasRole('<ROLE>')")`.
- Every FE route that is not public must be wrapped in `<ProtectedRoute role="<ROLE>">`.
- Refer to the Role access matrix in `@.agent/ARCHITECTURE.md` — do not grant access beyond what is defined there.

---

## Rules — Never Violate

- Do not build features listed under **Won't Have** in `@.agent/PRD.md` (automated payment gateway, built-in Video Call, Video Streaming, WebSocket notifications).
- Do not rename or add tables beyond the 13 defined in `@.agent/DATABASE.md`.
- Do not create API endpoints that contradict `@.agent/API_SPEC.md` without updating it first.
- Do not import from another feature's internal folder — share only through `components/common/` or `hooks/`.
- Do not put business logic in page components (`pages/**`) — keep it in services and hooks.
- Do not use `any` types.
- All UI strings and code comments must be in **Vietnamese**.