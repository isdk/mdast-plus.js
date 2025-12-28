import { describe, it, expect, vi } from 'vitest';
import { mdast } from '../src';
import { PipelineStage } from '../src/types';

describe('use() Pluggable support', () => {
  it('should accept a simple plugin function', async () => {
    const plugin = vi.fn();
    const p = mdast('test').use(plugin);
    // Trigger pipeline
    await p.toMarkdown();
    expect(plugin).toHaveBeenCalled();
  });

  it('should accept a tuple [plugin, options]', async () => {
    const plugin = vi.fn();
    const options = { foo: 'bar' };
    const p = mdast('test').use([plugin, options]);
    await p.toMarkdown();
    // unified passes options as first arg
    expect(plugin).toHaveBeenCalledWith(options); 
  });

  it('should accept useAt(stage, plugin)', async () => {
     const plugin = vi.fn();
     const p = mdast('test') as any;
     p.useAt('parse', plugin);
     
     const queue = p.queue;
     const entry = queue.find((x: any) => x.plugin === plugin);
     expect(entry).toBeDefined();
     expect(entry.stage).toBe(PipelineStage.parse);
  });
  
  it('should accept useAt(stage, [plugin, options])', async () => {
     const plugin = vi.fn();
     const opts = { a: 1 };
     const p = mdast('test') as any;
     p.useAt('finalize', [plugin, opts]);
     
     const queue = p.queue;
     const entry = queue.find((x: any) => x.plugin === plugin);
     expect(entry.stage).toBe(PipelineStage.finalize);
     expect(entry.options[0]).toBe(opts);
  });

  it('should handle Preset (nested plugins)', async () => {
     const p1 = vi.fn();
     const p2 = vi.fn();
     const preset = {
         plugins: [
             { plugin: p1, options: ['opt1'] }, // MdastPlugin in preset
             [p2, 'opt2'] // Tuple in preset
         ]
     };
     
     const p = mdast('test') as any;
     p.use(preset as any);
     
     const queue = p.queue;
     const entry1 = queue.find((x: any) => x.plugin === p1);
     const entry2 = queue.find((x: any) => x.plugin === p2);
     
     expect(entry1).toBeDefined();
     expect(entry1.options).toEqual(['opt1']);
     
     expect(entry2).toBeDefined();
     expect(entry2.options).toEqual(['opt2']);
  });

  it('should support legacy useAt(MdastPlugin)', async () => {
      const plugin = vi.fn();
      const p = mdast('test') as any;
      p.useAt({ plugin, stage: 'parse', name: 'my-plugin' });
      
      const entry = p.queue.find((x: any) => x.name === 'my-plugin');
      expect(entry).toBeDefined();
      expect(entry.stage).toBe(PipelineStage.parse);
  });

  it('should support legacy useAt([MdastPlugin, MdastPlugin])', async () => {
      const p1 = vi.fn();
      const p2 = vi.fn();
      const p = mdast('test') as any;
      p.useAt([
          { plugin: p1, name: 'p1' },
          { plugin: p2, name: 'p2' }
      ]);
      
      const e1 = p.queue.find((x: any) => x.name === 'p1');
      const e2 = p.queue.find((x: any) => x.name === 'p2');
      expect(e1).toBeDefined();
      expect(e2).toBeDefined();
  });
});
