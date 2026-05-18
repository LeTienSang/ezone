# English Templates

## Code Explanation

```markdown
## 📁 File: {filename}

### Purpose
[1-2 sentences describing what this file does]

### Breakdown

**Imports**
- Import X from Y for [purpose]

**Main class/function**
- [Explain logic]
- [Use real-world analogy if helpful]

**Methods**
- `methodX()`: [what it does, when called]

### 💡 Key Points
- Point 1
- Point 2

### 🔗 Connections
- Called by: ...
- Calls: ...
```

---

## Concept Explanation

```markdown
## 🎯 {Concept Name}

### What is it?
[Simple explanation, 2-3 sentences]

### Real-world Analogy
[Compare to something familiar]

Example: Repository Pattern is like a **librarian**:
- You don't search the storage yourself
- You ask the librarian (Repository) to find it
- Librarian knows where things are and how to find them fast

### In code

```typescript
// Short code example
```

### Why use it?
- Reason 1
- Reason 2

### Without it?
[Problems you'd face]

### 📚 Learn more
- Keywords to search
```

---

## Flow Explanation

```markdown
## 🔄 Flow: {Action Name}

### Overview
[1-2 sentences describing this flow]

### Diagram

```
[User action on webpage]
    │
    ▼
[Content Script] ─────── Detect event (text select, click, etc.)
    │ chrome.runtime.sendMessage (typed)
    ▼
[Background Service Worker] ── Route message, call integration
    │                      │
    ▼                      ▼
[Integration API]    [chrome.storage]
(translation / AI)   (read / write)
    │
    ▼
[Popup / Side Panel] ◄─── Response back to UI
```

### Step by Step

**Step 1: User triggers action**
- E.g. highlights a word, clicks a button

**Step 2: Content script detects**
- Listens for DOM events
- Sends typed message via `core/messaging/dispatcher.ts`

**Step 3: Background routes**
- Receives message, calls the correct feature service
- Calls integration (translation API, AI) if needed

**Step 4: Storage (if needed)**
- Reads/writes via `core/browser/storage.ts`
- Runs quota check after writes to `vocab:entries`

**Step 5: Response**
- Background returns `Result<T>` to caller
- Popup/side panel updates UI via hook state

### 🔍 Debug tips
- If error at step X, check...
```

---

## Why Explanation

```markdown
## ❓ Why: {Question}

### Short Answer
[1-2 sentences, direct answer]

### Detailed Explanation

**Reason 1: ...**
[Explain]

**Reason 2: ...**
[Explain]

### Without it?
[Problems you'd face]

### Trade-offs
| Pros | Cons |
|------|------|
| ... | ... |

### Alternatives?
[Other options and when to use them]

### 📌 Conclusion
[Summary recommendation]
```