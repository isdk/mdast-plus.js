import { describe, it, expect, vi } from 'vitest';
import { mdast } from '../src';
import type { Plugin } from 'unified';

describe('MdastPipeline.configure', () => {
  it('should modify options of a queued plugin by name', async () => {
    const mockPlugin: Plugin<[ { value: string }? ]> = vi.fn((options) => {
      return (tree: any) => {
        tree.val = options?.value;
        return tree;
      };
    });

    const result = await mdast('# Hello')
      .use({ name: 'my-plugin', plugin: mockPlugin, options: [{ value: 'old' }] })
      .configure('my-plugin', { value: 'new' })
      .toAst();

    expect(mockPlugin).toHaveBeenCalledWith({ value: 'new' });
    expect((result as any).val).toBe('new');
  });

  it('should modify options of the LAST added plugin when names collide (different plugin functions)', async () => {
    const results: number[] = [];
    const plugin1: Plugin<[ { id: number }? ]> = (options) => (tree) => {
      results.push(options?.id ?? 0);
    };
    const plugin2: Plugin<[ { id: number }? ]> = (options) => (tree) => {
      results.push(options?.id ?? 0);
    };

    // Add two different plugins with the same explicit name
    const pipeline = mdast('# Hello')
      .use({ name: 'dup', plugin: plugin1, options: [{ id: 1 }] })
      .use({ name: 'dup', plugin: plugin2, options: [{ id: 2 }] });

    // Configure 'dup' -> should affect plugin2 (last added)
    await pipeline
      .configure('dup', { id: 99 })
      .toAst();

    // plugin1 should still have id: 1, plugin2 should have id: 99
    expect(results).toEqual([1, 99]);
  });

  it('should match by function name if explicit name is missing', async () => {
    function namedPlugin(options: any) {
      return (tree: any) => {
        tree.namedVal = options?.val;
      };
    }

    const result = await mdast('# Hello')
      .use(namedPlugin, { val: 'initial' })
      .configure('namedPlugin', { val: 'configured' })
      .toAst();

    expect((result as any).namedVal).toBe('configured');
  });
});
