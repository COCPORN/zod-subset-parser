# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.2] - 2024-XX-XX

### Added
- Support for `z.record()` schema type with 1 or 2 arguments
- Support for `z.any()` schema type ✅ **PACKAGED**

### Changed
- Removed dual Zod version support and consolidated into single package
- Restructured project for better maintainability

## [0.2.1] - 2024-XX-XX

### Added
- Dual Zod v3/v4 version support with separate entry points
- Support for both `./zod3` and `./zod4` exports

### Changed
- Restructured project to support multiple Zod versions

## [0.2.0] - 2024-XX-XX

### Added
- Git repository information to package.json
- COCPORN as package author

### Changed
- Updated package metadata

## [0.1.0] - 2024-XX-XX

### Added
- Initial release of zod-subset-parser
- Support for parsing comments and whitespace in Zod schemas
- Syntax error line and column reporting
- Distribution files generation
- Support for basic Zod schema types:
  - `z.string()`
  - `z.number()`
  - `z.boolean()`
  - `z.null()`
  - `z.undefined()`
  - `z.literal()`
  - `z.enum()`
  - `z.array()`
  - `z.object()`
  - `z.union()`
  - `z.tuple()`
- Support for chained methods (e.g., `.describe()`)
- Safe parsing without eval
- TypeScript support

### Security
- Eval-free parsing using AST (acorn parser)

---

## Release Notes

### About `z.any()` Feature
The `z.any()` feature **HAS BEEN PACKAGED** in version 0.2.2. It allows parsing of schemas that accept any value type and includes comprehensive test coverage.

### Supported Schema Types (Current)
- Basic types: `string`, `number`, `boolean`, `null`, `undefined`, `any`
- Complex types: `literal`, `enum`, `array`, `object`, `union`, `tuple`, `record`
- Chained methods: `.describe()` and other Zod methods

### Package Information
- Current version: 0.2.2
- Supports Zod >= 3.0.0
- Dual export support for different Zod versions
- Built with TypeScript and includes type definitions
