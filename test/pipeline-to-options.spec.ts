import { describe, it, expect, vi } from 'vitest';
import { PipelineStage } from '../src/types';
import { mdast } from '../src/pipeline';

describe('MdastPipeline.to() options', () => {
  it('should support PipelineRunOptions in to() directly', async () => {
    const plugin1 = vi.fn((tree) => tree);
    const plugin2 = vi.fn((tree) => tree);

    const pipeline = mdast({ type: 'root', children: [] });

    pipeline.use({
      name: 'p1',
      plugin: () => plugin1,
      stage: PipelineStage.parse,
    });

    pipeline.use({
      name: 'p2',
      plugin: () => plugin2,
      stage: PipelineStage.parse,
    });

    // Run only the first plugin of the parse stage
    const vfile = await pipeline.to('ast', { stage: PipelineStage.parse, stopAtIndex: 0 });

    expect(plugin1).toHaveBeenCalled();
    expect(plugin2).not.toHaveBeenCalled();
    expect(vfile.result).toBeDefined();
    expect((vfile.result as any).type).toBe('root');
  });

  it('should return AST when stopping early even for string formats (e.g. markdown)', async () => {
    // This confirms that to('markdown', { stage: ... }) behaves like a debugging tool
    // returning the AST at that point, rather than trying to stringify it.
    
    const plugin = vi.fn((tree) => {
      tree.children.push({ type: 'text', value: 'processed' });
      return tree;
    });

    const pipeline = mdast({ type: 'root', children: [] });
    pipeline.useAt(PipelineStage.compile, () => plugin);

    // Stop after compile stage
    const vfile = await pipeline.to('markdown', { stage: PipelineStage.compile });

    expect(plugin).toHaveBeenCalled();
    // Should contain AST, not string
    expect(typeof vfile.value).not.toBe('string'); 
    expect(vfile.result).toBeDefined();
    const root = vfile.result as any;
    expect(root.type).toBe('root');
    expect(root.children[0].value).toBe('processed');
  });

  it('should support overrides in to() options', async () => {
    const plugin = vi.fn((options) => (tree: any) => tree);
    
    const pipeline = mdast({ type: 'root', children: [] })
      .use({
         name: 'testPlugin',
         plugin: plugin as any,
         options: [{ val: 1 }]
      });

    await pipeline.to('ast', { 
        overrides: { 
            testPlugin: { val: 2 } 
        } 
    });

    expect(plugin).toHaveBeenCalledWith({ val: 2 });
  });
});
