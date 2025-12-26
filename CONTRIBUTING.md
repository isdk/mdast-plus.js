# Contributing to @isdk/mdast-plus

Thank you for your interest in contributing to `@isdk/mdast-plus`! This document provides guidelines for contributing to the project.

## Architecture Overview

`@isdk/mdast-plus` is built on the `unified` ecosystem. It extends `mdast` (Markdown Abstract Syntax Tree) with semantic-first principles.

### Core Concepts

1. **Fluent API**: The main entry point is the `mdast()` function in `src/pipeline.ts`, backed by `MdastPipeline`.
2. **Staged Plugins**: Plugins are categorized into 5 stages (`PipelineStage`):
    * `parse`: Parsing input to AST.
    * `normalize`: Cleanup and canonicalize the tree.
    * `compile`: High-level semantic transformations.
    * `finalize`: Final preparation before output.
    * `stringify`: Serializing AST to output.
3. **Universal Data Protocols**: Nodes use `node.data` for metadata, and `node.data.hProperties` for HTML attributes.

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

1. Create your plugin in `src/plugins/`.
2. Implement the `MdastPlugin` interface. The `plugin` property should be a standard unified plugin.

```typescript
import { MdastPlugin, PipelineStage } from '../types';
import { visit } from 'unist-util-visit';

const myUnifiedPlugin = (options) => {
  return (tree) => {
    visit(tree, 'text', (node) => {
      // transform logic
    });
  };
};

export const myPlugin: MdastPlugin = {
  name: 'my-custom-plugin',
  plugin: myUnifiedPlugin,
  stage: PipelineStage.normalize, // or 'compile', 'finalize', etc.
  order: 50,                      // 0-100
  main: false,                    // Set to true to replace the first plugin of the stage, defaults to false
  before: 'some-other-plugin',    // Optional: run before another plugin
  after: 'another-plugin',        // Optional: run after another plugin
};
```

### Main Plugins

Each stage supports a **single** main plugin. When a plugin is marked with `main: true`, it will replace the first plugin that was originally registered for that stage. This is primarily used by formats to allow users to override the default parser or stringifier by injecting a different one at the same stage.

1. If it's a default plugin, add it to the `input` or `output` list of the relevant format in `src/formats/`.

## Adding a New Format

1. Define a `MdastFormat` object.
2. Register it using `MdastPipeline.register(format)`.

```typescript
import { MdastPipeline, PipelineStage } from '../src/pipeline';

MdastPipeline.register({
  id: 'json',
  title: 'JSON Format',
  output: [{
    plugin: function() {
      this.Compiler = (tree) => JSON.stringify(tree);
    },
    stage: PipelineStage.stringify
  }]
});
```

> **Note**: Format names are case-insensitive.
>
> **Important**: `unified` requires a `Compiler` to be attached for the process to complete successfully. If your format is intended to return an object (like the AST itself) rather than a string, you must provide a "pass-through" compiler:
>
> ```typescript
> function astCompiler() {
>   this.Compiler = (tree) => tree;
> }
> ```

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
