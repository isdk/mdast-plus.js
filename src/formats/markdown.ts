import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import { inlineStylesToMarkdownHandlers } from '../plugins/normalize-inline-styles';
import type { MdastFormatDefinition } from '../types';

/**
 * Common remark configuration for Markdown.
 */
export function markdownCommon(this: any) {
  const data = this.data();

  function add(key: string, value: any) {
    if (data[key]) {
      data[key].push(value);
    } else {
      data[key] = [value];
    }
  }

  add('toMarkdownExtensions', {
    handlers: inlineStylesToMarkdownHandlers,
  });

  this
    .use(remarkGfm, { singleTilde: false })
    .use(remarkDirective)
    .use(remarkMath)
    .use(remarkFrontmatter, ['yaml', 'toml']);
}

/**
 * Markdown format definition for FluentProcessor.
 * Handles both parsing (Markdown -> MDAST) and stringifying (MDAST -> Markdown).
 */
export const markdownFormat: MdastFormatDefinition = {
  parse: (p) => p.use(remarkParse).use(markdownCommon),
  stringify: (p) => p.use(remarkStringify).use(markdownCommon),
};
