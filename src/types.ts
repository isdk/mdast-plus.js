import type { Parent as UnistParent } from 'unist';
import type { Root, PhrasingContent } from 'mdast';
import type { Properties } from 'hast';

export type Stage = 'normalize' | 'compile' | 'finalize';

export interface MdastPlugin {
  name: string;
  stage?: Stage;
  order?: number;
  transform: (tree: Root, ctx: any) => Promise<void> | void;
}

export interface MdastAsset {
  path: string;
  contentType: string;
  bytes: Uint8Array;
}

export interface ConvertResult<T = string> {
  content: T;
  assets: MdastAsset[];
}

export interface MdastDataOrigin {
  format: 'docx' | 'notion' | 'html' | 'markdown' | 'latex' | string;
  raw?: unknown;
  hash?: string;
  [k: string]: unknown;
}

// Inline style extensions
export interface MdastMark extends UnistParent {
  type: 'mark';
  children: PhrasingContent[];
}

export interface MdastSub extends UnistParent {
  type: 'sub';
  children: PhrasingContent[];
}

export interface MdastSup extends UnistParent {
  type: 'sup';
  children: PhrasingContent[];
}

declare module 'mdast' {
  interface Data {
    hName?: string;
    hProperties?: Properties;
    _origin?: MdastDataOrigin;
  }

  interface CodeData extends Data {
    title?: string;
    filename?: string;
    kv?: Record<string, any>;
  }

  interface TableCellData extends Data {
    rowspan?: number;
    colspan?: number;
  }

  interface PhrasingContentMap {
    mark: MdastMark;
    sub: MdastSub;
    sup: MdastSup;
  }
}

export interface MdastReader<I> {
  read(input: I): Promise<Root>;
}

export interface MdastTransformer {
  transform(tree: Root): Promise<{ tree: Root; assets?: MdastAsset[] }>;
}

export interface MdastWriter<Output = string> {
  write(tree: Root, assets?: MdastAsset[]): Promise<ConvertResult<Output>>;
}
