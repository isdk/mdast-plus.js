import { visit } from 'unist-util-visit';
import type { Root, Image } from 'mdast';
import type { MdastPlugin } from '../types';

/**
 * Plugin to parse image dimensions (width, height) from URL fragments or properties.
 * e.g., image.png#500x300 or image.png?width=500
 *
 * It handles standard mdast image data if attributes were already processed
 * (e.g. by remark-attr) or if the URL contains dimensions (optional).
 */
export const imageSizePlugin: MdastPlugin = {
  name: 'image-size',
  stage: 'normalize',
  order: 40,
  transform: async (tree: Root) => {
    visit(tree, 'image', (node: Image) => {
      const data = (node.data = node.data || {});
      const hProps = (data.hProperties = data.hProperties || {});

      // 1. Parse from URL sugar (variant: cat.png#=500x300 or cat.png?width=500)
      const sugarRegex = /[#?&](?:width=([0-9]+))?(?:&?height=([0-9]+))?(?:=([0-9]+)x([0-9]+))?$/;
      const urlMatch = node.url.match(sugarRegex);
      if (urlMatch) {
        const width = urlMatch[1] || urlMatch[3];
        const height = urlMatch[2] || urlMatch[4];
        if (width && !hProps.width) hProps.width = parseInt(width, 10);
        if (height && !hProps.height) hProps.height = parseInt(height, 10);
        // Clean URL
        node.url = node.url.replace(sugarRegex, '');
      }

      // 2. check if they are already there in data (e.g. from attributes syntax)
      if ((data as any).width && !hProps.width) {
        hProps.width = (data as any).width;
      }
      if ((data as any).height && !hProps.height) {
        hProps.height = (data as any).height;
      }
    });
  }
};
