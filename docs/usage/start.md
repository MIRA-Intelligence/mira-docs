---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 快速开始（10 分钟）

本节带你从“一台干净的电脑”到“在 UI 里看到第一个项目跑出结果”。全程约 10 分钟（不含模型调用本身的时间）。

> 想走“本地优先”的最省事路径：直接安装 `MiraUI-bundle`，它会在首启时自动帮你注册并启动本机 `mira-engine`。如果你要把 agent 放到远程服务器，请仍然按下面步骤单独安装远端 `mira`，再让 UI 用远程连接模式接入。

```mermaid
flowchart LR
    A[准备环境] --> B[安装 mira 引擎]
    B --> C[mira onboard<br/>初始化 ~/.mira]
    C --> D[配置 Provider<br/>API Key]
    D --> E[mira gateway<br/>启动后端]
    E --> F[启动 MiraUI]
    F --> G[新建项目<br/>填写研究目标]
    G --> H[运行实验]
    H --> I[Result 阶段<br/>导出交付物]
```

---

## 0) 前置条件

最少需要：

- 一台 macOS / Windows / Linux 电脑。
- 至少 **一个** 模型 Provider 的 API key（OpenAI / Anthropic / OpenRouter / DeepSeek / 阿里 DashScope / 智谱 / 火山 / Azure 等任一即可），也可以用本地的 Ollama（不要 key）。

按你后面选的安装方式不同，软件依赖不同：

| 安装方式 | Python | Node.js | Git |
| --- | --- | --- | --- |
| **A. 单文件可执行**（推荐普通用户） | ❌ 不需要 | 仅在你想从源码跑 UI 时需要 | ❌ |
| **B. PyPI 安装**（推荐熟悉 Python 的研究者） | 3.11 或 3.12 | 仅在你想从源码跑 UI 时需要 | ❌ |
| **C. 源码安装**（开发者 / 想 hack） | 3.11 或 3.12 | 20+ | ✅ |

