import { unified, type Processor } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import type { Root } from 'mdast';
import type { MdastPlugin, ConvertResult, MdastAsset, MdastFormatDefinition } from './types';

// Default Formats
import { markdownFormat } from './formats/markdown';
import { htmlFormat } from './formats/html';

// Default Plugins
import { normalizeDirectivePlugin } from './plugins/normalize-directive';
import { normalizeTableSpanPlugin } from './plugins/normalize-table-span';
import { extractCodeMetaPlugin } from './plugins/extract-code-meta';
import { imageSizePlugin } from './plugins/image-size';

export class FluentProcessor {
  static formats: Record<string, MdastFormatDefinition> = {
    markdown: {
      parse: (p) => p.use(remarkParse).use(markdownFormat),
      stringify: (p) => p.use(remarkStringify).use(markdownFormat),
    },
    html: {
      parse: (p) => p.use(rehypeParse).use(rehypeRemark),
      stringify: (p) => p.use(htmlFormat),
    },
    ast: {
      parse: (p) => { },
    },
  };

  static registerFormat(name: string, definition: MdastFormatDefinition) {
    FluentProcessor.formats[name] = definition;
  }

  private processor: Processor;
  private input: any;
  private inputFormat: string = 'markdown';
  private plugins: MdastPlugin[] = [];
  private globalData: Record<string, any> = {};

  constructor(input: any) {
    this.input = input;
    this.processor = unified();

    // Core Normalization Plugins (Default)
    this.use(normalizeDirectivePlugin);
    this.use(normalizeTableSpanPlugin);
    this.use(extractCodeMetaPlugin);
    this.use(imageSizePlugin);
  }

  from(format: string): this {
    this.inputFormat = format;
    return this;
  }

  use(plugin: MdastPlugin): this {
    this.plugins.push(plugin);
    return this;
  }

  data(data: Record<string, any>): this {
    this.globalData = { ...this.globalData, ...data };
    return this;
  }

  async to(format: string): Promise<ConvertResult> {
    // 1. Setup Input Parser
    const inputFormatDef = FluentProcessor.formats[this.inputFormat];
    if (inputFormatDef?.parse) {
      inputFormatDef.parse(this.processor);
    }

    // 2. Parse
    let tree = (typeof this.input === 'string'
      ? this.processor.parse(this.input)
      : this.input) as Root;

    // 3. Inject global data into tree
    tree.data = { ...tree.data, ...this.globalData };

    // 4. Staged Transform
    const sortedPlugins = [...this.plugins].sort((a, b) => {
      const stages: Record<string, number> = { normalize: 0, compile: 1, finalize: 2 };
      if (a.stage !== b.stage) {
        const aStage = a.stage || 'normalize';
        const bStage = b.stage || 'normalize';
        return stages[aStage] - stages[bStage];
      }
      return (a.order || 0) - (b.order || 0);
    });

    for (const plugin of sortedPlugins) {
      await plugin.transform(tree, this.processor);
    }

    // 5. Setup Output Compiler
    const outputProcessor = unified().data('settings', this.processor.data('settings'));
    const outputFormatDef = FluentProcessor.formats[format];
    if (outputFormatDef?.stringify) {
      outputFormatDef.stringify(outputProcessor);
    }
    if (format === 'markdown' && !outputFormatDef) {
      // fallback if somehow removed
      outputProcessor.use(remarkStringify).use(markdownFormat);
    }

    // 6. Finalize (compile)
    const result = await outputProcessor.run(tree);
    const content = outputProcessor.stringify(result) as string;

    // 7. Extract Assets
    const assets: MdastAsset[] = [];
    if (tree.data && (tree.data as any).assets) {
      assets.push(...(tree.data as any).assets);
    }

    return { content, assets };
  }

  async toMarkdown(): Promise<string> {
    const result = await this.to('markdown');
    return result.content;
  }

  async toHTML(): Promise<string> {
    const result = await this.to('html');
    return result.content;
  }
}

export function mdast(input: any): FluentProcessor {
  return new FluentProcessor(input);
}
