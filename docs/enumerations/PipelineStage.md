[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / PipelineStage

# Enumeration: PipelineStage

Defined in: [packages/mdast-plus/src/types.ts:10](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/types.ts#L10)

PipelineStage defines the execution order of plugins in the processing pipeline.
Plugins are sorted and executed in ascending order based on these stage values.

## Enumeration Members

### compile

> **compile**: `200`

Defined in: [packages/mdast-plus/src/types.ts:16](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/types.ts#L16)

Transformation stage for semantic changes and custom high-level logic.

***

### finalize

> **finalize**: `300`

Defined in: [packages/mdast-plus/src/types.ts:18](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/types.ts#L18)

Finalization stage for preparing the AST for output (e.g., Sanitize, bridge to HAST).

***

### normalize

> **normalize**: `100`

Defined in: [packages/mdast-plus/src/types.ts:14](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/types.ts#L14)

Normalization stage for cleaning up and canonicalizing the AST (e.g., GFM, Directives).

***

### parse

> **parse**: `0`

Defined in: [packages/mdast-plus/src/types.ts:12](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/types.ts#L12)

Initial stage for parsing raw input (e.g., string to AST).

***

### stringify

> **stringify**: `400`

Defined in: [packages/mdast-plus/src/types.ts:20](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/types.ts#L20)

Final stage for serializing the AST to the target format result.
