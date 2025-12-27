import type { Plugin } from 'unified';
import type { Root } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { fromDom } from 'hast-util-from-dom';
import { PipelineStage } from '../types';

export interface ReadabilityOptions {
  // the url of the HTML document
  url?: string;
  readability?: Record<string, any> | false;
  jsdom?: Record<string, any>;
  hast?: Record<string, any>;
  'rehype-parse'?: Record<string, any>;
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

    const metadata = {
      ...article,
    };
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
  plugin: () => (tree: any, file: any) => {
    if (file.data?.readability) {
      tree.data = tree.data || {};
      tree.data.readability = file.data.readability;
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
