import { visit } from 'unist-util-visit';
import type { Root, Code } from 'mdast';
import type { MdastPlugin } from '../types';
import { parse } from 'shell-quote';

/**
 * Parses a meta string like 'title="My Code" filename="test.js" priority=1'
 * into a structured object.
 */
function parseMeta(meta: string): Record<string, string> {
  const result: Record<string, string> = {};
  // shell-quote's parse can handle complex shell-like strings
  const parsedArgs = parse(meta);

  for (const arg of parsedArgs) {
    if (typeof arg === 'string') {
      const parts = arg.split('=', 2);
      if (parts.length === 2) {
        result[parts[0]] = parts[1];
      } else {
        // If it's a standalone flag, treat its value as boolean true
        result[arg] = 'true';
      }
    }
  }
  return result;
}

/**
 * Plugin to extract metadata from the code block's info string (meta).
 * e.g., ```js title="Main" filename="app.js"
 */
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
