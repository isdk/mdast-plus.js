# @isdk/mdast-plus

> A "Semantic-First" Markdown processing toolkit based on unified, remark and rehype.

English | [简体中文](./README.cn.md)

[![NPM version](https://img.shields.io/npm/v/@isdk/mdast-plus.svg)](https://www.npmjs.com/package/@isdk/mdast-plus)

`@isdk/mdast-plus` is a powerful extension to the unified ecosystem, designed to provide consistent, semantic-first normalization and transformation of Markdown content. It simplifies complex processing pipelines with a fluent API and a staged plugin system.

## Features

- **Fluent API**: Chainable interface `mdast(input).use(plugin).toHTML()`.
- **Staged Plugins**: Organize transformations into `normalize`, `compile`, and `finalize` stages with priority ordering.
- **Semantic Normalization**:
  - **Directives**: Canonicalizes admonition names and extracts titles from labels.
  - **Table Spans**: Support for `rowspan` and `colspan` in HTML output.
  - **Code Meta**: Structured parsing of code block metadata strings.
  - **Image Sizing**: URL "sugar" support (e.g., `image.png#=500x300`) for image dimensions.
- **Deeply Typed**: Built on TypeScript with full support for unist/mdast module augmentation.

## Installation

```bash
npm install @isdk/mdast-plus
# or
pnpm add @isdk/mdast-plus
```

## Basic Usage

### HTML Conversion

```typescript
import { mdast } from '@isdk/mdast-plus';

const html = await mdast(':::warning[Special Note]\nBe careful!\n:::')
  .toHTML();
// Result: <div title="Special Note" class="warning"><p>Be careful!</p></div>
```

### Image Sizing

```typescript
const html = await mdast('![Cat](cat.png#=500x300)').toHTML();
// Result: <img src="cat.png" alt="Cat" width="500" height="300">
```

### Advanced Pipeline

```typescript
const { content, assets } = await mdast(myInput)
  .data({ myGlobal: 'value' })
  .use({
    name: 'my-plugin',
    stage: 'compile',
    transform: async (tree) => {
      // transform the AST
    }
  })
  .to('html');
```

## Staged Processing

Plugins are executed based on their `stage` and `order`:

1.  **normalize** (order 0-100): Cleanup and canonicalize the tree.
2.  **compile** (order 0-100): High-level semantic transformations.
3.  **finalize** (order 0-100): Final preparation before output.

## Core Plugins Included

| Plugin | Stage | Description |
| :--- | :--- | :--- |
| `normalize-directive` | normalize | Handles aliases (`warn` -> `warning`) and extracts titles. |
| `normalize-table-span` | normalize | Migrates table cell spans to `hProperties`. |
| `extract-code-meta` | normalize | Parses `title="foo"` from code block meta. |
| `image-size` | normalize | Parses `#=WxH` from image URLs. |

## License

[MIT](./LICENSE-MIT)
