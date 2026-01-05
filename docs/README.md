**@isdk/mdast-plus**

***

# @isdk/mdast-plus

> A "Semantic-First" Markdown processing toolkit based on unified, remark and rehype.

English | [简体中文](_media/README.cn.md) | [GitHub](https://github.com/isdk/mdast-plus.js)

[![NPM version](https://img.shields.io/npm/v/@isdk/mdast-plus.svg)](https://www.npmjs.com/package/@isdk/mdast-plus)

`@isdk/mdast-plus` is a powerful extension to the unified ecosystem, designed to provide consistent, semantic-first normalization and transformation of Markdown content. It simplifies complex processing pipelines with a fluent API and a staged plugin system.

## Features

- **Fluent API**: Chainable interface `mdast(input).use(plugin).toHTML()`.
- **Staged Plugins**: Organize transformations into `parse`, `normalize`, `compile`, `finalize`, and `stringify` stages.
- **Semantic Normalization**:
  - **Directives**: Canonicalizes admonition names and extracts titles from labels.
  - **Table Spans**: Support for `rowspan` and `colspan` in HTML output.
  - **Code Meta**: Structured parsing of code block metadata strings.
  - **Image Sizing**: URL "sugar" support (e.g., `image.png#=500x300`) for image dimensions.
  - **Inline Styles**: Built-in support for `==Highlight==`, `~Subscript~`, and `^Superscript^`.
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

### Configure Input Options

You can pass options to input plugins (like `remark-gfm` or `remark-parse`) using the second argument of `.from()`:

```typescript
// Enable single tilde strikethrough (~text~)
const md = await mdast('Hello ~world~')
  .from('markdown', { remarkGfm: { singleTilde: true } })
  .toMarkdown();
```

### Image Sizing

```typescript
const html = await mdast('![Cat](cat.png#=500x300)').toHTML();
// Result: <img src="cat.png" alt="Cat" width="500" height="300">
```

### AST Output

```typescript
// Get the fully processed AST (after normalization)
const ast = await mdast('==Highlighted==').toAST();

// Get the raw AST (after parsing, before normalization)
const rawAst = await mdast('==Highlighted==').toAST({ stage: 'parse' });
```

### Partial Execution & Debugging

You can stop the pipeline at any stage to inspect the intermediate AST, even when targeting a specific output format like `html` or `markdown`.

```typescript
// Run 'markdown' pipeline but stop after 'parse' stage
// Returns the VFile with the AST at that point
const vfile = await mdast(input).to('markdown', { stage: 'parse' });
const ast = vfile.result; 
```

### Runtime Overrides

You can override plugin options at the moment of execution using the `overrides` option in `.to()`. This is useful for adjusting behavior dynamically without rebuilding the pipeline.

```typescript
await mdast(input)
  .use({ name: 'myPlugin', plugin: myPlugin, options: [{ foo: 'bar' }] }) // Default option
  .to('html', {
    overrides: {
      myPlugin: { foo: 'baz' } // Override for this run only
    }
  });
```

### Advanced Pipeline

```typescript
import { htmlReadabilityPlugins } from '@isdk/mdast-plus';

const vfile = await mdast(myInput)
  .data({ myGlobal: 'value' })
  // Add multiple plugins as an array at the 'compile' stage
  .use([pluginA, pluginB])
  // Or add a set of plugins at a specific stage with options
  .useAt('parse', htmlReadabilityPlugins, { 
    url: 'https://example.com/article',
    frontmatter: true, // Inject metadata as YAML frontmatter
    sourceLink: true     // Append source link at the bottom
  })
  .priority(10) // Run later than default plugins
  .to('markdown');

console.log(vfile.value); // The serialized Markdown with frontmatter
```

### Plugin Behavior

`mdast-plus` uses [unified](https://github.com/unifiedjs/unified) internally. If you add the same plugin function multiple times, the last configuration **overrides** the previous ones.

> **Warning**: Passing `false` as a plugin option (e.g., `.use(myPlugin, false)`) will **disable** the plugin entirely. For regular plugins, this means they simply won't run. For plugins marked as `main: true` (like replacements for the default parser), if they are disabled with `false`, they will **not** replace the default plugin of that stage, providing a safe fallback to the default behavior. If you want to bypass a plugin's logic while keeping it active (e.g. to maintain its parser), use an options object like `{ enable: false }` instead.

```typescript
// The plugin will run ONCE with option: 2
pipeline.use(myPlugin, { option: 1 });
pipeline.use(myPlugin, { option: 2 });
```

To run the same plugin logic multiple times (e.g., for different purposes), provide a distinct function reference:

```typescript
// The plugin will run TWICE
pipeline.use(myPlugin, { option: 1 });
pipeline.use(myPlugin.bind({}), { option: 2 });
```

### Arbitrary Formats

You can register custom input or output formats:

```typescript
import { MdastPipeline, mdast, PipelineStage } from '@isdk/mdast-plus';

// Register a custom output format
MdastPipeline.register({
  id: 'reverse',
  output: [{
    plugin: function() {
      this.Compiler = (tree) => {
        // your custom stringification logic
        return '...';
      };
    },
    stage: PipelineStage.stringify
  }]
});

const result = await mdast('Hello').to('reverse');
```

> **Note**: Format names are case-insensitive (always converted to lowercase internally).

## Staged Processing

Plugins are executed based on their `stage`, `order`, and semantic constraints (`before`/`after`):

1.  **parse** (0): Input parsing (e.g., `remark-parse`).
2.  **normalize** (100): Cleanup and canonicalize the tree.
3.  **compile** (200): High-level semantic transformations.
4.  **finalize** (300): Final preparation before output (e.g. `rehype-sanitize`).
5.  **stringify** (400): Output generation.

### Main Plugin Replacement

Each stage can have one "main" plugin. If a plugin is marked with `main: true`, it will **replace** the first plugin in that same stage. This is useful for swapping out default parsers or compilers while keeping the rest of the pipeline intact.

> **Note**: Only one main plugin is allowed per stage. If multiple plugins are marked as main, only the last one defined will take effect as the replacement.

## Core Plugins Included

| Plugin | Stage | Description |
| :--- | :--- | :--- |
| `normalize-directive` | normalize | Handles aliases (`warn` -> `warning`) and extracts titles. |
| `normalize-table-span` | normalize | Migrates table cell spans to `hProperties`. |
| `extract-code-meta` | normalize | Parses `title="foo"` from code block meta. |
| `image-size` | normalize | Parses `#=WxH` from image URLs. |
| `normalize-inline-styles` | normalize | Standardizes `==mark==`, `~sub~`, and `^sup^`. |
| `html-readability` | parse | Uses Mozilla's Readability to extract main content from HTML. Supports `frontmatter` injection, `sourceLink` (source link) footer, and `smartExcerpt` for intelligent summary management. Use `htmlReadabilityPlugins` array for easier setup. |

### html-readability Options

- `url`: (string) The URL of the HTML document.
- `frontmatter`: (boolean | 'yaml' | 'toml') Whether to inject metadata as frontmatter. Default: `false`.
- `sourceLink`: (boolean) Whether to append source link at the bottom. The link will be generated based on the original title/URL even if they are filtered or renamed in the `fields` option. Default: `false`.
- `fields`: (string[] | object) Control which metadata fields are kept or how they are renamed. 
  - If an array: acts as an allowlist (e.g., `['title', 'excerpt']`).
  - If an object: maps original keys to new names (e.g., `{ title: 'headline' }`). Only keys in the map are kept (Projection).
- `extraMetadata`: (object) Extra key-value pairs to inject into the frontmatter. These will be merged with the readability metadata.
- `smartExcerpt`: (boolean | object) Whether to remove the excerpt if it is a duplicate or near-duplicate of the main content. Default: `true`.
  - `threshold`: (number) The ratio of excerpt length to content length (0.0 to 1.0). Default: `0.6`.
  - `minContentLength`: (number) Minimum length of the main content required to keep the excerpt. Default: `300`.

## Contributing

Please see [CONTRIBUTING.md](_media/CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

[MIT](_media/LICENSE-MIT)
