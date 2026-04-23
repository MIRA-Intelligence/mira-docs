# {{PROJECT_DOCS_NAME}}

这是 `{{PROJECT_CORE_NAME}}` 与 `{{PROJECT_UI_NAME}}` 的独立文档仓库草案目录（Markdown-first）。

目标：

- 与 `{{PROJECT_CORE_NAME}}`、`{{PROJECT_UI_NAME}}` 同级维护，后续可单独 push 到 `{{PROJECT_ORG_NAME}}` 下独立 repo。
- 「简介 -> 从这里开始 -> 深入使用 -> 部署与导出」信息架构。
- 兼容未来网页部署（文档站）与 PDF 导出。

## 文档入口

- 文档总览：`docs/README.md`
- Web 首页：`docs/index.mdx`
- 快速开始：`docs/usage/start.md`
- 信息架构：`docs/usage/information-architecture.md`
- UI 功能：`docs/usage/ui/`
- Agent 配置：`docs/usage/agent-config/`
- 部署说明：`docs/deployment/`
- 故障排查：`docs/faq/troubleshooting.md`

## 变量化约定

文档内统一使用以下占位符，避免项目改名时大量手工改动：

- `{{PROJECT_CORE_NAME}}`
- `{{PROJECT_UI_NAME}}`
- `{{PROJECT_ORG_NAME}}`
- `{{PROJECT_DOCS_NAME}}`

当前默认值见 `docs/variables.md`。

## 网页化策略（已确认）

采用 **MD 优先 + 少量 MDX 增强页面**：

1. 主体内容继续使用 `.md`，保证迁移、协作、PDF 导出稳定。
2. 仅在导航页/入口页使用 `.mdx`（如 `docs/index.mdx`），提供更强的交互展示。
3. 构建或导出前执行一次变量替换，将占位符渲染为目标项目名。

## 导出建议

- **网页部署**：优先选择支持 Markdown + MDX 的文档框架。
- **PDF 导出**：优先从 Markdown 主内容（`docs/usage/`、`docs/deployment/`、`docs/faq/`）导出，避免被少量 MDX 语法阻塞。

