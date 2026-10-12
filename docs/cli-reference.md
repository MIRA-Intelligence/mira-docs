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
  models    Fetch and manage provider model lists.
  runtime   Manage the per-project Python runtime.
  workflow  Inspect and control modular Project workflows.
```

> **`mira agent` vs `mira research`**：从 v0.3.0 起 agent loop 拆成两个：
> - `mira agent` 走 `BaseAgentLoop`，是 nanobot 风格的轻量 baseline——处理一个用户请求，可经多次模型/工具迭代后返回。不启用旧研究 auto 编排、task_plan 或 experiment 队列。适合一次性问答、写脚本、debug。
> - `mira research` 走 `ResearchAgentLoop`，用于旧研究编排：auto-mode 多轮、agent profile（`engineer`/`research`）、`task_plan.json` 协作、`automation_policy` 自动停止策略、跨 round token budget。
>
> 当前 UI 模块通过原生 executor 使用共享对话引擎，绕过旧 task_plan 编排。`mira workflow` 与模块 UI 使用同一 WorkflowService。

### `mira onboard`

初始化 `~/.mira/`（首次安装、迁移到新机器、配置坏掉重建时使用）。

```bash
mira onboard                  # 用默认路径（~/.mira/）
mira onboard --wizard         # 交互式向导，逐项填 provider / key / model
mira onboard -w /tmp/work -c /tmp/cfg.json  # 指定 workspace 和 config
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

跑通用 agent（`BaseAgentLoop`）：处理一个用户请求、写脚本、调试 provider/skills。不启用旧研究 auto 编排。需要独立项目模块时使用 UI 与 `mira workflow`，旧计划入口为 `mira research`。

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
| `-s, --session TEXT` | 每次实例生成独立 ID | session ID（决定上下文/记忆隔离） |
| `-w, --workspace TEXT` | 配置值 | 临时 workspace |
| `-c, --config TEXT` | `~/.mira/config.json` | 配置文件 |
| `--markdown / --no-markdown` | on | Markdown 渲染开关 |
| `--logs / --no-logs` | off | 显示运行时日志 |
| `--verbose / --no-verbose` | off | 显示工具调用 hint（含 skill 名） |
| `--debug / --no-debug` | off | 等价 `--verbose` |

### `mira research`

旧研究编排入口，使用 `ResearchAgentLoop` 的 Profile、任务计划和 automation metadata。CLI 的 `auto` 标志不等于自动驱动 UI 的多轮循环；当前模块操作使用下面的 `mira workflow`。

```bash
mira research --message "调研医学影像分割方法，保留真实文献来源。"
mira research --profile engineer --message "审核本项目测试和运行说明。"
mira research --profile team --project-dir /path/to/project
mira research --mode auto --max-tokens 200000 --max-experiments 8
```

| 选项 | 说明 |
| --- | --- |
| `--message TEXT` | 单次任务；省略进入 REPL |
| `-m, --mode manual/auto` | 运行 metadata；自动续轮由 UI channel 路径处理 |
| `-p, --profile default/engineer/research/team` | Profile |
| `--max-tokens INT` / `--max-experiments INT` | automation metadata 的预算 |
| `--project-dir TEXT` | 对应项目目录 |
| `-s, --session TEXT` | 指定恢复会话；默认每个实例独立 |
| `-w, --workspace TEXT` / `-c, --config TEXT` | 覆盖工作区或配置 |
| `--logs` / `--verbose` / `--debug` | 日志与工具提示 |

注意 `mira research -m` 是模式，消息必须用 `--message`；`mira agent -m` 才是消息。

### `mira workflow`

当前已实现的 CLI 以 **项目目录** 为参数。该目录需要已有 `.mira/project.json`。

```bash
mira workflow show /path/to/project --json
mira workflow run list /path/to/project --json
mira workflow run create /path/to/project initiation --intent "梳理证据与研究方向" --json
mira workflow run command /path/to/project <run-id> enqueue --json
mira workflow run command /path/to/project <run-id> pause --json
mira workflow run command /path/to/project <run-id> resume --json
mira workflow events /path/to/project --after 0 --limit 100
```

