[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / htmlReadabilityPlugins

# Variable: htmlReadabilityPlugins

> `const` **htmlReadabilityPlugins**: (\{ `main`: `boolean`; `name`: `string`; `plugin`: `Plugin`\<\[[`ReadabilityOptions`](../interfaces/ReadabilityOptions.md)?\], `string`, `Root`\>; `stage`: [`PipelineStage`](../enumerations/PipelineStage.md); \} \| \{ `after`: `string`; `name`: `string`; `plugin`: () => (`tree`, `file`) => `void`; `stage`: [`PipelineStage`](../enumerations/PipelineStage.md); \})[]

Defined in: [packages/mdast-plus/src/plugins/html-readability.ts:146](https://github.com/isdk/mdast-plus.js/blob/f87faaaa5512a2a313584cbae97a686bf2807b44/src/plugins/html-readability.ts#L146)

Combined plugins for HTML readability.
