# Contributing to @isdk/mdast-plus

Thank you for your interest in contributing to `@isdk/mdast-plus`! This document provides guidelines for contributing to the project.

## Architecture Overview

`@isdk/mdast-plus` is built on the `unified` ecosystem. It extends `mdast` (Markdown Abstract Syntax Tree) with semantic-first principles.

### Core Concepts

1.  **Fluent API**: The main entry point is the `mdast()` function in `src/pipeline.ts`.
2.  **Staged Plugins**: Plugins are categorized into three stages:
    *   `normalize`: Cleanup and canonicalize the tree.
    *   `compile`: High-level semantic transformations.
    *   `finalize`: Final preparation before output.
3.  **Universal Data Protocols**: Nodes use `node.data` for metadata, and `node.data.hProperties` for HTML attributes.

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- [pnpm](https://pnpm.io/) (used for dependency management)

### Installation

```bash
git clone https://github.com/isdk/mdast-plus.js.git
cd mdast-plus.js
pnpm install
```

## Development Workflow

### Building

```bash
pnpm run build
```

### Testing

We use `vitest` for testing. Add your tests in the `test/` directory.

```bash
pnpm run test        # Run tests once
```

### Linting

```bash
pnpm run lint
```

## Adding a New Plugin

1.  Create your plugin in `src/plugins/`.
2.  Implement the `MdastPlugin` interface:

```typescript
import { MdastPlugin } from '../types';

export const myPlugin: MdastPlugin = {
  name: 'my-plugin',
  stage: 'normalize', // 'normalize' | 'compile' | 'finalize'
  order: 50,          // 0-100
  transform: async (tree, processor) => {
    // Visit nodes and transform the tree
  }
};
```

3.  Register your plugin in `src/pipeline.ts` in the `FluentProcessor` constructor if it should be a default plugin.

## Adding a New Format

1. Implement the `MdastFormatDefinition` interface.
2. Register it using `FluentProcessor.registerFormat(name, definition)`.

```typescript
import { FluentProcessor } from '../pipeline';

FluentProcessor.registerFormat('json', {
  stringify: (processor) => {
    processor.Compiler = (tree) => JSON.stringify(tree);
  }
});
```

## Coding Standards

- Use **TypeScript** for all new code.
- Follow the existing code style and formatting (use Prettier/ESLint).
- Ensure all new features are covered by **tests**.
- Use **semantic-first** principles: focus on the meaning of the content, not just its visual representation.

## Submission Guidelines

- Create a feature branch for your changes.
- Ensure all tests pass.
- Update documentation (`README.md`, `README.cn.md`) if necessary.
- Submit a Pull Request with a clear description of your changes.

## License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](./LICENSE-MIT).
