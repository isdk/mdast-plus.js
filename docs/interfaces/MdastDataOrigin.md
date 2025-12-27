[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastDataOrigin

# Interface: MdastDataOrigin

Defined in: [packages/mdast-plus/src/types.ts:86](https://github.com/isdk/mdast-plus.js/blob/becb4bdeb4b577bd75c7751367751e84056ff87e/src/types.ts#L86)

Metadata capturing the origin of a node during conversion.

## Indexable

\[`k`: `string`\]: `unknown`

## Properties

### format

> **format**: `string`

Defined in: [packages/mdast-plus/src/types.ts:88](https://github.com/isdk/mdast-plus.js/blob/becb4bdeb4b577bd75c7751367751e84056ff87e/src/types.ts#L88)

The original source format.

***

### hash?

> `optional` **hash**: `string`

Defined in: [packages/mdast-plus/src/types.ts:92](https://github.com/isdk/mdast-plus.js/blob/becb4bdeb4b577bd75c7751367751e84056ff87e/src/types.ts#L92)

Hash used for caching or change detection.

***

### raw?

> `optional` **raw**: `unknown`

Defined in: [packages/mdast-plus/src/types.ts:90](https://github.com/isdk/mdast-plus.js/blob/becb4bdeb4b577bd75c7751367751e84056ff87e/src/types.ts#L90)

The raw content from the source before conversion.
