[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastMark

# Interface: MdastMark

Defined in: [packages/mdast-plus/src/types.ts:73](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/types.ts#L73)

mdast node for highlighted text (mark).

## Extends

- `Parent`

## Properties

### children

> **children**: `PhrasingContent`[]

Defined in: [packages/mdast-plus/src/types.ts:75](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/types.ts#L75)

List of children.

#### Overrides

`UnistParent.children`

***

### data?

> `optional` **data**: `Data`

Defined in: node\_modules/.pnpm/@types+unist@3.0.3/node\_modules/@types/unist/index.d.ts:95

Info from the ecosystem.

#### Inherited from

`UnistParent.data`

***

### position?

> `optional` **position**: `Position`

Defined in: node\_modules/.pnpm/@types+unist@3.0.3/node\_modules/@types/unist/index.d.ts:103

Position of a node in a source document.

Nodes that are generated (not in the original source document) must not
have a position.

#### Inherited from

`UnistParent.position`

***

### type

> **type**: `"mark"`

Defined in: [packages/mdast-plus/src/types.ts:74](https://github.com/isdk/mdast-plus.js/blob/75ee549d3fb31ef4bc1b4a6b3307f6368072874e/src/types.ts#L74)

Node type.

#### Overrides

`UnistParent.type`
