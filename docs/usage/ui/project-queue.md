---
sidebar_position: 1
---

# 项目队列与元信息管理

## 它在哪 / 长什么样

UI 最左侧那一栏。

<!-- ![项目队列](/img/project-queue.png) -->

<img
  src="/img/project-queue.png"
  alt="项目队列"
  style={{ width: '40%', display: 'block'}}
/>

*图：项目队列。每张卡片对应 `~/.mira/workspace/PRJ-xxxx/` 的一个目录。*

## 它做什么

- 浏览和切换全部项目（默认按最近活动时间倒序）。
- 新建项目时设置 `run_mode` / `agent_profile` / `contract_version`。
- 项目级动作：**重命名 / 复制 / 删除**。
<!-- - 一眼看到 `pending` / `running` / `completed` / `failed` 状态，不用点进去。 -->

## 典型操作

### 新建项目

1. 点列表底部的 `+` 或 `New Project`。
2. 必填：
   - `Research Description`：详细的描述本项目
3. 推荐：
   - `run_mode = manual`（首次都建议 manual，看一眼再放手）。
   - `agent_profile = default`（默认的风格，兼顾科研和工程性能）。
   - `contract_version = compact`（熟悉后再升 strict）。
4. 点击创建后，UI 会跳转到该项目的 Research 阶段。

### 复制项目（做实验分支）

- 在项目卡片菜单选 `Duplicate`。
- 复制会保留 `data/` 引用、`task_plan.json` 内容，但 ID 重置、`experiments/` 清空。
- 适合 “在原 baseline 上换一个超参数再跑一遍” 的工作流。

### 删除项目

- 删除会移除 UI 中的引用 + 后端缓存，并按提示决定是否同时删除 workspace 下的目录。
<!-- - **不会** 自动删除 `data/` 中的源数据（避免误删原始 DICOM）。 -->

### 重命名

- 仅修改显示名；不会动磁盘上的目录名（避免破坏正在跑的实验路径）。

## 状态映射

| UI 显示 | `task_plan.json.status` | 含义 |
| --- | --- | --- |
| 灰色 `Idle` | `pending` | 项目刚创建，还没跑过 |
| 蓝色 `Running` | `running` | Agent 正在某阶段执行 |
| 黄色 `Repairing` | `running` (含 guardrail 修复回合) | 字段缺失中，正在自动补齐 |
| 绿色 `Completed` | `completed` 且 `result.output_path` 有效 | 真正交付完成 |
| 红色 `Failed` | `failed` | 不可恢复错误，详情看日志 |

> **完成判定不是“所有实验跑完”**，而是“最终结果导出存在”。详见 [任务计划与状态同步](task-plan-and-status)。

## 验收检查

- [ ] 新建项目后，`~/.mira/workspace/PRJ-xxxx/` 目录立即被创建。
- [ ] 卡片状态徽章随后端推送同步更新（最长 1-2 秒）。
- [ ] 删除项目后，UI 列表中消失；如果勾了“同时删除磁盘”，对应目录也被清理。
