[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / htmlReadabilityPlugins

# Variable: htmlReadabilityPlugins

> `const` **htmlReadabilityPlugins**: (\{ `main`: `boolean`; `name`: `string`; `plugin`: `Plugin`\<\[[`ReadabilityOptions`](../interfaces/ReadabilityOptions.md)?\], `string`, `Root`\>; `stage`: [`PipelineStage`](../enumerations/PipelineStage.md); \} \| \{ `after`: `string`; `name`: `string`; `plugin`: (`options?`) => (`tree`, `file`) => `void`; `stage`: [`PipelineStage`](../enumerations/PipelineStage.md); \})[]

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:192](https://github.com/isdk/mdast-plus.js/blob/fb690626024343866805f4e55a09e901ff9d4a09/src/plugins/html-readability.ts#L192)

Combined plugins for HTML readability.
