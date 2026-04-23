# MIRA Docs

`MIRA` 引擎与 `MiraUI` 的官方文档站，Markdown-first，由 [Docusaurus](https://docusaurus.io/) 构建。

- 在线访问：**https://mira-intelligence.github.io/mira-docs/**
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
push -> npm ci -> npm run build -> upload-pages-artifact -> deploy-pages
```

无需手动操作，几分钟内更新到 GitHub Pages。

## 导出 PDF

主要内容（`docs/usage/`、`docs/deployment/`、`docs/faq/`）保持纯 Markdown，可被 `pandoc` / `mdbook` / `docsify-to-pdf` 等工具直接消费。

## License

`MIRA-Intelligence` 组织默认采用 GPL-3.0-or-later，文档随仓库一致。
