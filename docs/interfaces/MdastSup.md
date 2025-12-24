[**@isdk/mdast-plus**](../README.md)

***

[@isdk/mdast-plus](../globals.md) / MdastSup

# Interface: MdastSup

Defined in: [packages/mdast-plus/src/types.ts:89](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/types.ts#L89)

mdast node for superscript text.

## Extends

- `Parent`

## Properties

### children

> **children**: `PhrasingContent`[]

Defined in: [packages/mdast-plus/src/types.ts:91](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/types.ts#L91)

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

Defined in: [packages/mdast-plus/src/types.ts:90](https://github.com/isdk/mdast-plus.js/blob/c94d215035e579925cf60814f0a5c05c543ca784/src/types.ts#L90)

Node type.

#### Overrides

`UnistParent.type`
