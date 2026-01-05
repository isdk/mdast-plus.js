[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / htmlReadabilityPlugins

# Variable: htmlReadabilityPlugins

> `const` **htmlReadabilityPlugins**: (\{ `main`: `boolean`; `name`: `string`; `plugin`: `Plugin`\<\[[`ReadabilityOptions`](../interfaces/ReadabilityOptions.md)?\], `string`, `Root`\>; `stage`: [`PipelineStage`](../enumerations/PipelineStage.md); \} \| \{ `after`: `string`; `name`: `string`; `plugin`: (`options?`) => (`tree`, `file`) => `void`; `stage`: [`PipelineStage`](../enumerations/PipelineStage.md); \})[]

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:277](https://github.com/isdk/mdast-plus.js/blob/fc889343b0a625d8edbf2036c3e25b676d1bf163/src/plugins/html-readability.ts#L277)

Combined plugins for HTML readability.
