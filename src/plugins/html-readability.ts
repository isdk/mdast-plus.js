import type { Plugin } from 'unified';
import type { Root } from 'hast';
import { visit } from 'unist-util-visit';
import { fromHtml } from 'hast-util-from-html';
import { fromDom } from 'hast-util-from-dom';
import { stringify as yamlStringify } from 'yaml';
import { stringify as tomlStringify } from 'smol-toml';
import { PipelineStage } from '../types';
import { omitBy, pick } from 'lodash-es';

export interface SmartExcerptOptions {
  /**
   * The threshold ratio of excerpt length to content length.
   * If (excerptLength / contentLength) > threshold, the excerpt is considered redundant.
   * @default 0.6
   */
  threshold?: number;
  /**
   * The minimum length of the main content required to keep the excerpt.
   * If content length is less than this value, the excerpt is considered redundant (if it is contained in the content).
   * @default 300
   */
  minContentLength?: number;
}

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
  sourceLink?: boolean;
  /**
   * Whether to remove the excerpt if it is a duplicate or near-duplicate of the main content.
   * Useful when the content is short or the excerpt is just a subset of the content.
   * @default true
   */
  smartExcerpt?: boolean | SmartExcerptOptions;
  /**
   * Control the fields and names in metadata.
   * - If an array of strings, it acts as an allowlist (only these fields are kept).
   * - If an object, it maps original field names to new names. Only the keys present in the map are kept (Projection).
   */
  fields?: string[] | Record<string, string>;
  /**
   * Extra key-value pairs to inject into the frontmatter.
   * These will be merged with the readability metadata.
   */
  extraMetadata?: Record<string, any>;
}

/**
 * A unified/rehype plugin that uses Mozilla's Readability to parse the input HTML.
 */
export const htmlReadability: Plugin<[ReadabilityOptions?], string, Root> = function (options) {
  const { readability: readabilityOptions, jsdom: jsdomOptions, hast: hastOptions, url, fields } = options || {};

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

    const { smartExcerpt = true, sourceLink } = options || {};
    let metadata = omitBy(article, (v) => v == null || v === '');

    // Capture original URL/Title for sourceLink before filtering
    const sourceLinkUrl = url || metadata.url;
    const sourceLinkTitle = metadata.title;

    if (smartExcerpt && metadata.excerpt && metadata.textContent) {
      const { threshold = 0.6, minContentLength = 300 } = smartExcerpt === true ? {} : smartExcerpt;
      const cleanExcerpt = metadata.excerpt.trim().toLowerCase().replace(/\s+/g, ' ');
      const cleanContent = metadata.textContent.trim().toLowerCase().replace(/\s+/g, ' ');

      if (cleanContent.includes(cleanExcerpt)) {
        const ratio = cleanExcerpt.length / cleanContent.length;
        if (ratio > threshold || cleanContent.length < minContentLength) {
          delete metadata.excerpt;
        }
      }
    }

    if (url) {
      metadata.url = url;
    }
    delete metadata.content;
    delete metadata.textContent;

    if (fields) {
      if (Array.isArray(fields)) {
        metadata = pick(metadata, fields);
      } else {
        const newMetadata: Record<string, any> = {};
        for (const [key, newKey] of Object.entries(fields)) {
          if (metadata[key] !== undefined) {
            newMetadata[newKey] = metadata[key];
          }
        }
        metadata = newMetadata;
      }
    }

    if (options?.extraMetadata) {
      metadata = { ...metadata, ...options.extraMetadata };
    }

    if (file) {
      file.data = file.data || {};
      file.data.readability = metadata;
    }

    if (hast) {
      const children = [hast];
      if (sourceLink && sourceLinkUrl && !checkHtmlUrlExists(hast, sourceLinkUrl)) {
        children.push({
          type: 'element',
          tagName: 'blockquote',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'p',
              properties: {},
              children: [
                { type: 'text', value: 'Source: ' },
                {
                  type: 'element',
                  tagName: 'a',
                  properties: { href: sourceLinkUrl },
                  children: [{ type: 'text', value: sourceLinkTitle || sourceLinkUrl }]
                }
              ]
            }
          ]
        });
      }

      if (isFragment) {
        hast = {
          type: 'root',
          children,
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
                  children,
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
    const { frontmatter, sourceLink, extraMetadata } = options || {};
    if (file.data?.readability || extraMetadata) {
      file.data = file.data || {};
      file.data.readability = { ...file.data.readability, ...extraMetadata };

      tree.data = tree.data || {};
      tree.data.readability = file.data.readability;
      if (frontmatter) {
        const type = frontmatter === 'toml' ? 'toml' : 'yaml';
        const value = (type === 'toml' ? tomlStringify(file.data.readability).trim() : yamlStringify(file.data.readability)).trim();
        tree.children.unshift({
          type,
          value,
        });
      }

      if (sourceLink && file.data.readability.url) {
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

export function checkHtmlUrlExists(tree: any, url: string): boolean {
  if (!url) return false;
  let exists = false;

  visit(tree, 'element', (node: any) => {
    if (node.tagName === 'a' && node.properties && isSameUrl(node.properties.href as string, url)) {
      exists = true;
      return false; // stop visiting
    }
  });

  return exists;
}
