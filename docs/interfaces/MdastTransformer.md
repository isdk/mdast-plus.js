[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastTransformer

# Interface: MdastTransformer

Defined in: [packages/mdast-plus/src/types.ts:142](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/types.ts#L142)

Interface for transforming an mdast tree.

## Methods

### transform()

> **transform**(`tree`): `Promise`\<\{ `assets?`: [`MdastAsset`](MdastAsset.md)[]; `tree`: `Root`; \}\>

Defined in: [packages/mdast-plus/src/types.ts:147](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/types.ts#L147)

Transforms the given mdast tree.

#### Parameters

##### tree

`Root`

The Root node to transform

#### Returns

`Promise`\<\{ `assets?`: [`MdastAsset`](MdastAsset.md)[]; `tree`: `Root`; \}\>
