[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastFormat

# Interface: MdastFormat

Defined in: [packages/mdast-plus/src/types.ts:66](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/types.ts#L66)

Defines a document format, encompassing its input (parsing) and output (serialization) strategies.

## Properties

### extensions?

> `optional` **extensions**: `string`[]

Defined in: [packages/mdast-plus/src/types.ts:72](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/types.ts#L72)

File extensions associated with this format.

***

### id

> **id**: `string`

Defined in: [packages/mdast-plus/src/types.ts:68](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/types.ts#L68)

Unique identifier for the format (e.g., 'markdown', 'html').

***

### input?

> `optional` **input**: [`MdastPlugin`](MdastPlugin.md)[]

Defined in: [packages/mdast-plus/src/types.ts:77](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/types.ts#L77)

Plugins used for reading this format into a standard AST (Parser + Normalizer).

***

### mediaTypes?

> `optional` **mediaTypes**: `string`[]

Defined in: [packages/mdast-plus/src/types.ts:74](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/types.ts#L74)

MIME types associated with this format.

***

### output?

> `optional` **output**: [`MdastPlugin`](MdastPlugin.md)[]

Defined in: [packages/mdast-plus/src/types.ts:80](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/types.ts#L80)

Plugins used for serializing the AST into this format (Finalizer + Stringifier).

***

### title?

> `optional` **title**: `string`

Defined in: [packages/mdast-plus/src/types.ts:70](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/types.ts#L70)

Human-readable title.
