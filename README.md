# zod-subset-parser

`zod-subset-parser` is a TypeScript library that safely parses Zod schema definitions written as JavaScript/TypeScript **strings**, and returns live, executable Zod schema objects — without using `eval`.

This enables developers and AI agents to describe schemas using familiar Zod syntax, store them as strings, and rehydrate them into executable schemas at runtime safely.

## Installation

```bash
pnpm install zod-subset-parser
```

## Dual Zod Version Support

This package supports both Zod v3 and Zod v4 through separate entry points:

### For Zod v3
```ts
import { parseZodString } from "zod-subset-parser/zod3";
```

### For Zod v4
```ts
import { parseZodString } from "zod-subset-parser/zod4";
```

The package automatically detects which version you're using based on the import path and provides the appropriate implementation.

## Usage

The parser is designed to be robust and handles standard JavaScript syntax, including comments and extra whitespace.

```ts
// For Zod v4 (recommended)
import { parseZodString } from "zod-subset-parser/zod4";

// For Zod v3
// import { parseZodString } from "zod-subset-parser/zod3";

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

## Publishing Separate Packages

This single package supports both Zod v3 and v4 through separate entry points, but if you need to publish them as separate packages, you can do so:

### Option 1: Create Separate Package Names

You can publish version-specific packages:

```bash
# Clone the repository for each version
git clone <repo-url> zod-subset-parser-v3
git clone <repo-url> zod-subset-parser-v4

# For v3 package
cd zod-subset-parser-v3
# Update package.json name to "zod-subset-parser-v3"
# Update exports to only include zod3 entry point
# Remove zod4 dependencies and files
npm publish

# For v4 package  
cd zod-subset-parser-v4
# Update package.json name to "zod-subset-parser-v4"
# Update exports to only include zod4 entry point
# Remove zod3 dependencies and files
npm publish
```

### Option 2: Use Package Tags

Publish different versions with npm tags:

```bash
# Build both versions
npm run build

# Publish v3 with tag
npm publish --tag zod3

# Publish v4 with tag (or as latest)
npm publish --tag zod4
# or
npm publish --tag latest
```

### Option 3: Scoped Packages

Create scoped packages for each version:

```bash
# Update package.json for each version
# @yourorg/zod-subset-parser-v3
# @yourorg/zod-subset-parser-v4

npm publish --access public
```

The current unified approach is recommended as it provides the best developer experience while maintaining compatibility with both Zod versions.
