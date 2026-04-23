---
title: CLI 命令参考
sidebar_position: 3
---

# CLI 命令参考

`{{PROJECT_CORE_NAME}}` 提供两个命令行入口：

| 命令 | 用途 | 谁用 |
| --- | --- | --- |
| `mira` | 日常使用：onboard、跑 agent、起 gateway、起 API | 所有人 |
| `mira-engine` | 本地后台服务管理：装 / 起 / 停 / 看日志 / 升级 | 把 Mira 当系统服务跑的人 |

> 全局选项：`-v` / `--version` 查看版本；`--help` 查看帮助。所有子命令都支持 `--help`。

## `mira` 总览

```
$ mira --help
Usage: mira [OPTIONS] COMMAND [ARGS]...

  🐈 mira - Personal AI Assistant

Commands:
  onboard   Initialize mira configuration and workspace.
  gateway   Start the mira gateway.
  serve     Start OpenAI-compatible API server.
  agent     Interact with the agent directly.
  status    Show mira status.
  channels  Manage channels.
```

### `mira onboard`

初始化 `~/.mira/`（首次安装、迁移到新机器、配置坏掉重建时使用）。

```bash
mira onboard                  # 用默认路径（~/.mira/）
mira onboard --wizard         # 交互式向导，逐项填 provider / key / model
mira onboard -w /tmp/work \   # 指定 workspace
             -c /tmp/cfg.json # 指定 config 路径
```

| 选项 | 默认 | 说明 |
| --- | --- | --- |
| `-w, --workspace TEXT` | `~/.mira/workspace` | 工作区目录 |
| `-c, --config TEXT` | `~/.mira/config.json` | 配置文件路径 |
| `--wizard` | off | 交互式问答补齐 provider / model |

### `mira gateway`

启动后端服务（WebSocket + REST），UI 与 channel 都连这个端口。

```bash
mira gateway                            # 默认 0.0.0.0:18790
mira gateway -p 28790                   # 换端口
mira gateway --host 127.0.0.1 -v        # 仅本机 + verbose 日志
```

| 选项 | 默认 | 说明 |
| --- | --- | --- |
| `--host TEXT` | `0.0.0.0` | 监听地址 |
| `-p, --port INTEGER` | `18790` | 监听端口 |
| `-w, --workspace TEXT` | 配置值 | 临时覆盖 workspace |
| `-v, --verbose` | off | 详细日志 |
| `-c, --config TEXT` | `~/.mira/config.json` | 配置文件 |

### `mira serve`

启动 **OpenAI 兼容** 的 HTTP API（`/v1/chat/completions`）。可以让 Cursor / Continue / 其它 OpenAI SDK 直接把 Mira 当一个 LLM endpoint 调。

```bash
mira serve -p 8900 --timeout 180
```

| 选项 | 默认 | 说明 |
| --- | --- | --- |
| `--host TEXT` | `127.0.0.1` | 监听地址（默认仅本机） |
| `-p, --port INTEGER` | `8900` | 端口 |
| `--timeout FLOAT` | `120.0` | 单请求超时（秒） |
| `-w, --workspace TEXT` | 配置值 | 临时 workspace |
| `-c, --config TEXT` | `~/.mira/config.json` | 配置文件 |

### `mira agent`

直接和 Agent 在终端里对话，最快验证 provider/skills 是否可用。

```bash
mira agent                                          # 进入 REPL
mira agent -m "总结 ~/papers 里的最新综述"           # 单次任务
mira agent -m "..." --logs --verbose                # 看实时日志和工具调用提示
mira agent -m "..." -s session-research             # 指定 session ID 复用上下文
mira agent -m "..." --no-markdown                   # 关掉 Markdown 渲染（适合管道输出）
```

