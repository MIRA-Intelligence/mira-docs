# MIRA Docs

`MIRA` 引擎与 `MiraUI` 的官方文档站，Markdown-first，由 [Docusaurus](https://docusaurus.io/) 构建。

- 在线访问：**https://mira-intelligence.github.io/**（根域名）
- 引擎仓库：[MIRA-Intelligence/mira](https://github.com/MIRA-Intelligence/mira)
- UI 仓库：[MIRA-Intelligence/mira-ui](https://github.com/MIRA-Intelligence/mira-ui)

## 文档入口

| 板块 | 路径 |
| --- | --- |
| 文档总览 | [`docs/README.md`](docs/README.md) |
| Web 首页 | [`docs/index.mdx`](docs/index.mdx) |
| 快速开始 | [`docs/usage/start.md`](docs/usage/start.md) |
| 信息架构 | [`docs/usage/information-architecture.md`](docs/usage/information-architecture.md) |
| UI 功能 | [`docs/usage/ui/`](docs/usage/ui/) |
| Agent 配置 | [`docs/usage/agent-config/`](docs/usage/agent-config/) |
| 部署说明 | [`docs/deployment/`](docs/deployment/) |
| 故障排查 | [`docs/faq/troubleshooting.md`](docs/faq/troubleshooting.md) |

## 当前功能基线

本次更新按 MIRA 0.3.5rc1 / MiraUI 0.4.5rc1 核对（2026-10-12）。稳定版仍是 0.3.4 / 0.4.4；RC 新功能见 [更新说明](docs/updates.md)。

新增入口：[确认与继续](docs/usage/ui/interactions.md)、[实验输入与执行](docs/usage/ui/experiment-inputs.md)、[快速对话](docs/usage/ui/quick-chat.md)、[记忆与 SDK](docs/usage/agent-config/memory-and-sdk.md)。

截图由当前 MiraUI 组件重新截取，演示数据与模拟桌面桥接已标注。复现说明见 [截图维护](scripts/screenshots/README.md)。

历史兼容性清理记录：[全站审查报告](maintenance/legacy-content-audit-2026-10-12.md)。

## 本地开发

```bash
npm ci
npm run start          # 本地开发，http://localhost:3000
npm run build          # 生产构建，输出到 build/
npm run serve          # 预览生产构建
```

> `prebuild` / `prestart` 会自动跑 `npm run render:docs`：把 `docs/` 里的占位符渲染到 `.generated-docs/`，Docusaurus 实际读的是 `.generated-docs/`。

### 校验 Mermaid 图

```bash
node scripts/check-mermaid.mjs   # 解析所有 *.md/*.mdx 中的 mermaid 块，发现语法错误立即报错
```

## 变量化约定

文档内统一使用以下占位符，避免项目改名时大量手工改动：

| 占位符 | 当前值 |
| --- | --- |
| `{{PROJECT_CORE_NAME}}` | `MIRA` |
| `{{PROJECT_UI_NAME}}` | `MiraUI` |
| `{{PROJECT_ORG_NAME}}` | `MIRA-Intelligence` |
| `{{PROJECT_DOCS_NAME}}` | `MIRA Docs` |

变量定义见 [`docs/variables.md`](docs/variables.md)，构建脚本见 [`scripts/render-doc-variables.js`](scripts/render-doc-variables.js)。改名只需改变量值并重建。

## 文档协作约定

采用 **Markdown 优先 + 少量 MDX 增强页面**：

1. 主体内容用 `.md`，迁移、协作、PDF 导出都稳定。
2. 仅在导航页/入口页用 `.mdx`（如 `docs/index.mdx`），获得更强的交互展示。
3. 构建前一律执行变量替换。
4. **新增/修改图表请用 Mermaid**，并在提交前跑一次 `node scripts/check-mermaid.mjs`。

## 自动部署

`main` 分支每次 push 触发 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)：

```
push -> npm ci -> npm run build -> peaceiris/actions-gh-pages -> mira-intelligence.github.io:main
```

若配置 Tencent SSH Secrets，同一工作流还会调用 rsync 更新 Tencent Cloud；本地脚本 `scripts/deploy-tencent-docs.sh` 是手动入口。

产物被跨仓推送到 [`mira-intelligence.github.io`](https://github.com/MIRA-Intelligence/mira-intelligence.github.io) 仓库的 `main` 分支，由其 GitHub Pages 托管到根域名。认证用 `PAGES_DEPLOY_KEY` Secret（SSH deploy key，只对目标仓库有写权限）。

> 目标仓库不要手工编辑——每次部署都是 `force_orphan: true` 强推，会覆盖本地提交。

## 导出 PDF

正文以 Markdown 为主，部分页面使用 MDX 组件、站内路由和 Mermaid。导出 PDF 时可从构建后的网页打印；使用 `pandoc` 等工具前，需处理 MDX、图片路径与图表渲染，不能假定所有源文件都可直接转换。

## License

本仓库 `package.json` 声明 `ISC`，当前未包含独立 LICENSE 文件。文档授权以维护者补充的仓库许可为准，不沿用旧说明中的组织级 GPL 假设。
