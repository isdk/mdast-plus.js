import { visit } from 'unist-util-visit';
import type { Root, PhrasingContent, Text } from 'mdast';
import type { MdastMark, MdastSub, MdastSup, MdastPlugin } from '../types';

/**
 * Creates an mdast node for mark, sub, or sup.
 * @param type - The node type
 * @param children - The child nodes
 * @returns The created mdast node
 */
function createNode(type: 'mark' | 'sub' | 'sup', children: PhrasingContent[]): MdastMark | MdastSub | MdastSup {
  return {
    type,
    children,
    data: {
      hName: type,
    },
  } as any;
}

/**
 * Normalizes inline styles in the tree by finding text patterns and converting them to nodes.
 * Patterns: ==mark==, ~sub~, ^sup^
 * @param tree - The Root node to transform
 */
export function normalizeInlineStylesPlugin(tree: Root) {
  visit(tree, 'text', (node: Text, index, parent: any) => {
    if (!parent || index === undefined) return;

    const text = node.value;
    let lastIndex = 0;
    const newChildren: PhrasingContent[] = [];
    let matchFound = false;

    const combinedRegex = /(==[^=]+==|~[^~]+~|\^[^^]+\^)/g;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      matchFound = true;
      const fullMatch = match[0];
      const matchIndex = match.index;

      // Add preceding text
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
      if (lastIndex < text.length) {
        newChildren.push({ type: 'text', value: text.slice(lastIndex) });
      }
      parent.children.splice(index, 1, ...newChildren);
      return index + newChildren.length;
    }
  });
}

/**
 * Handlers for converting HAST to mdast (rehype-remark).
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
 * mdast-plus plugin for inline styles support (mark/sub/sup).
 */
export const inlineStylesPlugin: MdastPlugin = {
  name: 'normalize-inline-styles',
  stage: 'normalize',
  transform: (tree: Root) => {
    normalizeInlineStylesPlugin(tree);
  },
};