> 不知道 Provider 选哪个？想要省事且效果稳：注册一个 [OpenRouter](https://openrouter.ai) key，能用一把钥匙调遍主流闭源/开源模型。

## 1) 安装 `{{PROJECT_CORE_NAME}}` 引擎

挑一个你最舒服的方式。**装一种就够了**，不要混装。

<Tabs groupId="install-method">
  <TabItem value="binary" label="A. 单文件可执行（推荐）" default>

无需 Python，下载即用，最适合非开发者。

到 [GitHub Releases](https://github.com/{{PROJECT_ORG_NAME}}/mira/releases/latest) 下载对应平台的可执行文件（每个文件都附带 `.sha256` 校验和）：

| 平台 | 文件 |
| --- | --- |
| Windows (x86_64) | `mira-engine-windows-x86_64.exe` |
| macOS (Apple Silicon) | `mira-engine-macos-arm64` |
| macOS (Intel) | `mira-engine-macos-x86_64` |
| Linux (x86_64) | `mira-engine-linux-x86_64` |

放到 `PATH` 里即可（建议改名去掉平台后缀）。

**macOS / Linux：**

```bash
# 以 macOS arm64 为例
curl -L -o mira-engine \
  https://github.com/{{PROJECT_ORG_NAME}}/mira/releases/latest/download/mira-engine-macos-arm64
chmod +x mira-engine
sudo mv mira-engine /usr/local/bin/

# macOS 首次运行可能需要解除 Gatekeeper 隔离
xattr -dr com.apple.quarantine /usr/local/bin/mira-engine
```

**Windows（PowerShell，管理员）：**

```powershell
# 下载到固定目录并加入 PATH
$dst = "C:\Program Files\Mira"
New-Item -ItemType Directory -Force -Path $dst | Out-Null
Invoke-WebRequest -Uri "https://github.com/{{PROJECT_ORG_NAME}}/mira/releases/latest/download/mira-engine-windows-x86_64.exe" `
  -OutFile "$dst\mira-engine.exe"
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$dst", "Machine")
```

> 单文件版直接提供 `mira-engine` 服务管理 CLI（含 `gateway` 子流程），可以覆盖大多数日常使用。如果你需要直接用 `mira agent ...` 在终端跟 Agent 对话，请改用 B 或 C 方式安装。

校验：

```bash
mira-engine --help
mira-engine doctor
```

  </TabItem>
  <TabItem value="pypi" label="B. PyPI 安装">

适合已经有 Python 3.11/3.12 环境的研究者和 CI。

```bash
# 推荐用 venv / conda 隔离
python -m venv ~/.venvs/mira
source ~/.venvs/mira/bin/activate    # Windows: ~\.venvs\mira\Scripts\activate

pip install mira-engine
```

校验：

```bash
mira --version
mira --help
```

应该能看到 6 个子命令：`onboard / gateway / serve / agent / status / channels`。

升级 / 卸载：

```bash
pip install -U mira-engine
pip uninstall mira-engine
```

> 包名是 `mira-engine`（pip）；命令名是 `mira`（用户 CLI）和 `mira-engine`（服务管理 CLI）。两者都装在同一个 wheel 里。

  </TabItem>
  <TabItem value="source" label="C. 源码安装（开发者）">

想 hack 代码、跑 dev 分支或参与贡献时用。

```bash
git clone https://github.com/{{PROJECT_ORG_NAME}}/mira.git
cd mira
pip install -e .
```

校验：

```bash
mira --version
mira --help
```

> **可选**：仓库里 `install.sh` 提供一键创建 `mira` conda env 的脚本：`bash install.sh`。
>
> **想跑测试**：`pip install -e ".[dev]" && pytest`。

  </TabItem>
</Tabs>

## 2) `mira onboard` — 初始化本地

```bash
mira onboard
```

它会：

1. 在 `~/.mira/` 下创建：`config.json`、`workspace/`、`logs/`、`runtime/`。
2. 写入一份带占位字段的 `config.json` 模板。
3. （加 `--wizard` 可以走交互式向导，逐项填 provider/model/key。）

如果你之前用过 MedPilot，第一次运行 `mira` 任何子命令时都会自动把 `~/.medpilot/` → `~/.mira/`，并把 `MEDPILOT_*` 环境变量映射到 `MIRA_*`，原文件保留 `.migrated-from-medpilot` 标记后不再触发。

## 3) 配置 Provider

打开 `~/.mira/config.json`，至少把以下几项填齐。下面给三种最常见组合：

<details>
<summary><b>选项 A：OpenRouter（最简单，一把钥匙调全家）</b></summary>

```json
{
  "agents": {
    "defaults": {
      "provider": "openrouter",
      "model": "anthropic/claude-sonnet-4-5",
      "maxTokens": 8192,
      "temperature": 0.1,
      "maxToolIterations": 60
    }
  },
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-..."
    }
  }
}
```

</details>

<details>
<summary><b>选项 B：直接 OpenAI + Anthropic 双账号</b></summary>

```json
{
  "agents": {
    "defaults": {
      "provider": "auto",
      "model": "anthropic/claude-opus-4-5"
    }
  },
  "providers": {
    "openai":    { "apiKey": "sk-..." },
    "anthropic": { "apiKey": "sk-ant-..." }
  }
}
```

`provider: "auto"` 会按 `model` 字段自动匹配 `anthropic/...` → `anthropic`，`openai/...` → `openai`。

</details>

<details>
<summary><b>选项 C：本地 Ollama（无需 API key，需先装 Ollama 并 <code>ollama pull qwen2.5:14b</code>）</b></summary>

```json
{
  "agents": {
    "defaults": {
      "provider": "ollama",
      "model": "qwen2.5:14b"
    }
  },
  "providers": {
    "ollama": {
      "apiBase": "http://localhost:11434"
    }
  }
}
```

</details>

校验：

```bash
mira status
```

应当看到 provider 已识别、model 已确认、workspace 路径正确。

## 4) 启动后端

```bash
mira gateway
```

默认会在前台监听：

- WebSocket：`ws://localhost:18790/ws`
- REST API： `http://localhost:18790/api`

如果你想改端口：`mira gateway --port 28790`。常驻后台请看 [本地服务（mira-engine）](../deployment/local-engine-service.md)。

> 想直接在终端里聊一下试试，不用 UI？另开一个终端：
>
> ```bash
> mira agent -m "你好，介绍一下你能做什么"
> ```

## 5) 启动 `{{PROJECT_UI_NAME}}`

挑一种安装方式。**普通用户走 A 即可**，B 留给前端开发者和想 hack UI 的人。

<Tabs groupId="ui-install">
  <TabItem value="installer" label="A. 桌面安装包（推荐）" default>

