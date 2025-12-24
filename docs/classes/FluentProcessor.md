[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / FluentProcessor

# Class: FluentProcessor

Defined in: [packages/mdast-plus/src/pipeline.ts:24](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/pipeline.ts#L24)

Fluent processor for mdast transformations.
Allows chaining configuration and finally converting to a target format.

## Constructors

### Constructor

> **new FluentProcessor**(`input`): `FluentProcessor`

Defined in: [packages/mdast-plus/src/pipeline.ts:59](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/pipeline.ts#L59)

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

Defined in: [packages/mdast-plus/src/pipeline.ts:26](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/pipeline.ts#L26)

Map of registered format definitions

## Methods

### data()

> **data**(`data`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:93](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/pipeline.ts#L93)

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

Defined in: [packages/mdast-plus/src/pipeline.ts:75](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/pipeline.ts#L75)

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

Defined in: [packages/mdast-plus/src/pipeline.ts:103](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/pipeline.ts#L103)

Converts the input content to the specified format.

#### Parameters

##### format

`string`

The output format name

#### Returns

`Promise`\<[`ConvertResult`](../interfaces/ConvertResult.md)\<`string`\>\>

A promise resolving to the conversion result (content and assets)

***

### toHTML()

> **toHTML**(): `Promise`\<`string`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:173](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/pipeline.ts#L173)

Helper to convert content to HTML.

#### Returns

`Promise`\<`string`\>

A promise resolving to the HTML string

***

### toMarkdown()

> **toMarkdown**(): `Promise`\<`string`\>

Defined in: [packages/mdast-plus/src/pipeline.ts:164](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/pipeline.ts#L164)

Helper to convert content to Markdown.

#### Returns

`Promise`\<`string`\>

A promise resolving to the Markdown string

***

### use()

> **use**(`plugin`): `this`

Defined in: [packages/mdast-plus/src/pipeline.ts:84](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/pipeline.ts#L84)

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

Defined in: [packages/mdast-plus/src/pipeline.ts:45](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/pipeline.ts#L45)

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
