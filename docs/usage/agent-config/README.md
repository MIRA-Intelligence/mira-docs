# Agent 配置

本节覆盖 `{{PROJECT_CORE_NAME}}` 的全部运行时配置：从初始化、模型/Provider 选择，到调用工具与外部 channel。

```mermaid
flowchart LR
    A[onboard<br/>初始化磁盘结构] --> B[Provider + 模型<br/>选 LLM]
    B --> C{需要按复杂度切模型?}
    C -- 是 --> D[Router 模式<br/>small/medium/large]
    C -- 否 --> E[单模型]
    D --> F[Skills + Tools<br/>能干什么]
    E --> F
    F --> G{跑 auto 研究?}
    G -- 是 --> J[Automation Policy<br/>停止条件/预算]
    G -- 否 --> H{要远程接入?}
    J --> H
    H -- 是 --> K[Channels<br/>飞书/Slack/Telegram/...]
    H -- 否 --> I([完成配置])
    K --> I
```

## 页面列表

| 页面 | 何时看 |
| --- | --- |
| [onboard 与 workspace 初始化](./onboard-and-workspace.md) | 第一次安装；想换 workspace 位置；从 MedPilot 迁移 |
| [Provider 与运行时参数](./providers-and-runtime.md) | 切模型/换供应商；调温度、回合上限、上下文窗口 |
| [模型路由（router）模式](./model-router.md) | 想让"小问题走便宜模型" |
| [Skills 与 Tools](./skills-and-tools.md) | 想知道有哪些技能可调用、怎么挂自定义 MCP server |
| [Auto 模式与 Automation Policy](./automation-policy.md) | 跑 `mira research --mode auto`；UI 自动多轮研究；想配停止条件/预算 |
| [Channel 配置](./channels.md) | 想把 Agent 接到飞书/Slack/Telegram/钉钉/邮件 |

