import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';

import { inlineStylesToMarkdownHandlers, inlineStylesPlugin } from '../plugins/normalize-inline-styles';
import { normalizeDirectivePlugin } from '../plugins/normalize-directive';
import { normalizeTableSpanPlugin } from '../plugins/normalize-table-span';
import { extractCodeMetaPlugin } from '../plugins/extract-code-meta';
import { imageSizePlugin } from '../plugins/image-size';

import type { MdastFormat, MdastPlugin } from '../types';
import { PipelineStage } from '../types';

/**
 * Plugin sequence for reading Markdown into a standard mdast-plus AST.
 * Includes the parser, core syntax extensions (GFM, Math, Directives), 
 * and normalization plugins.
 */
const markdownInputPlugins: MdastPlugin[] = [
  // 1. Parser
  {
    plugin: remarkParse,
    stage: PipelineStage.parse,
  },
  // 2. Syntax Extensions (remark ecosystem)
  {
    plugin: remarkGfm,
    options: [{ singleTilde: false }], 
    stage: PipelineStage.parse,
  },
  {
    plugin: remarkDirective,
    stage: PipelineStage.parse,
  },
  {
    plugin: remarkMath,
    stage: PipelineStage.parse,
  },
  {
    plugin: remarkFrontmatter,
    options: [['yaml', 'toml']],
    stage: PipelineStage.parse,
  },
  // 3. Normalizers (Core Mdast+ Logic)
  normalizeDirectivePlugin,
  normalizeTableSpanPlugin,
  extractCodeMetaPlugin,
  imageSizePlugin,
  inlineStylesPlugin,
];

/**
 * Plugin sequence for serializing a standard AST back into Markdown string.
 * Includes the stringifier and necessary syntax extensions for correct serialization.
 */
const markdownOutputPlugins: MdastPlugin[] = [
  {
    plugin: remarkStringify,
    options: [{
        handlers: inlineStylesToMarkdownHandlers
    }],
    stage: PipelineStage.stringify,
  },
  {
    plugin: remarkGfm,
    options: [{ singleTilde: false }],
    stage: PipelineStage.stringify,
  },
  {
      plugin: remarkDirective,
      stage: PipelineStage.stringify
  },
  {
      plugin: remarkMath,
      stage: PipelineStage.stringify
  },
  {
      plugin: remarkFrontmatter,
      options: [['yaml', 'toml']],
      stage: PipelineStage.stringify
  }
];

// Re-ordering output: Extensions should generally come before the compiler (remarkStringify).
markdownOutputPlugins.forEach(p => {
    if (p.plugin === remarkStringify) {
        p.order = 100; // Run last
    } else {
        p.order = 10; // Run first
    }
});


/**
 * Markdown format definition.
 * 
 * Supports GFM, Directives, Math, and Frontmatter. 
 * Provides a bidirectional mapping between Markdown strings and mdast-plus ASTs.
 */
export const markdownFormat: MdastFormat = {
  id: 'markdown',
  title: 'Markdown (GFM + Directives)',
  extensions: ['md', 'markdown', 'mdown', 'mkdn'],
  mediaTypes: ['text/markdown'],
  input: markdownInputPlugins,
  output: markdownOutputPlugins,
};
