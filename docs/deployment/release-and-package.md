---
sidebar_position: 2
---

# 打包与发布（Web / Desktop / Engine）

## 这一页解决什么

- `{{PROJECT_UI_NAME}}` 怎么打 Web 静态站 / 桌面安装包？
- `{{PROJECT_CORE_NAME}}` 引擎怎么发到 PyPI？怎么打成平台运行载荷？
- 团队 release 流程怎么保证 UI 与 Agent 版本兼容？

> 核对日期 2026-10-12：稳定版引擎 0.3.4 / UI 0.4.4；当前 RC 为 0.3.5rc1 / 0.4.5rc1。版本与新功能要求见 [本次更新](../updates.md)。

## 制品类型一览

```mermaid
flowchart LR
    Code[源码仓库] --> A{制品类型}
    A --> Web["UI 静态站<br/>dist/"]
    A --> Desktop["UI 桌面安装包<br/>.dmg / .exe / .AppImage"]
    A --> PyPI["mira-engine PyPI<br/>wheel + sdist"]
    A --> Bin["mira-engine 运行载荷<br/>PyInstaller + 校验和"]
```

| 制品 | 发布工作流 | 触发 |
| --- | --- | --- |
| UI 静态站 | （任意静态托管，一次 `npm run build:web`） | 手动 / CI |
| UI 桌面安装包（`standalone` + `bundle`） | `mira-ui` 仓库 `desktop-release.yml` | 推 tag `v*` |
| mira-engine PyPI | `mira` 仓库 `agent-release.yml` | 推 tag `v*` |
| mira-engine 平台运行载荷 | 同上，`agent-release.yml` 里 PyInstaller 步骤 | 推 tag `v*` |
| 联合 release 校验 | `release-train.yml` (workflow_dispatch) | 手动指定 `agent_tag + ui_tag` |

## 我该下载哪个桌面包

GitHub Release 现在会在**同一个 release 条目**里同时放出 `MIRA-standalone` 和 `MIRA-bundle` 两类桌面资产。

| 你要做什么 | 应选桌面包 |
| --- | --- |
| 连接远程服务器上的 `mira gateway` | `MIRA-standalone` |
| 你已经自己装好了本机 `mira` / `mira-engine` | `MIRA-standalone` |
| 想在同一台电脑上本地开箱即用 | `MIRA-bundle` |
| 想把安装包交给不熟悉 Python / CLI 的同事 | `MIRA-bundle` |

一句话判断：

- `standalone` = 只有 UI，适合远程连接或你自己管理 engine
- `bundle` = UI + 内置本地 engine，适合同机本地使用

## UI 构建命令

```bash
cd mira-ui

# Web 静态站（产物：dist/）
npm run build:web

# Electron 渲染端构建（产物：dist-electron/）
npm run build:electron

# Web + Electron 一把
npm run build:desktop

# 出当前平台 standalone 安装包（产物：release/）
npm run dist

# 出本地整合包（产物：release-bundle/）
npm run dist:bundle:mac
npm run dist:bundle:win
```

standalone 命名约定：

| 平台 | 安装包文件名（约定） |
| --- | --- |
| macOS | `MIRA-standalone-<ver>-mac-<arch>.dmg` |
| Windows | `MIRA-standalone-<ver>-win-<arch>-setup.exe` |
| Linux | standalone `.AppImage`（当前 Linux 仅提供 standalone） |

bundle 命名约定：

| 平台 | 安装包文件名（约定） |
| --- | --- |
| macOS | `MIRA-bundle-<ver>-mac-<arch>.dmg` |
| Windows | `MIRA-bundle-<ver>-win-<arch>-setup.exe` |

`MIRA-bundle` 会把平台对应的 `mira-engine` 运行载荷一起打包（Windows 为完整 one-dir 目录）进 Electron 安装包，并在首启时自动注册/拉起本地 service；`MIRA-standalone` 则不会代替你安装本地 engine。

