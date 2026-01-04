[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastSup

# Interface: MdastSup

Defined in: [packages/mdast-plus/src/types.ts:130](https://github.com/isdk/mdast-plus.js/blob/fb690626024343866805f4e55a09e901ff9d4a09/src/types.ts#L130)

Represents a superscript text node in mdast.

## Extends

- `Parent`

## Properties

### children

> **children**: `PhrasingContent`[]

Defined in: [packages/mdast-plus/src/types.ts:132](https://github.com/isdk/mdast-plus.js/blob/fb690626024343866805f4e55a09e901ff9d4a09/src/types.ts#L132)

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

> **type**: `"sup"`

Defined in: [packages/mdast-plus/src/types.ts:131](https://github.com/isdk/mdast-plus.js/blob/fb690626024343866805f4e55a09e901ff9d4a09/src/types.ts#L131)

Node type.

#### Overrides

`UnistParent.type`
