[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastMark

# Interface: MdastMark

Defined in: [packages/mdast-plus/src/types.ts:87](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L87)

Represents a highlighted text (mark) node in mdast.

## Extends

- `Parent`

## Properties

### children

> **children**: `PhrasingContent`[]

Defined in: [packages/mdast-plus/src/types.ts:89](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L89)

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

Defined in: [packages/mdast-plus/src/types.ts:88](https://github.com/isdk/mdast-plus.js/blob/bacb4922529058fef775e3f4b4e71c98ac1cab17/src/types.ts#L88)

Node type.

#### Overrides

`UnistParent.type`
