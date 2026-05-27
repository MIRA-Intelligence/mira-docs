---
sidebar_position: 1
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {
  ScenarioPickerProvider,
  ScenarioPicker,
  Scenario,
  ScenarioFallback,
} from '@site/src/components/ScenarioPicker';

# 快速开始

挑一个最贴近你的使用场景，下面会**自动展开对应的完整步骤**。如果不确定怎么选，留在 **🖥️ 桌面 App · 本机一键**这条路上 — 绝大多数新用户最快上手的姿势。

<ScenarioPickerProvider defaultScenario="desktop-local">

<ScenarioPicker
  question="你打算怎么用 {{PROJECT_CORE_NAME}}?"
  scenarios={[
    {
      id: 'desktop-local',
      emoji: '🖥️',
      title: '桌面 App · 本机一键',
      subtitle: '只用这台电脑跑。UI 自带 mira-engine，无需 Python。',
      badge: '推荐',
    },
    {
      id: 'desktop-remote',
      emoji: '☁️',
      title: '桌面 App · 远程后端',
      subtitle: '团队 / 服务器上已经跑着 mira gateway，本地只装 UI。',
    },
    {
      id: 'cli',
      emoji: '⌨️',
      title: '命令行 / 脚本',
      subtitle: '只用 mira CLI 跑 agent，集成进 shell / CI / notebook。不要 UI。',
    },
    {
      id: 'cli-and-ui',
      emoji: '🧰',
      title: 'CLI + 桌面 UI',
      subtitle: '本机：pip 装 engine + standalone 桌面 UI。Linux 桌面用户首选。',
    },
    {
      id: 'dev',
      emoji: '🛠️',
      title: '源码开发',
      subtitle: '想 hack mira 本身或为它贡献代码。git clone + 联调。',
    },
  ]}
/>

<ScenarioFallback>

👆 点上面任意一张卡，下面会展开完整步骤。你的选择会记住在本浏览器里，下次刷新还在；URL 会带上 `#scenario-xxx`，方便分享。

</ScenarioFallback>

## 通用前置

不管走哪条路，至少需要：

