import { unified, type Processor } from 'unified';
import type { Root } from 'mdast';
import type {
  MdastPlugin,
  ConvertResult,
  MdastAsset,
  MdastFormatDefinition,
  MdastPlusOptions,
} from './types';

// Default Formats
import { markdownFormat } from './formats/markdown';
import { htmlFormat } from './formats/html';

// Default Plugins
import { normalizeDirectivePlugin } from './plugins/normalize-directive';
import { normalizeTableSpanPlugin } from './plugins/normalize-table-span';
import { extractCodeMetaPlugin } from './plugins/extract-code-meta';
import { imageSizePlugin } from './plugins/image-size';
import { inlineStylesPlugin } from './plugins/normalize-inline-styles';

/**
 * Fluent processor for mdast transformations.
 * Allows chaining configuration and finally converting to a target format.
 */
export class FluentProcessor {
  /** Map of registered format definitions */
  static formats: Record<string, MdastFormatDefinition> = {
    markdown: markdownFormat,
    html: htmlFormat,
    ast: {
      needsTransformToMdast: false,
      parse: (p) => {
        p.Parser = (text: string) => JSON.parse(text);
      },
      stringify: (p) => {
        p.Compiler = (node: any) => node;
      },
    },
  };

  /**
   * Registers a new format definition.
   * @param name - The name of the format (e.g., 'docx')
   * @param definition - The format definition containing parse/stringify logic
   */
  static registerFormat(name: string, definition: MdastFormatDefinition) {
    FluentProcessor.formats[name.toLowerCase()] = definition;
  }

  private processor: Processor;
  private input: any;
  private inputFormat: string = 'markdown';
  private plugins: MdastPlugin[] = [];
  private globalData: Record<string, any> = {};
  private _options: MdastPlusOptions = {};

  /**
   * Creates a new FluentProcessor instance.
   * @param input - The input content (string or mdast tree)
   * @param options - The options for mdast-plus
   */
  constructor(input: any, options?: MdastPlusOptions) {
    this.input = input;
    if (options) {
      this._options = options;
    }
    this.processor = unified();

    // Core Normalization Plugins (Default)
    this.use(normalizeDirectivePlugin);
    this.use(normalizeTableSpanPlugin);
    this.use(extractCodeMetaPlugin);
    this.use(imageSizePlugin);
    this.use(inlineStylesPlugin);
  }

  /**
   * Specifies the input format.
   * @param format - The input format name (default: 'markdown')
   */
  from(format: string): this {
    this.inputFormat = format.toLowerCase();
    return this;
  }

  /**
   * Adds a plugin to the processing pipeline.
   * @param plugin - The mdast plugin to use
   */
  use(plugin: MdastPlugin): this {
    this.plugins.push(plugin);
    return this;
  }

  /**
   * Merges global data into the processor.
   * @param data - Key-value pairs to store in global data
   */
  data(data: Record<string, any>): this {
    this.globalData = { ...this.globalData, ...data };
    return this;
  }

  /**
   * Merges options into the processor.
   * @param options - The options for mdast-plus
   */
  options(options: MdastPlusOptions): this {
    this._options = {
      ...this._options,
      ...options,
      markdown: { ...this._options?.markdown, ...options?.markdown },
      html: { ...this._options?.html, ...options?.html },
    };
    return this;
  }

  /**
   * Converts the input content to the specified format.
   * @param format - The output format name
   * @returns A promise resolving to the conversion result (content and assets)
   */
  async to(format: string): Promise<ConvertResult> {
    format = format.toLowerCase();

    // 1. Setup Input Parser
    const inputProcessor = unified();
    const inputFormatDef = FluentProcessor.formats[this.inputFormat];
    if (inputFormatDef?.parse) {
      inputFormatDef.parse(inputProcessor, this._options);
    }

    // 2. Parse & Transform to mdast
    let tree = (typeof this.input === 'string'
      ? inputProcessor.parse(this.input)
      : this.input) as Root;

    const needsRun = inputFormatDef.needsTransformToMdast !== false; // default to true
    const isAstOutput = format === 'ast';

    // Run transformers if the format definition requires it (e.g., for HAST -> MDAST),
    // but skip it if the user just wants the intermediate AST for debugging/testing.
    if (needsRun && !isAstOutput) {
      tree = await inputProcessor.run(tree) as Root;
    }

    // 3. Inject global data into tree
    tree.data = { ...tree.data, ...this.globalData };

    // 4. Staged Transform
    const sortedPlugins = [...this.plugins].sort((a, b) => {
      const stages: Record<string, number> = { normalize: 0, compile: 1, finalize: 2 };
      const aStage = a.stage || 'normalize';
      const bStage = b.stage || 'normalize';

      if (aStage !== bStage) {
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
      outputFormatDef.stringify(outputProcessor, this._options);
    }
    if (format === 'markdown' && !outputFormatDef) {
      // fallback if somehow removed
      markdownFormat.stringify!(outputProcessor, this._options);
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

  /**
   * Helper to convert content to Markdown.
   * @returns A promise resolving to the Markdown string
   */
  async toMarkdown(): Promise<string> {
    const result = await this.to('markdown');
    return result.content;
  }

  /**
   * Helper to convert content to HTML.
   * @returns A promise resolving to the HTML string
   */
  async toHTML(): Promise<string> {
    const result = await this.to('html');
    return result.content;
  }

  /**
   * Helper to get the processed mdast tree.
   * @returns A promise resolving to the mdast Root node
   */
  async toAST(): Promise<Root> {
    const result = await this.to('ast');
    return result.content as any;
  }
}

/**
 * Entry point for the fluent mdast-plus API.
 * @param input - The input content (string or mdast tree)
 * @param options - The options for mdast-plus
 * @returns A FluentProcessor instance
 */
export function mdast(input: any, options?: MdastPlusOptions): FluentProcessor {
  return new FluentProcessor(input, options);
}
