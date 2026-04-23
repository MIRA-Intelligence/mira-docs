---
sidebar_position: 3
---

# 实验详情面板（指标、证据、工件）

## 它在哪 / 长什么样

在 Experiment 阶段的实验列表里点任意一条进入。**TODO 截图**：左侧元信息（id/method/status/profile）、中部指标表（metrics）、右侧 artifacts 列表（路径 + 缩略图）、底部结论与 next 步骤。

![实验详情](/img/experiment-detail.png)

## 它做什么

把一次实验跑出来的所有 **可验证证据** 集中在一页，方便你判断 “这个实验真的完成了吗”、“结论站不站得住”。

## 字段总表（按重要性排序）

| 字段 | 在哪看 | 含义 | 缺失会怎样 |
| --- | --- | --- | --- |
| `status` | 顶部 | `pending`/`running`/`completed`/`failed` | — |
| `results.metrics` | 中部表格 | 数字指标，如 `{ "auc": 0.91, "dice": 0.85 }` | 实验视为没产出 |
| `results.findings` | 中部 Markdown | 文字结论 | 后续报告会缺“讲什么” |
| `results.artifacts` | 右侧列表 | 产物文件路径列表 | 结论无法溯源 |
| `method` | 左侧元信息 | 实验方法描述 | 对照分析会缺字段 |
| `theoretical_proof` *(strict)* | 底部 | 理论或方法依据 | guardrail 触发修复回合 |
| `isolation_test` *(strict)* | 底部 | 隔离对照（变量控制） | guardrail 触发修复回合 |
| `post_mortem` *(strict)* | 底部 | 失败/异常复盘（成功也填，作为 post-hoc 分析） | guardrail 触发修复回合 |
| `evidence_refs` *(strict)* | 底部 | 引用的文献/链接 ID 列表 | guardrail 触发修复回合 |

> 带 `*(strict)*` 的字段只在 `contract_version = strict` 时强制要求。

## 使用建议

### 看一个实验是否真的完成

按这个顺序快速扫一遍：

1. `status = completed` ✅
2. `results.metrics` 有 ≥1 个有意义的指标 ✅
3. `results.artifacts` 中有路径 + 路径文件存在 ✅
4. `results.findings` 不是占位文本（“TODO”/“待补充”一律不算） ✅
5. （strict）四个研究字段都有真实内容 ✅

任一项不通过，要么手动补，要么让 guardrail 跑一轮自动修复。

### 复盘一个 `failed` 实验

1. 点 `Open logs`，定位最后一条非 INFO 日志。
2. 看 `post_mortem` 字段（即使 failed，Agent 也会尝试写一段总结）。
3. 在该实验下点 `Retry from failure`，Agent 会复用前面已成功的步骤。

### 直接定位文件

- artifact 路径都是相对于 `~/.mira/workspace/PRJ-xxxx/` 的。
- UI 里点击路径会复制到剪贴板（也支持桌面模式下直接 “在 Finder/Explorer 中显示”）。

## 验收检查

- [ ] 指标表内容与对应 `results.json` / `task_plan.json.experiments[].results.metrics` 一致。
- [ ] artifact 路径全部可访问（不存在的文件会被标红）。
- [ ] strict 模式下，所有研究字段都有非占位内容。
- [ ] 跳到下一个实验时，面板内容立刻刷新（不会停留在上一个实验的数据）。
