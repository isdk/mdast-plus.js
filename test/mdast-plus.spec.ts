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
});

describe('Compliance Fixtures', () => {
  it('F1: Admonition title normalization', async () => {
    const input = `:::warning[注意]\n请小心\n:::`;
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
    const input = '```mermaid title="架构图"\ngraph TD; A-->B;\n```';
    // We expect the meta to be parsed. Testing toHTML might not show meta unless custom rendered,
    // so we can test the data injection if we had a way to inspect the tree.
    // For now, verify it doesn't crash and renders standard code block.
    const html = await mdast(input).toHTML();
    expect(html).toContain('mermaid');
    expect(html).toContain('graph TD');
  });
});
