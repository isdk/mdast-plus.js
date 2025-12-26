import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { inlineStylesFromHtmlHandlers } from '../plugins/normalize-inline-styles';
import type { MdastFormat, MdastPlugin } from '../types';
import { PipelineStage } from '../types';

/**
 * Plugin sequence for reading HTML into a standard mdast-plus AST.
 * Uses rehype-parse and rehype-remark with custom handlers for extended styles.
 */
const htmlInputPlugins: MdastPlugin[] = [
  {
    plugin: rehypeParse,
    stage: PipelineStage.parse,
  },
  {
    plugin: rehypeRemark,
    options: [{
      handlers: {
        ...inlineStylesFromHtmlHandlers,
      },
    }],
    stage: PipelineStage.parse,
    order: 10, // Run after parse
  },
];

/**
 * Plugin sequence for serializing a standard AST into sanitized HTML string.
 * Includes the remark-rehype bridge, HTML sanitization with extended schema, 
 * and rehype-stringify.
 */
const htmlOutputPlugins: MdastPlugin[] = [
  {
    plugin: remarkRehype,
    stage: PipelineStage.finalize,
    order: 10,
  },
  {
    plugin: rehypeSanitize,
    options: [{
      ...defaultSchema,
      tagNames: [...(defaultSchema.tagNames || []), 'mark', 'sub', 'sup'],
      attributes: {
        ...defaultSchema.attributes,
        '*': [...(defaultSchema.attributes?.['*'] || []), 'className', 'id', 'style'],
        td: [...(defaultSchema.attributes?.td || []), 'rowSpan', 'colSpan', 'rowspan', 'colspan'],
        th: [...(defaultSchema.attributes?.th || []), 'rowSpan', 'colSpan', 'rowspan', 'colspan'],
        img: [...(defaultSchema.attributes?.img || []), 'width', 'height'],
      },
    }],
    stage: PipelineStage.finalize,
    order: 20,
  },
  {
    plugin: rehypeStringify,
    stage: PipelineStage.stringify,
  },
];

/**
 * HTML format definition.
 * 
 * Provides a bidirectional mapping between HTML strings and mdast-plus ASTs.
 * Includes built-in sanitization and support for table spans and image dimensions.
 */
export const htmlFormat: MdastFormat = {
  id: 'html',
  title: 'HTML',
  extensions: ['html', 'htm'],
  mediaTypes: ['text/html'],
  input: htmlInputPlugins,
  output: htmlOutputPlugins,
};