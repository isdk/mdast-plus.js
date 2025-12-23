# MDAST+ Specification Proposal

**Version**: 0.2.2
**Status**: RFC (Request for Comments)
**Base**: `mdast` (unist)

## 1. 核心设计原则 (Design Principles)

1. **Superset (超集原则)**: 完全兼容标准 `mdast` 规范，所有标准工具链（如 `unist-util-visit`）无需修改即可处理。
2. **Semantic-First (语义优先)**: 节点定义描述“它是什么”（如 `Callout`），而非“它长什么样”（如 `BlueBox`）。
3. **Unified Extension (统一扩展)**: 不随意发明新节点类型，优先使用 `Directive` (通用指令) 和 `Data` (元数据) 来表达复杂结构。
4. **Strict Typing (严格类型)**: 全面基于 TypeScript 定义，确保转换管线的类型安全。
5. **KISS 原则**: 尽量避免重新发明轮子，复用现有unist/mdast生态，简单易懂。

Hint:

* 需要**编译/渲染**的（图表、数据） -> **Code Block**
* 需要**包装/排版**的（提示框、布局） -> **Directive**
* **Graceful Degradation (优雅降级)**: 所有扩展节点应该具备降级为标准 Markdown 的能力（例如：Mermaid 图表降级为图片或代码块，Callout 降级为引用块）。

---

## 2. 节点分类与定义 (Node Taxonomy)

