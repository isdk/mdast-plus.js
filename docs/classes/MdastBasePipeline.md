[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastBasePipeline

# Class: MdastBasePipeline

Defined in: [packages/mdast-plus/src/pipeline.ts:42](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L42)

Base implementation of the fluent mdast processing pipeline.
Manages the plugin registry and the execution queue.

## Extended by

- [`MdastPipeline`](MdastPipeline.md)

## Constructors

### Constructor

> **new MdastBasePipeline**(`input`): `MdastBasePipeline`

Defined in: [packages/mdast-plus/src/pipeline.ts:70](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L70)

Initializes a new pipeline instance with the given input.

#### Parameters

##### input

`Compatible`

Content to process (string, Buffer, VFile, or AST Node).

#### Returns

`MdastBasePipeline`

## Properties

### \_data

> `protected` **\_data**: `Record`\<`string`, `any`\> = `{}`

Defined in: [packages/mdast-plus/src/pipeline.ts:64](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L64)

***

### input

> `protected` **input**: `Compatible`

Defined in: [packages/mdast-plus/src/pipeline.ts:62](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L62)

***

### queue

> `protected` **queue**: [`MdastPlugin`](../interfaces/MdastPlugin.md)[] = `[]`

Defined in: [packages/mdast-plus/src/pipeline.ts:63](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L63)

## Methods

### assembleProcessor()

> `protected` **assembleProcessor**(`queue`): `Processor`

Defined in: [packages/mdast-plus/src/pipeline.ts:494](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L494)

Assembles a unified processor based on the sorted plugin queue.

#### Parameters

##### queue

[`MdastPlugin`](../interfaces/MdastPlugin.md)[]

#### Returns

`Processor`

***

### configure()

> **configure**(`pluginName`, ...`options`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:478](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L478)

Modifies the options of a plugin that is already in the pipeline queue.
Searches from the end of the queue and updates the first match found.

#### Parameters

##### pluginName

`string`

The name of the plugin to modify.
                    Matches against explicit plugin name or function name.

##### options

...`any`[]

The new options to pass to the plugin (replaces existing options).

#### Returns

`this`

The pipeline instance for chaining.

***

### data()

> **data**(`key`, `value?`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:80](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L80)

Configures global data for the pipeline, which will be available to all plugins via this.data().

#### Parameters

##### key

Data key or a record of multiple data entries.

`string` | `Record`\<`string`, `any`\>

##### value?

`any`

Value to set (if key is a string).

#### Returns

`this`

The pipeline instance for chaining.

***

### ensureInputPlugins()

> `protected` **ensureInputPlugins**(`queue`, `overrides?`, `maxStage?`): `void`

Defined in: [packages/mdast-plus/src/pipeline.ts:165](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L165)

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

Defined in: [packages/mdast-plus/src/pipeline.ts:194](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L194)

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

Defined in: [packages/mdast-plus/src/pipeline.ts:92](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L92)

Instance-level access to the global format registry.

#### Parameters

##### id

`string`

#### Returns

`undefined` \| [`MdastFormat`](../interfaces/MdastFormat.md)

***

### priority()

> **priority**(`order`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:461](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L461)

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

### resolveRunQueue()

> `protected` **resolveRunQueue**(`format`, `overrides?`, `stage?`, `stopAtIndex?`): [`MdastPlugin`](../interfaces/MdastPlugin.md)[]

Defined in: [packages/mdast-plus/src/pipeline.ts:214](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L214)

Resolves the final plugin queue for execution based on the target format and run options.
Calculates the effective plugin list by applying overrides, handling partial execution (stage/stopAtIndex),
and injecting necessary input/output plugins.

#### Parameters

##### format

[`MdastFormat`](../interfaces/MdastFormat.md)

##### overrides?

`Record`\<`string`, `any`\>

##### stage?

[`PipelineStage`](../enumerations/PipelineStage.md)

##### stopAtIndex?

`number`

#### Returns

[`MdastPlugin`](../interfaces/MdastPlugin.md)[]

***

### to()

> **to**(`fmt`, `optionsOrOverrides?`): `Promise`\<`VFile`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:290](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L290)

Processes the pipeline and serializes the result into the specified format.

#### Parameters

##### fmt

Target format ID or definition.

`string` | [`MdastFormat`](../interfaces/MdastFormat.md)

##### optionsOrOverrides?

Pipeline execution options or plugin option overrides.

[`PipelineRunOptions`](../interfaces/PipelineRunOptions.md) | `Record`\<`string`, `any`\>

#### Returns

`Promise`\<`VFile`\>

A promise resolving to a VFile containing the result.

***

### toRuntimeEntry()

> `protected` **toRuntimeEntry**(`entry`, `defaultStage`, `overrides?`): [`MdastPlugin`](../interfaces/MdastPlugin.md) & `object`

Defined in: [packages/mdast-plus/src/pipeline.ts:116](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L116)

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

Defined in: [packages/mdast-plus/src/pipeline.ts:336](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L336)

Adds a plugin or an array of plugins to the pipeline's compile stage.

#### Parameters

##### plugin

The unified plugin function, a MdastPlugin object, or an array of them.

[`MdastPlugin`](../interfaces/MdastPlugin.md) | `Pluggable` | `PluggableList` | MdastPlugin \| Pluggable[]

##### options

...`any`[]

Arguments for the plugin(s).

#### Returns

`this`

The pipeline instance for chaining.

***

### useAt()

#### Call Signature

> **useAt**(`stage`, `plugin`, ...`options`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:418](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L418)

Adds a plugin or an array of plugins to the pipeline at a specific stage.

##### Parameters

###### stage

The stage name or numeric value.

[`PipelineStage`](../enumerations/PipelineStage.md) | `"parse"` | `"normalize"` | `"compile"` | `"finalize"` | `"stringify"`

###### plugin

The unified plugin function, a MdastPlugin object, or an array of them.

[`MdastPlugin`](../interfaces/MdastPlugin.md) | `Pluggable` | `PluggableList` | MdastPlugin \| Pluggable[]

###### options

...`any`[]

Arguments for the plugin(s).

##### Returns

`this`

The pipeline instance for chaining.

#### Call Signature

> **useAt**(`plugin`, ...`options`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:425](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L425)

Adds a plugin or an array of plugins to the pipeline. The stage is taken from the plugin object(s) or defaults to 'compile'.

##### Parameters

###### plugin

The MdastPlugin object or an array of them, or a standard unified Pluggable.

[`MdastPlugin`](../interfaces/MdastPlugin.md) | [`MdastPlugin`](../interfaces/MdastPlugin.md)[] | `Pluggable` | `PluggableList`

###### options

...`any`[]

Arguments for the plugin(s) (overrides plugin.options if provided).

##### Returns

`this`

The pipeline instance for chaining.

***

### getFormat()

> `static` **getFormat**(`id`): `undefined` \| [`MdastFormat`](../interfaces/MdastFormat.md)

Defined in: [packages/mdast-plus/src/pipeline.ts:58](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L58)

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

Defined in: [packages/mdast-plus/src/pipeline.ts:49](https://github.com/isdk/mdast-plus.js/blob/63ad0024c4c259bf87070606fda5c1b86ee2db1d/src/pipeline.ts#L49)

Registers a global document format.

#### Parameters

##### format

[`MdastFormat`](../interfaces/MdastFormat.md)

The format definition to register.

#### Returns

`void`
