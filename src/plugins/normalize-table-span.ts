import { visit } from 'unist-util-visit';
import type { Root, TableCell } from 'mdast';
import type { MdastPlugin } from '../types';

/**
 * Plugin to normalize table cell spans (rowspan, colspan).
 * Migrates data.rowspan/colspan to hProperties.rowSpan/colSpan for HTML conversion.
 */
export const normalizeTableSpanPlugin: MdastPlugin = {
  name: 'normalize-table-span',
  stage: 'normalize',
  order: 20,
  transform: async (tree: Root) => {
    visit(tree, 'tableCell', (node: TableCell) => {
      if (node.data) {
        const { rowspan, colspan } = node.data;

        // Ensure hProperties exist
        node.data.hProperties = node.data.hProperties || {};

        // Migrate rowspan -> rowSpan
        if (rowspan !== undefined) {
          node.data.hProperties.rowSpan = rowspan;
          delete node.data.rowspan;
        }

        // Migrate colspan -> colSpan
        if (colspan !== undefined) {
          node.data.hProperties.colSpan = colspan;
          delete node.data.colspan;
        }
      }
    });
  }
};
