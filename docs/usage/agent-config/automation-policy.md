---
sidebar_position: 5
---

# 实验执行与 Automation Policy

当前模块在 **实验启动窗口** 设置执行模式、目标和预算，并保存到该 Run 的 `module_data`。旧 `task_plan` 编排的 auto-round 算法不适用于原生 ModuleRun。

![实验启动时设置模式与预算](/img/current/experiment-launch.png)

*当前启动窗口的局部截图，值为演示。*

## 执行模式与衔接

- **手动**：批准范围后执行一个登记实验；保存终态记录后，等待继续一个实验或结束并汇总。最后一个实验也需要收尾决定。
- **自动**：按已批准的范围推进，遇到澄清、错误或限制时仍可能停止。
- 总览 **模块完成后** 只控制下游衔接，不能代替实验执行模式或执行前批准。

详见 [实验输入与执行](../ui/experiment-inputs.md) 与 [确认与继续](../ui/interactions.md)。

## 本次 Run 的目标与预算

下面是运行配置结构，**不是全局 `config.json` 的 Agent 默认字段**：

```json
{
  "module_data": {
    "experiment_execution_mode": "manual",
    "automation_policy": {
      "logic": "AND",
      "goals": [
        { "metric": "mae_ms", "operator": "<", "value": 30 }
      ],
      "maxExperiments": 2,
      "maxTokens": 200000
    }
  }
}
```

| 字段 | 用法与边界 |
| --- | --- |
| `logic` | AND 为全部指标条件，OR 为任一条件 |
| `goals` | 指标名、比较符和值；指标名应与真实结果一致，比较符为 `>`、`>=`、`<`、`<=`、`==` |
| `maxExperiments` | 正整数；原生实验登记层检查数量上限 |
| `maxTokens` | 正整数；作为配置传给 executor，不应视为 Provider 计费的即时硬截止 |

目标、Token 预算和实验数上限不能代替实际结果与使用量检查。停止后的 Run 可能仍等待确认或汇总；生成文件与交付完成应分别验收。

## 旧研究入口的兼容范围

`mira research` 仍支持 `--mode`、`--max-tokens`、`--max-experiments`，用于旧研究编排 metadata。CLI 的 `--mode auto` 不会独立驱动 UI 的多轮续作。

旧 `ResearchAgentLoop` 的续轮上限来自 `agents.defaults.autoMaxRounds`，当前默认 100。这与一次模型请求中的 `maxToolIterations`，以及新实验 Run 的执行模式都不同。

旧计划项目继续使用 `task_plan.json` 与其合同；新模块不通过旧 `task_plan.result`、export guard 或文本启发式算法完成交付。状态说明见 [状态与存储](../ui/task-plan-and-status.md)，命令见 [CLI 参考](../../cli-reference.md#mira-research)。
