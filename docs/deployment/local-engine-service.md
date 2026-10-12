---
sidebar_position: 3
---

# 本地服务（mira-engine）

`mira-engine` 管理 gateway 的安装、启动、停止、重启、诊断和升级。macOS 使用 LaunchAgent，Linux 使用用户 systemd，Windows bundle 使用 WinSW 系统服务。

> 以下生命周期语义已按 **引擎 0.3.5rc1** 核对。旧版 macOS 的 `start` 曾有强制重启行为；新版应用配置请用 `restart`。

## 两层心智模型

| 层 | 命令 | 用途 |
| --- | --- | --- |
| 注册 | `install-service` / `uninstall-service` | 安装或移除服务定义与自启动 |
| 运行 | `start` / `stop` / `restart` / `status` | 管理已经安装的实例 |
| 配置 | `config.json`、UI 运行配置 | 模型接入首选 [模型供应商 UI](../usage/agent-config/providers-and-runtime.md)；UI 保存会更新运行时，手工编辑按具体字段重启 |

## 一次安装

Python 包安装用户：

```bash
mira onboard --wizard
mira-engine install-service --host 127.0.0.1 --port 18790
mira-engine start
mira-engine status
```

桌面 **MIRA-bundle** 内置匹配的引擎，按首次启动引导安装和配置；**standalone** 主要提供 UI，由你管理本地或远程后端。

| 平台 | 服务定义 | 权限说明 |
| --- | --- | --- |
| macOS | `~/Library/LaunchAgents/com.projectmira.engine.plist` | 当前用户 LaunchAgent |
| Linux | `~/.config/systemd/user/mira-engine.service` | 用户服务；登出后常驻需配置 linger |
| Windows | `MiraEngine` | WinSW 系统服务，安装/启停通常需要管理员权限 |

Windows 提权时使用目标用户 home 保持配置归属：

```powershell
mira-engine install-service --home "$env:USERPROFILE" --config "$env:USERPROFILE\.mira\config.json"
```

`--home` 指操作系统用户目录，数据目录是其下的 `.mira`；它不是 `MIRA_HOME` 的同义参数。更改服务注册的 host、port 或引擎路径时才需要重新安装定义。

## 启动、停止、重启

```bash
mira-engine status
mira-engine start
mira-engine stop
mira-engine restart
```

- **start**：已运行时不杀进程，等待该实例自己的 gateway 通过健康检查。
- **stop**：等待进程树退出；macOS 会卸载当前 launchd job，避免 KeepAlive 立即拉起，但保留 plist 和下次登录自启动。
- **restart**：同一生命周期锁内先停后启；停止失败不会再启动替代实例，沿用已有配置与端口。
- **status**：分别显示已安装、已加载（macOS）、运行中和健康；服务注册但反复崩溃不代表运行正常。

如果停止后还有另一个 gateway 占用端口，工具会报告该实例的配置路径，不会自动杀掉它。要永久移除自启动，请使用 `uninstall-service`。

## 在桌面 UI 中操作

设置切到本地模式后，可查看服务状态并使用 **启动引擎 / 停止引擎 / 重启引擎 / 刷新状态**。

![桌面本地引擎控制区域](/img/current/engine-controls.png)

*当前组件的局部截图，使用模拟桌面桥接展示状态；未对真实服务执行启停。浏览器中这些控制不可用，远程引擎应在运行主机管理。*

停止和重启会先请求确认，因为会断开连接并可能中断任务；任务不保证自动恢复。完成后检查服务状态和项目 Run，再决定继续。修复服务、Run doctor、升级引擎与日常启停是不同操作。

## 改配置后如何生效

直接编辑引擎配置后，用：

```bash
mira-engine restart
mira-engine status
```

不要把 `start` 当作重启。普通配置变更也不需要卸载并重装服务。UI 保存运行配置可能提供应用/重启行为，以当前窗口提示为准。

## 独立启动的 gateway

用 `mira gateway` 启动的实例可能不属于已安装的系统服务。控制它时选择相同 `MIRA_HOME`：

```bash
MIRA_HOME=/path/to/mira-data mira-engine status --gateway
MIRA_HOME=/path/to/mira-data mira-engine stop --gateway --port 18790
MIRA_HOME=/path/to/mira-data mira-engine start --gateway --port 18790
MIRA_HOME=/path/to/mira-data mira-engine restart --gateway --port 18790
```

`start --gateway` 恢复先前停止时保存的启动方式，不负责首次创建实例。首次运行仍用 `mira gateway`。只有一个实例时可省略 `--port`；一次启停保持相同选择参数。

Windows 旧 detached gateway 可能不能可靠接收优雅停止信号。确认接受中断后，可针对经过身份校验的独立进程使用 `stop --gateway --port 18790 --force`；系统服务不需要 `--force`。

## 日志、诊断、升级与卸载

```bash
mira-engine logs
mira-engine doctor
mira-engine doctor --export
mira-engine upgrade --package mira-engine
mira-engine uninstall-service
```

日志在 `~/.mira/logs/agent-service.log`，诊断包在 `~/.mira/runtime/diagnostics/`。升级路径取决于 Python 安装还是桌面 bundle；bundle 用户优先使用匹配版本的桌面更新，详见 [打包与发布](./release-and-package.md)。

确认运行实例与配置归属后再清理故障状态。不要仅凭 PID 文件或同名进程就删除锁、强杀进程；先查看 `status`、端口和诊断信息。
