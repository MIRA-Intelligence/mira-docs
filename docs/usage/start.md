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

> **版本提示（2026-10-12）**：稳定版是引擎 0.3.4 / UI 0.4.4。本次新增的实验执行模式、额外输入路径、对话批量操作与引擎启停对应 [引擎 0.3.5rc1](https://github.com/MIRA-Intelligence/mira/releases/tag/v0.3.5rc1) / [UI 0.4.5rc1](https://github.com/MIRA-Intelligence/mira-ui/releases/tag/v0.4.5rc1)，均为预发布版。下文截图以当前源码界面为准；`releases/latest` 下载稳定版。更多见 [本次更新](../updates.md)。

## 通用前置

不管走哪条路，至少需要：

- macOS 12+ / Windows 10+ / Linux x86_64 一台
- 至少一种可用的模型接入：API key、支持的 OAuth 登录，或已运行的本地模型服务
- 想跑本地模型：先装好 [Ollama](https://ollama.ai) 并 `ollama pull qwen2.5:14b`

<Scenario id="desktop-local" title="🖥️ 桌面 App · 本机一键">

**适合**：只在一台电脑用，越省事越好；不想碰 Python / 终端 / 服务管理。

### 1. 下载 `MIRA-bundle`

到 [mira-ui Releases](https://github.com/{{PROJECT_ORG_NAME}}/mira-ui/releases/latest)，挑你平台的 `MIRA-bundle` 安装包：

| 平台 | 文件 |
| --- | --- |
| macOS (Apple Silicon) | `MIRA-bundle-<ver>-mac-arm64.dmg` |
| macOS (Intel) | `MIRA-bundle-<ver>-mac-x64.dmg` |
| Windows (x64) | `MIRA-bundle-<ver>-win-x64-setup.zip` |

> Linux 暂未提供 bundle 包。Linux 桌面用户请切到 **🧰 CLI + 桌面 UI** 这条路。

### 2. 安装并首次启动

- **macOS**：双击 `.dmg`，拖进 `Applications`；第一次打开右键 → 打开（绕过 Gatekeeper）。如果被拦：

  ```bash
  xattr -dr com.apple.quarantine /Applications/MIRA.app
  ```

- **Windows**：解压 `.zip`，双击里面的 `setup.exe`，按提示完成安装。

首次启动时 UI 会自动：

1. 把 bundle 里的 `mira-engine` 部署成本机后台服务（macOS 走 `launchd`，Windows 走 Service Manager）
2. 在 `127.0.0.1:18790` 起 gateway
3. 跳到 Provider 引导

首次启动时间取决于服务安装、系统权限与本地配置。如果卡在「Local engine update failed」，看 [FAQ · 引擎安装失败](../faq/troubleshooting.md)。

### 3. 在 UI 里配置 Provider（首选）

打开顶部四格图标 **模型供应商**，或 **设置 → 管理供应商**。首次引导完成后也可随时回到此页修改，不需要手写 JSON。

1. 选择供应商并打开 **启用**；填 **API Key** 与 **API Base**，官方地址可按提示留空。
2. 点击 **测试连接**，再点击右上角 **保存**。测试可使用当前输入；拉取模型需要先保存凭据。
3. 点击 **从供应商拉取**，在右侧 **可用模型** 中添加需要的模型；无法拉取时可手动添加真实模型 ID。
4. 点击 **设为主模型**，再次 **保存**，然后新开简短对话验证实际调用。

![首选的模型供应商配置界面](/img/current/provider-settings.png)

*当前 MiraUI 实际组件截图，使用隔离演示配置与模拟模型列表；不代表真实连接测试成功。*

OAuth 使用专用登录引导，此设置页管理模型和角色绑定，不提供 API Key 登录。Ollama、vLLM 与私有网关应填写实际服务地址，模型 ID 使用服务提供的名称。

详见 [Provider UI 操作与运行参数](./agent-config/providers-and-runtime.md#首选在-miraui-中设置)。纯 CLI、批量部署或未提供 UI 的参数见下方 [高级配置文件参考](#provider-config-ref)。

### 4. 新建项目并启动模块

1. 左侧切到 **项目**，点击 **新建项目**，填写名称与父目录，核对最终目录预览。
2. 创建后进入项目总览，选择工程、科研或团队 Profile。
3. 从 **调研 / 实验 / 结果交付** 任意模块开始：填本次目标与相关输入，不必把三栏都跑一遍。
4. AI 给出执行范围确认后，批准或提出修改意见。
5. 实验启动窗口可选手动/自动；首次建议手动，每个实验结束后审查并决定是否继续。
6. 在总览选中已完成的实验，继续结果交付，选择报告、Word 论文、PDF 演示或 ZIP。

![新建项目：名称和最终目录预览](/img/current/create-project.png)

*当前窗口局部截图，使用演示名称与路径。*

只有快速问答需求时，在 **对话 → 新建对话** 中直接使用。后续可转成项目并带入上下文。操作见 [快速对话](./ui/quick-chat.md)。

### 5. 检查是否完成

- 项目目录与 `.mira/project.json` 已创建。
- 对应模块 Run 的状态、确认表单和实验记录与本次操作一致。
- 交付模块的输出文件确实存在、可读取并符合所选格式。

新模块状态在 `.mira/modules/<run-id>/module.json`。旧 `task_plan` 项目的结构不同，见 [状态与存储](./ui/task-plan-and-status.md)。

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
| Windows (x64) | `MIRA-standalone-<ver>-win-x64-setup.zip` |
| Linux (x64) | `MIRA-standalone-<ver>-linux-x86_64.AppImage` |

> Standalone 不会替你装本地 engine，但启动时也不强求有；它启动后会卡在「未连接」并提示你填后端地址。

### 2. 安装并打开

- **macOS**：拖进 `Applications`，右键 → 打开。
- **Windows**：解压 `.zip`，双击里面的 `setup.exe`。
- **Linux**：`chmod +x MIRA-standalone-*.AppImage && ./MIRA-standalone-*.AppImage`。

### 3. 填远程地址

打开 `Settings → General`：

| 字段 | 填什么 |
| --- | --- |
| API URL | `https://mira.your-lab.com/api` |
| WebSocket URL | `wss://mira.your-lab.com/ws` |

保存后 UI 自动重连。状态条变绿即代表后端通了。

> 同机房不带 TLS 测试：`http://10.0.0.5:18790/api` + `ws://10.0.0.5:18790/ws`。生产环境强烈建议走 nginx/caddy + TLS。

### 4. 在 UI 配置 Provider 并新建项目

连接远程引擎后，首选 **模型供应商** 页面配置与测试；保存修改的是服务器上的配置，详见 [Provider UI 操作](./agent-config/providers-and-runtime.md)。

创建项目跟本机一键场景一致，见 **🖥️ 桌面 App · 本机一键 · 第 4 步**（点上面的卡片切换查看）；路径必须按**服务端**的实际项目目录填写。

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
mira --help    # 查看 onboard / gateway / serve / agent / research / workflow 等入口
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


### 3. 选 Provider

纯 CLI 首选上一节的 `mira onboard --wizard` 向导。需要手工部署时才使用以下 JSON；若同时使用 MiraUI，请优先在 [模型供应商界面](./agent-config/providers-and-runtime.md) 设置。完整字段参考 [高级配置文件参考](#provider-config-ref)。

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
mira agent -m "使用当前 literature-search 技能调研 GLP-1 类药物副作用研究，列 5 个相关临床试验"
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

会得到 `mira` 用户 CLI（包括 onboard、agent、research、workflow 等），以及本机服务管理 CLI `mira-engine install-service / start / stop / status / logs`。

  </TabItem>
  <TabItem value="binary" label="预构建引擎（无需 Python）">

到 [mira Releases](https://github.com/{{PROJECT_ORG_NAME}}/mira/releases/latest) 下载平台对应的二进制（用 release 的 `SHA256SUMS.txt` 校验文件）：

| 平台 | 文件 |
| --- | --- |
| Windows (x86_64) | `mira-engine-windows-x86_64.zip`（解压后保留完整目录） |
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

> 预构建版**只有** `mira-engine` 服务管理命令（`install-service / start / stop / status / doctor`），**没有** `mira onboard` / `mira agent`。Provider 配置首选后续安装的 MiraUI「模型供应商」页面；workspace 可在 UI 设置中选择。纯 CLI 初始化再使用完整 `mira` 的 onboard 或手工配置。

  </TabItem>
</Tabs>

### 2. 初始化（完整 CLI 安装）

```bash
mira onboard
```

预构建 `mira-engine` 跳过此命令。Provider 首选在第 4 步连接 UI 后设置；仅使用命令行时可运行 `mira onboard --wizard`。

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

### 5. 在 UI 配置 Provider，再新建项目

打开 **模型供应商**，配置凭据、测试后保存、拉取并设为主模型。详见 [Provider UI 操作](./agent-config/providers-and-runtime.md)。

新建项目跟本机一键场景一致 — 见 **🖥️ 桌面 App · 本机一键 · 第 4 步**（点卡片切换查看）。

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

### 2. 初始化

```bash
mira onboard
```

联调 UI 连接后，优先从 **模型供应商** 配置接入和主模型。只调试 CLI 时可使用 `mira onboard --wizard`；手工配置是高级选项。

### 3. 联调

```bash
# 后端：前台启 gateway，修改后端代码后重新启动
cd mira
mira gateway --host 127.0.0.1 --port 18790

# 另一个终端：前端 Vite + Electron 一起起
cd mira-ui
npm run dev:electron
```

只想浏览器调试：`npm run dev`，访问 `http://localhost:5173`。

后端地址可通过 `.env.local` 覆盖：

```bash
VITE_API_URL=http://localhost:18790/api
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

## Provider 高级配置文件参考 {#provider-config-ref}

**使用 MiraUI 时优先使用 [模型供应商界面](./agent-config/providers-and-runtime.md)**。以下示例仅用于纯 CLI、批量部署或界面未提供的字段。OAuth 凭据不能手写 API Key，应使用专用登录引导；完整 CLI 可运行 `mira onboard --wizard`。

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

完整 Provider / 模型 / 候选参数：[Provider 与运行时参数](./agent-config/providers-and-runtime.md)、[模型选择与候选回退](./agent-config/model-router.md)。

## 下一步去哪

### 用得更顺手

- [核心概念](../concepts.md) — 弄清楚 project / ModuleRun / experiment / Artifact 的边界。
- [UI 功能总览](./ui/index.mdx) — 把每个面板的快捷键和按钮过一遍。
- [运行模式与 Profile](./ui/run-mode-and-profile.md) — 区分 Profile、实验执行模式和模块衔接。

### 调优

- [Provider 与运行时参数](./agent-config/providers-and-runtime.md) — 切模型、调温度、改回合上限。
- [模型选择与候选回退](./agent-config/model-router.md) — 配置默认模型、候选与团队角色。
- [Skills 与 Tools](./agent-config/skills-and-tools.md) — 看看还有哪些 skill 可用，怎么挂自定义 MCP 工具。

### 扩展

- [Channel 配置](./agent-config/channels.md) — 把 Agent 接到飞书 / Slack / Telegram。
- [自托管部署](../deployment/self-hosted.md) — 把后端搬到团队服务器。
- [本地服务（mira-engine）](../deployment/local-engine-service.md) — 让引擎像系统服务一样常驻。

### 出问题了

- [FAQ 与故障排查](../faq/troubleshooting.md)