到 [GitHub Releases](https://github.com/{{PROJECT_ORG_NAME}}/mira-ui/releases/latest) 下载对应平台的安装包：

| 平台 | 安装包文件名 | 安装方式 |
| --- | --- | --- |
| macOS (Apple Silicon) | `MiraUI-<ver>-mac-arm64.dmg` | 双击 → 拖到 Applications |
| macOS (Intel) | `MiraUI-<ver>-mac-x64.dmg` | 同上 |
| Windows (x86_64) | `MiraUI-<ver>-win-x64-setup.exe` | 双击运行 |
| Linux (x86_64) | `MiraUI-<ver>-linux-x86_64.AppImage` | `chmod +x` 后双击或终端运行 |

> macOS 首次打开如果提示 “无法验证开发者”：右键 → 打开（或 `xattr -dr com.apple.quarantine /Applications/MiraUI.app`）。

启动后：

1. 默认尝试连接 `http://127.0.0.1:18790`。如果你按 4) 启动了 `mira gateway`，**通常无需任何配置就能看到项目列表**。
2. 后端跑在远程机器上？打开 `Settings → Connection`，填写远程地址（例如 `https://mira.lab.example.com`）。
3. 应用会自动检测同机器上的 `mira-engine`：
   - 找到则 spawn 内置实例（`mira-engine` 在 PATH 上）。
   - 找不到则只走远程后端模式。

![首屏占位图](/img/ui-navigation.png)

*图：UI 首屏总览。*

  </TabItem>
  <TabItem value="source" label="B. 源码运行（开发者）">

需要 Node.js 20+ 与 npm 10+。

```bash
git clone https://github.com/{{PROJECT_ORG_NAME}}/mira-ui.git
cd mira-ui
npm install

# 选一个：
npm run dev              # Web 模式，浏览器访问 http://localhost:5173
npm run dev:electron     # Desktop 联调（Vite + Electron 一起起）
npm run dist             # 出当前平台桌面安装包到 release/
```

后端地址通过 `.env.local` 自定义：

```bash
VITE_API_URL=http://localhost:18790
VITE_WS_URL=ws://localhost:18790/ws
```

详见 [Web / Desktop 双模式](./ui/desktop-web-mode.md) 和 [打包与发布](../deployment/release-and-package.md)。

  </TabItem>
</Tabs>

## 6) 你的第一个项目

1. **新建项目**：点左侧 `+`，填写：
   - `Research description`：对本项目要研究的内容及目标进行详细的描述。
   - `agent_profile`：研究类项目选 `research`。
   - `contract_version`：默认 `compat` 即可，等熟悉后再尝试 `strict`。
   - `run_mode`：先选 `manual`（每一步都看一眼）。
2. **进入 Research 阶段**：补充背景、数据来源、参考文献。Agent 会用 `pubmed-search` / `deep-research` 自动找资料。
3. **进入 Experiment 阶段**：在“新建实验”里写明指标和方法。Agent 会调用对应 skill（如 `medical-image-dl-pipeline`）落到 `experiments/exp-001/` 下，每跑完一轮会回写 `task_plan.json` 中的 `experiments[].results`。
4. **进入 Result 阶段**：选择导出类型（`experiment_report` / `paper_article` / `presentation` / `metadata`），点击导出。完成后 UI 会显示 `output_path` 与 `output_type`，文件落在 `result/exports/`。

<div style={{ textAlign: 'center' }}>
  <img src="/img/new_project.png" alt="新建项目" width="50%" />
  <p style={{ marginTop: '8px' }}>图：新建项目</p> 
</div>

## 7) 验收清单

跑完上面流程后，至少应满足：

- [ ] `~/.mira/workspace/PRJ-xxxx/task_plan.json` 存在且 `phase = result`、`status = completed`。
- [ ] `result.output_path` 对应文件存在并可下载。
- [ ] UI 项目卡片上出现 `completed` 标识。
- [ ] `mira status` 没有红色项。

任一条不满足，按 [FAQ 与故障排查](../faq/troubleshooting.md) 对应小节定位。

---

## 下一步去哪

### 用得更顺手

- [核心概念](../concepts.md) — 弄清楚 task_plan / project / experiment 的边界。
- [UI 功能总览](./ui/index.mdx) — 把每个面板的快捷键和按钮过一遍。
- [运行模式与 Profile](./ui/run-mode-and-profile.md) — 学会切到 `auto`，吞吐量翻倍。

### 调优

- [Provider 与运行时参数](./agent-config/providers-and-runtime.md) — 切模型、调温度、改回合上限。
- [模型路由（Router）模式](./agent-config/model-router.md) — 让便宜模型干便宜的活。
- [Skills 与 Tools](./agent-config/skills-and-tools.md) — 看看还有哪些 skill 可用，怎么挂自定义 MCP 工具。

### 扩展

- [Channel 配置](./agent-config/channels.md) — 把 Agent 接到飞书/Slack/Telegram，让团队远程指挥。
- [自托管部署](../deployment/self-hosted.md) — 把后端搬到团队服务器。
- [本地服务（mira-engine）](../deployment/local-engine-service.md) — 让引擎像系统服务一样常驻。

### 出问题了

- [FAQ 与故障排查](../faq/troubleshooting.md)
