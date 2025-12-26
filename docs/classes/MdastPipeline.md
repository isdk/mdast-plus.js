[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastPipeline

# Class: MdastPipeline

Defined in: [packages/mdast-plus/src/pipeline.ts:399](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L399)

Extended pipeline with convenience methods for common formats.

## Extends

- [`MdastBasePipeline`](MdastBasePipeline.md)

## Constructors

### Constructor

> **new MdastPipeline**(`input`): `MdastPipeline`

Defined in: [packages/mdast-plus/src/pipeline.ts:54](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L54)

Initializes a new pipeline instance with the given input.

#### Parameters

##### input

`Compatible`

Content to process (string, Buffer, VFile, or AST Node).

#### Returns

`MdastPipeline`

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`constructor`](MdastBasePipeline.md#constructor)

## Properties

### \_data

> `protected` **\_data**: `Record`\<`string`, `any`\> = `{}`

Defined in: [packages/mdast-plus/src/pipeline.ts:48](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L48)

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`_data`](MdastBasePipeline.md#_data)

***

### input

> `protected` **input**: `Compatible`

Defined in: [packages/mdast-plus/src/pipeline.ts:46](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L46)

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`input`](MdastBasePipeline.md#input)

***

### queue

> `protected` **queue**: [`MdastPlugin`](../interfaces/MdastPlugin.md)[] = `[]`

Defined in: [packages/mdast-plus/src/pipeline.ts:47](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L47)

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`queue`](MdastBasePipeline.md#queue)

## Methods

### assembleProcessor()

> `protected` **assembleProcessor**(`queue`): `Processor`

Defined in: [packages/mdast-plus/src/pipeline.ts:326](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L326)

Assembles a unified processor based on the sorted plugin queue.

#### Parameters

##### queue

[`MdastPlugin`](../interfaces/MdastPlugin.md)[]

#### Returns

`Processor`

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`assembleProcessor`](MdastBasePipeline.md#assembleprocessor)

***

### data()

> **data**(`key`, `value?`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:64](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L64)

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

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`data`](MdastBasePipeline.md#data)

***

### ensureInputPlugins()

> `protected` **ensureInputPlugins**(`queue`, `overrides?`, `maxStage?`): `void`

Defined in: [packages/mdast-plus/src/pipeline.ts:149](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L149)

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

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`ensureInputPlugins`](MdastBasePipeline.md#ensureinputplugins)

***

### from()

> **from**(`fmt`, `overrides?`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:178](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L178)

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

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`from`](MdastBasePipeline.md#from)

***

### getFormat()

> **getFormat**(`id`): `undefined` \| [`MdastFormat`](../interfaces/MdastFormat.md)

Defined in: [packages/mdast-plus/src/pipeline.ts:76](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L76)

Instance-level access to the global format registry.

#### Parameters

##### id

`string`

#### Returns

`undefined` \| [`MdastFormat`](../interfaces/MdastFormat.md)

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`getFormat`](MdastBasePipeline.md#getformat)

***

### priority()

> **priority**(`order`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:314](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L314)

Sets the priority order for the most recently added plugin.
Plugins with lower order run earlier within the same stage.

#### Parameters

##### order

`number`

Numeric priority.

#### Returns

`this`

The pipeline instance for chaining.

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`priority`](MdastBasePipeline.md#priority)

***

### to()

> **to**(`fmt`, `overrides?`): `Promise`\<`VFile`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:198](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L198)

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

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`to`](MdastBasePipeline.md#to)

***

### toAst()

> **toAst**(`options?`): `Promise`\<`Root`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:436](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L436)

Finalizes the pipeline and returns the resulting AST (Root node).

#### Parameters

##### options?

Configuration for the extraction.

###### overrides?

`Record`\<`string`, `any`\>

Map for plugin option overrides.

###### stage?

`"parse"` \| `"normalize"` \| `"compile"` \| `"finalize"` \| `"stringify"`

Run the pipeline up to this stage only.

#### Returns

`Promise`\<`Root`\>

***

### toAST()

> **toAST**(`options?`): `Promise`\<`Root`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:474](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L474)

Alias for toAst()

#### Parameters

##### options?

###### overrides?

`Record`\<`string`, `any`\>

###### stage?

`"parse"` \| `"normalize"` \| `"compile"` \| `"finalize"` \| `"stringify"`

#### Returns

`Promise`\<`Root`\>

***

### toHtml()

