[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastPlugin

# Interface: MdastPlugin

Defined in: [packages/mdast-plus/src/types.ts:13](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/types.ts#L13)

Definition for an mdast plugin.

## Properties

### name

> **name**: `string`

Defined in: [packages/mdast-plus/src/types.ts:15](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/types.ts#L15)

Plugin name

***

### order?

> `optional` **order**: `number`

Defined in: [packages/mdast-plus/src/types.ts:19](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/types.ts#L19)

Execution order within the stage (lower numbers run first)

***

### stage?

> `optional` **stage**: [`Stage`](../type-aliases/Stage.md)

Defined in: [packages/mdast-plus/src/types.ts:17](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/types.ts#L17)

Processing stage the plugin belongs to

***

### transform()

> **transform**: (`tree`, `ctx`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/mdast-plus/src/types.ts:21](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/types.ts#L21)

Transformation function

#### Parameters

##### tree

`Root`

##### ctx

`any`

#### Returns

`void` \| `Promise`\<`void`\>
