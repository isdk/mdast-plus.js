[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastFormatDefinition

# Interface: MdastFormatDefinition

Defined in: [packages/mdast-plus/src/types.ts:27](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/types.ts#L27)

Definition for an mdast format (parser/stringifier).

## Properties

### parse()?

> `optional` **parse**: (`processor`) => `void`

Defined in: [packages/mdast-plus/src/types.ts:29](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/types.ts#L29)

Function to register parser plugins

#### Parameters

##### processor

`any`

#### Returns

`void`

***

### stringify()?

> `optional` **stringify**: (`processor`) => `void`

Defined in: [packages/mdast-plus/src/types.ts:31](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/types.ts#L31)

Function to register stringifier plugins

#### Parameters

##### processor

`any`

#### Returns

`void`
