# Zod Subset Parser for LLMs

This document outlines the available Zod features you can use with the `parseZodString` function.

## Function Signature

`parseZodString(schemaString: string): ZodSchema`

## Supported Zod Features

You can generate Zod schemas as strings using the following constructs.

### Base Types
- `z.string()`
- `z.number()`
- `z.boolean()`
- `z.literal("your-literal")`
- `z.enum(["val1", "val2"])`
- `z.null()`
- `z.undefined()`
- `z.array(ZodType)`
- `z.object({ key: ZodType, ... })`
- `z.union([ZodType, ...])`
- `z.tuple([ZodType, ...])`

### Chained Methods

#### For `z.string()`
- `.min(number)`
- `.max(number)`
- `.regex(/.../)`
- `.email()`
- `.url()`
- `.uuid()`

#### For `z.number()`
- `.min(number)`
- `.max(number)`
- `.int()`
- `.positive()`
- `.negative()`

#### For any type
- `.optional()`
- `.nullable()`

## Unsupported Features (Do Not Use)

- **`z.refine()`**: Custom refinements are not supported.
- **`z.transform()`**: Transformations are not supported.
- **`z.lazy()`**: Lazy schemas are not supported.
- **Variable References**: You cannot use variables within the schema string. All values must be literals (e.g., `5`, `"hello"`, `/regex/`).
- **TypeScript Generics/Types**: Do not include TypeScript syntax like `<...>` or type annotations.

## Example

**VALID INPUT:**
```javascript
z.object({
  name: z.string().min(1),
  age: z.number().positive().optional(),
  role: z.enum(["admin", "user"]),
  tags: z.array(z.string().uuid())
})
```

**INVALID INPUT:**
```javascript
// Invalid: uses .refine()
z.string().refine(val => val.length > 5)

// Invalid: uses a variable
const minLength = 5;
z.string().min(minLength)
```
