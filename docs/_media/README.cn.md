# @isdk/mdast-plus

> 基于 unified, remark 和 rehype 的“语义优先” Markdown 处理工具包。

[English](./README.md) | 简体中文 | [GitHub](https://github.com/isdk/mdast-plus.js)

[![NPM version](https://img.shields.io/npm/v/@isdk/mdast-plus.svg)](https://www.npmjs.com/package/@isdk/mdast-plus)

`@isdk/mdast-plus` 是 unified 生态系统的强大扩展，旨在为 Markdown 内容提供一致且语义优先的规范化与转换。它通过 Fluent API 和分阶段的插件系统简化了复杂的处理工作流。

## 特性

- **Fluent API**: 链式调用接口 `mdast(input).use(plugin).toHTML()`。
- **分阶段插件**: 将转换组织为 `normalize`、`compile` 和 `finalize` 阶段，支持优先级排序。
- **语义化规范**:
  - **指令 (Directives)**: 规范化提示框 (Admonition) 名称并从标签中提取标题。
  - **表格跨行/跨列**: 支持 HTML 输出中的 `rowspan` 和 `colspan`。
  - **代码元数据**: 对代码块元数据字符串进行结构化解析。
  - **图片尺寸**: 支持 URL 糖语法 (例如 `image.png#=500x300`) 来设置图片尺寸。
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

### 图片尺寸

```typescript
const html = await mdast('![Cat](cat.png#=500x300)').toHTML();
// 结果: <img src="cat.png" alt="Cat" width="500" height="300">
```

### 高级工作流

```typescript
const { content, assets } = await mdast(myInput)
  .data({ myGlobal: 'value' })
  .use({
    name: 'my-plugin',
    stage: 'compile',
    transform: async (tree) => {
      // 转换 AST
    }
  })
  .to('html');
```

### 任意格式支持

您可以注册自定义的输入或输出格式：

```typescript
import { FluentProcessor, mdast } from '@isdk/mdast-plus';

// 注册自定义输出格式
FluentProcessor.registerFormat('reverse', {
  stringify: (p) => {
    p.Compiler = (tree) => {
      // 您的自定义序列化逻辑
      return '...';
    };
  }
});

const result = await mdast('Hello').to('reverse');
```

> **注意**: 格式名称不区分大小写（内部始终转换为小写）。

## 分阶段处理

插件根据它们的 `stage` (阶段) 和 `order` (顺序) 执行：

1.  **normalize** (order 0-100): 清理并规范化树。
2.  **compile** (order 0-100): 高级语义转换。
3.  **finalize** (order 0-100): 输出前的最后准备。

## 内置核心插件

| 插件 | 阶段 | 描述 |
| :--- | :--- | :--- |
| `normalize-directive` | normalize | 处理别名 (`warn` -> `warning`) 并提取标题。 |
| `normalize-table-span` | normalize | 将表格单元格跨度迁移到 `hProperties`。 |
| `extract-code-meta` | normalize | 从代码块元数据中解析 `title="foo"`。 |
| `image-size` | normalize | 从图片 URL 中解析 `#=WxH`。 |

## 贡献

请查看 [CONTRIBUTING.cn.md](./CONTRIBUTING.cn.md) 以获取有关如何贡献本项目的指南。

## 许可证

[MIT](./LICENSE-MIT)
