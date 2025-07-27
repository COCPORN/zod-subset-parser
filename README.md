# zod-subset-parser

`zod-subset-parser` is a TypeScript library that safely parses Zod schema definitions written as JavaScript/TypeScript **strings**, and returns live, executable Zod schema objects — without using `eval`.

This enables developers and AI agents to describe schemas using familiar Zod syntax, store them as strings, and rehydrate them into executable schemas at runtime safely.

## Installation

```bash
pnpm install zod-subset-parser
```

## Usage

The parser is designed to be robust and handles standard JavaScript syntax, including comments and extra whitespace.

```ts
import { parseZodString } from "zod-subset-parser";

const schema = parseZodString(`
  // Define a user schema
  z.object({
    name: z.string().min(1), // User's full name
    age: z.number().optional(), /* User's age */
    tags: z.array(z.string())
  })
`);

schema.parse({ name: "Alice", tags: ["foo"] }); // ✅ Valid
```

## Supported Zod Features

- `z.string()` with `.min()`, `.max()`, `.regex()`, `.email()`, `.url()`, `.uuid()`
- `z.number()` with `.min()`, `.max()`, `.int()`, `.positive()`, `.negative()`
- `z.boolean()`
- `z.literal(...)`
- `z.enum([...])`
- `z.null()`, `z.undefined()`
- `.optional()`, `.nullable()`, `.describe("...")`
- `z.array(...)` with `.min()`, `.max()`, `.length()`, `.nonempty()`
- `z.object({ ... })` with nested support
- `z.union([ ... ])`
- `z.tuple([ ... ])`

## Out of Scope (v1)

- `.refine(...)` (custom logic)
- `.transform(...)`
- `z.lazy(...)`
- Variable references
- TypeScript types or generics

