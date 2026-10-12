---
sidebar_position: 4
---

# Skills 与 Tools

## 这一页解决什么

- `{{PROJECT_CORE_NAME}}` 内置了哪些 skill？哪些可以直接拿来用？
- Skill 与 Tool 的边界在哪？
- 怎么限制 / 放开 Agent 能用的工具？
- 怎么挂一个自定义的 MCP server？

## Skill vs Tool — 一句话区分

- **Tool** = “**能做**什么”：写文件、执行 shell、发 HTTP 请求、调 MCP server。粒度细，原子。
- **Skill** = “**怎么做**一件事”：一段写好的 SOP（Markdown + 可选脚本），告诉 Agent “要做 X，按以下步骤、用以下工具、产出以下文件”。粒度粗，可复用。

> 你可以理解为：Tools 是手脚，Skills 是肌肉记忆。

## 当前 Skill 目录

当前检出的技能集合位于 `mira_engine/skills/builtin_skills/`。技能包与项目安装的插件可以变化，先在 UI 的可用列表核对，不把旧文档的目录或名称当作固定 API。

| 当前目录 | 示例 | 用途 |
| --- | --- | --- |
| `medical-image-analysis/` | `medical-image-analysis`、`tools/monai` | 医学影像深度学习与工具 |
| `data_processing/` | `tools/pydicom`、`tools/dicom2nifti`、`tools/nibabel`、`tools/pyradiomics` | 数据整理、转换、特征提取 |
| `ml-statistics/` | `radiomics`、`survival-analysis`、`statistical-analysis`、`scikit-learn` | 影像组学、统计与建模 |
| `research/` | `literature-search`、`literature-review`、`scientific-method` | 文献检索、综述与研究设计 |
| `visualization/` | `matplotlib`、`seaborn`、`plotly`、`scientific-visualization` | 图表与可视化 |
| `documents/` | `docx`、`pdf`、`pptx`、`scientific-writing` | 文档处理与科研写作 |
| `engineering/`、`tools/` | `test-driven-development`、`skill-creator`、`find-skills`、`memory`、`cron` | 工程与辅助任务 |

旧的 `medical-image-dl-pipeline` 已重组为医学影像分析入口；旧检索名称 `pubmed-search` / `multi-search-engine` 已合并到当前 `literature-search`。找不到旧名称时，选择实际可用的技能，不照旧路径手写调用。

自定义技能可放在当前项目/工作区的 `.mira/skills/<name>/SKILL.md`；兼容路径 `<workspace>/skills/` 仍由 loader 搜索。Skills Plugins 管理已安装技能，以当前项目的启用状态为准。

技能说明不是实验结果或依赖安装证明，仍需核对输入与实际工具执行。

## UI 选择 Skill 与插件

消息输入区可显式选择当前消息必须使用的 Skill；无法继续时，运行时请求批准 fallback，而不是悄悄改用另一套流程。UI 的 Skills Plugins 窗口可查看并管理项目可用的技能/插件；安装、启用和工具能力以当前窗口与后端状态为准。

模块的技能调用仍受当前执行批准约束。团队委派不能跳过主 Run 的确认或手动实验边界。

## Tool 清单

| Tool | 配置入口 | 是否默认开 | 说明 |
| --- | --- | --- | --- |
| `filesystem` | 内置 | ✅ | `read_file` / `write_file` / `list_dir` 等，按运行时路径策略检查，实验可授权额外只读输入 |
| `exec`（shell） | `tools.exec` | ✅ | 子进程执行，带 `timeout`、`pathAppend`、可选 `bwrap` 沙箱、可选 `background=true` |
| `bg` | 主 loop 自动注册 | ✅（仅主 loop） | 列出 / 监控 / 终止后台任务，配合 `exec(background=true)` 用 |
| `web` | `tools.web` | ✅ | 抓页面、查搜索引擎 |
| `web.search` | `tools.web.search` | ✅ | 搜索后端：`duckduckgo` / `brave` / `tavily` / `searxng` / `jina` |
| `mcp_<server>_<tool>` | `tools.mcpServers` | 视配置 | 任意 Model Context Protocol server 暴露的工具 |

最小工具配置：

```json
{
  "tools": {
    "restrictToWorkspace": true,
    "exec":  { "enable": true, "timeout": 60, "pathAppend": "" },
    "web": {
      "enable": true,
      "search": { "provider": "duckduckgo", "maxResults": 5, "timeout": 30 }
    }
  }
}
```

> `restrictToWorkspace: true` 启用运行时路径限制。当前实验可通过启动窗口授权额外只读输入，参见 [实验输入](../ui/experiment-inputs.md)。它不是 OS 级沙箱，也不应保证所有外部工具具有相同隔离能力。

## 项目级 Python venv 隔离（`tools.exec.python`）

> 这是一个**默认关闭、需要显式开启**的特性。启用并实际触发 Python 命令后，在当前项目目录下创建/使用 `.venv/`，agent 跑 `python` / `pip` / `pytest` 时自动用项目自己的解释器，不再污染系统 / 全局环境。

### 为什么需要它

