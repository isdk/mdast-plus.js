import { describe, it, expect } from 'vitest';
import { mdast, MdastPipeline, PipelineStage } from '../src';

describe('custom formats', () => {
  it('should support registered custom formats', async () => {
    MdastPipeline.register({
      id: 'reverse',
      output: [{
        plugin: function() {
          this.Compiler = (tree: any) => {
            // simple reverse stringify for testing
            if (tree.type === 'root') {
              return tree.children.map(this.Compiler).join('\n');
            }
            if (tree.type === 'paragraph') {
              return tree.children.map(this.Compiler).join('');
            }
            if (tree.type === 'text') {
              return tree.value.split('').reverse().join('');
            }
            return '';
          };
        },
        stage: PipelineStage.stringify
      }]
    });

    const result = await mdast('Hello').to('reverse');
    expect(String(result)).toBe('olleH');
  });

  it('should support custom input format', async () => {
    MdastPipeline.register({
      id: 'simple',
      input: [{
        plugin: function() {
          this.Parser = (text: string) => {
            return {
              type: 'root',
              children: [{
                type: 'paragraph',
                children: [{ type: 'text', value: text.toUpperCase() }]
              }]
            };
          };
        },
        stage: PipelineStage.parse
      }]
    });

    const result = await mdast('hello').from('simple').toMarkdown();
    expect(result.trim()).toBe('HELLO');
  });
});
