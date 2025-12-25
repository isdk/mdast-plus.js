import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import { inlineStylesToMarkdownHandlers } from '../plugins/normalize-inline-styles';
import type { MdastFormatDefinition, MdastPlusOptions } from '../types';

/**
 * Common remark configuration for Markdown.
 */
export function markdownCommon(this: any, options?: Record<string, any>) {
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
    .use(remarkGfm, { singleTilde: false, ...options })
    .use(remarkDirective, options)
    .use(remarkMath, options)
    // remarkFrontmatter has a different options signature, so we don't pass the whole bag.
    .use(remarkFrontmatter, ['yaml', 'toml']);
}

/**
 * Markdown format definition for FluentProcessor.
 * Handles both parsing (Markdown -> MDAST) and stringifying (MDAST -> Markdown).
 */
export const markdownFormat: MdastFormatDefinition = {
  needsTransformToMdast: false,
  // Logical order: use the parser, then add plugins that extend it.
  parse: (p, options) => p.use(remarkParse, options?.markdown).use(markdownCommon, options?.markdown),
  stringify: (p, options) => p.use(remarkStringify, options?.markdown).use(markdownCommon, options?.markdown),
};