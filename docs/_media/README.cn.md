# @isdk/mdast-plus

> 基于 unified, remark 和 rehype 的“语义优先” Markdown 处理工具包。

[English](./README.md) | 简体中文 | [GitHub](https://github.com/isdk/mdast-plus.js)

[![NPM version](https://img.shields.io/npm/v/@isdk/mdast-plus.svg)](https://www.npmjs.com/package/@isdk/mdast-plus)

`@isdk/mdast-plus` 是 unified 生态系统的强大扩展，旨在为 Markdown 内容提供一致且语义优先的规范化与转换。它通过 Fluent API 和分阶段的插件系统简化了复杂的处理工作流。

## 特性

- **Fluent API**: 链式调用接口 `mdast(input).use(plugin).toHTML()`。
- **分阶段插件**: 将转换组织为 `parse`, `normalize`, `compile`, `finalize` 和 `stringify` 阶段。
- **语义化规范**:
  - **指令 (Directives)**: 规范化提示框 (Admonition) 名称并从标签中提取标题。
  - **表格跨行/跨列**: 支持 HTML 输出中的 `rowspan` 和 `colspan`。
  - **代码元数据**: 对代码块元数据字符串进行结构化解析。
  - **图片尺寸**: 支持 URL 糖语法 (例如 `image.png#=500x300`) 来设置图片尺寸。
  - **行内样式**: 内置对 `==高亮==`、`~下标~` 和 `^上标^` 的支持。
- **深度类型支持**: 基于 TypeScript 构建，完整支持 unist/mdast 的模块扩充。

## 安装

```bash
npm install @isdk/mdast-plus
# 或
pnpm add @isdk/mdast-plus
```

## 基本用法

### HTML 转换

```typescript
import { mdast } from '@isdk/mdast-plus';

const html = await mdast(':::warning[重要提示]\n请小心！\n:::')
  .toHTML();
// 结果: <div title="重要提示" class="warning"><p>请小心！</p></div>
```

### 配置输入选项

您可以通过 `.from()` 的第二个参数向输入插件（如 `remark-gfm` 或 `remark-parse`）传递选项：

```typescript
// 启用单个波浪线删除线 (~text~)
const md = await mdast('Hello ~world~')
  .from('markdown', { remarkGfm: { singleTilde: true } })
  .toMarkdown();
```

### 图片尺寸

```typescript
const html = await mdast('![Cat](cat.png#=500x300)').toHTML();
// 结果: <img src="cat.png" alt="Cat" width="500" height="300">
```

### AST 输出

```typescript
// 获取处理后的完整 AST (在 normalization 之后)
const ast = await mdast('==高亮内容==').toAST();

// 获取原始 AST (在 parse 之后, normalization 之前)
const rawAst = await mdast('==高亮内容==').toAST({ stage: 'parse' });
```

### 高级工作流

```typescript
const { content, assets } = await mdast(myInput)
  .data({ myGlobal: 'value' })
  // 在 'compile' 阶段添加自定义插件
  .useAt('compile', myPlugin, { option: 1 })
  .priority(10) // 比默认插件更晚执行
  .to('html');
```

### 插件行为

`mdast-plus` 内部使用 [unified](https://github.com/unifiedjs/unified)。如果您多次添加同一个插件函数，最后的配置将**覆盖**之前的配置。

```typescript
// 插件将只执行一次，且选项为: 2
pipeline.use(myPlugin, { option: 1 });
pipeline.use(myPlugin, { option: 2 });
```

若要多次运行相同的插件逻辑（例如用于不同目的），请提供不同的函数引用：

```typescript
// 插件将执行两次
pipeline.use(myPlugin, { option: 1 });
pipeline.use(myPlugin.bind({}), { option: 2 });
```

### 任意格式支持

您可以注册自定义的输入或输出格式：

```typescript
import { MdastPipeline, mdast, PipelineStage } from '@isdk/mdast-plus';

// 注册自定义输出格式
MdastPipeline.register({
  id: 'reverse',
  output: [{
    plugin: function() {
      this.Compiler = (tree) => {
        // 您的自定义序列化逻辑
        return '...';
      };
    },
    stage: PipelineStage.stringify
  }]
});

const result = await mdast('Hello').to('reverse');
```

> **注意**: 格式名称不区分大小写（内部始终转换为小写）。

## 分阶段处理

插件根据它们的 `stage` (阶段) 和 `order` (顺序) 执行：

1.  **parse** (0): 输入解析 (例如 `remark-parse`)。
2.  **normalize** (100): 清理并规范化树。
3.  **compile** (200): 高级语义转换。
4.  **finalize** (300): 输出前的最后准备 (例如 `rehype-sanitize`)。
5.  **stringify** (400): 输出生成。

## 内置核心插件

| 插件 | 阶段 | 描述 |
| :--- | :--- | :--- |
| `normalize-directive` | normalize | 处理别名 (`warn` -> `warning`) 并提取标题。 |
| `normalize-table-span` | normalize | 将表格单元格跨度迁移到 `hProperties`。 |
| `extract-code-meta` | normalize | 从代码块元数据中解析 `title="foo"`。 |
| `image-size` | normalize | 从图片 URL 中解析 `#=WxH`。 |
| `normalize-inline-styles` | normalize | 标准化 `==mark==`、`~sub~` 和 `^sup^`。 |

## 贡献

请查看 [CONTRIBUTING.cn.md](./CONTRIBUTING.cn.md) 以获取有关如何贡献本项目的指南。

## 许可证

[MIT](./LICENSE-MIT)