> Electron 元数据在 `mira-ui/package.json`：`name = "mira-ui"`、`productName = "MIRA"`、`appId = "com.projectmira.miraui"`。改了这些会影响安装包标识，请慎重。

## Engine 发布到 PyPI

`pyproject.toml` 已配置 `name = "mira-engine"`、`hatch-vcs` 从 git tag 读版本。

### 发布配置

当前工作流使用 PyPI Trusted Publishing。维护者需按仓库的 release checklist 检查 Publisher、环境、权限与标签，不再使用旧文档的“在 Manage 中创建项目”步骤。

### 日常发版

```bash
# 1) 拉到要发的 commit
git tag <engine-tag>
git push origin <engine-tag>
```

`agent-release.yml` 会自动：

1. Linux/macOS/Windows 三平台跑测试。
2. `python -m build` 出 wheel + sdist。
3. `pypa/gh-action-pypi-publish` 用 OIDC trusted publishing 发到 PyPI。
4. PyInstaller 出 macOS/Linux 可执行与 Windows one-dir 目录载荷（含 SHA256 校验和），上传到 GitHub Release。文件命名约定：

| 平台 | 二进制文件名 |
| --- | --- |
| Windows (x86_64) | `mira-engine-windows-x86_64.zip`（含 exe 与依赖） |
| macOS (Apple Silicon) | `mira-engine-macos-arm64` |
| macOS (Intel) | `mira-engine-macos-x86_64` |
| Linux (x86_64) | `mira-engine-linux-x86_64` |

