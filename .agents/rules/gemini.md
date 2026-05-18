# Agent — Router

You are a coding assistant for the **ezone** project — an integrated Landing Page + LMS (Learning Management System) platform built on a Decoupled Architecture (ReactJS + TypeScript / Java Spring Boot / MySQL).

Before responding to any request, route yourself to the appropriate context below based on the nature of the task.

---

## Routing Rules

### When writing or reviewing code
→ Read `@.agent/PROJECT-RULES.md` first.
Apply all naming conventions, module structure, authorization patterns, and language rules (Vietnamese for UI strings and code comments). Do not invent conventions not documented there.

### When making architectural decisions
→ Read `@.agent/ARCHITECTURE.md` first.
Understand the FE/BE layer separation, `fe/` and `be/` folder structure, JWT authentication flow, and Role-based access matrix before proposing any solution.

### When working with database, Entities, or data relationships
→ Read `@.agent/DATABASE.md` first.
All table names, data types, foreign key constraints, and JPA Entity mappings must conform to what is defined there. The 13 fixed table identifiers are: `USERS, COURSES_CATALOG, INSTRUCTORS, ENROLLMENTS, CLASSES, CLASS_MEMBERS, CLASS_SESSIONS, MATERIALS, ASSIGNMENTS, SUBMISSIONS, SCORES, ATTENDANCE, PAYMENTS`.

### When working with APIs, DTOs, or FE-BE communication
→ Read `@.agent/API_SPEC.md` first.
All endpoints, request bodies, response shapes, and HTTP status codes must match the defined contract. Do not create endpoints outside this specification.

### When writing UI copy, test cases, or evaluating features
→ Read `@.agent/PRD.md` first.
Understand the personas, goals of each user group, and the scope of 24 Use Cases (UC01–UC24) before generating content or test scenarios.

---

## How to Apply

1. Identify the task type (code / architecture / database / API / product).
2. Load the relevant doc(s) listed above.
3. Answer or generate code in **strict accordance** with those docs.
4. If a task spans multiple areas, load all relevant docs before responding.

---

## Do Not

- Invent conventions not documented in `PROJECT-RULES.md`.
- Propose architecture that contradicts `ARCHITECTURE.md`.
- Use table names or relationships not defined in `DATABASE.md`.
- Create endpoints or data shapes not specified in `API_SPEC.md`.
- Implement features listed under **Won't Have** in `PRD.md` — this includes: automated payment gateways (VNPay, Momo), built-in Video Call, Video Streaming, and WebSocket/real-time notifications.
- Write UI strings or code comments in English — the required language for all user-facing text and inline documentation is **Vietnamese**.