| 子命令 | 当前能力 |
| --- | --- |
| `show` | 项目 workflow 与运行快照；支持 `--json` |
| `run list` | 列出独立运行；支持 `--json` |
| `run create <dir> <module-type>` | `initiation / planning / experiment / delivery`；可加 `--intent`、`--enqueue` |
| `run command <dir> <run-id> <command-type>` | 生命周期命令，如 enqueue、pause、resume、cancel、retry、complete；按状态限制执行 |
| `events <dir>` | 输出 JSON Lines，支持 `--after` 与 `--limit`（1–500） |

这是状态与生命周期适配器。`create --enqueue` 不等于这个 CLI 会独立启动模型工作；执行仍需 UI/模块运行时。源码 API 设计中的 `project policy`、`run respond`、`artifact export` 等完整命令树尚未全部实现，不要照提案调用。

表单回答、Artifact 内容和其他模块操作使用 [workflow API](./usage/ui/realtime-sync.md)。

### `mira status`

打印当前配置摘要：provider、模型、workspace、可用 Provider 配置。
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

- `mira channels status`：列出发现的 channel 与启用配置；不是正在运行的 gateway 连接健康检查。
- `mira channels login <name>`：仅对实现 login 的 channel 可用；不支持的通道返回错误。

详细的 channel 配置见 [Channel 配置](./usage/agent-config/channels.md)。

### `mira models`

```bash
mira models fetch <provider>        # 获取服务模型并缓存
mira models list <provider>         # 读取缓存
mira models select <provider> --model <model-id>
mira models clear <provider>       # 清理模型列表缓存
```

`fetch --select` 可以获取后选择；`list --refresh`、`select --refresh` 会先联网刷新。`select` 会写配置，`clear` 不删除模型权重或项目。服务端需要提供该 Provider 支持的发现能力，不能把有缓存当作在线模型已可用。

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

幂等：版本已经装过会直接跳过。可预先运行，使 `uv venv --python <ver>` 走暖缓存而不是阻塞下载。

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
mira runtime project-gc --stale-days 60 --delete-stale         # 删除 60 天未活动项目的 venv
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

如果你下载的是 GitHub Release 里的预构建 `mira-engine` 载荷，它只包含这一组服务管理命令，不包含完整 `mira` 用户 CLI；因此不能执行 `mira onboard`、`mira agent` 或前台 `mira gateway`。首次初始化请使用 PyPI / 源码安装得到 `mira` 命令，或搭配原生 `MIRA-UI`（推荐 `MIRA-bundle`）完成配置。

```
$ mira-engine --help
Commands:
  install-service     注册系统服务（macOS/Linux 用户服务，Windows 系统服务）
  uninstall-service   注销服务
  start               启动服务
  stop                停止服务
  restart             停止后启动，沿用已有配置
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
mira-engine restart

# 跟踪日志
mira-engine logs

# 一次性诊断（环境/依赖/端口/配置），并把结果导出到 ~/.mira/runtime/diagnostics/
mira-engine doctor
mira-engine doctor --export

# 升级（默认升级 PyPI 上的 mira-engine 发行包）
mira-engine upgrade
mira-engine upgrade --package mira-engine
```

`start` 幂等，不杀死已运行实例；应用直接编辑的配置用 `restart`。独立 gateway 可通过 `--gateway`、`--port` 和相同 `MIRA_HOME` 选择。`--home` 是 OS 用户目录，不是数据目录。详见 [本地服务](./deployment/local-engine-service.md)。

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

`MIRA_*` 支持嵌套字段，分隔符为 `__`。当前加载路径中，配置文件的显式值优先于环境变量，不能假定 export 会覆盖已有字段。例：

```bash
export MIRA_AGENTS__DEFAULTS__MODEL="anthropic/claude-opus-4-5"
export MIRA_PROVIDERS__OPENAI__API_KEY="sk-..."
export MIRA_GATEWAY__PORT=28790
```

旧 `MEDPILOT_*` 名称不自动映射，应按当前字段重新配置。

## 自动化中的错误处理

子命令按各自实现返回退出码；不要把旧文档的“3=配置、4=鉴权、5=依赖”当作统一合同。先检查进程是否成功，再读取该命令实际提供的错误消息或结构化输出。

`mira workflow show` / `run list` 等已实现 `--json`。`mira status` 当前没有 `--json`，应使用相应 API 的健康、版本或状态接口，而不是调用未实现选项。
