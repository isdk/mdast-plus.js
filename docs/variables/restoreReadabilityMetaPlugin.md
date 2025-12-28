[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / restoreReadabilityMetaPlugin

# Variable: restoreReadabilityMetaPlugin

> `const` **restoreReadabilityMetaPlugin**: `object`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:131](https://github.com/isdk/mdast-plus.js/blob/f87faaaa5512a2a313584cbae97a686bf2807b44/src/plugins/html-readability.ts#L131)

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
