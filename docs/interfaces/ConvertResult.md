[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / ConvertResult

# Interface: ConvertResult\<T\>

Defined in: [packages/mdast-plus/src/types.ts:50](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/types.ts#L50)

Result of a conversion process.

## Type Parameters

### T

`T` = `string`

The type of the main content (default: string)

## Properties

### assets

> **assets**: [`MdastAsset`](MdastAsset.md)[]

Defined in: [packages/mdast-plus/src/types.ts:54](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/types.ts#L54)

Extracted assets

***

### content

> **content**: `T`

Defined in: [packages/mdast-plus/src/types.ts:52](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/types.ts#L52)

The converted content
