[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / SmartExcerptOptions

# Interface: SmartExcerptOptions

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:10](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L10)

## Properties

### minContentLength?

> `optional` **minContentLength**: `number`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:22](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L22)

The minimum length of the main content required to keep the excerpt.
If content length is less than this value, the excerpt is considered redundant (if it is contained in the content).

#### Default

```ts
300
```

***

### threshold?

> `optional` **threshold**: `number`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:16](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L16)

The threshold ratio of excerpt length to content length.
If (excerptLength / contentLength) > threshold, the excerpt is considered redundant.

#### Default

```ts
0.6
```
