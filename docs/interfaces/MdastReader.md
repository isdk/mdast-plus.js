[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastReader

# Interface: MdastReader\<I\>

Defined in: [packages/mdast-plus/src/types.ts:131](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/types.ts#L131)

Interface for reading input into an mdast tree.

## Type Parameters

### I

`I`

Input type

## Methods

### read()

> **read**(`input`): `Promise`\<`Root`\>

Defined in: [packages/mdast-plus/src/types.ts:136](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/types.ts#L136)

Reads input and returns an mdast Root node.

#### Parameters

##### input

`I`

The input to read

#### Returns

`Promise`\<`Root`\>
