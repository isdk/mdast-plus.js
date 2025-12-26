[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastBasePipeline

# Class: MdastBasePipeline

Defined in: [packages/mdast-plus/src/pipeline.ts:26](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L26)

Base implementation of the fluent mdast processing pipeline.
Manages the plugin registry and the execution queue.

## Extended by

- [`MdastPipeline`](MdastPipeline.md)

## Constructors

### Constructor

> **new MdastBasePipeline**(`input`): `MdastBasePipeline`

Defined in: [packages/mdast-plus/src/pipeline.ts:53](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L53)

Initializes a new pipeline instance with the given input.

#### Parameters

##### input

`Compatible`

Content to process (string, Buffer, VFile, or AST Node).

#### Returns

`MdastBasePipeline`

## Properties

### input

> `protected` **input**: `Compatible`

Defined in: [packages/mdast-plus/src/pipeline.ts:46](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L46)

***

### queue

> `protected` **queue**: [`MdastPlugin`](../interfaces/MdastPlugin.md)[] = `[]`

Defined in: [packages/mdast-plus/src/pipeline.ts:47](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L47)

## Methods

### assembleProcessor()

> `protected` **assembleProcessor**(`queue`): `Processor`

Defined in: [packages/mdast-plus/src/pipeline.ts:254](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L254)

Assembles a unified processor based on the sorted plugin queue.

#### Parameters

##### queue

[`MdastPlugin`](../interfaces/MdastPlugin.md)[]

#### Returns

`Processor`

***

### ensureInputPlugins()

> `protected` **ensureInputPlugins**(`queue`, `overrides?`, `maxStage?`): `void`

Defined in: [packages/mdast-plus/src/pipeline.ts:123](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L123)

Ensures that input plugins (parser, normalizers) are present in the queue.
Adds implicit plugins if no parser is detected.

#### Parameters

##### queue

[`MdastPlugin`](../interfaces/MdastPlugin.md)[]

##### overrides?

`Record`\<`string`, `any`\>

##### maxStage?

[`PipelineStage`](../enumerations/PipelineStage.md) = `PipelineStage.stringify`

#### Returns

`void`

***

### from()

> **from**(`fmt`, `overrides?`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:152](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L152)

Configures the input format and adds its associated plugins to the pipeline.

#### Parameters

##### fmt

Format ID or definition.

`string` | [`MdastFormat`](../interfaces/MdastFormat.md)

##### overrides?

`Record`\<`string`, `any`\>

Optional map to override plugin options by plugin name.

#### Returns

`this`

The pipeline instance for chaining.

***

### getFormat()

> **getFormat**(`id`): `undefined` \| [`MdastFormat`](../interfaces/MdastFormat.md)

Defined in: [packages/mdast-plus/src/pipeline.ts:60](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L60)

Instance-level access to the global format registry.

#### Parameters

##### id

`string`

#### Returns

`undefined` \| [`MdastFormat`](../interfaces/MdastFormat.md)

***

### priority()

> **priority**(`order`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:242](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L242)

Sets the priority order for the most recently added plugin.
Plugins with lower order run earlier within the same stage.

#### Parameters

##### order

`number`

Numeric priority.

#### Returns

`this`

The pipeline instance for chaining.

***

### to()

> **to**(`fmt`, `overrides?`): `Promise`\<`VFile`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:172](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L172)

Processes the pipeline and serializes the result into the specified format.

#### Parameters

##### fmt

Target format ID or definition.

`string` | [`MdastFormat`](../interfaces/MdastFormat.md)

##### overrides?

`Record`\<`string`, `any`\>

Optional map to override plugin options.

#### Returns

`Promise`\<`VFile`\>

A promise resolving to a VFile containing the result.

***

### toRuntimeEntry()

> `protected` **toRuntimeEntry**(`entry`, `defaultStage`, `overrides?`): [`MdastPlugin`](../interfaces/MdastPlugin.md) & `object`

Defined in: [packages/mdast-plus/src/pipeline.ts:84](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L84)

Normalizes a plugin entry for runtime execution.

#### Parameters

##### entry

[`MdastPlugin`](../interfaces/MdastPlugin.md)

##### defaultStage

[`PipelineStage`](../enumerations/PipelineStage.md)

##### overrides?

`Record`\<`string`, `any`\>

#### Returns

[`MdastPlugin`](../interfaces/MdastPlugin.md) & `object`

***

### use()

> **use**(`plugin`, ...`options`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:215](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L215)

Adds a plugin to the pipeline's compile stage.

#### Parameters

##### plugin

`any`

The unified plugin function.

##### options

...`any`[]

Arguments for the plugin.

#### Returns

`this`

The pipeline instance for chaining.

***

### useAt()

> **useAt**(`stage`, `plugin`, ...`options`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:226](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L226)

Adds a plugin to the pipeline at a specific stage.

#### Parameters

##### stage

The stage name or numeric value.

`"parse"` | `"normalize"` | `"compile"` | `"finalize"` | `"stringify"`

##### plugin

`any`

The unified plugin function.

##### options

...`any`[]

Arguments for the plugin.

#### Returns

`this`

The pipeline instance for chaining.

***

### getFormat()

> `static` **getFormat**(`id`): `undefined` \| [`MdastFormat`](../interfaces/MdastFormat.md)

Defined in: [packages/mdast-plus/src/pipeline.ts:42](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L42)

Retrieves a registered format by its ID.

#### Parameters

##### id

`string`

The format identifier.

#### Returns

`undefined` \| [`MdastFormat`](../interfaces/MdastFormat.md)

The format definition or undefined if not found.

***

### register()

> `static` **register**(`format`): `void`

Defined in: [packages/mdast-plus/src/pipeline.ts:33](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/pipeline.ts#L33)

Registers a global document format.

#### Parameters

##### format

[`MdastFormat`](../interfaces/MdastFormat.md)

The format definition to register.

#### Returns

`void`