mdast+ 将节点分为三大类：**Core (核心)**/**Rich (富文本)**, **DSL (领域语言)**, **Component (组件)**。

### A. Core & Rich (基础与富文本)

*继承自 GFM 和常用 remark 插件规范。*

| 节点类型 | 来源标准 | 语义 | 备注 |
| :--- | :--- | :--- | :--- |
| `table` / `tableRow` / `tableCell` | GFM | 表格 | **增强**: `data` 属性支持 `rowspan`, `colspan` |
| `delete` | GFM | 删除线 | `~~text~~` |
| `listItem` | GFM | 任务列表 | `checked: true/false/null` |
| `footnoteReference` / `footnoteDefinition` | GFM | 脚注 | `[^1]` |
| `image` | Common | 图片 | 尺寸存入 `data.hProperties` (见下文) |
| `math` / `inlineMath` | STEM | 数学公式 | 独立节点，不使用 Code Block |
| `mark` | Extension | 高亮 | `==text==` |
| `sub` / `sup` | Extension | 下标/上标 | `~text~` / `^text^` |

注:

* 为什么 mark/sub/sup 是核心节点？
  * 尽管可以使用指令,但是`mark`/`sub`/`sup`这三种格式属于“行内样式(Inline Style)”，与 `Bold` (`**`), `Italic` (`*`) 同频出现。它们应该像其它 phrasing nodes 一样自然出现在段落内部
* 标准 Markdown 图片节点不支持尺寸，mdast+ 约定存入: `data: {hProperties: { width: 500, height: 300 }}`，优先使用数值（像素）。
* Markdown 语法扩展 (Syntax Extension):
  * 为了支持 Round-trip (AST <-> Markdown)，mdast+ 推荐采用 Attribute Syntax 扩展（类 Pandoc/Kramdown 风格）来显式表达尺寸：
    * 示例: `![A cat](cat.png){width=500 height=300}`
    * 允许支持兼容变体: `![A cat](cat.png width=500 height=300)` 或 `![A cat](cat.png =500x300)`

### B. DSL & Figures (领域语言与图表)

*统一使用标准 `code` 节点，通过 `lang` 属性区分语义。*

**处理原则**：此类节点内容被视为 **Raw Payload**，转换器需调用特定引擎将其转换为 `image` 或 HTML 片段。

| 语言标识 (`lang`) | 语义类型 | 推荐处理策略 (Transformer) |
| :--- | :--- | :--- |
| `mermaid` | 流程/时序图 | Client-side JS 或 Kroki (SVG) |
| `plantuml` | UML 图 | Kroki (SVG) |
| `csv` | 表格数据 | 解析 CSV -> 转换为 `table` 节点结构 |
| `json` / `yaml` | 数据/配置 | 仅展示代码，或用于特定的数据可视化组件 |
| `latex` | 纯 LaTeX 文档块 | 区别于 `math` 节点，这是大段源码，通常仅高亮显示 |
| `geojson` | 地理数据 | 渲染为地图组件 |

**AST 结构示例**:

```javascript
{
  type: 'code',
  lang: 'mermaid',
  meta: 'title="架构图"',
  value: 'graph TD; A-->B;'
  // 无 children，因为它是黑盒 DSL
}
```

#### 安全性与可逆性 (Security & Reversibility)

1. 逃生舱 (`_origin`): 对于复杂的 DSL（如复杂的 LaTeX 宏或私有图表格式），如果转换可能丢失细节，必须将原始未触动的 payload 存入 `data._origin.raw`。
2. **Sanitization**: 在渲染为 HTML 时，所有 DSL 输出（尤其是 mermaid 生成的 SVG 或 html 代码块）必须 经过 `rehype-sanitize` 清洗，防止 XSS 攻击。

### C. Components & Layouts (组件与布局)

*统一使用 `directive` 节点。*

**处理原则**：此类节点包含 **Markdown 内容** (Children)，转换器负责为其包裹 HTML 容器或应用特定样式。

#### 1. Container Directive (`:::name`)

用于块级容器。

| 指令名称 (`name`) | 语义 | 典型属性 (`attributes`) | 降级策略 |
| :--- | :--- | :--- | :--- |
| `note` / `tip` / `Important` / `Caution` /`warning` / `danger` | **Admonition** (提示块) | `title` | `blockquote` (引用) |
| `details` | **Collapsible** (折叠块) | `open` (bool), `summary` | 列表或纯文本 |
| `tabs` / `tab` | **Layout** (选项卡) | `label` | 顺序排列的标题+内容 |
| `grid` / `col` | **Layout** (网格) | `width` | 顺序排列 |

提示指令的详细说明:

| 级别 | 推荐 Emoji | 推荐颜色 | 适用场景 |
| --- | --- | --- | --- |
| **Note** (备注) | ℹ️ 或 📝 | **蓝色** (#209cee) | 补充背景信息、非必要的说明或引用。 |
| **Tip** (提示) | 💡 或 ✨ | **绿色** (#23d160) | 帮助用户更高效操作的小技巧或“避坑”经验。 |
| **Important** (重要) | ❗ 或 📌 | **青色/深蓝** (#118fe3) | 必须阅读的关键点，如果不看可能会导致操作失败。 |
| **Caution** (小心) | ⚠️ 或 🔸 | **黄色/橙色** (#ffdd57) | 提醒用户注意非破坏性的风险，如“此操作耗时较长”。 |
| **Warning** (警告) | 🟠 或 ⚠️ | **橙色** (#ff9500) | 存在潜在的中度风险，如“此操作不可撤销”或“数据将被覆盖”。 |
| **Danger** (危险) | 🚫 或 ❌ 或 💀 | **红色** (#ff3860) | 极高风险，可能导致严重后果、系统崩溃或安全威胁。 |

提示指令同时支持块级容器和单行内联（TextDirective）两种写法。

```md
::: warning 注意
请小心...
:::
```

**AST 结构示例**:

```javascript
{
  type: 'containerDirective',
  name: 'warning',
  attributes: { title: '注意' },
  children: [ // 内部包含标准 Markdown AST
    { type: 'paragraph', children: [{ type: 'text', value: '请小心...' }] }
  ]
}
```

单行内联: `:warning[请小心]{title="注意"}`

#### 2. Leaf Directive (`::name`)

用于独立组件（无 Markdown children）。

| 指令名称 (`name`) | 语义 | 典型属性 | 降级策略 |
| :--- | :--- | :--- | :--- |
| `youtube` / `bilibili` | **Embed** (视频) | `id` | 链接 (Link) |
| `toc` | **Meta** (目录) | `depth` | (移除) |
| `pagebreak` | **Print** (分页) | - | `---` (水平线) |

```md
::youtube[Label]{v=123}
```

**AST 结构示例**:

```javascript
{
  type: 'leafDirective',
  name: 'youtube',
  attributes: {v: '123'},
  children: [{type: 'text', value: 'Label'}]
}
```

## Directive 标题规范

AST 规范 (Canonical Representation):

* **MUST**: 所有 Directive 的“标题/显示名”统一落到 `attributes.title` 字段中。
* **Children**: `children` 应当只包含提示块的正文内容，**不应**包含标题文本。

**Markdown 输入语法 (Input Syntax)**:

* **Standard**: Attribute 写法 `:::warning{title="注意"}` (推荐，最清晰)。
* **Sugar**: Label 写法 `:::warning[注意]` 或 `:::warning 注意` (允许作为语法糖存在)。

**规范化逻辑 (Normalization Logic)**:
在 Parse 阶段之后，必须执行 **Title Normalization**：

1. **检测**: 检查 Directive 是否包含 Label (通常解析为 `children` 中的 `directiveLabel` 节点或特定的 Label 结构)。
2. **提取**:
    * 若 Label 内容为 **纯文本** (Text-only)，提取其字符串值。
    * 若 Label 包含 **简单格式** (如加粗 `[**Note**]`)，提取其纯文本内容 (strip formatting)。
3. **赋值**: 将提取的文本赋值给 `attributes.title`。
4. **清洗**: 从 `children` 中 **移除** 该 Label 节点，防止标题在正文中重复渲染。
5. **例外 (Exception)**:
    * 如果 Label 包含 **复杂内容** (如图片、公式)，则无法转换为简单的 string attribute。此时 **MAY** 保留 Label 节点，由渲染器特殊处理（但这被视为不规范的 Admonition）。

---

## 3. 通用数据协议 (Universal Data Protocol)

```typescript
// mdast-plus.d.ts
import type { Code, Parent, Literal, PhrasingContent, Root } from 'mdast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';
import type { Math, InlineMath } from 'mdast-util-math';

export type { Code, Parent, Literal, Properties } from 'mdast';
export type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';
export type { Math, InlineMath } from 'mdast-util-math';

export type MdastAsset = {
  path: string;          // e.g. "assets/diagram-1.svg"
  contentType: string;   // "image/svg+xml"
  bytes: Uint8Array;
};

export type MdastConvertResult = {
  tree: Root;  // mdast+ tree
  assets: Asset[];
};

export interface MdastReader<I> {
  read(input: I): Promise<Root>;
}

export interface MdastTransformer {
  transform(tree: Root): Promise<{ tree: Root; assets?: Asset[] }>;
}

export interface MdastWriter<O> {
  write(tree: Root, assets?: Asset[]): Promise<O>;
}

export interface MdastMark extends Parent {
  type: 'mark';
  children: PhrasingContent[];
}
export interface MdastSub extends Parent {
  type: 'sub';
  children: PhrasingContent[];
}
export interface MdastSup extends Parent {
  type: 'sup';
  children: PhrasingContent[];
}

export interface MdastDataOrigin {
  format: 'docx' | 'notion' | 'html' | 'markdown' | 'latex' | string;
  raw?: any;
  hash?: string;   // 可选：用于缓存计算的指纹
  [k: string]: any;
}

// 3. 注入到 mdast 核心定义
declare module 'mdast' {
  // 扩展 Data 接口
  interface Data {
    hName?: string;
    hProperties?: Properties;
    rowspan?: number;
    colspan?: number;
    _origin?: MdastDataOrigin;
  }

  interface PhrasingContentMap {
    mark: MdastMark;
    sub: MdastSub;
    sup: MdastSup;
  }
}
```

---

## 5. 处理管线建议 (Pipeline Recommendation)

为了实现 mdast+，将任意格式转换为markdown或HTML（可能会存在多个文件作为资源），处理器的管线顺序至关重要：

1. **Parse**: 将源格式解析为 mdast+ 树。
    * *Docx Reader*: 将 Word 样式解析进 `data.hProperties`，表格解析进 `data.rowspan`。
    * *Markdown Reader*: 启用 `remark-gfm`, `remark-math`, `remark-directive`。
2. **Transform (Normalize)**: 标准化语义。
    * *Meta Extract*: 将 Code Block 的 `filename="app.js"` 提取到 `data`。
    * *Directive Normalize*: 比如可以支持更多的别名, 例如提示块中的“error”作为“danger”的别名。
3. **Transform (Compile/Render)**: 处理 DSL。
    * *Diagrams*: 检测 `code[lang=mermaid]`，调用 Kroki 转换为 `image` 节点 (针对 Word/PDF 输出) 或保持原样 (针对 React 输出)。
4. **Stringify**: 输出目标格式
    * *To Markdown*
    * *To HTML*

任何会生成/接收 HTML 片段的转换链路，默认必须使用 rehype-sanitize（或等效机制）清洗；

本核心包仅支持markdown,HTML两种基本格式，为了方便扩展其他格式，需要定义简单易用的规范接口，内部的markdown/HTML也需遵循该接口规范实现。
本规范采用单包(@isdk/mdast-plus)实现，是因为核心包基本上是一些配置约定，依赖生态中的库实现，代码大部分都是比较简单的pipeline, 提供组装好的preset. 可以将transform单独作为plugins目录放置。
其他扩展（插件、文档格式等）通过独立的第三方包实现。
