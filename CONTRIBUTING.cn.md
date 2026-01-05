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

### 理解 Pipeline 工作流 (Understanding the Pipeline)

`MdastPipeline` 类负责协调整个转换过程。理解其生命周期对于进行复杂的定制至关重要。

#### 1. 注册 (Registration - `use`)

当您调用 `.use()` 时，插件不会立即执行。相反，它们被封装为 `MdastPlugin` 条目并推入一个队列 (`queue`) 中。

#### 2. 解析 (Resolution - `resolveRunQueue`)

当调用 `.to(format)` 时，Pipeline 会解析出最终要执行的插件列表：

- **覆盖 (Overrides)**: 应用 `.to()` 中提供的运行时选项。
- **过滤 (Filtering)**: 如果请求了特定的 `stage` 或 `stopAtIndex`，队列将被相应地切片。
- **主插件保留 (Main Plugin Preservation)**: 确保即使被切片排除，“主”插件（如解析器）也会被保留（除非显式禁用）。
- **输入/输出注入**: 自动添加输入插件（如果缺失）和特定格式的输出插件。

#### 3. 组装 (Assembly - `assembleProcessor`)

解析后的队列随后被组装成一个 `unified` 处理器：

- **分组**: 插件按 `PipelineStage` 分组。
- **替换**: 如果某个阶段存在 `main: true` 的插件，它将替换该阶段的默认插件。
- **排序**: 阶段内的插件根据 `order` 和语义化的 `before`/`after` 约束进行排序。
- **执行**: `unified` 处理器按顺序运行插件。

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

### 插件开发注意事项 (Plugin Development Notes)

#### 1. `.use()` 的灵活性与数组歧义性 (Flexibility & Array Ambiguity)

`MdastPipeline` 旨在同时支持 `unified` 社区习惯和 `mdast-plus` 的高级结构化对象。

*   **标准调用**: `.use(plugin, options)`
*   **Tuple 调用**: `.use([plugin, options])` —— 这通常用于 Preset 中。
*   **List 调用**: `.use([plugin1, plugin2])` —— 同时注册多个插件。
*   **Struct 调用**: `.use({ plugin: myPlugin, stage: 'parse' })` —— 推荐用于内部开发。

**注意：** 当传入数组时，系统使用**启发式 (Heuristic)** 算法来区分 Tuple 和 List：
*   如果数组看起来像 `[Function, Object]`，它既可能是 `[Plugin, Options]` (Tuple)，也可能是 `[Plugin, MdastPlugin]` (List)。
*   系统会检查后续元素。如果后续元素看起来**不像**一个插件（不是函数、不是数组、没有 plugin 属性），系统会判定这是一个 **Tuple**（即后续元素是选项）。
*   因此，开发 Preset 时，请确保您的结构清晰。

#### 2. 选项传递与 Preset

当您使用 `.use(preset, globalOptions)` 加载一个包含多个插件的数组（Preset）时，`globalOptions` 会被递归地传递给 Preset 中的每一个子插件（除非子插件本身已经绑定了具体的 Options）。这允许用户通过一次调用配置一组插件。

#### 3. 插件签名

现代 `unified` (v11+) 的插件（Attacher）仅接收 `options` 作为参数。上下文（Context）通过 `this` 访问。

```typescript
// ✅ 正确
const myPlugin = function(options) {
  const processor = this; // 访问 processor 上下文
  return (tree, file) => { ... }; // Transformer 接收 tree 和 file
}

// ❌ 错误 (旧版风格)
const myPlugin = function(options, context) { ... }
```

#### 4. 实现注意事项：树的包裹 (Tree Wrapping)

当插件需要对 AST 树进行包裹（例如添加 `<html>`/`<body>` 标签或追加页脚）时，请遵循以下模式：

1. **先准备内容**: 将所有内容节点（主内容、页脚等）收集到一个数组中。
2. **检查存在性**: 在追加节点（如来源链接）之前，务必检查该节点是否已存在，以避免重复。
3. **统一包裹**: 使用准备好的数组，根据配置（如 `isFragment` 选项）执行最终的包裹逻辑。

这种方法可以确保在不同输出配置下的健壮性，并避免冗余逻辑。

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
