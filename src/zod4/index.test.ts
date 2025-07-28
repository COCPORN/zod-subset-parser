import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { parseZodString } from './index';

describe('parseZodString', () => {
  it('should parse a simple z.string()', () => {
    const schema = parseZodString('z.string()');
    expect(schema).toBeInstanceOf(z.ZodString);
  });

  it('should parse a simple z.number()', () => {
    const schema = parseZodString('z.number()');
    expect(schema).toBeInstanceOf(z.ZodNumber);
  });

  it('should parse a simple z.boolean()', () => {
    const schema = parseZodString('z.boolean()');
    expect(schema).toBeInstanceOf(z.ZodBoolean);
  });

  it('should parse a z.string().min(5)', () => {
    const schema = parseZodString('z.string().min(5)');
    expect(schema.safeParse('1234').success).toBe(false);
    expect(schema.safeParse('12345').success).toBe(true);
  });

  it('should parse a z.string().max(5)', () => {
    const schema = parseZodString('z.string().max(5)');
    expect(schema.safeParse('12345').success).toBe(true);
    expect(schema.safeParse('123456').success).toBe(false);
  });

  it('should parse a z.string().email()', () => {
    const schema = parseZodString('z.string().email()');
    expect(schema.safeParse('test@example.com').success).toBe(true);
    expect(schema.safeParse('not-an-email').success).toBe(false);
  });

  it('should parse a z.string().url()', () => {
    const schema = parseZodString('z.string().url()');
    expect(schema.safeParse('https://example.com').success).toBe(true);
    expect(schema.safeParse('not-a-url').success).toBe(false);
  });

  it('should parse a z.string().uuid()', () => {
    const schema = parseZodString('z.string().uuid()');
    expect(schema.safeParse('123e4567-e89b-12d3-a456-426614174000').success).toBe(true);
    expect(schema.safeParse('not-a-uuid').success).toBe(false);
  });

  it('should parse a z.string().regex()', () => {
    const schema = parseZodString('z.string().regex(/^[a-z]+$/)');
    expect(schema.safeParse('abc').success).toBe(true);
    expect(schema.safeParse('ABC').success).toBe(false);
  });

  it('should parse a z.number().min(5)', () => {
    const schema = parseZodString('z.number().min(5)');
    expect(schema.safeParse(4).success).toBe(false);
    expect(schema.safeParse(5).success).toBe(true);
  });

  it('should parse a z.number().max(5)', () => {
    const schema = parseZodString('z.number().max(5)');
    expect(schema.safeParse(5).success).toBe(true);
    expect(schema.safeParse(6).success).toBe(false);
  });

  it('should parse a z.number().int()', () => {
    const schema = parseZodString('z.number().int()');
    expect(schema.safeParse(5).success).toBe(true);
    expect(schema.safeParse(5.5).success).toBe(false);
  });

  it('should parse a z.number().positive()', () => {
    const schema = parseZodString('z.number().positive()');
    expect(schema.safeParse(1).success).toBe(true);
    expect(schema.safeParse(0).success).toBe(false);
    expect(schema.safeParse(-1).success).toBe(false);
  });

  it('should parse a z.number().negative()', () => {
    const schema = parseZodString('z.number().negative()');
    expect(schema.safeParse(-1).success).toBe(true);
    expect(schema.safeParse(0).success).toBe(false);
    expect(schema.safeParse(1).success).toBe(false);
  });

  it('should parse a z.literal()', () => {
    const schema = parseZodString('z.literal("hello")');
    expect(schema.safeParse('hello').success).toBe(true);
    expect(schema.safeParse('world').success).toBe(false);
  });

  it('should parse a z.enum()', () => {
    const schema = parseZodString('z.enum(["a", "b", "c"])');
    expect(schema.safeParse('a').success).toBe(true);
    expect(schema.safeParse('d').success).toBe(false);
  });

  it('should parse a z.null()', () => {
    const schema = parseZodString('z.null()');
    expect(schema.safeParse(null).success).toBe(true);
    expect(schema.safeParse(undefined).success).toBe(false);
  });

  it('should parse a z.undefined()', () => {
    const schema = parseZodString('z.undefined()');
    expect(schema.safeParse(undefined).success).toBe(true);
    expect(schema.safeParse(null).success).toBe(false);
  });

  it('should parse a .optional()', () => {
    const schema = parseZodString('z.string().optional()');
    expect(schema.safeParse(undefined).success).toBe(true);
    expect(schema.safeParse('hello').success).toBe(true);
  });

  it('should parse a .nullable()', () => {
    const schema = parseZodString('z.string().nullable()');
    expect(schema.safeParse(null).success).toBe(true);
    expect(schema.safeParse('hello').success).toBe(true);
  });

  it('should parse a z.array(z.string())', () => {
    const schema = parseZodString('z.array(z.string())');
    expect(schema.safeParse(['a', 'b', 'c']).success).toBe(true);
    expect(schema.safeParse(['a', 1, 'c']).success).toBe(false);
  });

  it('should parse a z.object()', () => {
    const schema = parseZodString('z.object({ name: z.string() })');
    expect(schema.safeParse({ name: 'test' }).success).toBe(true);
    expect(schema.safeParse({ name: 123 }).success).toBe(false);
  });

  it('should parse a z.union()', () => {
    const schema = parseZodString('z.union([z.string(), z.number()])');
    expect(schema.safeParse('test').success).toBe(true);
    expect(schema.safeParse(123).success).toBe(true);
    expect(schema.safeParse(true).success).toBe(false);
  });

  it('should parse a z.tuple()', () => {
    const schema = parseZodString('z.tuple([z.string(), z.number()])');
    expect(schema.safeParse(['test', 123]).success).toBe(true);
    expect(schema.safeParse([123, 'test']).success).toBe(false);
  });

  it('should throw an error for invalid expressions', () => {
    expect(() => parseZodString('z.string() + z.number()')).toThrow();
  });

  it('should parse a z.any()', () => {
    const schema = parseZodString('z.any()');
    expect(schema.safeParse('string').success).toBe(true);
    expect(schema.safeParse(123).success).toBe(true);
    expect(schema.safeParse(true).success).toBe(true);
    expect(schema.safeParse(null).success).toBe(true);
    expect(schema.safeParse(undefined).success).toBe(true);
    expect(schema.safeParse({ foo: 'bar' }).success).toBe(true);
    expect(schema.safeParse([1, 2, 3]).success).toBe(true);
  });

  it('should throw an error for unsupported arguments', () => {
    expect(() => parseZodString('z.string(123)')).toThrow();
  });

  it('should throw an error for unsupported array element types', () => {
    expect(() => parseZodString('z.enum([1, 2, 3])')).toThrow();
  });

  it('should throw an error for unsupported object property types', () => {
    expect(() => parseZodString('z.object({ name: 123 })')).toThrow();
  });

  it('should parse a z.string() with .describe()', () => {
    const description = 'This is a test description.';
    const schema = parseZodString(`z.string().describe("${description}")`);
    expect(schema.description).toBe(description);
  });

  it('should parse array length constraints', () => {
    const schema = parseZodString('z.array(z.string()).min(1).max(2)');
    expect(schema.safeParse([]).success).toBe(false);
    expect(schema.safeParse(['a']).success).toBe(true);
    expect(schema.safeParse(['a', 'b']).success).toBe(true);
    expect(schema.safeParse(['a', 'b', 'c']).success).toBe(false);
  });

  it('should handle comments and extra whitespace', () => {
    const schemaString = `
      // This is a test object
      z.object({
        name: z.string(), // User's name
        age: z.number().int() /* User's age */,
      })
    `;
    const schema = parseZodString(schemaString);
    expect(schema.safeParse({ name: 'test', age: 30 }).success).toBe(true);
    expect(schema.safeParse({ name: 'test', age: 30.5 }).success).toBe(false);
  });

  it('should report correct line and column for a syntax error', () => {
    const schemaString = `
      z.object({
        name: z.string(),
        age: z.number(),
        @
      })
    `;
    // The exact error message from acorn can vary, so we'll use a regex
    // to confirm the line and column are present and correct.
    expect(() => parseZodString(schemaString)).toThrow(
      /Invalid JavaScript at line 5, column 8/
    );
  });

  it('should handle empty string input', () => {
    expect(() => parseZodString('')).toThrow();
  });

  it('should parse .default() with literal values', () => {
    // Test string default
    const stringSchema = parseZodString('z.string().default("hello")');
    expect(stringSchema.parse(undefined)).toBe('hello');
    expect(stringSchema.parse('world')).toBe('world');
    
    // Test number default
    const numberSchema = parseZodString('z.number().default(42)');
    expect(numberSchema.parse(undefined)).toBe(42);
    expect(numberSchema.parse(100)).toBe(100);
    
    // Test boolean default
    const booleanSchema = parseZodString('z.boolean().default(true)');
    expect(booleanSchema.parse(undefined)).toBe(true);
    expect(booleanSchema.parse(false)).toBe(false);
    
    // Test null default
    const nullSchema = parseZodString('z.string().nullable().default(null)');
    expect(nullSchema.parse(undefined)).toBe(null);
    expect(nullSchema.parse('test')).toBe('test');
  });

  it('should parse z.record() with value type only', () => {
    const schema = parseZodString('z.record(z.string())');
    
    // Test valid data
    expect(schema.safeParse({ key1: 'value1', key2: 'value2' }).success).toBe(true);
    
    // Test invalid data (wrong value type)
    expect(schema.safeParse({ key1: 'value1', key2: 123 }).success).toBe(false);
    
    // Test empty object
    expect(schema.safeParse({}).success).toBe(true);
  });

  it('should parse z.record() with key and value types', () => {
    const schema = parseZodString('z.record(z.string(), z.number())');
    
    // Test valid data
    expect(schema.safeParse({ name: 123, age: 456 }).success).toBe(true);
    
    // Test invalid data (wrong value type)
    expect(schema.safeParse({ name: 'invalid' }).success).toBe(false);
    
    // Test empty object
    expect(schema.safeParse({}).success).toBe(true);
  });

  it('should parse z.record() with complex nested types', () => {
    const schema = parseZodString('z.record(z.object({ name: z.string(), count: z.number() }))'); 
    
    // Test valid nested data
    expect(schema.safeParse({
      item1: { name: 'test1', count: 5 },
      item2: { name: 'test2', count: 10 }
    }).success).toBe(true);
    
    // Test invalid nested data
    expect(schema.safeParse({
      item1: { name: 'test1', count: 'invalid' }
    }).success).toBe(false);
  });

  it('should parse z.record() with chained methods', () => {
    const schema = parseZodString('z.record(z.string()).optional()');
    
    // Test undefined (should be valid due to optional)
    expect(schema.safeParse(undefined).success).toBe(true);
    
    // Test valid record
    expect(schema.safeParse({ key: 'value' }).success).toBe(true);
  });

  it('should throw error for z.record() with invalid argument count', () => {
    expect(() => parseZodString('z.record()')).toThrow('z.record() requires 1 or 2 arguments');
    expect(() => parseZodString('z.record(z.string(), z.number(), z.boolean())')).toThrow('z.record() requires 1 or 2 arguments');
  });

  it('should parse complex object schema with descriptions and optional fields', () => {
    const complexSchemaString = `z.object({
      path: z.string().describe('File path to read (relative to current working directory)'),
      encoding: z.enum(['utf8', 'binary', 'base64']).optional().describe('File encoding (default: utf8)'),
      startLine: z.number().optional().describe('Start line for partial reading (1-based)'),
      endLine: z.number().optional().describe('End line for partial reading (1-based)'),
      maxBytes: z.number().optional().describe('Maximum bytes to read')
    })`;
    
    const schema = parseZodString(complexSchemaString);
    
    // Test valid input
    expect(schema.safeParse({
      path: '/test/file.txt',
      encoding: 'utf8',
      startLine: 1,
      endLine: 10,
      maxBytes: 1024
    }).success).toBe(true);
    
    // Test minimal valid input (only required field)
    expect(schema.safeParse({
      path: '/test/file.txt'
    }).success).toBe(true);
    
    // Test invalid encoding
    expect(schema.safeParse({
      path: '/test/file.txt',
      encoding: 'invalid'
    }).success).toBe(false);
    
    // Test missing required field
    expect(schema.safeParse({
      encoding: 'utf8'
    }).success).toBe(false);
  });
});
