import type { Root } from 'mdast';
import type { MdastFormat } from '../types';
import { PipelineStage } from '../types';

import { normalizeDirectivePlugin } from '../plugins/normalize-directive';
import { normalizeTableSpanPlugin } from '../plugins/normalize-table-span';
import { extractCodeMetaPlugin } from '../plugins/extract-code-meta';
import { imageSizePlugin } from '../plugins/image-size';
import { inlineStylesPlugin } from '../plugins/normalize-inline-styles';

/**
 * Pass-through compiler that returns the AST as-is.
 * Essential for unified processes that should output an object (the AST) 
 * instead of a serialized string.
 */
export function astCompiler(this: any) {
  this.Compiler = (tree: Root) => tree;
}

/**
 * Parser for stringified JSON AST input.
 * Allows the pipeline to accept a JSON string and treat it as a unist tree.
 */
export function jsonParser(this: any) {
  this.Parser = (doc: string) => {
    return JSON.parse(doc);
  };
}

/**
 * AST (MDAST) format definition.
 * Supports reading from JSON strings and provides full normalization
 * through the standard mdast-plus plugin set.
 */
export const astFormat: MdastFormat = {
  id: 'ast',
  title: 'MDAST',
  input: [
    { plugin: jsonParser, stage: PipelineStage.parse },
    normalizeDirectivePlugin,
    normalizeTableSpanPlugin,
    extractCodeMetaPlugin,
    imageSizePlugin,
    inlineStylesPlugin
  ],
  output: [{
    plugin: astCompiler,
    options: [],
    stage: PipelineStage.stringify
  }]
};
