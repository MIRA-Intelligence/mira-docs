---
title: 2026 年 10 月功能更新
sidebar_position: 1
---

# 2026 年 10 月功能更新

本次文档核对日期：**2026-10-12**。依据引擎与 UI 的当前源码、已实现 API/CLI、仓库内合同文档以及 GitHub 发布记录。

## 版本基线

| 通道 | MIRA 引擎 | MiraUI |
| --- | --- | --- |
| 稳定版 | [0.3.4](https://github.com/MIRA-Intelligence/mira/releases/tag/v0.3.4) | [0.4.4](https://github.com/MIRA-Intelligence/mira-ui/releases/tag/v0.4.4) |
| 当前预发布版 | [0.3.5rc1](https://github.com/MIRA-Intelligence/mira/releases/tag/v0.3.5rc1) | [0.4.5rc1](https://github.com/MIRA-Intelligence/mira-ui/releases/tag/v0.4.5rc1) |

本文新增操作截图以当前预发布版对应源码为准。GitHub 的 `/releases/latest` 指向稳定版；要使用 RC 新功能，请打开上表的指定 release。桌面设置可选择接收预发布更新，启用后才纳入 RC/Beta 通道。

当前 UI 的 `compatibility.json` 配对为 UI `0.4.5rc1`、agent `0.3.5rc1`，最低 agent `0.3.5rc1`，API contract `v1`。模块协议独立通过 `/api/workflow/v1/contract` 发现。

## 本次需要重新熟悉的操作

| 变化 | 阅读入口 |
| --- | --- |
| 既有 Provider UI 文档补齐，作为首选配置方式 | [模型供应商 UI](./usage/agent-config/providers-and-runtime.md) |
| 从任意模块开始，选择候选创建新分支 | [模块总览](./usage/ui/pipeline-view.md) |
| 模块自己的执行批准、修改与多轮澄清 | [确认与继续](./usage/ui/interactions.md) |
| 每次实验启动时选择手动/自动，逐个实验结束后确认 | [实验输入与执行](./usage/ui/experiment-inputs.md) |
| 额外输入路径：本次实验和子智能体只读访问 | [输入路径](./usage/ui/experiment-inputs.md#额外输入路径) |
| 原生实验记录成为候选，交付文件归为同一交付物 | [实验详情](./usage/ui/experiment-detail.md)、[结果交付](./usage/ui/result-center.md) |
| 明确项目名称、父目录、最终目录并确认复用 | [项目管理](./usage/ui/project-queue.md) |
| 对话/项目文件夹、对话批量操作、转项目与 Skill 选择 | [快速对话](./usage/ui/quick-chat.md) |
| 本地引擎启动、停止、重启及健康状态 | [本地服务](./deployment/local-engine-service.md) |
| 新模块状态由 `module.json` 管理 | [状态与存储](./usage/ui/task-plan-and-status.md) |
| `mira workflow` 当前已实现的命令 | [CLI 参考](./cli-reference.md#mira-workflow) |

## 截图范围

截图于本次更新中重新获取，使用当前 MiraUI 的实际 React 组件与样式，并在隔离浏览器页面中填入演示数据。局部图截取实际表单或功能区域；不是设计稿。桌面引擎控制区域使用模拟桌面桥接展示，未对正在运行的服务做启停。Provider 截图使用模拟配置与模型列表接口，不使用真实密钥，也不代表实际连接测试或模型调用已成功。

演示指标、方向、文件引用和状态用于说明操作，不代表真实实验结果，也不能证明安装包或模型调用已经通过端到端验收。

## 兼容边界

旧 `task_plan` 项目继续保留自己的读取与运行路径；当前源码设计文档中的自动旧项目转换、部分恢复与调度强化仍有后续事项。本次文档只把代码中已存在的命令与界面写成操作步骤，不将提案当作可用入口。
