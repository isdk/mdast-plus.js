import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';

export function markdownFormat(this: any) {
  this
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkMath)
    .use(remarkFrontmatter, ['yaml', 'toml']);
}
