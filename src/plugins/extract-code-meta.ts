import { visit } from 'unist-util-visit';
import type { Root, Code } from 'mdast';
import type { MdastPlugin } from '../types';
import { parse } from 'shell-quote';
import { PipelineStage } from '../types';

/**
 * Parses a code block's meta string (e.g., 'title="My Code" filename="test.js" priority=1')
 * into a structured key-value object.
 * 
 * @param meta - The raw meta string from a code block.
 * @returns A record of parsed metadata.
 */
function parseMeta(meta: string): Record<string, string> {
  const result: Record<string, string> = {};
  // shell-quote's parse handles complex shell-like quoting/escaping
  const parsedArgs = parse(meta);

  for (const arg of parsedArgs) {
    if (typeof arg === 'string') {
      const parts = arg.split('=', 2);
      if (parts.length === 2) {
        result[parts[0]] = parts[1];
      } else {
        // Standalone flags are treated as boolean 'true'
        result[arg] = 'true';
      }
    }
  }
  return result;
}

/**
 * Attacher for the code meta extraction plugin.
 */
const extractCodeMetaAttacher = () => {
  return async (tree: Root) => {
    visit(tree, 'code', (node: Code) => {
      if (node.meta) {
        const metaData = parseMeta(node.meta);
        const data = (node.data = node.data || {}) as any;

        // Populate well-known fields into node.data for downstream use
        if (metaData.title) data.title = metaData.title;
        if (metaData.filename) data.filename = metaData.filename;

        // Store the full set in a kv map for generic access
        data.kv = { ...(data.kv || {}), ...metaData };
      }
    });
  };
};

/**
 * Plugin to extract and structure metadata from code block info strings.
 * 
 * Example:
 * ```js title="Hello" filename="world.js"
 * console.log('hi');
 * ```
 * The above will populate node.data.title and node.data.filename.
 */
export const extractCodeMetaPlugin: MdastPlugin = {
  plugin: extractCodeMetaAttacher,
  stage: PipelineStage.normalize,
  order: 30,
};
