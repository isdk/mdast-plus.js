[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / ReadabilityOptions

# Interface: ReadabilityOptions

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:26](https://github.com/isdk/mdast-plus.js/blob/5a6a4660c9e58c3f1962ac06703980775afb9c70/src/plugins/html-readability.ts#L26)

## Properties

### extraMetadata?

> `optional` **extraMetadata**: `Record`\<`string`, `any`\>

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:59](https://github.com/isdk/mdast-plus.js/blob/5a6a4660c9e58c3f1962ac06703980775afb9c70/src/plugins/html-readability.ts#L59)

Extra key-value pairs to inject into the frontmatter.
These will be merged with the readability metadata.

***

### fields?

> `optional` **fields**: `string`[] \| `Record`\<`string`, `string`\>

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:54](https://github.com/isdk/mdast-plus.js/blob/5a6a4660c9e58c3f1962ac06703980775afb9c70/src/plugins/html-readability.ts#L54)

Control the fields and names in metadata.
- If an array of strings, it acts as an allowlist (only these fields are kept).
- If an object, it maps original field names to new names. Only the keys present in the map are kept (Projection).

***

### frontmatter?

> `optional` **frontmatter**: `boolean` \| `"yaml"` \| `"toml"`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:37](https://github.com/isdk/mdast-plus.js/blob/5a6a4660c9e58c3f1962ac06703980775afb9c70/src/plugins/html-readability.ts#L37)

Whether to inject metadata as frontmatter.

#### Default

```ts
false
```

***

### hast?

> `optional` **hast**: `Record`\<`string`, `any`\>

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:31](https://github.com/isdk/mdast-plus.js/blob/5a6a4660c9e58c3f1962ac06703980775afb9c70/src/plugins/html-readability.ts#L31)

***

### jsdom?

> `optional` **jsdom**: `Record`\<`string`, `any`\>

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:30](https://github.com/isdk/mdast-plus.js/blob/5a6a4660c9e58c3f1962ac06703980775afb9c70/src/plugins/html-readability.ts#L30)

***

### readability?

> `optional` **readability**: `false` \| `Record`\<`string`, `any`\>

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:29](https://github.com/isdk/mdast-plus.js/blob/5a6a4660c9e58c3f1962ac06703980775afb9c70/src/plugins/html-readability.ts#L29)

***

### rehype-parse?

> `optional` **rehype-parse**: `Record`\<`string`, `any`\>

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:32](https://github.com/isdk/mdast-plus.js/blob/5a6a4660c9e58c3f1962ac06703980775afb9c70/src/plugins/html-readability.ts#L32)

***

### smartExcerpt?

> `optional` **smartExcerpt**: `boolean` \| [`SmartExcerptOptions`](SmartExcerptOptions.md)

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:48](https://github.com/isdk/mdast-plus.js/blob/5a6a4660c9e58c3f1962ac06703980775afb9c70/src/plugins/html-readability.ts#L48)

Whether to remove the excerpt if it is a duplicate or near-duplicate of the main content.
Useful when the content is short or the excerpt is just a subset of the content.

#### Default

```ts
true
```

***

### sourceLink?

> `optional` **sourceLink**: `boolean`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:42](https://github.com/isdk/mdast-plus.js/blob/5a6a4660c9e58c3f1962ac06703980775afb9c70/src/plugins/html-readability.ts#L42)

Whether to append source link at the bottom.

#### Default

```ts
false
```

***

### url?

> `optional` **url**: `string`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:28](https://github.com/isdk/mdast-plus.js/blob/5a6a4660c9e58c3f1962ac06703980775afb9c70/src/plugins/html-readability.ts#L28)
