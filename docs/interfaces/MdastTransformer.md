[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastTransformer

# Interface: MdastTransformer

Defined in: [packages/mdast-plus/src/types.ts:142](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/types.ts#L142)

Interface for transforming an mdast tree.

## Methods

### transform()

> **transform**(`tree`): `Promise`\<\{ `assets?`: [`MdastAsset`](MdastAsset.md)[]; `tree`: `Root`; \}\>

Defined in: [packages/mdast-plus/src/types.ts:147](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/types.ts#L147)

Transforms the given mdast tree.

#### Parameters

##### tree

`Root`

The Root node to transform

#### Returns

`Promise`\<\{ `assets?`: [`MdastAsset`](MdastAsset.md)[]; `tree`: `Root`; \}\>
