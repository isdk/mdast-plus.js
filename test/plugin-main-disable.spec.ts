
import { describe, it, expect } from 'vitest';
import { mdast, MdastPipeline } from '../src/pipeline';
import { MdastPlugin, PipelineStage } from '../src/types';

describe('Main Plugin Disabled Logic', () => {

  it('should not replace default parser if main plugin is disabled via false option', async () => {
    // Setup a custom format with a default parser
    const defaultParser: MdastPlugin = {
      name: 'default-parser',
      plugin: function() {
        this.parser = (doc: string) => ({ type: 'root', children: [{ type: 'text', value: 'default' }] });
      },
      stage: PipelineStage.parse
    };

    // Custom compiler to see output
    const defaultCompiler: MdastPlugin = {
        name: 'default-compiler',
        plugin: function() {
            this.compiler = (tree: any) => tree.children[0].value;
        },
        stage: PipelineStage.stringify
    };

    MdastPipeline.register({
      id: 'test-format',
      input: [defaultParser],
      output: [defaultCompiler]
    });

    // A main parser that we will disable
    const mainParser: MdastPlugin = {
      name: 'main-parser',
      plugin: function() {
        this.parser = (doc: string) => ({ type: 'root', children: [{ type: 'text', value: 'main' }] });
      },
      stage: PipelineStage.parse,
      main: true
    };

    // Use the main parser but disable it with `false`
    const result = await mdast('input')
      .from('test-format')
      .use(mainParser, false,1)
      .to('test-format');

    // Expectation: Since mainParser is disabled, it should NOT replace defaultParser.
    // So defaultParser should run.
    expect(result.value).toBe('default');
  });

  it('should replace default parser if main plugin is enabled', async () => {
    // Re-use test-format from previous test

    const mainParser: MdastPlugin = {
      name: 'main-parser-enabled',
      plugin: function() {
        this.parser = (doc: string) => ({ type: 'root', children: [{ type: 'text', value: 'main' }] });
      },
      stage: PipelineStage.parse,
      main: true
    };

    const result = await mdast('input')
      .from('test-format')
      .use(mainParser)
      .to('test-format');

    expect(result.value).toBe('main');
  });
});
