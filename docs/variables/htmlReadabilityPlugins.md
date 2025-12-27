[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / htmlReadabilityPlugins

# Variable: htmlReadabilityPlugins

> `const` **htmlReadabilityPlugins**: (\{ `main`: `boolean`; `name`: `string`; `plugin`: `Plugin`\<\[[`ReadabilityOptions`](../interfaces/ReadabilityOptions.md)?\], `string`, `Root`\>; `stage`: [`PipelineStage`](../enumerations/PipelineStage.md); \} \| \{ `after`: `string`; `name`: `string`; `plugin`: () => (`tree`, `file`) => `void`; `stage`: [`PipelineStage`](../enumerations/PipelineStage.md); \})[]

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:106](https://github.com/isdk/mdast-plus.js/blob/becb4bdeb4b577bd75c7751367751e84056ff87e/src/plugins/html-readability.ts#L106)

Combined plugins for HTML readability.
