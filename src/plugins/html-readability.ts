import type { Plugin } from 'unified';
import type { Root } from 'hast';
import { visit } from 'unist-util-visit';
import { fromHtml } from 'hast-util-from-html';
import { fromDom } from 'hast-util-from-dom';
import { stringify as yamlStringify } from 'yaml';
import { PipelineStage } from '../types';
import { isNil, omitBy } from 'lodash-es';

export interface ReadabilityOptions {
  // the url of the HTML document
  url?: string;
  readability?: Record<string, any> | false;
  jsdom?: Record<string, any>;
  hast?: Record<string, any>;
  'rehype-parse'?: Record<string, any>;
  /**
   * Whether to inject metadata as frontmatter.
   * @default false
   */
  frontmatter?: boolean | 'yaml' | 'toml';
  /**
   * Whether to append source link at the bottom.
   * @default false
   */
  noteLink?: boolean;
}

/**
 * A unified/rehype plugin that uses Mozilla's Readability to parse the input HTML.
 */
export const htmlReadability: Plugin<[ReadabilityOptions?], string, Root> = function (options) {
  const { readability: readabilityOptions, jsdom: jsdomOptions, hast: hastOptions, url } = options || {};

  this.parser = function (doc: string, file: any) {
    if (readabilityOptions === false) {
      return fromHtml(doc, { fragment: true, ...hastOptions });
    }

    let JSDOM: any;
    let Readability: any;

    try {
      const jsdomPkg = require('jsdom');
      JSDOM = jsdomPkg.JSDOM;
      const readabilityPkg = require('@mozilla/readability');
      Readability = readabilityPkg.Readability;
    } catch (error) {
      throw new Error(`[html-readability] Dependency missing. Please install 'jsdom' and '@mozilla/readability'.`);
    }

    const dom = new JSDOM(doc, { url, pretendToBeVisual: true, ...jsdomOptions, includeNodeLocations: true });
    const reader = new Readability(dom.window.document, {
      // debug: true,
      maxElemsToParse: 100000,
      nbTopCandidates: 5,
      charThreshold: 500,
      keepClasses: true,
      ...readabilityOptions,
      serializer: (el: any) => el,
    });
    const article = reader.parse();

    if (!article || !article.content) {
      return fromHtml(doc, { fragment: true, ...hastOptions });
    }

    const domContent = article.content;

    // const hast = fromHtml(article.content, { fragment: true, ...hastOptions });
    let hast = fromDom(domContent, { afterTransform: hastOptions?.afterTransform }) as any;
    // console.log('🚀 ~ file: html-readability.ts:59 ~ hast:', hast)
    const isFragment = hastOptions?.fragment !== false; // default to true
    // 无用，返回的 domContent 已经不是jsdom了， nodeLocation 没有这个方法！
    // const location = dom.nodeLocation(dom.window.document.querySelector('html')); //dom.window.document.querySelector('div')

    const metadata = omitBy(article, isNil);
    if (url) {
      metadata.url = url;
    }
    delete metadata.content;
    delete metadata.textContent;

    if (file) {
      file.data = file.data || {};
      file.data.readability = metadata;
    }

    if (hast) {
      if (isFragment) {
        hast = {
          type: 'root',
          children: [hast],
        }
      } else {
        hast = {
          type: 'root',
          children: [
            {
              type: 'element',
              tagName: 'html',
              properties: {},
              children: [
                {
                  type: 'element',
                  tagName: 'head',
                  properties: {},
                  children: [],
                },
                {
                  type: 'element',
                  tagName: 'body',
                  properties: {},
                  children: [hast],
                },
              ],
            },
          ],
        };
      }

      hast.data = hast.data || {};
      (hast.data as any).readability = metadata;
    }

    return hast;
  };
};

/**
 * Pre-configured MdastPlugin for html-readability.
 */
export const htmlReadabilityPlugin = {
  name: 'readability',
  plugin: htmlReadability,
  stage: PipelineStage.parse,
  main: true,
  // If it acts as main, it will replace the first parser.
  // We can add 'after' but 'main: true' is stronger for parsers.
};

/**
 * Plugin to restore readability metadata after HAST to MDAST conversion.
 */
export const restoreReadabilityMetaPlugin = {
  name: 'restore-readability-meta',
  plugin: (options?: ReadabilityOptions) => (tree: any, file: any) => {
    if (file.data?.readability) {
      tree.data = tree.data || {};
      tree.data.readability = file.data.readability;

      const { frontmatter, noteLink } = options || {};
      if (frontmatter) {
        const type = frontmatter === 'toml' ? 'toml' : 'yaml';
        const value = yamlStringify(file.data.readability).trim();
        tree.children.unshift({
          type,
          value,
        });
      }

      if (noteLink && file.data.readability.url) {
        const { url, title } = file.data.readability;
        if (!checkUrlExists(tree, url)) {
          tree.children.push({
            type: 'blockquote',
            children: [
              {
                type: 'paragraph',
                children: [
                  { type: 'text', value: 'Source: ' },
                  {
                    type: 'link',
                    url,
                    children: [{ type: 'text', value: title || url }]
                  }
                ]
              }
            ]
          });
        }
      }
    }
  },
  stage: PipelineStage.parse,
  after: 'rehype-remark',
};

/**
 * Combined plugins for HTML readability.
 */
export const htmlReadabilityPlugins = [
  htmlReadabilityPlugin,
  restoreReadabilityMetaPlugin,
];

function isSameUrl(url1: string, url2: string): boolean {
  if (!url1 || !url2) return false;
  if (url1 === url2) return true;
  try {
    // If one is absolute and the other isn't, they aren't the same (unless resolved, but we assume independence here)
    // Actually, JSDOM usually resolves links if 'url' is provided.
    // We try to normalize by parsing.
    const u1 = new URL(url1);
    const u2 = new URL(url2);
    // Compare hrefs (normalized)
    return u1.href === u2.href;
  } catch {
    // If parsing fails (e.g. relative URLs), fallback to strict equality (already checked)
    // or maybe try to strip trailing slash?
    const n1 = url1.replace(/\/$/, '');
    const n2 = url2.replace(/\/$/, '');
    return n1 === n2;
  }
}

export function checkUrlExists(tree: any, url: string): boolean {
  if (!url) return false;
  let exists = false;

  visit(tree, 'link', (node: any) => {
    if (isSameUrl(node.url, url)) {
      exists = true;
      return false; // stop visiting
    }
  });

  return exists;
}
