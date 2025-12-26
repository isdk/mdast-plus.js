[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastMark

# Interface: MdastMark

Defined in: [packages/mdast-plus/src/types.ts:97](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/types.ts#L97)

Represents a highlighted text (mark) node in mdast.

## Extends

- `Parent`

## Properties

### children

> **children**: `PhrasingContent`[]

Defined in: [packages/mdast-plus/src/types.ts:99](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/types.ts#L99)

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

Defined in: [packages/mdast-plus/src/types.ts:98](https://github.com/isdk/mdast-plus.js/blob/8870eec4ef97dd48bead818813d06479ceff9450/src/types.ts#L98)

Node type.

#### Overrides

`UnistParent.type`
