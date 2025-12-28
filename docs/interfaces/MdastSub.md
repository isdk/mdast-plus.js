[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastSub

# Interface: MdastSub

Defined in: [packages/mdast-plus/src/types.ts:124](https://github.com/isdk/mdast-plus.js/blob/b08b74cf958d7f9ed7bee309acc7e659bc74da3c/src/types.ts#L124)

Represents a subscript text node in mdast.

## Extends

- `Parent`

## Properties

### children

> **children**: `PhrasingContent`[]

Defined in: [packages/mdast-plus/src/types.ts:126](https://github.com/isdk/mdast-plus.js/blob/b08b74cf958d7f9ed7bee309acc7e659bc74da3c/src/types.ts#L126)

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

> **type**: `"sub"`

Defined in: [packages/mdast-plus/src/types.ts:125](https://github.com/isdk/mdast-plus.js/blob/b08b74cf958d7f9ed7bee309acc7e659bc74da3c/src/types.ts#L125)

Node type.

#### Overrides

`UnistParent.type`
