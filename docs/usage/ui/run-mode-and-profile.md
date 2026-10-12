---
sidebar_position: 8
---

# 运行模式与 Profile

当前界面把 **对话 / 项目** 作为工作入口，项目中的 Profile 提供 **工程 / 科研 / 团队**。它们与每次实验的执行模式、模块间衔接策略是不同设置。

## 工作入口与 Profile

| 入口/选项 | 作用 |
| --- | --- |
| 对话（Quick Chat） | 通用聊天与工具任务，不要求先走项目流水线 |
| 项目 | 保存模块运行、实验记录、候选结果与交付分支 |
| 工程 `engineer` | 偏实现、复用、调试和验证 |
| 科研 `research` | 偏问题定义、文献、证据与对照 |
| 团队 `team` | 使用团队协作策略，可在能力允许时委派子智能体 |

新模块由各自的原生 executor 管理确认、实验与产出，复用通用对话引擎。Profile 提供执行策略，不能把它理解为所有项目都进入旧 `ResearchAgentLoop` 的 `task_plan` 流程。

团队模式仍需遵守当前模块的确认、实验边界和读取范围；子智能体不能绕过主运行的批准。

## 三类运行控制

| 控制 | 设置位置 | 影响范围 |
| --- | --- | --- |
| 实验执行模式：自动 / 手动 | 启动实验或从上游继续实验的窗口 | 本次实验 Run；手动模式逐个实验等待确认 |
| 模块完成后：由我选择 / 自动创建建议模块 | 项目总览右上角 | 模块间下游创建策略 |
| 执行前批准 / 修改 | 当前模块的确认表单 | 当前范围是否获准执行 |

自动实验不会自动批准新范围；自动创建下游也不跳过下游确认。详见 [确认与继续](./interactions.md) 和 [实验输入与执行](./experiment-inputs.md)。

## Compat / Strict

UI 保留 **Compat / Strict** 的实验记录合同选择。它表达输出记录的校验要求，不是 API transport 或 workflow contract 的版本。

新模块还会检查自身输入、执行确认、原生实验记录和产物。结构校验通过不能证明实验结论正确。旧 `task_plan` 的补字段流程见 [Guardrail](./guardrail-and-auto-repair.md)。

## CLI 的边界

- `mira agent`：通用对话引擎，可多次工具调用完成一个用户任务。
- `mira research`：旧研究编排入口，支持 `default / engineer / research / team`。
- `mira workflow`：当前模块项目的读取与生命周期命令，与 UI 使用同一 WorkflowService。

`mira research --mode auto` 保留旧 metadata 语义，不等于 CLI 会自动驱动 UI 的多轮模块流程。具体命令见 [CLI 参考](../../cli-reference.md)。
