# 信息架构

本页展示 `{{PROJECT_DOCS_NAME}}` 的功能地图与阅读路径，便于快速定位目标内容。

![功能地图](/img/ui-structure.png)

*图 1：UI模块布局*

## 核心目标

- 首屏可快速理解产品边界（`{{PROJECT_CORE_NAME}}` vs `{{PROJECT_UI_NAME}}`）
- 新用户可在 5 分钟内完成首个项目闭环
- 功能文档覆盖从创建项目到交付导出的完整闭环
- 部署、配置、排障与使用路径分离，降低检索成本

## 内容映射

- **Start**：`usage/start`（环境准备与首个项目）
- **Features**：`usage/ui/*`（UI 功能操作）
- **Configuration**：`usage/agent-config/*`（Agent 配置）
- **Deployment**：`deployment/*`
- **FAQ**：`faq/troubleshooting`

## 推荐阅读顺序

1. 先完成 `usage/start` 的环境准备与首个项目。
2. 再进入 `usage/ui/*`，按功能定位日常操作。
3. 需要模型或 Provider 调优时查看 `usage/agent-config/*`。
4. 上线前参考 `deployment/*`，问题排查使用 `faq/troubleshooting`。
