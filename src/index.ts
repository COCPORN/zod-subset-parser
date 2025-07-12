import { z, ZodTypeAny } from 'zod';
import * as acorn from 'acorn';
import { Expression, CallExpression, Identifier, MemberExpression, Literal, ArrayExpression, ObjectExpression, Property } from 'estree';

export class ZodParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ZodParseError';
  }
}

/**
 * Parses a Zod schema definition from a string.
 * @param node The AST node to parse.
 * @returns A Zod schema.
 */
function parseNode(node: Expression): ZodTypeAny {
  if (node.type !== 'CallExpression') {
    throw new ZodParseError(`Unsupported expression type: ${node.type}`);
  }

  const callee = node.callee;

  if (callee.type === 'MemberExpression') {
    const object = callee.object;
    const property = callee.property as Identifier;

    // Base case: z.string(), z.number(), etc.
    if (object.type === 'Identifier' && object.name === 'z') {
      const methodName = property.name;
      const args = node.arguments.map(arg => parseArg(arg as Expression));

      switch (methodName) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'null':
        case 'undefined':
          if (args.length > 0) {
            throw new ZodParseError(`z.${methodName}() does not take any arguments`);
          }
          return z[methodName]();
        case 'literal':
          return z.literal(args[0]);
        case 'enum':
          const enumValues = args[0] as any[];
          if (enumValues.some(v => typeof v !== 'string')) {
            throw new ZodParseError('z.enum() only supports an array of strings');
          }
          return z.enum(enumValues as [string, ...string[]]);
        case 'array':
          return z.array(args[0] as ZodTypeAny);
        case 'object':
          return z.object(args[0] as Record<string, ZodTypeAny>);
        case 'union':
          return z.union(args[0] as [ZodTypeAny, ...ZodTypeAny[]]);
        case 'tuple':
          return z.tuple(args[0] as [ZodTypeAny, ...ZodTypeAny[]]);
        default:
          throw new ZodParseError(`Unsupported Zod base type: ${methodName}`);
      }
    }

    // Recursive case: chained methods
    if (object.type === 'CallExpression') {
      const schema = parseNode(object);
      const methodName = property.name;
      const args = node.arguments.map(arg => parseArg(arg as Expression));

      if (typeof (schema as any)[methodName] !== 'function') {
        throw new ZodParseError(`Unsupported method: ${methodName}`);
      }

      return (schema as any)[methodName](...args);
    }
  }

  throw new ZodParseError('Invalid Zod expression');
}

/**
 * Parses an argument from a CallExpression.
 * @param arg The argument node to parse.
 * @returns The parsed argument.
 */
function parseArg(arg: Expression): any {
  if (arg.type === 'Literal') {
    return (arg as Literal).value;
  }
  if (arg.type === 'ArrayExpression') {
    return (arg as ArrayExpression).elements.map(el => parseArg(el as Expression));
  }
  if (arg.type === 'CallExpression') {
    return parseNode(arg);
  }
  if (arg.type === 'ObjectExpression') {
    const obj: Record<string, ZodTypeAny> = {};
    for (const prop of (arg as ObjectExpression).properties) {
      if (prop.type === 'Property') {
        const key = (prop as Property).key as Identifier;
        obj[key.name] = parseNode((prop as Property).value as Expression);
      }
    }
    return obj;
  }
  throw new ZodParseError(`Unsupported argument type: ${arg.type}`);
}

export function parseZodString(str: string): ZodTypeAny {
  try {
    const ast = acorn.parse(str, { ecmaVersion: 2020, locations: true });
    
    if (ast.type !== 'Program' || ast.body.length !== 1 || ast.body[0].type !== 'ExpressionStatement') {
      throw new ZodParseError('Invalid schema expression');
    }

    return parseNode(ast.body[0].expression);
  } catch (error) {
    if (error instanceof ZodParseError) {
      throw error;
    }
    const e = error as Error & { loc: { line: number, column: number }};
    if (e.loc) {
      throw new ZodParseError(`Invalid JavaScript at line ${e.loc.line}, column ${e.loc.column}: ${e.message}`);
    }
    throw new ZodParseError(`Invalid JavaScript: ${e.message}`);
  }
}