import { visit } from 'unist-util-visit';
import type { Root, Code } from 'mdast';
import type { MdastPlugin } from '../types';

/**
 * Parses a meta string like 'title="My Code" filename="test.js" priority=1'
 * into a structured object.
 */
function parseMeta(meta: string): Record<string, string> {
  const result: Record<string, string> = {};
  const regex = /([a-zA-Z0-9_-]+)(?:=?(?:"([^"]*)"|'([^']*)'|([^ \t\n\r\f]+)))?/g;
  let match;
  while ((match = regex.exec(meta)) !== null) {
    const key = match[1];
    const value = match[2] || match[3] || match[4] || '';
    result[key] = value;
  }
  return result;
}

export const extractCodeMetaPlugin: MdastPlugin = {
  name: 'extract-code-meta',
  stage: 'normalize',
  order: 30,
  transform: async (tree: Root) => {
    visit(tree, 'code', (node: Code) => {
      if (node.meta) {
        const metaData = parseMeta(node.meta);
        const data = (node.data = node.data || {}) as any;

        // Specific well-known fields
        if (metaData.title) data.title = metaData.title;
        if (metaData.filename) data.filename = metaData.filename;

        // Store all in kv for backup
        data.kv = { ...(data.kv || {}), ...metaData };
      }
    });
  }
};
