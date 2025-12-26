import { visit } from 'unist-util-visit';
import type { Root, Image } from 'mdast';
import type { MdastPlugin } from '../types';
import { PipelineStage } from '../types';

/**
 * Attacher for the image size parsing plugin.
 */
const imageSizeAttacher = () => {
  return async (tree: Root) => {
    visit(tree, 'image', (node: Image) => {
      const data = (node.data = node.data || {});
      const hProps = (data.hProperties = data.hProperties || {});

      // 1. Parse from URL sugar syntax:
      // cat.png#=500x300  -> width=500, height=300
      // cat.png?width=500 -> width=500
      const sugarRegex = /[#?&](?:width=([0-9]+))?(?:&?height=([0-9]+))?(?:=([0-9]+)x([0-9]+))?$/;
      const urlMatch = node.url.match(sugarRegex);
      if (urlMatch) {
        const width = urlMatch[1] || urlMatch[3];
        const height = urlMatch[2] || urlMatch[4];
        if (width && !hProps.width) hProps.width = parseInt(width, 10);
        if (height && !hProps.height) hProps.height = parseInt(height, 10);
        // Clean the URL of the sugar syntax
        node.url = node.url.replace(sugarRegex, '');
      }

      // 2. Sync dimensions from node.data (if populated by other attribute parsers)
      if ((data as any).width && !hProps.width) {
        hProps.width = (data as any).width;
      }
      if ((data as any).height && !hProps.height) {
        hProps.height = (data as any).height;
      }
    });
  };
};

/**
 * Plugin to parse and normalize image dimensions (width/height).
 * 
 * It extracts dimensions from URL fragments/queries (e.g., `#=500x300`) 
 * and ensures they are available in `node.data.hProperties` for HTML output.
 */
export const imageSizePlugin: MdastPlugin = {
  plugin: imageSizeAttacher,
  stage: PipelineStage.normalize,
  order: 40,
};
