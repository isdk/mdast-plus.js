import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

/**
 * Unified plugin/configuration for HTML format.
 * Includes mdast-to-hast conversion, sanitization (with table span support), and stringification.
 */
export function htmlFormat(this: any) {
  this
    .use(remarkRehype)
    .use(rehypeSanitize, {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        // Allow rowspan/colspan and other common attributes
        '*': [...(defaultSchema.attributes?.['*'] || []), 'className', 'id', 'style'],
        td: [...(defaultSchema.attributes?.td || []), 'rowSpan', 'colSpan', 'rowspan', 'colspan'],
        th: [...(defaultSchema.attributes?.th || []), 'rowSpan', 'colSpan', 'rowspan', 'colspan'],
        img: [...(defaultSchema.attributes?.img || []), 'width', 'height'],
      },
    })
    .use(rehypeStringify);
}
