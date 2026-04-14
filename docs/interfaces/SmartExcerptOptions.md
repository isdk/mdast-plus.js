[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / SmartExcerptOptions

# Interface: SmartExcerptOptions

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:13](https://github.com/isdk/mdast-plus.js/blob/2ea5365f4aab848bca73b551726e0ff0a97d2d6c/src/plugins/html-readability.ts#L13)

## Properties

### minContentLength?

> `optional` **minContentLength**: `number`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:25](https://github.com/isdk/mdast-plus.js/blob/2ea5365f4aab848bca73b551726e0ff0a97d2d6c/src/plugins/html-readability.ts#L25)

The minimum length of the main content required to keep the excerpt.
If content length is less than this value, the excerpt is considered redundant (if it is contained in the content).

#### Default

```ts
300
```

***

### threshold?

> `optional` **threshold**: `number`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:19](https://github.com/isdk/mdast-plus.js/blob/2ea5365f4aab848bca73b551726e0ff0a97d2d6c/src/plugins/html-readability.ts#L19)

The threshold ratio of excerpt length to content length.
If (excerptLength / contentLength) > threshold, the excerpt is considered redundant.

#### Default

```ts
0.6
```
