import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';

/**
 * Unified plugin/configuration for Markdown format.
 * Includes GFM, directives, math, and frontmatter.
 */
export function markdownFormat(this: any) {
  const data = this.data();

  function add(key: string, value: any) {
    if (data[key]) {
      data[key].push(value);
    } else {
      data[key] = [value];
    }
  }

  add('toMarkdownExtensions', {
    handlers: {
      mark(node: any, _: any, state: any) {
        return '==' + state.containerPhrasing(node, { before: '==', after: '==' }) + '==';
      },
      sub(node: any, _: any, state: any) {
        return '~' + state.containerPhrasing(node, { before: '~', after: '~' }) + '~';
      },
      sup(node: any, _: any, state: any) {
        return '^' + state.containerPhrasing(node, { before: '^', after: '^' }) + '^';
      },
    },
  });

  this
    .use(remarkGfm, { singleTilde: false })
    .use(remarkDirective)
    .use(remarkMath)
    .use(remarkFrontmatter, ['yaml', 'toml']);
}
