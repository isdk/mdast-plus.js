import { visit } from 'unist-util-visit';
import type { Root, PhrasingContent, Text } from 'mdast';
import type { MdastMark, MdastSub, MdastSup, MdastPlugin } from '../types';
import { PipelineStage } from '../types';

/**
 * Creates a specialized mdast node for mark, sub, or sup.
 * 
 * @param type - The target node type.
 * @param children - The phrasing content children.
 * @returns A new mdast node with bridge metadata for HAST.
 */
function createNode(type: 'mark' | 'sub' | 'sup', children: PhrasingContent[]): MdastMark | MdastSub | MdastSup {
  return {
    type,
    children,
    data: {
      hName: type, // Ensure HTML rendering uses <mark>, <sub>, or <sup>
    },
  } as any;
}

/**
 * Transforms standard text nodes by identifying inline style patterns 
 * and converting them into structured mdast nodes.
 * 
 * Patterns:
 * - `==highlighted==` -> `<mark>`
 * - `~subscript~` -> `<sub>`
 * - `^superscript^` -> `<sup>`
 * 
 * @param tree - The Root node to transform.
 */
export function normalizeInlineStyles(tree: Root) {
  visit(tree, 'text', (node: Text, index, parent: any) => {
    if (!parent || index === undefined) return;

    const text = node.value;
    let lastIndex = 0;
    const newChildren: PhrasingContent[] = [];
    let matchFound = false;

    // Combined regex for all supported inline sugar syntax
    const combinedRegex = /(==[^=]+==|~[^~]+~|\^[^^]+\^)/g;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      matchFound = true;
      const fullMatch = match[0];
      const matchIndex = match.index;

      // Append text preceding the match
      if (matchIndex > lastIndex) {
        newChildren.push({ type: 'text', value: text.slice(lastIndex, matchIndex) });
      }

      let type: 'mark' | 'sub' | 'sup' = 'mark';
      let content = '';

      if (fullMatch.startsWith('==')) {
        type = 'mark';
        content = fullMatch.slice(2, -2);
      } else if (fullMatch.startsWith('~')) {
        type = 'sub';
        content = fullMatch.slice(1, -1);
      } else if (fullMatch.startsWith('^')) {
        type = 'sup';
        content = fullMatch.slice(1, -1);
      }

      newChildren.push(createNode(type, [{ type: 'text', value: content }]));
      lastIndex = combinedRegex.lastIndex;
    }

    if (matchFound) {
      // Append any remaining text after the last match
      if (lastIndex < text.length) {
        newChildren.push({ type: 'text', value: text.slice(lastIndex) });
      }
      // Replace the original text node with the new sequence of nodes
      parent.children.splice(index, 1, ...newChildren);
      return index + newChildren.length;
    }
  });
}

/**
 * Attacher for the inline styles normalization plugin.
 */
const normalizeInlineStylesAttacher = () => {
  return (tree: Root) => {
    normalizeInlineStyles(tree);
  };
};

/**
 * Handlers for converting HAST to mdast (rehype-remark).
 * Maps `<mark>`, `<sub>`, and `<sup>` elements back to their mdast counterparts.
 */
export const inlineStylesFromHtmlHandlers = {
  mark: (state: any, node: any) => {
    const result = { type: 'mark', children: state.all(node) };
    state.patch(node, result);
    return result;
  },
  sub: (state: any, node: any) => {
    const result = { type: 'sub', children: state.all(node) };
    state.patch(node, result);
    return result;
  },
  sup: (state: any, node: any) => {
    const result = { type: 'sup', children: state.all(node) };
    state.patch(node, result);
    return result;
  },
};

/**
 * Handlers for converting mdast to Markdown (remark-stringify).
 * Serializes `mark`, `sub`, and `sup` nodes back into their sugar syntax.
 */
export const inlineStylesToMarkdownHandlers = {
  mark(node: any, _: any, state: any) {
    return '==' + state.containerPhrasing(node, { before: '==', after: '==' }) + '==';
  },
  sub(node: any, _: any, state: any) {
    return '~' + state.containerPhrasing(node, { before: '~', after: '~' }) + '~';
  },
  sup(node: any, _: any, state: any) {
    return '^' + state.containerPhrasing(node, { before: '^', after: '^' }) + '^';
  },
};

/**
 * Plugin to support extended inline styles: `==mark==`, `~sub~`, and `^sup^`.
 */
export const inlineStylesPlugin: MdastPlugin = {
  plugin: normalizeInlineStylesAttacher,
  stage: PipelineStage.normalize,
};
