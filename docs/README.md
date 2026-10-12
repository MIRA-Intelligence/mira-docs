---
slug: /docs-overview
---

# {{PROJECT_DOCS_NAME}} 文档目录

本页是文档的总目录。**第一次来 → 直接进 [快速开始](./usage/start.md)。**

- [2026 年 10 月更新](./updates.md)：新功能、版本要求与截图范围。
- [确认与继续](./usage/ui/interactions.md)、[实验输入与执行](./usage/ui/experiment-inputs.md)：当前模块的操作路径。

## 推荐阅读路径

| 角色 | 路径 |
| --- | --- |
| 新用户 | [快速开始](./usage/start.md) → [核心概念](./concepts.md) → [UI 功能总览](./usage/ui/index.mdx) → [结果导出中心](./usage/ui/result-center.md) |
| 配置/调优 | 首选 [模型供应商 UI](./usage/agent-config/providers-and-runtime.md) → [Agent 高级配置](./usage/agent-config/README.md) → [模型选择与回退](./usage/agent-config/model-router.md) → [Skills 与 Tools](./usage/agent-config/skills-and-tools.md) |
| 运维/部署 | [本地服务](./deployment/local-engine-service.md) → [自托管](./deployment/self-hosted.md) → [打包与发布](./deployment/release-and-package.md) |
| 排障 | [FAQ 与故障排查](./faq/troubleshooting.md) |
| 命令行用户 | [CLI 命令参考](./cli-reference.md) |

## 文档分区

| 分区 | 内容 |
| --- | --- |
| `concepts` | 必须先理解的术语与实体（workspace / project / ModuleRun / experiment / Artifact） |
| `cli-reference` | `mira` 与 `mira-engine` 全部子命令 |
| `usage/start` | 安装、连接与首次模块运行 |
| `usage/ui/*` | UI 每个面板的职责与操作 |
| `usage/agent-config/*` | Agent 初始化、模型、候选、tools、channels |
| `deployment/*` | 本地服务、docker-compose 自托管、打包发布 |
| `faq/*` | 连接、执行、输入、服务与迁移问题的定位顺序与解法 |
