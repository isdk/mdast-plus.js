[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastDataOrigin

# Interface: MdastDataOrigin

Defined in: [packages/mdast-plus/src/types.ts:107](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/types.ts#L107)

Metadata capturing the origin of a node during conversion.

## Indexable

\[`k`: `string`\]: `unknown`

## Properties

### format

> **format**: `string`

Defined in: [packages/mdast-plus/src/types.ts:109](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/types.ts#L109)

The original source format.

***

### hash?

> `optional` **hash**: `string`

Defined in: [packages/mdast-plus/src/types.ts:113](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/types.ts#L113)

Hash used for caching or change detection.

***

### raw?

> `optional` **raw**: `unknown`

Defined in: [packages/mdast-plus/src/types.ts:111](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/types.ts#L111)

The raw content from the source before conversion.