| 选项 | 默认 | 说明 |
| --- | --- | --- |
| `-m, --message TEXT` | — | 直接发一句话；省略则进交互式 |
| `-s, --session TEXT` | `cli:direct` | session ID（决定上下文/记忆隔离） |
| `-w, --workspace TEXT` | 配置值 | 临时 workspace |
| `-c, --config TEXT` | `~/.mira/config.json` | 配置文件 |
| `--markdown / --no-markdown` | on | Markdown 渲染开关 |
| `--logs / --no-logs` | off | 显示运行时日志 |
| `--verbose / --no-verbose` | off | 显示工具调用 hint（含 skill 名） |
| `--debug / --no-debug` | off | 等价 `--verbose` |

### `mira status`

打印当前配置摘要：provider、模型、workspace、迁移状态、可用 channel。
出问题时第一时间运行它。

```bash
mira status
```

### `mira channels`

```
$ mira channels --help
Commands:
  status  Show channel status.
  login   Login for a specific channel (plugin-aware).
```

- `mira channels status`：列出已启用 channel 与其登录状态。
- `mira channels login <name>`：触发 channel 的登录流程（如 OAuth）。

详细的 channel 配置见 [Channel 配置](usage/agent-config/channels)。

---

## `mira-engine` 总览

`mira-engine` 把 `mira gateway` 包装为可被系统管理（launchd / systemd / Windows Service）的后台服务，并提供升级 / 诊断 / 日志查看入口。**普通使用不需要它**；当你希望关掉终端 Mira 仍在跑，再考虑安装。

```
$ mira-engine --help
Commands:
  install-service     注册系统服务（用户级）
  uninstall-service   注销服务
  start               启动服务
  stop                停止服务
  status              查看服务状态
  logs                跟踪/打印服务日志
  doctor              诊断（环境、端口、配置、依赖）
  upgrade             升级 mira-engine 包
```

### 常用动作

```bash
# 第一次安装为系统服务
mira-engine install-service

# 启停 / 看状态
mira-engine start
mira-engine status
mira-engine stop

# 跟踪日志
mira-engine logs

# 一次性诊断（环境/依赖/端口/配置），并把结果导出到 ~/.mira/runtime/diagnostics/
mira-engine doctor
mira-engine doctor --export

# 升级（默认升级 PyPI 上的 mira-engine 发行包）
mira-engine upgrade
mira-engine upgrade --package mira-engine
```

### 平台注册位置

| 平台 | 注册项 |
| --- | --- |
| macOS | `~/Library/LaunchAgents/com.projectmira.engine.plist` |
| Linux | `~/.config/systemd/user/mira-engine.service` |
| Windows | 服务名 `MiraEngine` |

### 日志与诊断

| 用途 | 路径 |
| --- | --- |
| 服务日志 | `~/.mira/logs/agent-service.log`（含轮转副本） |
| 诊断 bundle | `~/.mira/runtime/diagnostics/<timestamp>.zip` |

---

## 环境变量

所有配置都可以通过 `MIRA_*` 环境变量覆盖（`pydantic-settings` 自动绑定）；嵌套字段用 `__` 分隔。例：

```bash
export MIRA_AGENTS__DEFAULTS__MODEL="anthropic/claude-opus-4-5"
export MIRA_PROVIDERS__OPENAI__API_KEY="sk-..."
export MIRA_GATEWAY__PORT=28790
```

> 老的 `MEDPILOT_*` 环境变量在第一次启动时会被自动映射到 `MIRA_*`（一次性兼容层）。建议在 shell rc 里直接换成 `MIRA_*`。

## 退出码约定

| 退出码 | 含义 |
| --- | --- |
| 0 | 正常完成 |
| 1 | 通用错误（详见 stderr） |
| 2 | 参数错误（typer 校验失败） |
| 3 | 配置缺失/不合法 |
| 4 | Provider 鉴权失败 |
| 5 | 依赖缺失（如未装 Ollama 但选择了它） |

具体退出码以最新版本为准；若做 CI 集成请用 `mira status --json`（规划中）替代字符串解析。
