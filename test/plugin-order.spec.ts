import { describe, it, expect } from 'vitest';
import { mdast, PipelineStage } from '../src';

describe('Plugin Stage and Order', () => {
  it('should execute plugins in order of stage and priority (order)', async () => {
    const executionOrder: string[] = [];

    const createPlugin = (name: string, stage?: any, order?: number) => ({
      plugin: function() {
        return (tree: any) => {
          executionOrder.push(name);
        };
      },
      stage,
      order,
    });

    // We add plugins in random order of stage/priority
    await mdast('# test')
      .useAt('finalize', createPlugin('finalize-1', undefined, 1).plugin)
      .priority(1)
      .useAt('compile', createPlugin('compile-1', undefined, 1).plugin)
      .priority(1)
      .useAt('normalize', createPlugin('normalize-2', undefined, 2).plugin)
      .priority(2)
      .useAt('compile', createPlugin('compile-0', undefined, 0).plugin)
      .priority(0)
      .useAt('normalize', createPlugin('normalize-1', undefined, 1).plugin)
      .priority(1)
      .useAt('finalize', createPlugin('finalize-0', undefined, 0).plugin)
      .priority(0)
      .toHTML();

    // Filter only our test plugins to avoid noise from default plugins
    const filteredOrder = executionOrder.filter(name =>
      ['normalize', 'compile', 'finalize'].some(s => name.startsWith(s))
    );

    expect(filteredOrder).toEqual([
      'normalize-1',
      'normalize-2',
      'compile-0',
      'compile-1',
      'finalize-0',
      'finalize-1'
    ]);
  });

  it('should use default stage (compile) and default order (0)', async () => {
    const executionOrder: string[] = [];

    const createPlugin = (name: string) => {
      return function() {
        return (tree: any) => {
          executionOrder.push(name);
        };
      };
    };

    await mdast('# test')
      .use(createPlugin('default-plugin')) // stage: compile, order: 0
      .useAt('compile', createPlugin('after-default'))
      .priority(1)
      .toHTML();

    const filteredOrder = executionOrder.filter(name =>
      name === 'default-plugin' || name === 'after-default'
    );

    expect(filteredOrder).toEqual([
      'default-plugin',
      'after-default'
    ]);
  });

  it('should correctly sort implicit (undefined) stage and explicit "normalize" stage', async () => {
    const executionOrder: string[] = [];
    const createP = (name: string) => function() {
      return () => { executionOrder.push(name); };
    };

    // Bug regression: implicit stage (undefined) vs explicit 'normalize'
    // should still be sorted by order within the same stage.
    await mdast('# test')
      .useAt('normalize', createP('explicit-1'))
      .priority(1)
      .useAt('normalize', createP('implicit-2'))
      .priority(2)
      .useAt('normalize', createP('explicit-0'))
      .priority(0)
      .useAt('normalize', createP('implicit-1'))
      .priority(1)
      .toHTML();

    const filtered = executionOrder.filter(n => n.includes('implicit') || n.includes('explicit'));
    expect(filtered).toEqual([
      'explicit-0',
      'explicit-1',
      'implicit-1',
      'implicit-2'
    ]);
  });
});
