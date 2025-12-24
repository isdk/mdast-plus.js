import { describe, it, expect } from 'vitest';
import { mdast, FluentProcessor } from '../src';

describe('custom formats', () => {
  it('should support registered custom formats', async () => {
    FluentProcessor.registerFormat('reverse', {
      stringify: (p) => {
        const Compiler = (tree: any) => {
          // simple reverse stringify for testing
          if (tree.type === 'root') {
            return tree.children.map(Compiler).join('\n');
          }
          if (tree.type === 'paragraph') {
            return tree.children.map(Compiler).join('');
          }
          if (tree.type === 'text') {
            return tree.value.split('').reverse().join('');
          }
          return '';
        };
        p.Compiler = Compiler;
      }
    });

    const result = await mdast('Hello').to('reverse');
    expect(result.content).toBe('olleH');
  });

  it('should support custom input format', async () => {
    FluentProcessor.registerFormat('simple', {
      parse: (p) => {
        p.Parser = (text: string) => {
          return {
            type: 'root',
            children: [{
              type: 'paragraph',
              children: [{ type: 'text', value: text.toUpperCase() }]
            }]
          };
        };
      }
    });

    const result = await mdast('hello').from('simple').toMarkdown();
    expect(result.trim()).toBe('HELLO');
  });
});
