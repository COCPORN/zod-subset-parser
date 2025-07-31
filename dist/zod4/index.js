"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/zod4/index.ts
var index_exports = {};
__export(index_exports, {
  ZodParseError: () => ZodParseError,
  parseZodString: () => parseZodString
});
module.exports = __toCommonJS(index_exports);
var import_zod = require("zod");
var acorn = __toESM(require("acorn"));
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
        case "bigint":
        case "boolean":
        case "date":
        case "symbol":
        case "null":
        case "undefined":
        case "void":
        case "any":
        case "unknown":
        case "never":
          if (args.length > 0) {
            throw new ZodParseError(`z.${methodName}() does not take any arguments`);
          }
          return import_zod.z[methodName]();
        case "literal":
          return import_zod.z.literal(args[0]);
        case "enum":
          const enumValues = args[0];
          if (enumValues.some((v) => typeof v !== "string")) {
            throw new ZodParseError("z.enum() only supports an array of strings");
          }
          return import_zod.z.enum(enumValues);
        case "array":
          return import_zod.z.array(args[0]);
        case "object":
          return import_zod.z.object(args[0]);
        case "union":
          return import_zod.z.union(args[0]);
        case "tuple":
          return import_zod.z.tuple(args[0]);
        case "record":
          if (args.length === 1) {
            return import_zod.z.record(import_zod.z.string(), args[0]);
          } else if (args.length === 2) {
            return import_zod.z.record(args[0], args[1]);
          }
          throw new ZodParseError("z.record() requires 1 or 2 arguments");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ZodParseError,
  parseZodString
});
