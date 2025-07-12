# How to Publish to NPM

This guide provides the basic steps to publish this package to the npm registry.

## 1. Prerequisites

- **Create an NPM Account:** If you don't have one, sign up at [npmjs.com](https://www.npmjs.com/signup).
- **Install Node.js and pnpm:** Ensure you have Node.js and pnpm installed on your machine.

## 2. Login to NPM

Before you can publish, you need to authenticate with your npm account from your terminal.

```bash
npm login
```

Follow the prompts to enter your username, password, and email address.

## 3. Versioning

Before publishing a new version, it's important to update the version number in your `package.json`. You can do this manually, or use the `pnpm version` command, which will also create a git tag.

```bash
# For a patch release (e.g., 1.0.0 -> 1.0.1)
pnpm version patch

# For a minor release (e.g., 1.0.1 -> 1.1.0)
pnpm version minor

# For a major release (e.g., 1.1.0 -> 2.0.0)
pnpm version major
```

## 4. Build the Package

This project uses `tsup` to build the distributable files. The `build` script is already configured in `package.json`.

```bash
pnpm build
```

This will create a `dist` directory with the compiled JavaScript files and TypeScript declarations. The `files` field in `package.json` is configured to only include this `dist` directory in the published package.

## 5. Publish

Once you are logged in, have updated the version, and have built the package, you can publish it to the npm registry.

```bash
pnpm publish
```

If your package name is scoped (e.g., `@username/package-name`), you may need to use a flag to indicate that it's a public package.

```bash
pnpm publish --access public
```

## 6. Verification

You can verify that your package was published successfully by visiting its page on the npm website: `https://www.npmjs.com/package/zod-subset-parser`.
