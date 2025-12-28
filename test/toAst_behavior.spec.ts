
import { describe, it, expect, vi } from 'vitest';
import { MdastPipeline, PipelineStage } from '../src/types';
import { mdast } from '../src/pipeline';

describe('toAst stopAtIndex Behavior', () => {
  it('should stop at the first plugin by default (stopAtIndex=0)', async () => {
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

    await pipeline.toAst({ stage: PipelineStage.parse });

    expect(plugin1).toHaveBeenCalled();
    expect(plugin2).not.toHaveBeenCalled();
  });

  it('should run up to the specified index when stopAtIndex is provided', async () => {
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

    await pipeline.toAst({ stage: PipelineStage.parse, stopAtIndex: 1 });

    expect(plugin1).toHaveBeenCalled();
    expect(plugin2).toHaveBeenCalled();
  });

  it('should not duplicate main plugins if they are included in the slice', async () => {
    const mainPlugin = vi.fn((tree) => tree);
    const normalPlugin = vi.fn((tree) => tree);

    const pipeline = mdast({ type: 'root', children: [] });
    
    // Main plugin at index 0
    pipeline.use({
      name: 'mainP',
      plugin: () => mainPlugin,
      stage: PipelineStage.parse,
      main: true
    });
    
    // Normal plugin at index 1
    pipeline.use({
      name: 'normalP',
      plugin: () => normalPlugin,
      stage: PipelineStage.parse,
    });

    // Run up to index 1 (should include both)
    await pipeline.toAst({ stage: PipelineStage.parse, stopAtIndex: 1 });

    expect(mainPlugin).toHaveBeenCalledTimes(1); // Should be called EXACTLY once
    expect(normalPlugin).toHaveBeenCalledTimes(1);
  });
});
