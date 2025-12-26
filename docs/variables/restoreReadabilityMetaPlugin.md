[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / restoreReadabilityMetaPlugin

# Variable: restoreReadabilityMetaPlugin

> `const` **restoreReadabilityMetaPlugin**: `object`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:88](https://github.com/isdk/mdast-plus.js/blob/2e4b3f4f8f9f2537173553e02c79170d79418c86/src/plugins/html-readability.ts#L88)

Plugin to restore readability metadata after HAST to MDAST conversion.

## Type Declaration

### after

> **after**: `string` = `'rehype-remark'`

### name

> **name**: `string` = `'restore-readability-meta'`

### plugin()

> **plugin**: () => (`tree`, `file`) => `void`

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
