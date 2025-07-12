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

  it('should throw an error for unsupported types', () => {
    expect(() => parseZodString('z.any()')).toThrow();
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
});
