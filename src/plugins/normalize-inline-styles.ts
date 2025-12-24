import { visit } from 'unist-util-visit';
import type { Root, PhrasingContent, Text } from 'mdast';
import type { MdastMark, MdastSub, MdastSup, MdastPlugin } from '../types';

function createNode(type: 'mark' | 'sub' | 'sup', children: PhrasingContent[]): MdastMark | MdastSub | MdastSup {
  return {
    type,
    children,
    data: {
      hName: type
    }
  } as any;
}


export function normalizeInlineStylesPlugin(tree: Root) {
  visit(tree, 'text', (node: Text, index, parent: any) => {
    if (!parent || index === undefined) return;

    let text = node.value;
    let lastIndex = 0;
    const newChildren: PhrasingContent[] = [];
    let matchFound = false;

    // This is a simplified version. For multiple types, we might need a more robust loop.
    // We'll process one pattern at a time for simplicity in this first version,
    // or better, a single pass with combined regex.

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

export const normalizeInlineStyles: MdastPlugin = {
  name: 'normalize-inline-styles',
  stage: 'normalize',
  transform: (tree: Root) => {
    normalizeInlineStylesPlugin(tree);
  },
};