不开启时，`exec` 工具直接调用父进程 PATH 上的 `python`，多个项目共用同一个全局 site-packages：

- A 项目装了 `torch==2.1`，B 项目要 `torch==2.4`，互相覆盖；
- agent 误装的依赖会留在系统环境里，没办法干净回滚；
- 想换 Python 版本得改 shell rc。

开启后，第一次在某个项目里跑 python 类命令，`exec` 工具会：

1. 在项目目录建 `.venv/`（用 [uv](https://docs.astral.sh/uv/)，速度比 `python -m venv` 快很多）；
2. 有 `pyproject.toml` 时执行 `uv sync`，否则有 `requirements.txt` 时安装该文件中的依赖；都没有就建空 venv，让 agent 按需 `pip install`；
3. 给该项目所有后续子进程把 `<project>/.venv/bin` 注入到 PATH 最前面。

第二次起同一项目就直接复用，不会重复 bootstrap。

### 前置条件

- 本机 PATH 上要有 `uv >= 0.5.0`（`brew install uv` / `pip install uv` / `curl -LsSf https://astral.sh/uv/install.sh | sh`）。`{{PROJECT_CORE_NAME}}` 桌面 bundle 自带 `uv`，源码安装需要自己装。
- 没装 `uv` 而 `manager` 又被设成 `"uv"`，触发时会报 `PythonEnvError`，agent 的 shell 调用会失败。

### 配置

编辑 `~/.mira/config.json`：

```json
{
  "tools": {
    "exec": {
      "python": {
        "manager": "uv",
        "autoBootstrap": true,
        "venvDir": ".venv",
        "pythonVersion": "3.11",
        "linkMode": "hardlink",
        "cacheDir": "",
        "baselineRequirements": [],
        "rewritePipInstall": false
      }
    }
  }
}
```

字段含义：

| 字段 | 默认 | 说明 |
| --- | --- | --- |
| `manager` | `"off"` | `"off"` 维持旧行为；`"uv"` 启用本特性；`"system"` 为预留模式（passthrough，仅 pin 解释器、不建 venv），**当前版本尚未实现**，写了等同 `"off"` |
| `autoBootstrap` | `true` | 第一次遇到 `python` / `pip` / `pytest` / `jupyter` / `ipython` / `uv` 命令时自动建 venv；关闭后不会自动建立项目 venv；需要预先准备环境，`mira runtime` 的当前命令并不提供通用 create-venv 入口 |
| `venvDir` | `".venv"` | 项目相对路径；可以写绝对路径把所有 venv 集中到外部目录 |
| `pythonVersion` | `""` | `""` 让 uv 自动选；写 `"3.11"` / `"3.12.4"` 等；首次需要的版本 uv 会自动下载（standalone build） |
| `linkMode` | `"hardlink"` | `hardlink` 最省盘；`clone` 走 APFS / btrfs reflink；`symlink` / `copy` 是兜底 |
| `cacheDir` | `""` | 覆盖 `$UV_CACHE_DIR`；多用户机器或想集中管理时用 |
| `baselineRequirements` | `[]` | 项目里既没 `pyproject.toml` 也没 `requirements.txt` 时，bootstrap 完往 venv 里默认装的包，例如 `["numpy", "pandas"]` |
| `rewritePipInstall` | `false` | `true` 时 `exec` 会把 agent 发的 `pip install ...` / `python -m pip install ...` 改写成 `uv pip install ...`；`pip list` / `pip show` 等只读子命令永远不改写 |

### 验证

```bash
mira runtime info
# Manager: uv
# Auto-bootstrap: True
# Venv dir: .venv
# Pinned python: 3.11
# uv: /opt/homebrew/bin/uv (v0.5.11)

# 跑一次 agent 触发 bootstrap
mira agent -w /path/to/project -m "跑 python -c 'import sys; print(sys.executable)'"

# 应能看到
ls /path/to/project/.venv/bin/python
```

相关 CLI（`mira runtime info` / `cache-prune` / `project-gc` / `install-python`）见 [CLI 命令参考](../../cli-reference.md#mira-runtime)。

## 后台长任务（`exec(background=true)` + `bg` 工具）

`exec` 默认是**前台**调用，命令打包等结果，受 `tools.exec.timeout` 上限约束（最大 600s）。神经网络训练、大数据预处理、长仿真这种 30 分钟以上的活儿，前台模式扛不住。

从 v0.3.0 起 `exec` 支持 `background=true`，配合新增的 `bg` 工具实现真正的**后台任务托管**：

- agent 在主 loop 里调 `exec(command="...", background=true, description="...")`：fork 一个 detached 子进程，立刻返回 `{job_id, pid}`，不再受前台 timeout 约束；
- stdout / stderr 实时落到 `<工作目录>/.mira/jobs/<job_id>/{stdout.log, stderr.log}`；
- agent 后续通过 `bg` 工具跨多个 loop 轮次轮询 / tail / wait / kill 这个 job，不会一直阻塞在单次 tool call 上。

### 哪些 loop 启用了 `bg`

- **主 loop**（`mira agent` / `mira research` / gateway / `serve`）：默认 `enable_background=True`，注册 `BackgroundJobRegistry` + 暴露 `bg` 工具。
- **Subagent**（agent 派出去的子 loop）：故意保持 `enable_background=False`——子上下文里没有 `bg` 工具能监控这些 job，不应该让它们 fire-and-forget。

引擎关闭时 registry 会被 drain，所有还活着的子进程会被 best-effort SIGTERM → SIGKILL，避免孤儿进程。

### `exec(background=true)` 参数

启用后台模式后，`exec` 工具 schema 多出两个字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `background` | bool | 默认 `false`。`true` 时启动 detached 任务并立即返回 |
| `description` | string | 可选。给 job 起个人类可读名字，会出现在 `bg list` 里。`background=false` 时忽略 |

### `bg` 工具 actions

```text
action 枚举: list | status | tail | wait | kill
```

| Action | 必需参数 | 行为 |
| --- | --- | --- |
| `list` | — | 列出当前 registry 里所有 job：状态（running / exited）、`job_id`、`pid`、`description`、started_at |
| `status` | `job_id` | 单 job 详情：cwd、command 预览、`exit_code`（若已退出）、`exited_at` |
| `tail` | `job_id` | 取 stdout/stderr 最后 N 行；`tail_lines` 默认 40，最大 1000 |
| `wait` | `job_id` | 阻塞最多 `timeout` 秒（默认 30，最大 600）等待退出。超时会返回 "still running" 让 agent 下一轮再查 |
| `kill` | `job_id` | SIGTERM → 5s 宽限期 → SIGKILL。POSIX 上整个进程组一起杀（spawn 时设了 `start_new_session=True`） |

### 用户视角

绝大多数情况你**不用手动配置**——agent 看到长任务自己会切到 `background=true`。需要你介入的场景：

- **直接看进度**：去 `<工作目录>/.mira/jobs/<job_id>/` 看实时日志；旧 job 目录由后台任务目录清理逻辑处理。
- **手动杀 job**：如果引擎挂了导致 registry 丢失，按 `pid` 直接 `kill -TERM <pid>`；或重启 mira 后 registry 会从空开始（**job 不持久化跨重启**）。
- **不希望某个 agent 走后台**：subagent 自动就不能用，主 loop 想关掉的话目前没有 config 开关，要改代码 `ExecTool(enable_background=False)`。

## Web 搜索 provider

| Provider | 备注 |
| --- | --- |
| `duckduckgo` | 默认，无需 key |
| `brave` | 需 `apiKey`；需要相应服务凭据 |
| `tavily` | 需 `apiKey`；适合学术 |
| `searxng` | 自托管 SearXNG 实例，需 `baseUrl` |
| `jina` | 需 `apiKey` |

```json
{ "tools": { "web": { "search": {
  "provider": "brave",
  "apiKey": "BSAxxxxxxxx",
  "maxResults": 8,
  "timeout": 30
}}}}
```

## 让 Agent 走代理（公司网/校园网）

```json
{ "tools": { "web": {
  "proxy": "http://127.0.0.1:7890"
}}}
```

也支持 `socks5://127.0.0.1:1080`。

## SSRF 白名单（Tailscale / 内网）

如果你需要让 Agent 访问内网或 Tailscale，把对应 CIDR 加到 SSRF 白名单：

```json
{ "tools": {
  "ssrfWhitelist": ["100.64.0.0/10", "10.0.0.0/8"]
}}
```

## 挂载自定义 MCP server

```mermaid
flowchart LR
    Agent --> MCP
    MCP --> S1["stdio：本地命令<br/>e.g. npx my-tool"]
    MCP --> S2["sse：HTTP+SSE"]
    MCP --> S3[streamableHttp]
```

`tools.mcpServers` 支持 stdio / SSE / streamable-HTTP 三种类型，`type` 留空时根据 `command` / `url` 字段自动推断：

```json
{
  "tools": {
    "mcpServers": {
      "filesystem-extra": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/data/share"],
        "env": { "READONLY": "1" },
        "toolTimeout": 30,
        "enabledTools": ["*"]
      },
      "team-knowledge": {
        "url": "https://mcp.team.example.com/sse",
        "headers": { "Authorization": "Bearer <token>" },
        "enabledTools": ["search_kb", "fetch_doc"]
      }
    }
  }
}
```

每个 MCP server 暴露的 tool 会被以 `mcp_<server>_<tool>` 名字注册到 Agent 工具栈。`enabledTools` 用来：

- `["*"]`：开放该 server 下所有工具（默认）。
- `["search_kb", "fetch_doc"]`：白名单，只暴露这两个。
- `[]`：完全屏蔽该 server 的工具（但仍维持连接）。

## 验收检查

- [ ] `mira agent --verbose -m "查一下最近 SAM 在医学影像的应用"` 能看到 `web.search` 与 `read_file` 等工具调用 hint。
- [ ] 把 `tools.exec.enable` 设 `false` 后再跑同一任务，Agent 应自然回退、不再调用 shell。
- [ ] 配好 MCP server 后，`mira status` 显示 `mcp_<server>_<tool>` 已注册。
