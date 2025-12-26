[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastSup

# Interface: MdastSup

Defined in: [packages/mdast-plus/src/types.ts:109](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/types.ts#L109)

Represents a superscript text node in mdast.

## Extends

- `Parent`

## Properties

### children

> **children**: `PhrasingContent`[]

Defined in: [packages/mdast-plus/src/types.ts:111](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/types.ts#L111)

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

Defined in: [packages/mdast-plus/src/types.ts:110](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/types.ts#L110)

Node type.

#### Overrides

`UnistParent.type`
