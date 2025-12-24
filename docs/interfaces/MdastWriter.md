[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastWriter

# Interface: MdastWriter\<Output\>

Defined in: [packages/mdast-plus/src/types.ts:154](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/types.ts#L154)

Interface for writing an mdast tree to an output format.

## Type Parameters

### Output

`Output` = `string`

Output type (default: string)

## Methods

### write()

> **write**(`tree`, `assets?`): `Promise`\<[`ConvertResult`](ConvertResult.md)\<`Output`\>\>

Defined in: [packages/mdast-plus/src/types.ts:160](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/types.ts#L160)

Writes the mdast tree to the target output.

#### Parameters

##### tree

`Root`

The Root node to write

##### assets?

[`MdastAsset`](MdastAsset.md)[]

Optional assets to include

#### Returns

`Promise`\<[`ConvertResult`](ConvertResult.md)\<`Output`\>\>
