import type { Plugin } from 'unified';
import type { Parent as UnistParent } from 'unist';
import type { Root, PhrasingContent } from 'mdast';
import type { Properties } from 'hast';

/**
 * PipelineStage defines the execution order of plugins in the processing pipeline.
 * Plugins are sorted and executed in ascending order based on these stage values.
 */
export enum PipelineStage {
  /** Initial stage for parsing raw input (e.g., string to AST). */
  parse     = 0,
  /** Normalization stage for cleaning up and canonicalizing the AST (e.g., GFM, Directives). */
  normalize = 100,
  /** Transformation stage for semantic changes and custom high-level logic. */
  compile   = 200,
  /** Finalization stage for preparing the AST for output (e.g., Sanitize, bridge to HAST). */
  finalize  = 300,
  /** Final stage for serializing the AST to the target format result. */
  stringify = 400
}

/** The default stage assigned to a plugin if none is specified. */
export const DefaultPipelineStage = PipelineStage.compile;

/** String names corresponding to the PipelineStage levels. */
export type PipelineStageName = keyof typeof PipelineStage;

/**
 * Configuration for a plugin within the mdast-plus pipeline.
 * It wraps a standard unified plugin with execution metadata.
 */
export interface MdastPlugin {
  /**
   * Optional name for the plugin. 
   * Used for identification in overrides and logging.
   * If not provided, defaults to the plugin function's name.
   */
  name?: string;
  /** The standard unified plugin (attacher) function. */
  plugin: Plugin<any[], any, any>;
  /**
   * Arguments passed to the plugin.
   * MUST be an array of arguments (e.g., [optionsObject]).
   */
  options?: any[];
  /** The stage in which this plugin should run. */
  stage?: PipelineStage | PipelineStageName;
  /** Execution priority within the same stage. Lower values run earlier. */
  order?: number;
}

/**
 * Defines a document format, encompassing its input (parsing) and output (serialization) strategies.
 */
export interface MdastFormat {
  /** Unique identifier for the format (e.g., 'markdown', 'html'). */
  id: string;
  /** Human-readable title. */
  title?: string;
  /** File extensions associated with this format. */
  extensions?: string[];
  /** MIME types associated with this format. */
  mediaTypes?: string[];

  /** Plugins used for reading this format into a standard AST (Parser + Normalizer). */
  input?: MdastPlugin[];

  /** Plugins used for serializing the AST into this format (Finalizer + Stringifier). */
  output?: MdastPlugin[];
}

/**
 * Metadata capturing the origin of a node during conversion.
 */
export interface MdastDataOrigin {
  /** The original source format. */
  format: 'docx' | 'notion' | 'html' | 'markdown' | 'latex' | string;
  /** The raw content from the source before conversion. */
  raw?: unknown;
  /** Hash used for caching or change detection. */
  hash?: string;
  [k: string]: unknown;
}

/** Represents a highlighted text (mark) node in mdast. */
export interface MdastMark extends UnistParent {
  type: 'mark';
  children: PhrasingContent[];
}

/** Represents a subscript text node in mdast. */
export interface MdastSub extends UnistParent {
  type: 'sub';
  children: PhrasingContent[];
}

/** Represents a superscript text node in mdast. */
export interface MdastSup extends UnistParent {
  type: 'sup';
  children: PhrasingContent[];
}

declare module 'mdast' {
  interface Data {
    /** Target HTML tag name */
    hName?: string;
    /** Target HTML properties */
    hProperties?: Properties;
    /** Source origin information */
    _origin?: MdastDataOrigin;
  }

  interface CodeData extends Data {
    /** Title of the code block */
    title?: string;
    /** Path to the code file */
    filename?: string;
    /** Extra key-value metadata */
    kv?: Record<string, any>;
  }

  interface TableCellData extends Data {
    /** Table cell row span */
    rowspan?: number;
    /** Table cell column span */
    colspan?: number;
  }

  interface PhrasingContentMap {
    mark: MdastMark;
    sub: MdastSub;
    sup: MdastSup;
  }
}
