[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / SmartExcerptOptions

# Interface: SmartExcerptOptions

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:11](https://github.com/isdk/mdast-plus.js/blob/6a398ff355b39ed17183d5afad29bd4ca7551ec6/src/plugins/html-readability.ts#L11)

## Properties

### minContentLength?

> `optional` **minContentLength**: `number`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:23](https://github.com/isdk/mdast-plus.js/blob/6a398ff355b39ed17183d5afad29bd4ca7551ec6/src/plugins/html-readability.ts#L23)

The minimum length of the main content required to keep the excerpt.
If content length is less than this value, the excerpt is considered redundant (if it is contained in the content).

#### Default

```ts
300
```

***

### threshold?

> `optional` **threshold**: `number`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:17](https://github.com/isdk/mdast-plus.js/blob/6a398ff355b39ed17183d5afad29bd4ca7551ec6/src/plugins/html-readability.ts#L17)

The threshold ratio of excerpt length to content length.
If (excerptLength / contentLength) > threshold, the excerpt is considered redundant.

#### Default

```ts
0.6
```
