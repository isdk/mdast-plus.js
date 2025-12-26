import { unified, type Processor } from 'unified';
import { VFile, type VFileCompatible } from 'vfile';

import type { Root } from 'mdast';

import { DefaultPipelineStage, type MdastFormat, type MdastPlugin, PipelineStage, PipelineStageName } from './types';

// Default Formats
import { markdownFormat } from './formats/markdown';
import { htmlFormat } from './formats/html';
import { astFormat, astCompiler } from './formats/ast';

/**
 * Checks if the given input is a unist/mdast Node.
 * @param input - The object to check.
 * @returns True if it's a Node object with a 'type' property.
 */
function isNode(input: any): boolean {
  return typeof input === 'object' && input !== null && typeof input.type === 'string';
}

/**
 * Base implementation of the fluent mdast processing pipeline.
 * Manages the plugin registry and the execution queue.
 */
export class MdastBasePipeline {
  private static readonly registry = new Map<string, MdastFormat>();

  /**
   * Registers a global document format.
   * @param format - The format definition to register.
   */
  public static register(format: MdastFormat) {
    this.registry.set(format.id, format);
  }

  /**
   * Retrieves a registered format by its ID.
   * @param id - The format identifier.
   * @returns The format definition or undefined if not found.
   */
  public static getFormat(id: string): MdastFormat | undefined {
    return this.registry.get(id);
  }

  protected input: VFileCompatible;
  protected queue: MdastPlugin[] = [];

  /**
   * Initializes a new pipeline instance with the given input.
   * @param input - Content to process (string, Buffer, VFile, or AST Node).
   */
  constructor(input: VFileCompatible) {
    this.input = input;
  }

  /**
   * Instance-level access to the global format registry.
   */
  public getFormat(id: string): MdastFormat | undefined {
    const ctor = this.constructor as typeof MdastPipeline;
    return ctor.getFormat(id);
  }

  /**
   * Resolves a format identifier or object to a valid MdastFormat.
   * @private
   */
  private resolveFormat(fmt: string | MdastFormat): MdastFormat {
    if (typeof fmt === 'string') {
      const found = this.getFormat(fmt);
      if (!found) {
        throw new Error(`[MdastPlus] Format '${fmt}' is not registered.`);
      }
      return found;
    }
    return fmt;
  }

  /**
   * Normalizes a plugin entry for runtime execution.
   * @protected
   */
  protected toRuntimeEntry(
    entry: MdastPlugin,
    defaultStage: PipelineStage,
    overrides?: Record<string, any>
  ): MdastPlugin & { stage: PipelineStage } {
    let stage = defaultStage;
    if (entry.stage !== undefined) {
      if (typeof entry.stage === 'string') {
        stage = PipelineStage[entry.stage] ?? defaultStage;
      } else {
        stage = entry.stage as PipelineStage;
      }
    }

    let options = entry.options || [];
    // Prefer explicit name, fall back to function name
    const pluginName = entry.name || entry.plugin.name;

    if (overrides && pluginName) {
        if (pluginName in overrides) {
            const override = overrides[pluginName];
            options = Array.isArray(override) ? override : [override];
        }
    }

    return {
      name: pluginName,
      plugin: entry.plugin,
      options,
      stage,
      order: entry.order || 0
    };
  }

  /**
   * Ensures that input plugins (parser, normalizers) are present in the queue.
   * Adds implicit plugins if no parser is detected.
   * @protected
   */
  protected ensureInputPlugins(queue: MdastPlugin[], overrides?: Record<string, any>, maxStage: PipelineStage = PipelineStage.stringify) {
     const hasParser = queue.some(p => (p.stage ?? DefaultPipelineStage) === PipelineStage.parse);
     const inputIsNode = isNode(this.input);

     if (!hasParser) {
        let pluginsToAdd: MdastPlugin[] = [];
        if (inputIsNode) {
             const astFormat = MdastBasePipeline.getFormat('ast');
             if (astFormat && astFormat.input) pluginsToAdd = astFormat.input;
        } else {
             const mdFormat = MdastBasePipeline.getFormat('markdown');
             if (mdFormat && mdFormat.input) pluginsToAdd = mdFormat.input;
        }

        for (const p of pluginsToAdd) {
            const runtimeP = this.toRuntimeEntry(p, PipelineStage.parse, overrides);
            if ((runtimeP.stage ?? DefaultPipelineStage) <= maxStage) {
                queue.push(runtimeP);
            }
        }
     }
  }

  /**
   * Configures the input format and adds its associated plugins to the pipeline.
   * @param fmt - Format ID or definition.
   * @param overrides - Optional map to override plugin options by plugin name.
   * @returns The pipeline instance for chaining.
   */
  public from(fmt: string | MdastFormat, overrides?: Record<string, any>): this {
    const format = this.resolveFormat(fmt);
    if (!format.input || format.input.length === 0) {
      throw new Error(`[MdastPlus] Format '${format.id}' does not support input.`);
    }

    // Input plugins default to the Parse (0) stage.
    for (const p of format.input) {
      this.queue.push(this.toRuntimeEntry(p, PipelineStage.parse, overrides));
    }

    return this;
  }

