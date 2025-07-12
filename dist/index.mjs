// src/index.ts
import { z } from "zod";
import * as acorn from "acorn";
var ZodParseError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ZodParseError";
  }
};
function parseNode(node) {
  if (node.type !== "CallExpression") {
    throw new ZodParseError(`Unsupported expression type: ${node.type}`);
  }
  const callee = node.callee;
  if (callee.type === "MemberExpression") {
    const object = callee.object;
    const property = callee.property;
    if (object.type === "Identifier" && object.name === "z") {
      const methodName = property.name;
      const args = node.arguments.map((arg) => parseArg(arg));
      switch (methodName) {
        case "string":
        case "number":
        case "boolean":
        case "null":
        case "undefined":
          if (args.length > 0) {
            throw new ZodParseError(`z.${methodName}() does not take any arguments`);
          }
          return z[methodName]();
        case "literal":
          return z.literal(args[0]);
        case "enum":
          const enumValues = args[0];
          if (enumValues.some((v) => typeof v !== "string")) {
            throw new ZodParseError("z.enum() only supports an array of strings");
          }
          return z.enum(enumValues);
        case "array":
          return z.array(args[0]);
        case "object":
          return z.object(args[0]);
        case "union":
          return z.union(args[0]);
        case "tuple":
          return z.tuple(args[0]);
        default:
          throw new ZodParseError(`Unsupported Zod base type: ${methodName}`);
      }
    }
    if (object.type === "CallExpression") {
      const schema = parseNode(object);
      const methodName = property.name;
      const args = node.arguments.map((arg) => parseArg(arg));
      if (typeof schema[methodName] !== "function") {
        throw new ZodParseError(`Unsupported method: ${methodName}`);
      }
      return schema[methodName](...args);
    }
  }
  throw new ZodParseError("Invalid Zod expression");
}
function parseArg(arg) {
  if (arg.type === "Literal") {
    return arg.value;
  }
  if (arg.type === "ArrayExpression") {
    return arg.elements.map((el) => parseArg(el));
  }
  if (arg.type === "CallExpression") {
    return parseNode(arg);
  }
  if (arg.type === "ObjectExpression") {
    const obj = {};
    for (const prop of arg.properties) {
      if (prop.type === "Property") {
        const key = prop.key;
        obj[key.name] = parseNode(prop.value);
      }
    }
    return obj;
  }
  throw new ZodParseError(`Unsupported argument type: ${arg.type}`);
}
function parseZodString(str) {
  try {
    const ast = acorn.parse(str, { ecmaVersion: 2020, locations: true });
    if (ast.type !== "Program" || ast.body.length !== 1 || ast.body[0].type !== "ExpressionStatement") {
      throw new ZodParseError("Invalid schema expression");
    }
    return parseNode(ast.body[0].expression);
  } catch (error) {
    if (error instanceof ZodParseError) {
      throw error;
    }
    const e = error;
    if (e.loc) {
      throw new ZodParseError(`Invalid JavaScript at line ${e.loc.line}, column ${e.loc.column}: ${e.message}`);
    }
    throw new ZodParseError(`Invalid JavaScript: ${e.message}`);
  }
}
export {
  ZodParseError,
  parseZodString
};
