[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / restoreReadabilityMetaPlugin

# Variable: restoreReadabilityMetaPlugin

> `const` **restoreReadabilityMetaPlugin**: `object`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:240](https://github.com/isdk/mdast-plus.js/blob/52d1ca889a60b0073e2ea9d89beea6e3ef7680a2/src/plugins/html-readability.ts#L240)

Plugin to restore readability metadata after HAST to MDAST conversion.

## Type Declaration

### after

> **after**: `string` = `'rehype-remark'`

### name

> **name**: `string` = `'restore-readability-meta'`

### plugin()

> **plugin**: (`options?`) => (`tree`, `file`) => `void`

#### Parameters

##### options?

[`ReadabilityOptions`](../interfaces/ReadabilityOptions.md)

#### Returns

> (`tree`, `file`): `void`

##### Parameters

###### tree

`any`

###### file

`any`

##### Returns

`void`

### stage

> **stage**: [`PipelineStage`](../enumerations/PipelineStage.md) = `PipelineStage.parse`
