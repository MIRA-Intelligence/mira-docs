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
    F --> G{要远程接入?}
    G -- 是 --> H[Channels<br/>飞书/Slack/Telegram/...]
    G -- 否 --> I([完成配置])
    H --> I
```

## 页面列表

| 页面 | 何时看 |
| --- | --- |
| [onboard 与 workspace 初始化](onboard-and-workspace) | 第一次安装；想换 workspace 位置；从 MedPilot 迁移 |
| [Provider 与运行时参数](providers-and-runtime) | 切模型/换供应商；调温度、回合上限、上下文窗口 |
| [模型路由（router）模式](model-router) | 想让“小问题走便宜模型” |
| [Skills 与 Tools](skills-and-tools) | 想知道有哪些技能可调用、怎么挂自定义 MCP server |
| [Channel 配置](channels) | 想把 Agent 接到飞书/Slack/Telegram/钉钉/邮件 |

