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
  agent     Interact with the general-purpose agent (no research orchestration).
  research  Interact with the research-flavoured agent (auto-mode, profiles, contracts).
  status    Show mira status.
  channels  Manage channels.
  runtime   Manage the per-project Python runtime.
```

> **`mira agent` vs `mira research`**：从 v0.3.0 起 agent loop 拆成两个：
> - `mira agent` 走 `BaseAgentLoop`，是 nanobot 风格的轻量 baseline——build context → 调一次 LLM → 持久化 → 返回。**没有** auto-mode、task_plan、token budget、experiment 队列。适合一次性问答、写脚本、debug。
> - `mira research` 走 `ResearchAgentLoop`（`BaseAgentLoop` 的超集），带研究流水线全部能力：auto-mode 多轮、agent profile（`engineer`/`research`）、`task_plan.json` 协作、`automation_policy` 自动停止策略、跨 round token budget。
>
> Gateway / `serve` / UI channel 默认仍然是 research loop（行为不变），只有这两个 CLI 命令明确分流。

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

跑通用 agent（`BaseAgentLoop`）：单轮对话、写脚本、调试 provider/skills。**没有** auto-mode、task_plan、experiment 队列——要这些请用 `mira research`。

```bash
mira agent                                          # 进入 REPL
mira agent -m "总结 ~/papers 里的最新综述"           # 单次任务
mira agent -m "..." --logs --verbose                # 看实时日志和工具调用提示
mira agent -m "..." -s session-debug                # 指定 session ID 复用上下文
mira agent -m "..." --no-markdown                   # 关掉 Markdown 渲染（适合管道输出）
```

第一次启动且 stdin 是 TTY 时，会问你「Do you want to use the current directory as a project workspace?」——回答 yes 就用 `cwd` 当临时 workspace。

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

### `mira research`

跑研究 agent（`ResearchAgentLoop`）：带 auto-mode、agent profile、`task_plan.json` 协作、自动停止策略，**这是 UI 后端、`serve`、gateway 默认连的 loop**。CLI 入口让你不开 UI 也能跑全套研究流水线。

```bash
mira research                                              # 交互式 manual 模式
mira research -m "调研 SAM 在医学影像分割的 SOTA"         # 单次研究任务
mira research --mode auto --max-experiments 20             # 跑 auto-loop，跑满 20 次实验或目标达成
mira research --profile engineer -m "..."                  # 切换 AGENTS_*.md profile
mira research --project-dir ~/.mira/workspace/PRJ-0019     # 指定项目目录
mira research --max-tokens 200000 --mode auto              # 加 token 预算
```

| 选项 | 默认 | 说明 |
| --- | --- | --- |
| `--message TEXT` | — | 单次任务消息；省略则进 REPL |
| `-s, --session TEXT` | `cli:research` | session ID |
| `-m, --mode {manual,auto}` | `manual` | `auto` 启用自动多轮 loop（受 `automation_policy` 约束）|
| `-p, --profile {default,engineer,research}` | `default` | 选 `AGENTS_*.md` bootstrap |
| `--max-tokens INT` | — | automation policy：累计 session token 超过此值自动停 |
| `--max-experiments INT` | — | automation policy：完成 N 次 experiment 后停 |
| `--project-dir TEXT` | — | 转发为 `metadata.project_dir`，让 agent 锁定这个项目 |
| `-w, --workspace TEXT` | 配置值 | 临时 workspace |
| `-c, --config TEXT` | `~/.mira/config.json` | 配置文件 |
| `--markdown / --no-markdown` | on | Markdown 渲染开关 |
| `--logs / --no-logs` | off | 显示运行时日志 |
| `--verbose / --no-verbose` | off | 显示工具调用 hint（含 skill 名） |
| `--debug / --no-debug` | off | 等价 `--verbose` |

> `--mode auto` 跑长任务时，建议同时配 `--max-tokens` 和 `--max-experiments` 当兜底。具体停止策略（goals / heuristics / `strictHeuristics` 等）见 automation policy 专题（待补）。

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

详细的 channel 配置见 [Channel 配置](./usage/agent-config/channels.md)。

### `mira runtime`

管理项目级 Python venv 隔离（即 `tools.exec.python` 那一组配置）。开了 `manager: "uv"` 后才有意义；默认 `manager: "off"` 时这些命令也能跑，但只会提示你 “Per-project venvs are disabled”。

```
$ mira runtime --help
Commands:
  info             查看当前 Python runtime 配置 + 检测到的 uv
  install-python   预装 pinned CPython（首次启动用，让后续 uv venv 走缓存）
  cache-prune      清理 uv 全局缓存里没人引用的包
  project-gc       扫描 workspace 里的 .venv，列出体积、空闲天数，可选删除
```

特性详见 [项目级 Python venv 隔离](./usage/agent-config/skills-and-tools.md#项目级-python-venv-隔离toolsexecpython)。

#### `mira runtime info`

```bash
mira runtime info
```

输出当前 `manager` / `autoBootstrap` / `venvDir` / `pythonVersion` / `linkMode` / `cacheDir` / `baselineRequirements`，以及 `uv` 二进制位置和版本。`manager == "off"` 时只打印一行提示就退出。

#### `mira runtime install-python`

```bash
mira runtime install-python                  # 用 config 里的 pythonVersion
mira runtime install-python --version 3.11   # 一次性覆盖
```

幂等：版本已经装过会直接跳过。桌面安装器在首次启动时会调它一次，让 `uv venv --python <ver>` 走暖缓存而不是阻塞下载。

#### `mira runtime cache-prune`

```bash
mira runtime cache-prune --dry-run           # 先看会清掉哪些
mira runtime cache-prune --apply             # 真删
```

包装 `uv cache prune`：删掉全局缓存里没有任何 `uv.lock` / 现存 venv 还在引用的包。因为是 hardlink，pin 着的包即使从缓存删也不会真正释放盘——uv 报的字节数才是真正回收的量。

#### `mira runtime project-gc`

```bash
mira runtime project-gc                                        # 仅列表
mira runtime project-gc --root ~/.mira/workspace --stale-days 60
mira runtime project-gc --delete-stale                         # 删 60 天没动过的项目 venv
mira runtime project-gc --delete ~/.mira/workspace/PRJ-0019/.venv
```

| 选项 | 默认 | 说明 |
| --- | --- | --- |
| `--root TEXT` | 配置里的 workspace | 扫哪个目录下的 venv |
| `--stale-days INT` | `30` | 项目（venv 之外的文件）多少天没动算 stale |
| `--delete-stale` | off | 删除所有 stale venv |
| `--delete TEXT` | — | 指定 venv 路径精确删除，可重复传 |

输出表会列出每个 venv 的 size / last used / project last touched，方便你判断要不要清。

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
