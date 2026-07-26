[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / restoreReadabilityMetaPlugin

# Variable: restoreReadabilityMetaPlugin

> `const` **restoreReadabilityMetaPlugin**: `object`

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:230](https://github.com/isdk/mdast-plus.js/blob/ad2fd92de22e26739779fb84d9a8b23a9076c4be/src/plugins/html-readability.ts#L230)

Plugin to restore readability metadata after HAST to MDAST conversion.

## Type Declaration

### after

> **after**: `string` = `'rehype-remark'`

### name

> **name**: `string` = `'restore-readability-meta'`

### plugin

> **plugin**: (`options?`) => (`tree`, `file`) => `void`

#### Parameters

##### options?

[`ReadabilityOptions`](../interfaces/ReadabilityOptions.md)

#### Returns

(`tree`, `file`) => `void`

### stage

> **stage**: [`PipelineStage`](../enumerations/PipelineStage.md) = `PipelineStage.parse`
