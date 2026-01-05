[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / ReadabilityOptions

# Interface: ReadabilityOptions

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:25](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L25)

## Properties

### fields?

> `optional` **fields**: `string`[] \| `Record`\<`string`, `string`\>

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:53](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L53)

Control the fields and names in metadata.
- If an array of strings, it acts as an allowlist (only these fields are kept).
- If an object, it maps original field names to new names. Only the keys present in the map are kept (Projection).

***

### frontmatter?

> `optional` **frontmatter**: `boolean` \| `"yaml"` \| `"toml"`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:36](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L36)

Whether to inject metadata as frontmatter.

#### Default

```ts
false
```

***

### hast?

> `optional` **hast**: `Record`\<`string`, `any`\>

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:30](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L30)

***

### jsdom?

> `optional` **jsdom**: `Record`\<`string`, `any`\>

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:29](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L29)

***

### readability?

> `optional` **readability**: `false` \| `Record`\<`string`, `any`\>

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:28](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L28)

***

### rehype-parse?

> `optional` **rehype-parse**: `Record`\<`string`, `any`\>

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:31](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L31)

***

### smartExcerpt?

> `optional` **smartExcerpt**: `boolean` \| [`SmartExcerptOptions`](SmartExcerptOptions.md)

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:47](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L47)

Whether to remove the excerpt if it is a duplicate or near-duplicate of the main content.
Useful when the content is short or the excerpt is just a subset of the content.

#### Default

```ts
true
```

***

### sourceLink?

> `optional` **sourceLink**: `boolean`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:41](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L41)

Whether to append source link at the bottom.

#### Default

```ts
false
```

***

### url?

> `optional` **url**: `string`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:27](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L27)
