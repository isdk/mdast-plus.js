[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastPlugin

# Interface: MdastPlugin

Defined in: [packages/mdast-plus/src/types.ts:33](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L33)

Configuration for a plugin within the mdast-plus pipeline.
It wraps a standard unified plugin with execution metadata.

## Properties

### name?

> `optional` **name**: `string`

Defined in: [packages/mdast-plus/src/types.ts:39](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L39)

Optional name for the plugin.
Used for identification in overrides and logging.
If not provided, defaults to the plugin function's name.

***

### options?

> `optional` **options**: `any`[]

Defined in: [packages/mdast-plus/src/types.ts:46](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L46)

Arguments passed to the plugin.
MUST be an array of arguments (e.g., [optionsObject]).

***

### order?

> `optional` **order**: `number`

Defined in: [packages/mdast-plus/src/types.ts:50](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L50)

Execution priority within the same stage. Lower values run earlier.

***

### plugin

> **plugin**: `Plugin`\<`any`[], `any`, `any`\>

Defined in: [packages/mdast-plus/src/types.ts:41](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L41)

The standard unified plugin (attacher) function.

***

### stage?

> `optional` **stage**: [`PipelineStage`](../enumerations/PipelineStage.md) \| `"parse"` \| `"normalize"` \| `"compile"` \| `"finalize"` \| `"stringify"`

Defined in: [packages/mdast-plus/src/types.ts:48](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L48)

The stage in which this plugin should run.
