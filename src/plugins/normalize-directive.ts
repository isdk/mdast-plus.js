import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';
import type { MdastPlugin } from '../types';
import { PipelineStage } from '../types';

const ALIASES: Record<string, string> = {
  error: 'danger',
  warn: 'warning',
  success: 'tip',
  important: 'important',
  caution: 'caution',
  note: 'note',
};

/**
 * Attacher for the directive normalization plugin.
 */
const normalizeDirectiveAttacher = () => {
  return async (tree: Root) => {
    visit(tree, ['containerDirective', 'leafDirective', 'textDirective'] as any, (node: any) => {
      const directive = node as ContainerDirective | LeafDirective | TextDirective;

      // 1. Canonical Name mapping (e.g., 'warn' -> 'warning')
      const originalName = directive.name.toLowerCase();
      directive.name = ALIASES[originalName] || originalName;

      // 2. Title Normalization:
      // Extracts title from labels like :::note[Title] and moves it to attributes.title.
      if (directive.children && directive.children.length > 0) {
        const firstChild = directive.children[0];
        // Identify directive labels (type 'directiveLabel' or marked via data)
        if ((firstChild as any).data?.directiveLabel || firstChild.type === 'directiveLabel' as any) {
          const labelNode = firstChild as any;

          // Extract plain text from the label subtree
          let labelText = '';
          visit(labelNode, 'text', (textNode: any) => {
            labelText += textNode.value;
          });

          // Set attributes.title if it's not already explicitly defined
          if (labelText && !directive.attributes?.title) {
            directive.attributes = directive.attributes || {};
            directive.attributes.title = labelText.trim();
          }

          // Remove the label from children so it doesn't render twice
          directive.children.shift();
        }
      }

      // Ensure existing titles in attributes are trimmed
      if (directive.attributes?.title) {
        directive.attributes.title = String(directive.attributes.title).trim();
      }

      // 3. Bridge to HAST:
      // Maps directives to div/span with appropriate classes for CSS styling.
      directive.data = directive.data || {};
      directive.data.hName = directive.data.hName || (directive.type === 'containerDirective' ? 'div' : 'span');
      directive.data.hProperties = {
        ...(directive.data.hProperties || {}),
        ...directive.attributes,
        className: [directive.name, (directive.data.hProperties as any)?.className].filter(Boolean).join(' ')
      };
    });
  };
};

/**
 * Plugin to normalize directives (admonitions/callouts).
 * 
 * It ensures names are canonical (using ALIASES), titles are extracted from 
 * bracketed labels (e.g., `:::info[Title]`), and nodes are prepared for 
 * HTML rendering with correct class names.
 */
export const normalizeDirectivePlugin: MdastPlugin = {
  plugin: normalizeDirectiveAttacher,
  stage: PipelineStage.normalize,
  order: 10,
};