> **toHtml**(): `Promise`\<`string`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:418](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L418)

Finalizes the pipeline and returns the result as an HTML string.

#### Returns

`Promise`\<`string`\>

***

### toHTML()

> **toHTML**(): `Promise`\<`string`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:472](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L472)

Alias for toHtml()

#### Returns

`Promise`\<`string`\>

***

### toHtmlVFile()

> **toHtmlVFile**(): `Promise`\<`VFile`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:426](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L426)

Finalizes the pipeline and returns a VFile containing the HTML result.

#### Returns

`Promise`\<`VFile`\>

***

### toMarkdown()

> **toMarkdown**(): `Promise`\<`string`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:403](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L403)

Finalizes the pipeline and returns the result as a Markdown string.

#### Returns

`Promise`\<`string`\>

***

### toMarkdownVFile()

> **toMarkdownVFile**(): `Promise`\<`VFile`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:411](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L411)

Finalizes the pipeline and returns a VFile containing the Markdown result.

#### Returns

`Promise`\<`VFile`\>

***

### toRuntimeEntry()

> `protected` **toRuntimeEntry**(`entry`, `defaultStage`, `overrides?`): [`MdastPlugin`](../interfaces/MdastPlugin.md) & `object`

Defined in: [packages/mdast-plus/src/pipeline.ts:100](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L100)

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

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`toRuntimeEntry`](MdastBasePipeline.md#toruntimeentry)

***

### use()

> **use**(`plugin`, ...`options`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:241](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L241)

Adds a plugin or an array of plugins to the pipeline's compile stage.

#### Parameters

##### plugin

The unified plugin function, a MdastPlugin object, or an array of them.

[`MdastPlugin`](../interfaces/MdastPlugin.md) | `Plugin` | ([`MdastPlugin`](../interfaces/MdastPlugin.md) \| `Plugin`)[]

##### options

...`any`[]

Arguments for the plugin(s).

#### Returns

`this`

The pipeline instance for chaining.

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`use`](MdastBasePipeline.md#use)

***

### useAt()

#### Call Signature

> **useAt**(`stage`, `plugin`, ...`options`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:252](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L252)

Adds a plugin or an array of plugins to the pipeline at a specific stage.

##### Parameters

###### stage

The stage name or numeric value.

`"parse"` | `"normalize"` | `"compile"` | `"finalize"` | `"stringify"`

###### plugin

The unified plugin function, a MdastPlugin object, or an array of them.

[`MdastPlugin`](../interfaces/MdastPlugin.md) | `Plugin` | ([`MdastPlugin`](../interfaces/MdastPlugin.md) \| `Plugin`)[]

###### options

...`any`[]

Arguments for the plugin(s).

##### Returns

`this`

The pipeline instance for chaining.

##### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`useAt`](MdastBasePipeline.md#useat)

#### Call Signature

> **useAt**(`plugin`, ...`options`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:259](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L259)

Adds a plugin or an array of plugins to the pipeline. The stage is taken from the plugin object(s).

##### Parameters

###### plugin

The MdastPlugin object or an array of them.

[`MdastPlugin`](../interfaces/MdastPlugin.md) | ([`MdastPlugin`](../interfaces/MdastPlugin.md) \| `Plugin`)[]

###### options

...`any`[]

Arguments for the plugin(s) (overrides plugin.options if provided).

##### Returns

`this`

The pipeline instance for chaining.

##### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`useAt`](MdastBasePipeline.md#useat)

***

### getFormat()

> `static` **getFormat**(`id`): `undefined` \| [`MdastFormat`](../interfaces/MdastFormat.md)

Defined in: [packages/mdast-plus/src/pipeline.ts:42](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L42)

Retrieves a registered format by its ID.

#### Parameters

##### id

`string`

The format identifier.

#### Returns

`undefined` \| [`MdastFormat`](../interfaces/MdastFormat.md)

The format definition or undefined if not found.

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`getFormat`](MdastBasePipeline.md#getformat-2)

***

### register()

> `static` **register**(`format`): `void`

Defined in: [packages/mdast-plus/src/pipeline.ts:33](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/pipeline.ts#L33)

Registers a global document format.

#### Parameters

##### format

[`MdastFormat`](../interfaces/MdastFormat.md)

The format definition to register.

#### Returns

`void`

#### Inherited from

[`MdastBasePipeline`](MdastBasePipeline.md).[`register`](MdastBasePipeline.md#register)
