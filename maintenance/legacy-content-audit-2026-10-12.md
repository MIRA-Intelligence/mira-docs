# MIRA Docs 历史兼容性审查

日期：2026-10-12。范围：整个 `docs/`、站点首页、中英文首页文案、README、发布/部署入口和静态图片。

依据：当前 mira 与 mira-ui 的实际 schema、CLI 帮助、通道实现、模型接入、技能目录、Electron resolver 与 CI 工作流。引擎/UI 中有其他任务的未提交修改，本次只修改 mira-docs，没有将尚未完成的 Skill History 工作写成发布能力。

## 已删除或重写的内容

| 历史内容 | 当前证据与处理 |
| --- | --- |
| 复杂度路由、small/medium/large 配置与虚构 router 日志 | 当前 schema/运行路径没有这些字段；整页改为实际默认模型、候选回退和团队角色，首页与导航同步 |
| 引擎自动改名 MedPilot 目录、自动映射 MEDPILOT 环境变量 | 当前 CLI callback/loader 没有此逻辑；删除承诺、标记文件与覆盖目录命令 |
| export 可以覆盖配置文件所有字段 | 实际 Config 对照验证显示显式文件值优先；改为按真实加载优先级说明 |
| 飞书 HTTP /feishu/events 回调 | 当前使用 Lark WebSocket 长连接；删除不存在端点的接入步骤 |
| Slack 可改为 events 模式 | start 明确拒绝非 socket；改为仅 Socket Mode |
| 空发送者白名单不限访问、@username 一定匹配 | BaseChannel 空表拒绝；Telegram 按实际 ID/username 匹配；修正示例和权限说明 |
| Channel status 是 connected 实时健康状态 | CLI 输出的是发现的 Channel 与启用配置；改为日志和真实收发确认连接 |
| CORS/客户端 ID 提供 REST 用户鉴权 | 消息过滤不等于项目权限隔离，删除错误类比 |
| Azure api-version extraHeaders 必须设置 | 当前 Azure 适配器构造 Responses 客户端，不传该字段；改为资源根地址和真实部署名 |
| 旧医学影像、文献检索、导出 Skill 名称与目录 | 按当前 builtin_skills 清单重写，移除不存在的旧操作路径 |
| 当前模块仍按旧 auto-round/replan/export guard 工作 | 删除大段旧实现细节；保留明确标注的旧 CLI/任务计划兼容边界 |
| Electron 先读 env、扫描 PATH、最后找 bundle | 当前 resolver 优先 bundled，再读 MIRA_ENGINE_PATH，不扫描 PATH；更正顺序与开发提示 |
| 2026.04 固定版本号、旧发布分支操作、旧 roadmap | 删除过期 recipes，改为配对校验和当前发布入口 |
| 每个资产都有 .sha256 | 当前 agent-release 生成 SHA256SUMS.txt；修改下载与校验说明 |
| 打标签自动发布 GHCR 镜像、旧 bundle 重建工作流 | 当前工作流没有对应步骤/文件；删除自动发布图和失效入口 |
| mira status --json、统一 3/4/5 错误码、compose up --user | 当前没有这些接口合同；删除错误命令并说明实际替代入口 |
| Windows 异步错误一律无害、修复三轮一定解决 | 删除无条件结论，改为实际退出码、日志和证据检查 |
| 硬编码 10 分钟首跑、2 秒首屏 | 删除未测量承诺 |
| 组织默认 GPL 代表文档许可证 | repo 只有 package.json 的 ISC 声明、没有独立 LICENSE；按仓库证据说明 |

## 静态资产清理

确认全站源码无引用后删除 8 张已被当前截图替代的旧 PNG：experiment-detail、profile、ui-structure、ui-navigation、result-center、new_project、project-queue、ui-navigation-thumbnail。

另删除 11 个没有引用、且无法按 UTF-8/XML 解析的旧 SVG 占位图：ui-navigation、quickstart-flow、result-center、docs-overview、information-architecture、home-dashboard、agent-config、first-project、experiment-detail、deployment-architecture、ui-feature-map。保留品牌 logo、favicon、动画与 11 张本次有效截图。

## 明确保留的兼容性

