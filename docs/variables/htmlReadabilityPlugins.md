[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / htmlReadabilityPlugins

# Variable: htmlReadabilityPlugins

> `const` **htmlReadabilityPlugins**: (\{ `main`: `boolean`; `name`: `string`; `plugin`: `Plugin`\<\[[`ReadabilityOptions`](../interfaces/ReadabilityOptions.md)?\], `string`, `Root`\>; `stage`: [`PipelineStage`](../enumerations/PipelineStage.md); \} \| \{ `after`: `string`; `name`: `string`; `plugin`: (`options?`) => (`tree`, `file`) => `void`; `stage`: [`PipelineStage`](../enumerations/PipelineStage.md); \})[]

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:281](https://github.com/isdk/mdast-plus.js/blob/2ea5365f4aab848bca73b551726e0ff0a97d2d6c/src/plugins/html-readability.ts#L281)

Combined plugins for HTML readability.
