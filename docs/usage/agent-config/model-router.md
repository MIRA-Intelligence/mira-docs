---
title: 模型选择与候选回退
sidebar_position: 2
---

# 模型选择与候选回退

当前引擎使用默认模型和可选候选列表；团队 Profile 还可分别指定角色模型。旧文档中的 `routeByComplexity`、`routeModel` 和 small/medium/large 配置已不在当前 schema 与运行路径中，不应继续使用。

## 首选通过 UI 选择模型

打开 **模型供应商**，添加模型后点击 **设为主模型**，或在「活动模型」中选择主模型/团队角色，最后点击 **保存**。详细步骤与截图见 [Provider UI 指南](./providers-and-runtime.md)。

UI 的常用模型列表用于选择和分配模型，不是按顺序执行的候选回退列表。当前 UI 主模型输入是单模型；需要配置多候选时使用下文的高级字段。

## 高级：默认模型与候选

单模型时填写 `agents.defaults.model`。需要候选回退时，该字段可接收按优先顺序排列的模型 ID 数组：

```json
{
  "agents": {
    "defaults": {
      "provider": "custom",
      "model": ["primary-model-id", "backup-model-id"],
      "providerRetryMode": "standard"
    }
  },
  "providers": {
    "custom": {
      "apiBase": "https://gateway.example.com/v1",
      "apiKey": "<key>"
    }
  }
}
```

示例模型 ID 是占位符，替换为服务真实提供的 ID。第一个候选是默认模型；后续候选用于运行时支持的失败回退。所有候选都需要可用的凭据与接入。

显式固定 Provider 时，模型候选仍按该 Provider 解析，不会因为名字中出现另一家供应商就自动切换账号。回退由运行时的重试策略与错误类型决定，不保证任意失败都会切换模型。

## 团队角色

| 角色 | 模型字段 | Provider 字段 |
| --- | --- | --- |
| 监督者 | `supervisorModel` | `supervisorProvider` |
| 执行者 | `studentModel` | `studentProvider` |
| 评审者 | `criticModel` | `criticProvider` |

角色模型字段也支持候选列表；未指定角色模型时回退到默认模型。显式角色 Provider 用于单独指定该角色的接入。

## 检查配置

在 UI 的 Provider 窗口获取模型并测试连接。`mira status` 可查看配置路径、workspace、默认模型、角色模型和本地凭据状态，不能证明上游模型请求已成功。

运行实际任务时，结合日志核对使用的 Provider、模型与错误。不要再寻找旧文档中的 `[router] tier=small` 日志或“effective tiers”输出。

更多配置见 [Provider 与运行时参数](./providers-and-runtime.md)。
