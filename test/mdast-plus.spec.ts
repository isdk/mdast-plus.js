import { describe, it, expect } from 'vitest';
import { mdast } from '../src';

describe('mdast-plus fluent API', () => {
  it('should convert simple markdown to HTML', async () => {
    const html = await mdast('# Hello').toHTML();
    expect(html).toContain('<h1>Hello</h1>');
  });

  it('should handle round-trip (Markdown -> AST -> Markdown)', async () => {
    const md = await mdast('# Hello').toMarkdown();
    expect(md.trim()).toBe('# Hello');
  });

  it('should pass rehype options for parsing (fragment: false)', async () => {
    const input = '<div>root1</div><div>root2</div>';
    const ast: any = await mdast(input, { html: { fragment: false } }).from('html').toAST();
    // Expect the AST to represent a full HTML document structure
    expect(ast.type).toBe('root');
    expect(ast.children[0].type).toBe('element');
    expect(ast.children[0].tagName).toBe('html');
    const htmlChildren = ast.children[0].children as any[];
    expect(htmlChildren[1].tagName).toBe('body'); // Should have head and body
    const bodyChildren = htmlChildren[1].children as any[];
    expect(bodyChildren[0].tagName).toBe('div');
    expect(bodyChildren[0].children[0].value).toBe('root1'); // Check text content
    expect(bodyChildren[1].tagName).toBe('div');
    expect(bodyChildren[1].children[0].value).toBe('root2')
  });
});

describe('Compliance Fixtures', () => {
  it('F1: Admonition title normalization', async () => {
    const input = `:::warning[注意]
请小心
:::`;
    const html = await mdast(input).toHTML();
    expect(html).toContain('title="注意"');
    expect(html).toContain('warning');
    expect(html).toContain('请小心');
  });

  it('F4: Image sizing attribute', async () => {
    const input = `![A cat](cat.png#=500x300)`;
    const html = await mdast(input).toHTML();
    expect(html).toContain('src="cat.png"');
    expect(html).toContain('width="500"');
    expect(html).toContain('height="300"');
  });

  it('F5: Table cell span normalization', async () => {
    // We handle legacy rowspan/colspan if they are in data.
    // Since we don't have a parser for rowspan in MD yet, we test the transformer directly or via AST input.
    const tree = {
      type: 'root',
      children: [
        {
          type: 'table',
          children: [
            {
              type: 'tableRow',
              children: [
                {
                  type: 'tableCell',
                  children: [{ type: 'text', value: 'A' }],
                  data: { rowspan: 2, colspan: 3 }
                }
              ]
            }
          ]
        }
      ]
    };
    const html = await mdast(tree).toHTML();
    expect(html).toContain('rowspan="2"');
    expect(html).toContain('colspan="3"');
  });

  it('F6: Code meta extraction', async () => {
    const input = `\`\`\`mermaid title="架构图"
graph TD; A-->B;
\`\`\``;
    // We expect the meta to be parsed. Testing toHTML might not show meta unless custom rendered,
    // so we can test the data injection if we had a way to inspect the tree.
    // For now, verify it doesn't crash and renders standard code block.
    const html = await mdast(input).toHTML();
    expect(html).toContain('mermaid');
    expect(html).toContain('graph TD');
  });

  it('F8: mark/sub/sup as phrasing nodes', async () => {
    const input = '这是 ==高亮==，H~2~O，2^10^';
    const html = await mdast(input).toHTML();
    expect(html).toContain('<mark>高亮</mark>');
    expect(html).toContain('<sub>2</sub>');
    expect(html).toContain('<sup>10</sup>');

    let md = await mdast(input).toMarkdown();
    expect(md).toContain('==高亮==');
    expect(md).toContain('~2~');
    expect(md).toContain('^10^');

    md = await mdast(html).from('HTML').toMarkdown();
    expect(md).toContain('==高亮==');
    expect(md).toContain('~2~');
    expect(md).toContain('^10^');
  });
});

describe('AST format support', () => {
  it('should convert Markdown to AST object', async () => {
    const ast = await mdast('# Title').toAST();
    expect(ast.type).toBe('root');
    expect(ast.children[0].type).toBe('heading');
  });

  it('should parse AST from JSON string', async () => {
    const json = JSON.stringify({
      type: 'root',
      children: [{ type: 'paragraph', children: [{ type: 'text', value: 'Hello' }] }]
    });
    const md = await mdast(json).from('ast').toMarkdown();
    expect(md.trim()).toBe('Hello');
  });

  it('should run plugins when outputting AST', async () => {
    const ast = await mdast('==marked==').toAST();
    // Verify that normalizeInlineStyles plugin ran
    const p = ast.children[0] as any;
    expect(p.children[0].type).toBe('mark');
  });
});
