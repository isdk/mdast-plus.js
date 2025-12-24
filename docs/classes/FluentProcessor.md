[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / FluentProcessor

# Class: FluentProcessor

Defined in: [packages/mdast-plus/src/pipeline.ts:20](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/pipeline.ts#L20)

Fluent processor for mdast transformations.
Allows chaining configuration and finally converting to a target format.

## Constructors

### Constructor

> **new FluentProcessor**(`input`): `FluentProcessor`

Defined in: [packages/mdast-plus/src/pipeline.ts:54](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/pipeline.ts#L54)

Creates a new FluentProcessor instance.

#### Parameters

##### input

`any`

The input content (string or mdast tree)

#### Returns

`FluentProcessor`

## Properties

### formats

> `static` **formats**: `Record`\<`string`, [`MdastFormatDefinition`](../interfaces/MdastFormatDefinition.md)\>

Defined in: [packages/mdast-plus/src/pipeline.ts:22](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/pipeline.ts#L22)

Map of registered format definitions

## Methods

### data()

> **data**(`data`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:88](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/pipeline.ts#L88)

Merges global data into the processor.

#### Parameters

##### data

`Record`\<`string`, `any`\>

Key-value pairs to store in global data

#### Returns

`this`

***

### from()

> **from**(`format`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:70](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/pipeline.ts#L70)

Specifies the input format.

#### Parameters

##### format

`string`

The input format name (default: 'markdown')

#### Returns

`this`

***

### to()

> **to**(`format`): `Promise`\<[`ConvertResult`](../interfaces/ConvertResult.md)\<`string`\>\>

Defined in: [packages/mdast-plus/src/pipeline.ts:98](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/pipeline.ts#L98)

Converts the input content to the specified format.

#### Parameters

##### format

`string`

The output format name

#### Returns

`Promise`\<[`ConvertResult`](../interfaces/ConvertResult.md)\<`string`\>\>

A promise resolving to the conversion result (content and assets)

***

### toAST()

> **toAST**(): `Promise`\<`Root`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:180](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/pipeline.ts#L180)

Helper to get the processed mdast tree.

#### Returns

`Promise`\<`Root`\>

A promise resolving to the mdast Root node

***

### toHTML()

> **toHTML**(): `Promise`\<`string`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:171](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/pipeline.ts#L171)

Helper to convert content to HTML.

#### Returns

`Promise`\<`string`\>

A promise resolving to the HTML string

***

### toMarkdown()

> **toMarkdown**(): `Promise`\<`string`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:162](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/pipeline.ts#L162)

Helper to convert content to Markdown.

#### Returns

`Promise`\<`string`\>

A promise resolving to the Markdown string

***

### use()

> **use**(`plugin`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:79](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/pipeline.ts#L79)

Adds a plugin to the processing pipeline.

#### Parameters

##### plugin

[`MdastPlugin`](../interfaces/MdastPlugin.md)

The mdast plugin to use

#### Returns

`this`

***

### registerFormat()

> `static` **registerFormat**(`name`, `definition`): `void`

Defined in: [packages/mdast-plus/src/pipeline.ts:40](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/pipeline.ts#L40)

Registers a new format definition.

#### Parameters

##### name

`string`

The name of the format (e.g., 'docx')

##### definition

[`MdastFormatDefinition`](../interfaces/MdastFormatDefinition.md)

The format definition containing parse/stringify logic

#### Returns

`void`
