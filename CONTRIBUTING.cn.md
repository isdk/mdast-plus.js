# 贡献指南 - @isdk/mdast-plus

感谢您对贡献 `@isdk/mdast-plus` 的关注！本文档为您提供了参与项目开发的指南。

## 架构概览

`@isdk/mdast-plus` 基于 `unified` 生态系统构建。它严格遵循“语义优先”原则对 `mdast`（Markdown 抽象语法树）进行了扩展。

### 核心概念

1.  **Fluent API**: 主要入口是 `src/pipeline.ts` 中的 `mdast()` 函数。
2.  **分阶段插件**: 插件分为三个阶段：
    *   `normalize`: 清理并规范化语法树。
    *   `compile`: 高级语义转换。
    *   `finalize`: 输出前的最后准备。
3.  **通用数据协议**: 节点使用 `node.data` 存储元数据，使用 `node.data.hProperties` 存储 HTML 属性。

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

1.  在 `src/plugins/` 中创建您的插件。
2.  实现 `MdastPlugin` 接口：

```typescript
import { MdastPlugin } from '../types';

export const myPlugin: MdastPlugin = {
  name: 'my-plugin',
  stage: 'normalize', // 'normalize' | 'compile' | 'finalize'
  order: 50,          // 优先级 0-100
  transform: async (tree, processor) => {
    // 访问节点并转换树
  }
};
```

3.  如果该插件应为默认插件，请在 `src/pipeline.ts` 的 `FluentProcessor` 构造函数中注册它。

## 添加新格式

1. 实现 `MdastFormatDefinition` 接口。
2. 使用 `FluentProcessor.registerFormat(name, definition)` 进行注册。

```typescript
import { FluentProcessor } from '../pipeline';

FluentProcessor.registerFormat('json', {
  // 可选：是否需要执行转换器（transformer）以转换为 mdast。
  // 默认为 true。如果解析结果已经是标准的 mdast 且不需要进一步处理，可以设为 false。
  needsTransformToMdast: false,
  stringify: (processor) => {
    processor.Compiler = (tree) => JSON.stringify(tree);
  }
});
```

> **注意**: 格式名称不区分大小写。

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