- 旧 `task_plan.json` 项目、`/api/plan` 及 `mira research`：代码仍保留，与原生 ModuleRun 分开说明。
- `channels.web` → `channels.ui`、旧 host/port 配置兼容：loader 仍实现。
- UI `medpilot-ui-settings` → `mira-ui-settings`：settings store 仍实现；不描述为引擎文件迁移。
- 自定义 Skill 的旧 `<workspace>/skills` 路径：loader 仍搜索，同时说明 `.mira/skills`。
- Dream 的旧 cron/model 字段：schema 仍保留兼容入口。

旧 model-router 文档 URL 保留，内容已替换为当前操作，避免已有书签变成 404。

## 验证范围

- 33 个配置 JSON 示例通过实际 Pydantic 模型字段审查与解析；未识别字段为零。显式配置优先于环境变量的行为另经实例验证。
- 23 项实际 CLI `--help` 检查通过；不调用模型、不启动实验、不操作真实 gateway 服务。
- zh-CN/en 生产构建通过；78 个 HTML 页的 3,947 个本地链接检查无缺失目标/锚点，源码图片引用无缺失，Mermaid 解析与 `git diff --check` 通过。
- 构建保留现有 `vscode-languageserver-types` 静态依赖警告和 Docusaurus 更新检查权限提示，不影响产物生成。
- 浏览器抽查旧 model-router URL、英文首页与 FAQ 均返回 200，显示修订后的内容；抽查页面无横向溢出，控制台无错误。
- 发布状态以此前更新中的 API 查询为基线，不在此次纯文档审查中执行发布或部署。

## 全量页面清单

共核对 36 个源文档文件（含内部变量页）；同站首页和本地化入口另行检查。

- `docs/README.md`
- `docs/cli-reference.md`
- `docs/concepts.md`
- `docs/deployment/README.md`
- `docs/deployment/local-engine-service.md`
- `docs/deployment/release-and-package.md`
- `docs/deployment/self-hosted.md`
- `docs/faq/README.md`
- `docs/faq/troubleshooting.md`
- `docs/index.mdx`
- `docs/updates.md`
- `docs/usage/README.md`
- `docs/usage/agent-config/README.md`
- `docs/usage/agent-config/automation-policy.md`
- `docs/usage/agent-config/channels.md`
- `docs/usage/agent-config/memory-and-sdk.md`
- `docs/usage/agent-config/model-router.md`
- `docs/usage/agent-config/onboard-and-workspace.md`
- `docs/usage/agent-config/providers-and-runtime.md`
- `docs/usage/agent-config/skills-and-tools.md`
- `docs/usage/information-architecture.md`
- `docs/usage/start.md`
- `docs/usage/ui/desktop-web-mode.md`
- `docs/usage/ui/experiment-detail.md`
- `docs/usage/ui/experiment-inputs.md`
- `docs/usage/ui/guardrail-and-auto-repair.md`
- `docs/usage/ui/index.mdx`
- `docs/usage/ui/interactions.md`
- `docs/usage/ui/pipeline-view.md`
- `docs/usage/ui/project-queue.md`
- `docs/usage/ui/quick-chat.md`
- `docs/usage/ui/realtime-sync.md`
- `docs/usage/ui/result-center.md`
- `docs/usage/ui/run-mode-and-profile.md`
- `docs/usage/ui/task-plan-and-status.md`
- `docs/variables.md`

## 后续补齐：Provider UI 作为首选

按用户补充，Provider 文档现将「模型供应商」UI 放在所有 JSON 示例前，并同步快速开始各 UI 路径、首页/导航、初始化、模型选择与回退、Web/Desktop、自托管、本地服务和 FAQ。四张实际组件截图展示供应商设置、角色分配、运行参数和模型参数；接口为隔离演示，不使用真实凭据或修改运行中的引擎。有效截图现合计 15 张。

新增说明区分：测试可用未保存输入，拉取使用已保存配置；添加模型不等于切换主模型；角色留空继承主模型及供应商；UI 保存可更新当前 gateway 运行配置，手工编辑文件不会触发同一路径；远程保存作用于服务器。仍保留纯 CLI / 部署自动化及 UI 未提供字段的高级配置参考。此轮双语构建、33 个配置示例、Mermaid 与 4,003 个本地链接/锚点检查通过。
