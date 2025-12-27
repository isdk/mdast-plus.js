import { describe, it, expect, vi } from 'vitest';
import { mdast } from '../src/pipeline';
import { PipelineStage } from '../src/types';

describe('MdastPipeline useAt overload', () => {
  it('should support traditional useAt(stage, plugin, ...options)', async () => {
    const plugin = vi.fn((options) => (tree: any) => tree);
    const pipeline = mdast('# Hello')
      .useAt('compile', plugin, { foo: 'bar' });
    
    await pipeline.toAst();
    
    expect(plugin).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should support useAt(MdastPlugin)', async () => {
    const plugin = vi.fn((options) => (tree: any) => tree);
    const mdastPlugin = {
      plugin,
      options: [{ foo: 'baz' }],
      stage: 'compile' as const
    };
    
    const pipeline = mdast('# Hello')
      .useAt(mdastPlugin);
    
    await pipeline.toAst();
    
    expect(plugin).toHaveBeenCalledWith({ foo: 'baz' });
  });

  it('should support useAt(MdastPlugin, ...options) and override options', async () => {
    const plugin = vi.fn((options) => (tree: any) => tree);
    const mdastPlugin = {
      plugin,
      options: [{ foo: 'baz' }],
      stage: 'compile' as const
    };
    
    const pipeline = mdast('# Hello')
      .useAt(mdastPlugin, { foo: 'qux' });
    
    await pipeline.toAst();
    
    expect(plugin).toHaveBeenCalledWith({ foo: 'qux' });
  });

  it('should use default stage if not specified in MdastPlugin', async () => {
    const plugin = vi.fn((options) => (tree: any) => tree);
    const mdastPlugin = {
      plugin
    };
    
    const pipeline = mdast('# Hello')
      .useAt(mdastPlugin);
    
    // @ts-ignore: access private queue for testing
    const lastPlugin = pipeline.queue[pipeline.queue.length - 1];
    expect(lastPlugin.stage).toBe(PipelineStage.compile);
  });

  it('should support numeric PipelineStage in useAt', async () => {
    const plugin = vi.fn((options) => (tree: any) => tree);
    const pipeline = mdast('# Hello')
      .useAt(PipelineStage.normalize, plugin, { foo: 'bar' });
    
    // @ts-ignore: access private queue for testing
    const lastPlugin = pipeline.queue[pipeline.queue.length - 1];
    expect(lastPlugin.stage).toBe(PipelineStage.normalize);

    await pipeline.toAst();
    expect(plugin).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('should support numeric PipelineStage in toAst', async () => {
    const plugin = vi.fn((options) => (tree: any) => tree);
    const pipeline = mdast('# Hello')
      .useAt(PipelineStage.normalize, plugin);
    
    await pipeline.toAst({ stage: PipelineStage.normalize });
    expect(plugin).toHaveBeenCalled();

    const pluginCompile = vi.fn((options) => (tree: any) => tree);
    pipeline.useAt(PipelineStage.compile, pluginCompile);

    await pipeline.toAst({ stage: PipelineStage.normalize });
    expect(pluginCompile).not.toHaveBeenCalled();

    await pipeline.toAst({ stage: PipelineStage.compile });
    expect(pluginCompile).toHaveBeenCalled();
  });
});
