import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';
import type { MdastPlugin } from '../types';

const ALIASES: Record<string, string> = {
  error: 'danger',
  warn: 'warning',
  success: 'tip',
  important: 'important',
  caution: 'caution',
  note: 'note',
};

export const normalizeDirectivePlugin: MdastPlugin = {
  name: 'normalize-directive',
  stage: 'normalize',
  order: 10,
  transform: async (tree: Root) => {
    visit(tree, ['containerDirective', 'leafDirective', 'textDirective'] as any, (node: any) => {
      const directive = node as ContainerDirective | LeafDirective | TextDirective;

      // 1. Canonical Name
      const originalName = directive.name.toLowerCase();
      directive.name = ALIASES[originalName] || originalName;

      // 2. Title Normalization
      // Check for directiveLabel (often children[0] if present)
      if (directive.children && directive.children.length > 0) {
        const firstChild = directive.children[0];
        // Different parsers might use 'directiveLabel' type or just mark it
        if ((firstChild as any).data?.directiveLabel || firstChild.type === 'directiveLabel' as any) {
          const labelNode = firstChild as any;

          // Extract text from label
          let labelText = '';
          visit(labelNode, 'text', (textNode: any) => {
            labelText += textNode.value;
          });

          // Set attributes.title if not already explicitly set
          if (labelText && !directive.attributes?.title) {
            directive.attributes = directive.attributes || {};
            directive.attributes.title = labelText.trim();
          }

          // Remove the label from children
          directive.children.shift();
        }
      }

      // Handle the case where title might be in attributes but not canonicalized
      if (directive.attributes?.title) {
        directive.attributes.title = String(directive.attributes.title).trim();
      }

      // 3. Bridge to HAST
      directive.data = directive.data || {};
      directive.data.hName = directive.data.hName || (directive.type === 'containerDirective' ? 'div' : 'span');
      directive.data.hProperties = {
        ...(directive.data.hProperties || {}),
        ...directive.attributes,
        className: [directive.name, (directive.data.hProperties as any)?.className].filter(Boolean).join(' ')
      };
    });
  }
};
