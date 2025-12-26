import { visit } from 'unist-util-visit';
import type { Root, TableCell } from 'mdast';
import type { MdastPlugin } from '../types';
import { PipelineStage } from '../types';

/**
 * Attacher for the table span normalization plugin.
 */
const normalizeTableSpanAttacher = () => {
  return async (tree: Root) => {
    visit(tree, 'tableCell', (node: TableCell) => {
      if (node.data) {
        // Handle legacy or non-canonical span properties
        const { rowspan, colspan } = node.data;

        // Ensure hProperties exist for HAST bridging
        node.data.hProperties = node.data.hProperties || {};

        // Migrate 'rowspan' (lowercase) to 'rowSpan' (camelCase for HAST)
        if (rowspan !== undefined) {
          node.data.hProperties.rowSpan = rowspan;
          delete node.data.rowspan;
        }

        // Migrate 'colspan' (lowercase) to 'colSpan' (camelCase for HAST)
        if (colspan !== undefined) {
          node.data.hProperties.colSpan = colspan;
          delete node.data.colspan;
        }
      }
    });
  };
};

/**
 * Plugin to normalize table cell span properties.
 * 
 * It ensures that `rowspan` and `colspan` metadata on table cells are 
 * moved to `node.data.hProperties` with correct camelCase naming 
 * (`rowSpan`/`colSpan`), enabling correct HTML rendering.
 */
export const normalizeTableSpanPlugin: MdastPlugin = {
  plugin: normalizeTableSpanAttacher,
  stage: PipelineStage.normalize,
  order: 20,
};
