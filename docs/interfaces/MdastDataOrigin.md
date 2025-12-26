[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastDataOrigin

# Interface: MdastDataOrigin

Defined in: [packages/mdast-plus/src/types.ts:76](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L76)

Metadata capturing the origin of a node during conversion.

## Indexable

\[`k`: `string`\]: `unknown`

## Properties

### format

> **format**: `string`

Defined in: [packages/mdast-plus/src/types.ts:78](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L78)

The original source format.

***

### hash?

> `optional` **hash**: `string`

Defined in: [packages/mdast-plus/src/types.ts:82](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L82)

Hash used for caching or change detection.

***

### raw?

> `optional` **raw**: `unknown`

Defined in: [packages/mdast-plus/src/types.ts:80](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L80)

The raw content from the source before conversion.
