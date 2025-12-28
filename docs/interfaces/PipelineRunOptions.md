[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / PipelineRunOptions

# Interface: PipelineRunOptions

Defined in: [packages/mdast-plus/src/types.ts:86](https://github.com/isdk/mdast-plus.js/blob/f87faaaa5512a2a313584cbae97a686bf2807b44/src/types.ts#L86)

Options for controlling the pipeline execution.

## Properties

### overrides?

> `optional` **overrides**: `Record`\<`string`, `any`\>

Defined in: [packages/mdast-plus/src/types.ts:101](https://github.com/isdk/mdast-plus.js/blob/f87faaaa5512a2a313584cbae97a686bf2807b44/src/types.ts#L101)

Map of plugin names to their option overrides.

***

### stage?

> `optional` **stage**: [`PipelineStage`](../enumerations/PipelineStage.md) \| `"parse"` \| `"normalize"` \| `"compile"` \| `"finalize"` \| `"stringify"`

Defined in: [packages/mdast-plus/src/types.ts:91](https://github.com/isdk/mdast-plus.js/blob/f87faaaa5512a2a313584cbae97a686bf2807b44/src/types.ts#L91)

Run the pipeline only up to the specified stage.
Useful for debugging or inspecting intermediate ASTs.

***

### stopAtIndex?

> `optional` **stopAtIndex**: `number`

Defined in: [packages/mdast-plus/src/types.ts:97](https://github.com/isdk/mdast-plus.js/blob/f87faaaa5512a2a313584cbae97a686bf2807b44/src/types.ts#L97)

If `stage` is specified, stop execution at this index (0-based)
within the list of plugins at that stage.
Defaults to 0 (the first plugin).
