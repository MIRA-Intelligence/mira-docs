---
sidebar_position: 9
---

# 状态、文件与旧项目兼容

新模块项目与旧任务计划项目使用不同的状态来源。先识别项目类型，再查对应文件。

## 当前模块项目

```text
<project>/
  .mira/
    project.json                    # 项目元信息与 workflow
    events.jsonl                    # 持久化事件顺序
    modules/<run-id>/
      module.json                   # 本次 ModuleRun 的权威状态
      checkpoint.json               # 已保存的检查点
      attempts/<attempt-id>.json    # 每次执行尝试
    artifacts/<artifact-id>/
      artifact.json                 # 类型、来源、哈希与文件引用
      payload.*                     # 发布的内容
  result/exports/                   # UI 默认请求的交付路径
```

| 字段 | 界面含义 |
| --- | --- |
| `module_type` | 调研、规划、实验或交付类型 |
| `status` | 本次 Run 的生命周期 |
| `module_data.interaction` | 当前待回答表单 |
| `module_data.interaction_history` | 已保存的交互与决定 |
| `module_data.experiments` | 该 Run 的原生实验记录 |
| `inputs` / `outputs` | 明确继承和发布的 Artifact 引用 |
| `module_data.parent_run_id` / `upstream_selection` | 下游分支来自哪个 Run / 候选 |
| `revision` | 状态修订号；提交旧版本会冲突，需要重新加载 |

项目 manifest 的模块索引用于总览；具体运行状态以对应 `module.json` 为准。UI 通过引擎命令修改状态，不建议直接编辑这些文件。

## ModuleRun 的状态

| 状态 | 你应该做什么 |
| --- | --- |
| `created` | 草稿，尚未排队 |
| `queued` | 已排队，检查是否需要开始执行 |
| `running` | 正在执行，查看当前操作和输出 |
| `waiting_input` | 回答确认/澄清/继续表单 |
| `paused` | 检查暂停原因，再决定恢复 |
| `completed` | 检查发布的结果与文件，再继续下游 |
| `failed` | 看错误与已有记录，决定重试或新分支 |
| `cancelled` | 本次运行已取消，保留历史 |

`pending_control` 表示暂停/取消已请求但尚未到达安全边界。点击按钮不意味着任意外部进程已立即终止。

一次 Run 可经历多次 Attempt，例如回答表单后从检查点继续。Attempt 不是一个新的科学实验，实验数量以登记的记录为准。

## 旧 task_plan 项目

旧项目仍由 `task_plan.json` 保存阶段、实验和最终结果，API 仍保留 `/api/plan`。常见字段为：

```json
{
  "phase": "experiment",
  "experiments": [],
  "result": {
    "output_path": "result/exports/experiment_report.md",
    "output_type": "report",
    "summary": "阶段结果总结"
  }
}
```

示例只用于识别旧结构，具体合同以当前引擎 `/api/plan/contract` 返回值为准。旧计划完成判定与模块 Run 完成判定不同；新模块不能通过修改旧 `task_plan.status` 收尾。

当前源码合同文档中的部分迁移设计仍是提案。不要假定旧项目已经自动转换，也不要调用尚未实现的 `legacy-conversion` 端点。先备份，保留旧项目可读路径。

## 排查状态不一致

1. 确认 API 地址、workspace 和当前项目路径，避免比较不同后端。
2. 当前模块先查待输入表单、Run 状态与 `pending_control`；旧项目查 `task_plan`。
3. 刷新项目，必要时重连 UI；引擎用快照与持久化事件重建状态。
4. 对照日志、`module.json` 和文件是否存在，不只看聊天中的“完成”。

更多协议细节见 [实时同步](./realtime-sync.md)。
