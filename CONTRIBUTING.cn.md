# 贡献指南 - @isdk/mdast-plus

感谢您对贡献 `@isdk/mdast-plus` 的关注！本文档为您提供了参与项目开发的指南。

## 架构概览

`@isdk/mdast-plus` 基于 `unified` 生态系统构建。它严格遵循“语义优先”原则对 `mdast`（Markdown 抽象语法树）进行了扩展。

### 核心概念

1. **Fluent API**: 主要入口是 `src/pipeline.ts` 中的 `mdast()` 函数，由 `MdastPipeline` 支持。
2. **分阶段插件**: 插件被分类为 5 个阶段 (`PipelineStage`)：
    * `parse`: 将输入解析为 AST。
    * `normalize`: 清理并规范化语法树。
    * `compile`: 高级语义转换。
    * `finalize`: 输出前的最后准备。
    * `stringify`: 将 AST 序列化为输出。
3. **通用数据协议**: 节点使用 `node.data` 存储元数据，使用 `node.data.hProperties` 存储 HTML 属性。

## 开始开发

### 前置条件

- Node.js (推荐最新的 LTS 版本)
- [pnpm](https://pnpm.io/) (用于依赖管理)

### 安装

```bash
git clone https://github.com/isdk/mdast-plus.js.git
cd mdast-plus.js
pnpm install
```

## 开发流

### 构建

```bash
pnpm run build
```

### 测试

我们使用 `vitest` 进行测试。请在 `test/` 目录下添加您的测试用例。

```bash
pnpm run test        # 运行一次测试
```

### 代码检查 (Linting)

```bash
pnpm run lint
```

## 添加新插件

1. 在 `src/plugins/` 中创建您的插件。
2. 实现 `MdastPlugin` 接口。`plugin` 属性应该是一个标准的 unified 插件。

```typescript
import { MdastPlugin, PipelineStage } from '../types';
import { visit } from 'unist-util-visit';

const myUnifiedPlugin = (options) => {
  return (tree) => {
    visit(tree, 'text', (node) => {
      // 转换逻辑
    });
  };
};

export const myPlugin: MdastPlugin = {
  name: 'my-custom-plugin',
  plugin: myUnifiedPlugin,
  stage: PipelineStage.normalize, // 或 'compile', 'finalize' 等
  order: 50,                      // 0-100
  main: false,                    // 设置为 true 以替换该阶段的第一个插件，默认为 false
  before: 'some-other-plugin',    // 可选：在另一个插件之前运行
  after: 'another-plugin',        // 可选：在另一个插件之后运行
};
```

> **重要提示**: 如果你希望插件执行，切勿将 `false` 作为 `.use()` 的第二个参数或在 `MdastPlugin.options` 中传递。在 `unified` 中，`false` 是一个特殊值，会**禁用**该插件。如果你的插件是“主”插件（如解析器替代者），用 `false` 禁用它将阻止它替换该阶段的默认插件，从而提供安全的回退（此时终端将显示警告信息）。如果你需要根据条件跳过插件内部的逻辑但保持其激活，请使用选项对象（例如 `{ enabled: false }`）。

### 主插件 (Main Plugins)

每个阶段支持 **单个** 主插件。当一个插件被标记为 `main: true` 时，它将替换最初为该阶段注册的第一个插件。这主要由格式使用，允许用户通过在同一阶段注入不同的插件来覆盖默认的解析器或序列化器。

1. 如果它是一个默认插件，将其添加到 `src/formats/` 中相关格式的 `input` 或 `output` 列表中。

## 添加新格式

1. 定义一个 `MdastFormat` 对象。
2. 使用 `MdastPipeline.register(format)` 进行注册。

```typescript
import { MdastPipeline, PipelineStage } from '../src/pipeline';

MdastPipeline.register({
  id: 'json',
  title: 'JSON Format',
  output: [{
    plugin: function() {
      this.Compiler = (tree) => JSON.stringify(tree);
    },
    stage: PipelineStage.stringify
  }]
});
```

> **注意**: 格式名称不区分大小写。
>
> **重要提示**: `unified` 要求必须挂载一个 `Compiler` 才能完成处理流程。如果你的格式旨在返回一个对象（如 AST 本身）而非字符串，你需要提供一个“透传（pass-through）”编译器：
>
> ```typescript
> function astCompiler() {
>   this.Compiler = (tree) => tree;
> }
> ```

## 编码规范

- 所有新代码必须使用 **TypeScript**。
- 遵循现有的代码风格和格式（使用 Prettier/ESLint）。
- 确保所有新特性都有相应的**测试用例**覆盖。
- 遵循**语义优先**原则：关注内容的含义，而不仅仅是它的视觉呈现。

## 提交指南

- 为您的修改创建一个特性分支。
- 确保通过所有测试。
- 如有必要，更新相关文档（`README.md`, `README.cn.md`）。
- 提交 Pull Request，并清晰地描述您的修改内容。

## 许可证

通过参与本项目的贡献，即表示您同意您的贡献将遵循 [MIT 许可证](./LICENSE-MIT)。
