---
name: explain
description: >
  Explain code, concepts, flow, or decisions for beginners.
  Use when user says "explain", "giải thích", "how does this work",
  "what is", "tại sao", "why", or wants to understand code/concepts.
---

# Skill: explain

Explain code, architecture, data flow, or design decisions for the **ezone** project.

## Usage

```
explain code [feature-name]        → What the code does and how it is structured
explain concept [concept-name]     → Pattern or concept explanation (JWT, JPA, REST...)
explain flow [feature-name]        → End-to-end request/data flow for a Use Case
explain why [decision]             → Reasoning behind an architectural or design decision
```

---

## Workflow

### Step 1 — Ask language
Ask the user: **"English or Vietnamese? (en/vi)"**
Default to Vietnamese if not specified.

### Step 2 — Read docs first (no source scanning)

Load docs in this order based on the mode:

| Mode | Read in order |
|---|---|
| `code` | `@.agent/ARCHITECTURE.md` → `@.agent/PROJECT-RULES.md` |
| `concept` | `@.agent/PROJECT-RULES.md` → `@.agent/ARCHITECTURE.md` |
| `flow` | `@.agent/PRD.md` → `@.agent/API_SPEC.md` |
| `why` | `@.agent/PROJECT-RULES.md` → `@.agent/ARCHITECTURE.md` → `@.agent/DATABASE.md` (if data-related) |

### Step 3 — Read source only if needed
Only read a specific source file if the user points to an **exact file path**.
Never glob or scan the entire codebase.

### Step 4 — Explain
Structure the explanation as:
1. **One-line summary** — what it is in plain language.
2. **How it works** — step-by-step, no assumed knowledge.
3. **Where it lives in ezone** — reference the actual folder/file from `ARCHITECTURE.md`.
4. **Example** — concrete snippet or scenario from the ezone context.

---

## Doc Locations

```
ezone/.agent/
├── AGENT.md            ← Router: which doc to read for which task
├── PRD.md              ← Product requirements, 4 personas, UC01–UC24, Won't Have list
├── ARCHITECTURE.md     ← Layer structure, fe/ and be/ folder layout, JWT flow, Role matrix
├── PROJECT-RULES.md    ← Naming conventions, coding rules, language rules, Git workflow
├── API_SPEC.md         ← All REST endpoints, request/response shapes, HTTP status codes
└── DATABASE.md         ← 13 tables, column types, FK constraints, JPA Entity mapping examples
```

---

## Rules

- **Never glob or scan source code** — all architectural decisions are documented in `.agent/`.
- Only read source when the user provides an exact file path.
- Always ground explanations in the ezone project context — no generic textbook answers.
- Use Vietnamese for all explanations unless the user explicitly requests English.

---

## Error Handling

| Situation | Action |
|---|---|
| User does not specify mode | Ask: "Bạn muốn giải thích code, concept, flow, hay why?" |
| Need more source detail | Ask user for the specific file path |
| Feature not in UC01–UC24 | Note that it is outside the current project scope per `PRD.md` |