  /**
   * Processes the pipeline and serializes the result into the specified format.
   * @param fmt - Target format ID or definition.
   * @param overrides - Optional map to override plugin options.
   * @returns A promise resolving to a VFile containing the result.
   */
  public async to(fmt: string | MdastFormat, overrides?: Record<string, any>): Promise<VFile> {
    const format = this.resolveFormat(fmt);
    if (!format.output) {
      throw new Error(`[MdastPlus] Format '${format.id}' does not support output.`);
    }

    // 1. Fork Queue
    const runQueue = [...this.queue];

    // Check implicit input format BEFORE adding output plugins
    this.ensureInputPlugins(runQueue, overrides);

    // 2. Append Output Plugins
    // Output plugins default to the Finalize (300) stage.
    for (const p of format.output) {
      runQueue.push(this.toRuntimeEntry(p, PipelineStage.finalize, overrides));
    }

    // 3. Assemble & Run
    const processor = this.assembleProcessor(runQueue);

    if (isNode(this.input)) {
        // Input is AST: Skip Parsing. Run transformers then stringify.
        const tree = await processor.run(this.input as any);
        const result = processor.stringify(tree);
        const file = new VFile();
        if (typeof result === 'string' || Buffer.isBuffer(result)) {
            file.value = result;
        } else {
            file.result = result;
        }
        return file;
    } else {
        return processor.process(this.input);
    }
  }

  /**
   * Adds a plugin to the pipeline's compile stage.
   * @param plugin - The unified plugin function.
   * @param options - Arguments for the plugin.
   * @returns The pipeline instance for chaining.
   */
  public use(plugin: any, ...options: any[]): this {
    return this.useAt('compile', plugin, ...options);
  }

  /**
   * Adds a plugin to the pipeline at a specific stage.
   * @param stage - The stage name or numeric value.
   * @param plugin - The unified plugin function.
   * @param options - Arguments for the plugin.
   * @returns The pipeline instance for chaining.
   */
  public useAt(stage: PipelineStageName, plugin: any, ...options: any[]): this {
    this.queue.push({
      plugin,
      options,
      stage: PipelineStage[stage],
      order: 0
    });
    return this;
  }

  /**
   * Sets the priority order for the most recently added plugin.
   * Plugins with lower order run earlier within the same stage.
   * @param order - Numeric priority.
   * @returns The pipeline instance for chaining.
   */
  public priority(order: number): this {
    const last = this.queue[this.queue.length - 1];
    if (last) {
      last.order = order;
    }
    return this;
  }

  /**
   * Assembles a unified processor based on the sorted plugin queue.
   * @protected
   */
  protected assembleProcessor(queue: MdastPlugin[]): Processor {
    queue.sort((a, b) => {
      const aStage = (a.stage as PipelineStage) ?? DefaultPipelineStage;
      const bStage = (b.stage as PipelineStage) ?? DefaultPipelineStage;
      if (aStage !== bStage) return aStage - bStage;
      return a.order! - b.order!;
    });

    const processor = unified();

    for (const entry of queue) {
      processor.use(entry.plugin, ...(entry.options || []));
    }

    return processor;
  }
}

/**
 * Extended pipeline with convenience methods for common formats.
 */
export class MdastPipeline extends MdastBasePipeline {
  /**
   * Finalizes the pipeline and returns the result as a Markdown string.
   */
  public async toMarkdown() {
    const vfile = await this.to('markdown');
    return String(vfile);
  }

  /**
   * Finalizes the pipeline and returns a VFile containing the Markdown result.
   */
  public toMarkdownVFile() {
    return this.to('markdown');
  }

  /**
   * Finalizes the pipeline and returns the result as an HTML string.
   */
  public async toHtml() {
    const vfile = await this.to('html');
    return String(vfile);
  }

  /**
   * Finalizes the pipeline and returns a VFile containing the HTML result.
   */
  public toHtmlVFile() {
    return this.to('html');
  }

  /**
   * Finalizes the pipeline and returns the resulting AST (Root node).
   * @param options - Configuration for the extraction.
   * @param options.stage - Run the pipeline up to this stage only.
   * @param options.overrides - Map for plugin option overrides.
   */
  public async toAst(options?: { stage?: PipelineStageName, overrides?: Record<string, any> }) {
    if (options?.stage) {
      const targetStage = PipelineStage[options.stage];
      // Run only up to the specified stage
      const runQueue = this.queue.filter(p => {
        const s = (p.stage as PipelineStage) ?? DefaultPipelineStage;
        return s <= targetStage;
      });

      // Add the pass-through compiler to return the AST
      runQueue.push({
        plugin: astCompiler,
        options: [],
        stage: PipelineStage.stringify,
        order: 0
      });

      this.ensureInputPlugins(runQueue, options.overrides, targetStage);

      const processor = this.assembleProcessor(runQueue);

      if (isNode(this.input)) {
          const tree = await processor.run(this.input as any);
          return tree as Root;
      } else {
          const vfile = await processor.process(this.input);
          return vfile.result as Root;
      }

    } else {
      const vfile = await this.to('ast', options?.overrides);
      return vfile.result as Root;
    }
  }

  /** Alias for toHtml() */
  public toHTML() { return this.toHtml(); }
  /** Alias for toAst() */
  public toAST(options?: { stage?: PipelineStageName, overrides?: Record<string, any> }) { return this.toAst(options); }
}

MdastPipeline.register(markdownFormat);
MdastPipeline.register(htmlFormat);
MdastPipeline.register(astFormat);

/**
 * Entry point for the fluent mdast-plus API.
 * @param input - The input content (string or mdast tree)
 * @returns A FluentProcessor instance
 */
export function mdast(input: VFileCompatible): MdastPipeline {
  return new MdastPipeline(input);
}