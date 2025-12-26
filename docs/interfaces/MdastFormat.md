[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastFormat

# Interface: MdastFormat

Defined in: [packages/mdast-plus/src/types.ts:56](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L56)

Defines a document format, encompassing its input (parsing) and output (serialization) strategies.

## Properties

### extensions?

> `optional` **extensions**: `string`[]

Defined in: [packages/mdast-plus/src/types.ts:62](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L62)

File extensions associated with this format.

***

### id

> **id**: `string`

Defined in: [packages/mdast-plus/src/types.ts:58](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L58)

Unique identifier for the format (e.g., 'markdown', 'html').

***

### input?

> `optional` **input**: [`MdastPlugin`](MdastPlugin.md)[]

Defined in: [packages/mdast-plus/src/types.ts:67](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L67)

Plugins used for reading this format into a standard AST (Parser + Normalizer).

***

### mediaTypes?

> `optional` **mediaTypes**: `string`[]

Defined in: [packages/mdast-plus/src/types.ts:64](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L64)

MIME types associated with this format.

***

### output?

> `optional` **output**: [`MdastPlugin`](MdastPlugin.md)[]

Defined in: [packages/mdast-plus/src/types.ts:70](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L70)

Plugins used for serializing the AST into this format (Finalizer + Stringifier).

***

### title?

> `optional` **title**: `string`

Defined in: [packages/mdast-plus/src/types.ts:60](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L60)

Human-readable title.
