import type { Parent as UnistParent } from 'unist';
import type { Root, PhrasingContent } from 'mdast';
import type { Properties } from 'hast';

/**
 * Stages for mdast-plus pipeline processing.
 */
export type Stage = 'normalize' | 'compile' | 'finalize';

/**
 * Definition for an mdast plugin.
 */
export interface MdastPlugin {
  /** Plugin name */
  name: string;
  /** Processing stage the plugin belongs to */
  stage?: Stage;
  /** Execution order within the stage (lower numbers run first) */
  order?: number;
  /** Transformation function */
  transform: (tree: Root, ctx: any) => Promise<void> | void;
}

/**
 * Options for `mdast-plus` processor.
 * Assumes that all plugins for a given format (e.g., markdown)
 * have unique option keys.
 */
export interface MdastPlusOptions {
  /**
   * A bag of options for all markdown-related plugins (remark-parse, remark-gfm, etc.).
   */
  markdown?: Record<string, any>;
  /**
   * A bag of options for all HTML-related plugins (rehype-parse, rehype-remark, etc.).
   */
  html?: Record<string, any>;
}

/**
 * Definition for an mdast format (parser/stringifier).
 */
export interface MdastFormatDefinition {
  /**
   * Flag indicating whether the format needs a transform to mdast.
   * defaults to true.
   */
  needsTransformToMdast?: boolean;
  /** Function to register parser plugins */
  parse?: (processor: any, options?: MdastPlusOptions) => void;
  /** Function to register stringifier plugins */
  stringify?: (processor: any, options?: MdastPlusOptions) => void;
}

/**
 * Represents an asset (e.g., image) extracted during processing.
 */
export interface MdastAsset {
  /** Relative path or identifier for the asset */
  path: string;
  /** MIME type of the asset */
  contentType: string;
  /** Raw content as bytes */
  bytes: Uint8Array;
}

/**
 * Result of a conversion process.
 * @template T - The type of the main content (default: string)
 */
export interface ConvertResult<T = string> {
  /** The converted content */
  content: T;
  /** Extracted assets */
  assets: MdastAsset[];
}

/**
 * Original metadata for a node.
 */
export interface MdastDataOrigin {
  /** Source format */
  format: 'docx' | 'notion' | 'html' | 'markdown' | 'latex' | string;
  /** Raw data from the source */
  raw?: unknown;
  /** Hash of the source content */
  hash?: string;
  [k: string]: unknown;
}

/**
 * mdast node for highlighted text (mark).
 */
export interface MdastMark extends UnistParent {
  type: 'mark';
  children: PhrasingContent[];
}

/**
 * mdast node for subscript text.
 */
export interface MdastSub extends UnistParent {
  type: 'sub';
  children: PhrasingContent[];
}

/**
 * mdast node for superscript text.
 */
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

/**
 * Interface for reading input into an mdast tree.
 * @template I - Input type
 */
export interface MdastReader<I> {
  /**
   * Reads input and returns an mdast Root node.
   * @param input - The input to read
   */
  read(input: I): Promise<Root>;
}

/**
 * Interface for transforming an mdast tree.
 */
export interface MdastTransformer {
  /**
   * Transforms the given mdast tree.
   * @param tree - The Root node to transform
   */
   transform(tree: Root): Promise<{ tree: Root; assets?: MdastAsset[] }>;
}

/**
 * Interface for writing an mdast tree to an output format.
 * @template Output - Output type (default: string)
 */
export interface MdastWriter<Output = string> {
  /**
   * Writes the mdast tree to the target output.
   * @param tree - The Root node to write
   * @param assets - Optional assets to include
   */
  write(tree: Root, assets?: MdastAsset[]): Promise<ConvertResult<Output>>;
}
