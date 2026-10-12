---
sidebar_position: 7
---

# 记忆与 Python SDK

本页整理引擎仓库的 Memory 和 Python SDK 文档，并核对当前代码。两份源文档仍有较早的版本说明；这里以当前接口为准，不把旧的“计划发布”日期当作当前状态。

## 会话与长期记忆

| 层 | 用途 |
| --- | --- |
| 会话消息 | 当前对话上下文；ModuleRun 使用自己的会话 key |
| `memory/history.jsonl` | 压缩后的历史摘要，按游标追加 |
| `SOUL.md` / `USER.md` / `memory/MEMORY.md` | 长期风格、用户偏好与持久知识 |
| GitStore | 记录长期记忆文件的修改，供检查与恢复 |

上下文压缩把较早的安全片段整理为历史摘要；Dream 再处理新的摘要，对长期文件做有范围的修改。长期记忆不等于完整实验档案，也不替代项目的 Run、Artifact 和源数据。

可用消息命令：

| 命令 | 作用 |
| --- | --- |
| `/dream` | 立即运行 Dream |
| `/dream-log` 或 `/dream-log <sha>` | 查看最近或指定的记忆修改 |
| `/dream-restore` | 列出可恢复版本 |
| `/dream-restore <sha>` | 撤销指定长期记忆修改并生成安全提交 |

恢复操作会修改长期记忆。先查看差异，并确认所恢复的版本；不将它理解为回滚项目文件或实验。

Dream 配置在 `agents.defaults.dream`：

```json
{
  "agents": {
    "defaults": {
      "dream": {
        "intervalH": 2,
        "modelOverride": null,
        "maxBatchSize": 20,
        "maxIterations": 10
      }
    }
  }
}
```

`intervalH` 控制周期，`modelOverride` 可指定专用模型，后两项控制每批摘要数和编辑工具预算。旧 `cron` / `model` 字段为兼容入口，新配置优先使用上面的字段。

## Python 中调用 MIRA

安装完整 `mira-engine` Python 包并配置 Provider 后：

```python
import asyncio
from mira_engine import Mira

async def main():
    bot = Mira.from_config(workspace="/path/to/project")
    result = await bot.run(
        "读取本项目 README，列出需要补充的运行说明。",
        session_key="sdk:docs-review",
    )
    print(result.content)
    print(result.tools_used)

asyncio.run(main())
```

`Mira.from_config(config_path=None, workspace=...)` 加载配置并可覆盖工作区。`run` 接收消息、会话 key 和可选 hooks，返回 `RunResult`。当前实现将文本写入 `content`；`tools_used` 和 `messages` 仍返回空列表，不应当作完整审计记录。不同 session key 用于隔离对话历史。

SDK 运行一次 Agent 请求不等于启动 UI 的模块流水线。需要读取或控制已有 ModuleRun 时，使用 [workflow CLI](../../cli-reference.md#mira-workflow) 或 [workflow API](../ui/realtime-sync.md)。

## Hooks

从 `mira_engine.agent` 导入 `AgentHook` / `AgentHookContext`，可观察模型迭代、流式输出和工具执行。多个 hooks 按顺序组合，`finalize_content` 的输出传给下一个 hook。

完整示例和更多说明见引擎源码文档 [Python SDK](https://github.com/MIRA-Intelligence/mira/blob/v0.3.5rc1/docs/PYTHON_SDK.md) 与 [Memory](https://github.com/MIRA-Intelligence/mira/blob/v0.3.5rc1/docs/MEMORY.md)。