- macOS 12+ / Windows 10+ / Linux x86_64 一台
- 至少一个 LLM Provider 的 API key（OpenAI / Anthropic / OpenRouter / DeepSeek / 阿里 DashScope / 智谱 / 火山 / Azure / Ollama 等任一即可；OpenRouter 一把钥匙调遍全家，新人最省事）
- 想跑本地模型：先装好 [Ollama](https://ollama.ai) 并 `ollama pull qwen2.5:14b`

<Scenario id="desktop-local" title="🖥️ 桌面 App · 本机一键">

**适合**：只在一台电脑用，越省事越好；不想碰 Python / 终端 / 服务管理。

### 1. 下载 `MIRA-bundle`

到 [mira-ui Releases](https://github.com/{{PROJECT_ORG_NAME}}/mira-ui/releases/latest)，挑你平台的 `MIRA-bundle` 安装包：

| 平台 | 文件 |
| --- | --- |
| macOS (Apple Silicon) | `MIRA-bundle-<ver>-mac-arm64.dmg` |
| macOS (Intel) | `MIRA-bundle-<ver>-mac-x64.dmg` |
| Windows (x64) | `MIRA-bundle-<ver>-win-x64-setup.exe` |

> Linux 暂未提供 bundle 包。Linux 桌面用户请切到 **🧰 CLI + 桌面 UI** 这条路。

### 2. 安装并首次启动

- **macOS**：双击 `.dmg`，拖进 `Applications`；第一次打开右键 → 打开（绕过 Gatekeeper）。如果被拦：

  ```bash
  xattr -dr com.apple.quarantine /Applications/MIRA.app
  ```

- **Windows**：双击 `.exe`，按提示完成安装。

首次启动时 UI 会自动：

1. 把 bundle 里的 `mira-engine` 部署成本机后台服务（macOS 走 `launchd`，Windows 走 Service Manager）
2. 在 `127.0.0.1:18790` 起 gateway
3. 跳到 Provider 引导

整个过程 10~20 秒。如果卡在「Local engine update failed」，看 [FAQ · 引擎安装失败](../faq/troubleshooting.md)。

### 3. 在 UI 里配置 Provider

按引导选 provider、填 API key、确认 **Base URL** 和 **Model name**。常见选择：

- **OpenRouter**：一把 key 调遍主流模型，新人最稳。
- **OpenAI / Anthropic**：直接用官方账号。
- **OpenAI Codex / GitHub Copilot**：选 OAuth，会跳浏览器登录，登完即用。
- **本地 Ollama**：填 `http://localhost:11434/v1`，无需 API key。

> Base URL 留空时 UI 会用 provider 的官方默认值；如果你接的是企业代理、私有部署或非默认 Region，**必须**手动填一个能 `curl $apiBase/models` 通的地址。Model name 也要严格按官方命名（带 `-latest` / 日期 / 版本号），打错一个字符就会被服务端 404。

<details>
<summary><b>📋 各家 provider 的 Base URL + Model name 速查表（点击展开）</b></summary>

下表给的是**目前各家官方 OpenAI 兼容端口**和**官网在售的代表 model 名**，仅供新手照抄；正式使用前请到对应官网二次确认（API 列偶尔会改、新模型每月都在出）：

| Provider | Base URL（OpenAI 兼容端口） | Model name 示例 | 官方文档 |
| --- | --- | --- | --- |
| **OpenAI** | `https://api.openai.com/v1` | `gpt-4o` / `gpt-4.1` / `o3-mini` | [platform.openai.com/docs/models](https://platform.openai.com/docs/models) |
| **Anthropic** | `https://api.anthropic.com` | `claude-opus-4-5` / `claude-sonnet-4-5` / `claude-3-7-sonnet-latest` | [docs.anthropic.com/en/docs/about-claude/models](https://docs.anthropic.com/en/docs/about-claude/models) |
| **OpenRouter** | `https://openrouter.ai/api/v1` | `anthropic/claude-sonnet-4.5` / `openai/gpt-4o-mini` | [openrouter.ai/models](https://openrouter.ai/models) |
| **Gemini** | `https://generativelanguage.googleapis.com/v1beta/openai/` | `gemini-2.5-pro` / `gemini-2.5-flash` | [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) |
| **DeepSeek** | `https://api.deepseek.com/v1` | `deepseek-chat` / `deepseek-reasoner` | [api-docs.deepseek.com](https://api-docs.deepseek.com/) |
| **阿里 DashScope（百炼）** | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-max` / `qwen-plus` / `qwen3-max` | [help.aliyun.com/zh/model-studio](https://help.aliyun.com/zh/model-studio/getting-started/models) |
| **智谱 Zhipu / GLM** | `https://open.bigmodel.cn/api/paas/v4` | `glm-4.5` / `glm-4.5-air` | [bigmodel.cn/dev/howuse/model](https://bigmodel.cn/dev/howuse/model) |
| **Moonshot Kimi** | `https://api.moonshot.cn/v1`（中国）/ `https://api.moonshot.ai/v1`（国际） | `kimi-k2.5` / `moonshot-v1-32k` | [platform.moonshot.cn/docs/intro](https://platform.moonshot.cn/docs/intro) |
| **字节 火山 / VolcEngine 方舟** | `https://ark.cn-beijing.volces.com/api/v3` | `doubao-seed-1-6-250615`（用你在控制台拿到的 **endpoint id**） | [volcengine.com/docs/82379](https://www.volcengine.com/docs/82379/1099455) |
| **SiliconFlow 硅基流动** | `https://api.siliconflow.cn/v1` | `Qwen/Qwen3-Coder-480B-A35B-Instruct` / `deepseek-ai/DeepSeek-V3.2` | [docs.siliconflow.cn/cn/api-reference](https://docs.siliconflow.cn/cn/api-reference/chat-completions/chat-completions) |
| **MiniMax** | `https://api.minimax.io/v1` | `MiniMax-M2` | [platform.minimaxi.com/document](https://platform.minimaxi.com/document/ChatCompletion) |
| **Mistral** | `https://api.mistral.ai/v1` | `mistral-large-latest` / `ministral-8b-latest` | [docs.mistral.ai/getting-started/models](https://docs.mistral.ai/getting-started/models/models_overview/) |
| **Groq** | `https://api.groq.com/openai/v1` | `llama-3.3-70b-versatile` | [console.groq.com/docs/models](https://console.groq.com/docs/models) |
| **AiHubMix** | `https://aihubmix.com/v1` | 跟 OpenAI / Anthropic 同名，直接照抄即可 | [aihubmix.com/models](https://aihubmix.com/models) |
| **Azure OpenAI** | `https://<your-resource>.openai.azure.com` | **填 deployment 名**（不是公开 model 名） | [learn.microsoft.com/azure/ai-services/openai](https://learn.microsoft.com/azure/ai-services/openai/concepts/models) |
| **本地 Ollama** | `http://localhost:11434/v1` | `llama3.2` / `qwen2.5:14b` | [ollama.com/library](https://ollama.com/library) |
| **本地 vLLM** | `http://localhost:8000/v1` | 跟启动 vLLM 时 `--model` 完全一致，如 `Qwen/Qwen2.5-7B-Instruct` | [docs.vllm.ai/en/latest/serving/openai_compatible_server](https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html) |
| **OpenAI Codex / GitHub Copilot** | 不填（OAuth） | `gpt-5-codex` / `gpt-5.1-codex`（Codex）；`gpt-5` / `claude-sonnet-4.5`（Copilot） | [对应官网控制台](https://copilot.github.com/) |

这张表只列了主流的几家；完整 provider 清单（共 20+ 家）见 [Provider 与运行时参数](./agent-config/providers-and-runtime.md)。

**Base URL 留空 vs 填值**：UI 输入框留空 = 用 provider 内置的默认值（就是上表里的地址）。如果你的网络环境需要走代理（如港澳/海外回中国 → 用国内加速节点），或者你想接私有部署，就**必须**手动填一个完整的 base URL。

**Model name 一定要按官网命名**：例如 OpenAI 的 `o3-mini` 不能写成 `gpt-o3-mini`，Anthropic 必须带 `-latest` 或日期后缀（`claude-3-7-sonnet-latest`、`claude-sonnet-4-5-20251015`），VolcEngine 方舟必须用 **endpoint id**（形如 `ep-2025xxxxx`）而不是 model 名。填错时 UI 会显示一条来自上游的 400/404，从那条报错回头查官网即可。

</details>

UI 把结果写到 `~/.mira/config.json`，效果跟手写一样。详细字段参考下面的 [Provider 配置参考](#provider-config-ref)。

### 4. 新建第一个项目

1. 顶栏先选好运行模式：研究类课题点 **科研**（`agent_profile = research`），工程类点 **工程**（`agent_profile = engineer`）。如果只是想做一次性问答 / 工具调用、不打算建项目，那就直接停在 **普通** —— 普通模式跳过 mira research 流水线，无须新建项目就能用。三档的区别详见 [运行模式与 Profile](./ui/run-mode-and-profile.md)。
2. 点左侧 `+`，填：
   - `Research description`：详细写明你要研究的目标。
   - `contract_version`：默认 `compat` 即可，熟了再 `strict`。
   - `run_mode`：先选 `manual`（每一步看一眼）。
3. **Research 阶段**：补背景、数据来源、参考文献。Agent 会用 `pubmed-search` / `deep-research` 自动找资料。
4. **Experiment 阶段**：写明指标和方法。Agent 调对应 skill（如 `medical-image-dl-pipeline`），结果落到 `experiments/exp-001/`，回写 `task_plan.json` 的 `experiments[].results`。
5. **Result 阶段**：选导出类型（`experiment_report` / `paper_article` / `presentation` / `metadata`），点导出。完成后 UI 显示 `output_path`，文件在 `result/exports/`。

<div style={{ textAlign: 'center' }}>
  <img src="/img/new_project.png" alt="新建项目" width="50%" />
  <p style={{ marginTop: '8px' }}>图：新建项目</p>
</div>

### 5. 验收清单

- [ ] `~/.mira/workspace/PRJ-xxxx/task_plan.json` 存在且 `phase = result`、`status = completed`
- [ ] `result.output_path` 对应文件存在并可下载
- [ ] UI 项目卡片显示 `completed`

任一条不满足，按 [FAQ 与故障排查](../faq/troubleshooting.md) 对应小节定位。

</Scenario>

<Scenario id="desktop-remote" title="☁️ 桌面 App · 远程后端">

**适合**：团队 / 实验室服务器上已经按 [自托管部署](../deployment/self-hosted.md) 跑好了 `mira gateway`，你只想在本地装个 UI 接进去。

> 前提：远程已经能通过 HTTP/HTTPS + WS/WSS 访问到 mira gateway。**如果还没装好后端**，先按 [自托管部署](../deployment/self-hosted.md) 完成服务端再回来。

### 1. 下载 `MIRA-standalone`

到 [mira-ui Releases](https://github.com/{{PROJECT_ORG_NAME}}/mira-ui/releases/latest)，挑 `MIRA-standalone`：

| 平台 | 文件 |
| --- | --- |
| macOS (Apple Silicon) | `MIRA-standalone-<ver>-mac-arm64.dmg` |
| macOS (Intel) | `MIRA-standalone-<ver>-mac-x64.dmg` |
| Windows (x64) | `MIRA-standalone-<ver>-win-x64-setup.exe` |
| Linux (x64) | `MIRA-standalone-<ver>-linux-x86_64.AppImage` |

> Standalone 不会替你装本地 engine，但启动时也不强求有；它启动后会卡在「未连接」并提示你填后端地址。

### 2. 安装并打开

- **macOS**：拖进 `Applications`，右键 → 打开。
- **Windows**：双击安装包。
- **Linux**：`chmod +x MIRA-standalone-*.AppImage && ./MIRA-standalone-*.AppImage`。

### 3. 填远程地址

打开 `Settings → General`：

| 字段 | 填什么 |
| --- | --- |
| API URL | `https://mira.your-lab.com/api` |
| WebSocket URL | `wss://mira.your-lab.com/ws` |

保存后 UI 自动重连。状态条变绿即代表后端通了。

> 同机房不带 TLS 测试：`http://10.0.0.5:18790/api` + `ws://10.0.0.5:18790/ws`。生产环境强烈建议走 nginx/caddy + TLS。

### 4. 新建第一个项目

跟本机一键场景完全一致，见 **🖥️ 桌面 App · 本机一键 · 第 4 步**（点上面的卡片切换查看）；区别只是文件落在**服务端**的 `~/.mira/workspace/`。

### 5. 多用户协作

后端跑在远程后，可以多人共用一份 workspace、复用 LLM key 池、把 channel（飞书 / Slack / Telegram）接到群里。详见 [Channel 配置](./agent-config/channels.md)、[自托管部署](../deployment/self-hosted.md)。

</Scenario>

<Scenario id="cli" title="⌨️ 命令行 / 脚本">

**适合**：用 Python，想把 mira 接进 shell / CI / notebook，不需要桌面 UI。

### 1. 安装 `mira-engine`

需要 Python 3.11 或 3.12。强烈建议用 venv / conda 隔离：

```bash
python -m venv ~/.venvs/mira
source ~/.venvs/mira/bin/activate     # Windows: ~\.venvs\mira\Scripts\activate
pip install mira-engine
```

校验：

```bash
mira --version
mira --help    # 应当看到 onboard / gateway / serve / agent / status / channels 6 个子命令
```

> 包名是 `mira-engine`（pip）；命令名是 `mira`（用户 CLI）和 `mira-engine`（本机服务管理 CLI）。两者都在同一个 wheel 里。

### 2. 初始化 `~/.mira/`

```bash
mira onboard --wizard
```

会做三件事：

1. 创建 `~/.mira/config.json`、`workspace/`、`logs/`、`runtime/`。
2. 写入带占位的 `config.json` 模板。
3. 交互式向导：选 provider、填 key 或走 OAuth。

> 用过旧的 MedPilot？第一次跑 `mira` 任意子命令会自动把 `~/.medpilot/` 迁到 `~/.mira/`，并把 `MEDPILOT_*` 环境变量映射到 `MIRA_*`。

### 3. 选 Provider

简易模式：直接挑下面任一 Tab 把 JSON 贴进 `~/.mira/config.json`。完整字段参考 [Provider 配置参考](#provider-config-ref)。

<Tabs groupId="provider">
  <TabItem value="openrouter" label="OpenRouter（一把钥匙）" default>

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
    "openrouter": { "apiKey": "sk-or-v1-..." }
  }
}
```

  </TabItem>
  <TabItem value="openai" label="OpenAI + Anthropic">

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

  </TabItem>
  <TabItem value="oauth" label="OAuth（Codex / Copilot）">

OAuth provider 不能手写 key。请运行：

```bash
mira onboard --wizard
# 选 openai-codex 或 github-copilot，按提示在浏览器登录
```

</TabItem>
  <TabItem value="ollama" label="本地 Ollama">

```json
{
  "agents": {
    "defaults": {
      "provider": "ollama",
      "model": "qwen2.5:14b"
    }
  },
  "providers": {
    "ollama": { "apiBase": "http://localhost:11434" }
  }
}
```

  </TabItem>
</Tabs>

校验：

```bash
mira status
```

应当看到 provider 已识别、model 已确认、workspace 路径正确。

### 4. 跑第一个 agent

最简单的对话：

```bash
mira agent -m "你好，介绍一下你能做什么"
```

带 skill 调用的研究任务：

```bash
mira agent -m "调研一下最新的 GLP-1 类药物副作用研究，列 5 个最相关的临床试验" \
  --skill pubmed-search
```

进入 REPL：

```bash
mira agent
```

### 5. （可选）起 gateway 长跑

如果要把 mira 接到 channels（Slack / 飞书 / TG）或被其它服务调用，需要 gateway 常驻：

```bash
# 前台跑
mira gateway --port 18790

# 后台服务（推荐）：
mira-engine install-service --host 127.0.0.1 --port 18790
mira-engine start
mira-engine status
mira-engine logs
```

更多见 [本地服务（mira-engine）](../deployment/local-engine-service.md)。

</Scenario>

<Scenario id="cli-and-ui" title="🧰 CLI + 桌面 UI">

**适合**：本机同时需要 mira CLI（写脚本 / 跑 agent）和 桌面 UI（看进度 / 出报告）；Linux 桌面用户首选这条路。

### 1. 安装 `mira-engine` \{#mira-engine-install\}

<Tabs groupId="engine-install">
  <TabItem value="pip" label="pip 安装（推荐）" default>

需要 Python 3.11 或 3.12：

```bash
python -m venv ~/.venvs/mira
source ~/.venvs/mira/bin/activate     # Windows: ~\.venvs\mira\Scripts\activate
pip install mira-engine
mira --version
```

会得到 6 个子命令：`mira onboard / gateway / serve / agent / status / channels`，以及本机服务管理 CLI `mira-engine install-service / start / stop / status / logs`。

  </TabItem>
  <TabItem value="binary" label="单文件二进制（无需 Python）">

到 [mira Releases](https://github.com/{{PROJECT_ORG_NAME}}/mira/releases/latest) 下载平台对应的二进制（每个文件都带 `.sha256` 校验和）：

| 平台 | 文件 |
| --- | --- |
| Windows (x86_64) | `mira-engine-windows-x86_64.exe` |
| macOS (Apple Silicon) | `mira-engine-macos-arm64` |
| macOS (Intel) | `mira-engine-macos-x86_64` |
| Linux (x86_64) | `mira-engine-linux-x86_64` |

放到 `PATH` 里（建议改名去掉平台后缀）：

```bash
# 以 macOS arm64 为例
curl -L -o mira-engine \
  https://github.com/{{PROJECT_ORG_NAME}}/mira/releases/latest/download/mira-engine-macos-arm64
chmod +x mira-engine
sudo mv mira-engine /usr/local/bin/
xattr -dr com.apple.quarantine /usr/local/bin/mira-engine    # macOS 首次解除 Gatekeeper
```

> ⚠️ 单文件版**只有** `mira-engine` 服务管理命令（`install-service / start / stop / status / doctor`），**没有** `mira onboard` / `mira agent`。Provider 与 workspace 配置需要手写 `~/.mira/config.json`，或先用 pip 装一份做 onboard，之后再切换到二进制。

  </TabItem>
</Tabs>

### 2. 初始化 + 选 Provider

```bash
mira onboard --wizard
mira status
```

选 provider / 填 key 的 JSON 模板见 **⌨️ 命令行 / 脚本 · 第 3 步**（点上面的卡片切换查看），或下面的 [Provider 配置参考](#provider-config-ref)。

### 3. 起后端为后台服务

```bash
mira-engine install-service --host 127.0.0.1 --port 18790
mira-engine start
mira-engine status
```

> 如果只是临时试用，也可以 `mira gateway` 前台跑。

### 4. 装 `MIRA-standalone` 桌面 UI

到 [mira-ui Releases](https://github.com/{{PROJECT_ORG_NAME}}/mira-ui/releases/latest) 下 `MIRA-standalone-*`：

- **macOS / Windows**：装包并启动。
- **Linux**：`chmod +x MIRA-standalone-*.AppImage && ./MIRA-standalone-*.AppImage`。

启动后默认就连 `127.0.0.1:18790`，无需手动改。状态条变绿即代表 UI 找到了 engine。

### 5. 新建第一个项目

跟本机一键场景一致 — 见 **🖥️ 桌面 App · 本机一键 · 第 4 步**（点卡片切换查看）。

</Scenario>

<Scenario id="dev" title="🛠️ 源码开发">

**适合**：想 hack 代码、跑 dev 分支、调 skill 实现、为 mira / mira-ui 贡献。

### 1. clone & install

```bash
# 后端
git clone https://github.com/{{PROJECT_ORG_NAME}}/mira.git
cd mira
pip install -e ".[dev]"

# 前端
cd ..
git clone https://github.com/{{PROJECT_ORG_NAME}}/mira-ui.git
cd mira-ui
npm install
```

> 仓库根的 `install.sh` 提供一键创建 conda env：`bash install.sh`。

### 2. 初始化 & Provider

```bash
mira onboard --wizard
```

填 Provider JSON 见 **⌨️ 命令行 / 脚本 · 第 3 步**（点卡片切换查看），或下面的 [Provider 配置参考](#provider-config-ref)。

### 3. 联调

```bash
# 后端：前台启 gateway，改动文件自动 reload
cd mira
mira gateway --reload

# 另一个终端：前端 Vite + Electron 一起起
cd mira-ui
npm run dev:electron
```

只想浏览器调试：`npm run dev`，访问 `http://localhost:5173`。

后端地址可通过 `.env.local` 覆盖：

```bash
VITE_API_URL=http://localhost:18790
VITE_WS_URL=ws://localhost:18790/ws
```

### 4. 跑测试

```bash
# 后端
cd mira && pytest

# 前端
cd mira-ui && npm test
```

### 5. 打 release 包

```bash
cd mira-ui
npm run dist              # standalone 桌面包，输出到 release/
npm run dist:bundle:mac   # 含本机 engine 的 macOS bundle
npm run dist:bundle:win   # 含本机 engine 的 Windows bundle
```

更多见 [打包与发布](../deployment/release-and-package.md)、[Web / Desktop 双模式](./ui/desktop-web-mode.md)。

</Scenario>

</ScenarioPickerProvider>

---

## Provider 配置参考 \{#provider-config-ref\}

普通 API key provider 可以直接编辑 `~/.mira/config.json`。OAuth provider（OpenAI Codex / GitHub Copilot）不能手写 key，必须走 `mira onboard --wizard` 的浏览器登录流程。

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

`provider: "auto"` 会按 `model` 字段自动匹配：`anthropic/...` → anthropic，`openai/...` → openai。

</details>

<details>
<summary><b>选项 C：OAuth（OpenAI Codex / GitHub Copilot）</b></summary>

OAuth provider 不在 `config.json` 里写 API key：

```bash
mira onboard --wizard
# 选择 openai-codex 或 github-copilot，按提示在浏览器登录
```

登录后 token 由专用 OAuth 状态目录托管。常见 `agents.defaults` 字段：

```json
{
  "agents": {
    "defaults": {
      "provider": "openai_codex",
      "model": "openai-codex/gpt-5.3-codex"
    }
  }
}
```

</details>

<details>
<summary><b>选项 D：本地 Ollama（无需 API key）</b></summary>

先装 [Ollama](https://ollama.ai) 并 `ollama pull qwen2.5:14b`，然后：

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

完整 provider / 模型 / 路由参数：[Provider 与运行时参数](./agent-config/providers-and-runtime.md)、[模型路由（Router）模式](./agent-config/model-router.md)。

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

- [Channel 配置](./agent-config/channels.md) — 把 Agent 接到飞书 / Slack / Telegram。
- [自托管部署](../deployment/self-hosted.md) — 把后端搬到团队服务器。
- [本地服务（mira-engine）](../deployment/local-engine-service.md) — 让引擎像系统服务一样常驻。

### 出问题了

- [FAQ 与故障排查](../faq/troubleshooting.md)
