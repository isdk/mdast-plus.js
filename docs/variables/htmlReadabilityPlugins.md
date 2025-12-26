[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / htmlReadabilityPlugins

# Variable: htmlReadabilityPlugins

> `const` **htmlReadabilityPlugins**: (\{ `name`: `string`; `plugin`: `Plugin`\<\[(`boolean` \| [`ReadabilityOptions`](../interfaces/ReadabilityOptions.md))?\], `string`, `Root`\>; `stage`: [`PipelineStage`](../enumerations/PipelineStage.md); \} \| \{ `after`: `string`; `name`: `string`; `plugin`: () => (`tree`, `file`) => `void`; `stage`: [`PipelineStage`](../enumerations/PipelineStage.md); \})[]

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:103](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/plugins/html-readability.ts#L103)

Combined plugins for HTML readability.
