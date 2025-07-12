# zod-subset-parser — Product Requirements Document

## 📦 Project Name
**zod-subset-parser**

## 🧠 Overview
`zod-subset-parser` is a TypeScript library that safely parses Zod schema definitions written as JavaScript/TypeScript **strings**, and returns live, executable Zod schema objects — without using `eval`.

This enables developers and AI agents to describe schemas using familiar Zod syntax, store them as strings, and rehydrate them into executable schemas at runtime safely.

---

## 🎯 Goals

- Enable **safe deserialization of Zod schemas from strings**.
- Support a defined **subset of Zod** sufficient for most common use cases.
- Be **strict and predictable**: fail on unknown patterns.
- Be useful in **agentic workflows** (e.g., LLMs generating logic).
- Serve as a **foundation** for future tools: visual schema builders, linters, serializers, etc.

---

## ✅ Core Features

### ✔️ parseZodString(str: string) → ZodTypeAny

- Accept a string of valid Zod-like JS code.
- Parse into an AST using a JS parser (e.g., `acorn`).
- Reconstruct a Zod schema using the Zod API.
- Return the final schema object.

---

## 📘 Supported Zod Features (Initial Subset)

- `z.string()` with `.min()`, `.max()`, `.regex()`, `.email()`, `.url()`, `.uuid()`
- `z.number()` with `.min()`, `.max()`, `.int()`, `.positive()`, `.negative()`
- `z.boolean()`
- `z.literal(...)`
- `z.enum([...])`
- `z.null()`, `z.undefined()`
- `.optional()`, `.nullable()`
- `z.array(...)`
- `z.object({ ... })` with nested support
- `z.union([ ... ])`
- `z.tuple([ ... ])`

---

## 🛑 Out of Scope (v1)

- `.refine(...)` (custom logic)
- `.transform(...)`
- `z.lazy(...)`
- Variable references
- TypeScript types or generics

---

## 🧪 Error Handling

- Invalid constructs must throw descriptive, type-safe errors.
- Example:
  ```ts
  throw new ZodParseError("Unsupported method: refine");
  ```

## Example usage

```ts
import { parseZodString } from "zod-subset-parser";

const schema = parseZodString(`
  z.object({
    name: z.string().min(1),
    age: z.number().optional(),
    tags: z.array(z.string())
  })
`);

schema.parse({ name: "Alice", tags: ["foo"] }); // ✅ Valid
```

## 🛠 Technical Requirements

- Written in TypeScript
- Built with pnpm
- Uses `acorn`, `esprima`, or similar to parse JS syntax safely
- No eval, Function, or dynamic execution
- Fully type-safe return values and helpful diagnostics

## 📦 Deliverables

- NPM package: zod-subset-parser
- TypeScript types
- 100% test coverage of supported constructs
- CI pipeline
- README with usage examples