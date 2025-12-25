import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { inlineStylesFromHtmlHandlers } from '../plugins/normalize-inline-styles';
import type { MdastFormatDefinition, MdastPlusOptions } from '../types';

/**
 * Standard compiler/stringifier for HTML.
 */
export function htmlStringify(this: any, options?: Record<string, any>) {
  this
    .use(remarkRehype, options)
    .use(rehypeSanitize, {
      ...defaultSchema,
      tagNames: [...(defaultSchema.tagNames || []), 'mark', 'sub', 'sup'],
      attributes: {
        ...defaultSchema.attributes,
        '*': [...(defaultSchema.attributes?.['*'] || []), 'className', 'id', 'style'],
        td: [...(defaultSchema.attributes?.td || []), 'rowSpan', 'colSpan', 'rowspan', 'colspan'],
        th: [...(defaultSchema.attributes?.th || []), 'rowSpan', 'colSpan', 'rowspan', 'colspan'],
        img: [...(defaultSchema.attributes?.img || []), 'width', 'height'],
      },
    })
    .use(rehypeStringify, options);
}

/**
 * HTML format definition for FluentProcessor.
 * Handles both parsing (HTML -> MDAST) and stringifying (MDAST -> HTML).
 */
export const htmlFormat: MdastFormatDefinition = {
  parse: (p, options) => {
    return p.use(rehypeParse, options?.html).use(rehypeRemark, {
      ...options?.html,
      handlers: {
        ...(options?.html?.handlers || {}),
        ...inlineStylesFromHtmlHandlers,
      },
    });
  },
  stringify: (p, options) => p.use(htmlStringify, options?.html),
};