当前发布流程生成统一的 `SHA256SUMS.txt`，按文件名核对哈希。普通用户通过 [快速开始 → CLI + 桌面 UI · 安装 mira-engine](../usage/start.md#mira-engine-install) 场景下载这份产物（也是 `MIRA-bundle` 桌面安装包里随附的同一份二进制）。

> Trusted publishing 不需要存任何 API token；只要 OIDC 配对正确就行。

### 校验本地版本

```bash
pip install "mira-engine==<engine-version>"
mira --version
```

## 兼容性矩阵

UI ↔ Agent 的“契约表”由 **`{{PROJECT_UI_NAME}}` 仓库根目录**的 `compatibility.json` 维护。这个映射由 UI 侧持有，因为依赖方向是 `mira-ui → mira`（UI 调 agent），按惯例由消费者声明跟哪些上游版本兼容。

引擎通过 `/version` 暴露 `api_contract`；模块功能还通过 `/api/workflow/v1/contract` 发现。UI 使用配对清单和实际协议检查是否可用。

当前清单为 `release_train: 2026.10`、`ui: 0.4.5rc1`、`agent: 0.3.5rc1`、`min_agent_for_ui: 0.3.5rc1`、`api_contract: v1`。仓库 `package.json` 的占位版本不是安装包的 release 版本；构建脚本通过发布元数据注入实际版本。

### 字段含义

| 字段 | 含义 | 何时改 |
| --- | --- | --- |
| `release_train` | release 窗口标识，如 `2026.10` | 每次开新 release window |
| `ui` | 当前 UI tag（`0.4.5rc1`）或清单支持的版本范围 | 打 mira-ui tag 前 |
| `agent` | 当前 agent tag 或 minor range | agent 发新版后 |
| `api_contract` | wire format 的大版本（`v\d+`） | 仅当 wire format 破坏性变更 |
| `min_agent_for_ui` | UI 拒绝连的最低 agent patch | minor 跳变 / 协议要求升级时 |

> `min_agent_for_ui` 是运行时真正会拦版本的那条线——`{{PROJECT_UI_NAME}}` 启动时打 `/version` 拿到 agent 版本后，会跟这个值比对，低于这条线直接判 `incompatible`，弹"引擎需要升级"提示。

### 双层 CI guard（mira-ui 仓库）

| Workflow | 触发 | 干什么 |
| --- | --- | --- |
| `compatibility-check.yml` | push 到 `main`/`dev`/`release` 或 PR，且 paths 命中 `compatibility.json` / 校验脚本 | schema 校验，阻止格式错乱 |
| `desktop-release.yml#verify-compatibility` | 每次触发本 workflow（包括 tag push） | schema **+** tag push 时额外跑 `--require-ui ${TAG#v}`，要求 `compatibility.json#ui` 跟 tag 一致或落在 minor 范围内 |

`build-standalone` / `build-bundle` / `publish-release` 都 `needs: verify-compatibility`——**文件没改 / 改错就发不出来**。

### 本地校验

```bash
cd mira-ui

# 仅 schema 校验
node scripts/validate-compatibility.mjs --file compatibility.json

# 打 tag 之前预演 tag 校验（接受精确 pin 和 minor range 两种写法）
node scripts/validate-compatibility.mjs \
  --file compatibility.json \
  --require-ui <ui-version>    # 填即将发布的版本，不含 v 前缀
```

### 发布前核对

1. 选择实际要发布的两仓提交，更新 UI `compatibility.json` 的配对和最低引擎要求。
2. 用 `validate-compatibility.mjs --require-ui <ui-version>` 校验将发布的版本。
3. 按两仓 release checklist 运行测试、平台构建、签名与安装 smoke，再发布对应标签。
4. `release-train.yml` 校验已发布的 agent/UI 配对；用真实标签指定输入。

此处不再保留 2026.04 的旧版本号和固定分支切换命令。源码标签、GitHub 资产、PyPI 包与可用 Docker 镜像需要分别检查。

### Wire format 破坏性变更的特殊流程

如果当次 release 改了 wire format（删字段 / 改 enum / 改 endpoint shape），需要协调两仓：

1. **mira**：改 `mira_engine/channels/ui.py` 里的 `_API_CONTRACT_VERSION = "v1"` → `"v2"`，agent 打 tag，独立发版
2. **mira-ui**：改 `engine.ts` 里检查的常量来源（`compatibility.json#api_contract` `"v1"` → `"v2"`），回测兼容旧 agent 不再连得上（这正是 `api_contract` 大版本要做到的事），打 tag

旧 UI 连新 agent / 新 UI 连旧 agent，会被 `engine.ts` 的 `probeEngineCompatibility` 直接判 `incompatible`，弹"API 契约不兼容"。

## 预发布与 Windows 载荷

桌面设置默认不接收预发布；启用后才检查 RC/Beta。需要当前新增功能时，从指定 RC release 下载成对的 UI 与引擎，不用 `/releases/latest` 推断 RC。

Windows bundle 需要完整 one-dir 目录和 WinSW，不能只拷一个 `mira-engine.exe`。ARM64 本地测试需使用对应架构的依赖与构建工具，不能代替 x64 发布验收。构建参数与预演步骤以 UI 仓库脚本为准。

## Docker 镜像与发布的区别

compose 的 self-hosted profile 引用了 `ghcr.io/mira-intelligence/mira-engine` 与 `mira-ui`，但当前两仓 release 工作流没有自动构建/推送这两个镜像的步骤。推 `v*` 标签不能证明这些镜像已发布。

部署前确认目标镜像与标签可拉取；没有可用镜像时使用 [自托管页的源码构建路径](./self-hosted.md)。

## 验收检查（每次发版）

- [ ] CI 三平台测试全绿，检查警告是否来自本次代码，不把警告一概当作噪声。
- [ ] `pip install mira-engine==<ver>` 可装；`mira --version` 显示新版本。
- [ ] 桌面安装包在 macOS/Windows/Linux 三种系统上至少抽查能启动。
- [ ] `mira-ui/compatibility.json` 已更新到本次 release，`node scripts/validate-compatibility.mjs --file compatibility.json --require-ui <tag>` 在本地通过；mira-ui 仓库的 `verify-compatibility` job 在 tag push 上也是绿。
- [ ] GitHub Release 页面有：wheel、sdist、各平台引擎载荷与校验和。
