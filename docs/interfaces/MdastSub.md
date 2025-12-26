[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastSub

# Interface: MdastSub

Defined in: [packages/mdast-plus/src/types.ts:103](https://github.com/isdk/mdast-plus.js/blob/2e4b3f4f8f9f2537173553e02c79170d79418c86/src/types.ts#L103)

Represents a subscript text node in mdast.

## Extends

- `Parent`

## Properties

### children

> **children**: `PhrasingContent`[]

Defined in: [packages/mdast-plus/src/types.ts:105](https://github.com/isdk/mdast-plus.js/blob/2e4b3f4f8f9f2537173553e02c79170d79418c86/src/types.ts#L105)

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

Defined in: [packages/mdast-plus/src/types.ts:104](https://github.com/isdk/mdast-plus.js/blob/2e4b3f4f8f9f2537173553e02c79170d79418c86/src/types.ts#L104)

Node type.

#### Overrides

`UnistParent.type`
