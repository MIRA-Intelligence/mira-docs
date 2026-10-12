#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
B="${MIRA_DOCS_BROWSE_BIN:-/Users/cwang/.codex/skills/gstack/browse/dist/browse}"
mkdir -p static/img/current
# A same-origin blank document avoids importing App and its live API effects.
"$B" viewport 1600x800 --scale 2
"$B" goto http://localhost:5173/@vite/client
"$B" load-html scripts/screenshots/host.html
"$B" console --clear >/dev/null
"$B" eval scripts/screenshots/fixture.js
"$B" screenshot static/img/current/workflow-overview.png --viewport
"$B" js 'window.__docs.create()'
"$B" fill 'form[role=dialog] label input' '定量 MRI 方法比较'
"$B" screenshot static/img/current/create-project.png --selector 'form[role=dialog]'
"$B" js 'window.__docs.overview()'
"$B" click '[aria-label="调研 启动模块"]'
"$B" screenshot static/img/current/research-launch.png --selector '[role=dialog] > div'
"$B" click '[aria-label="关闭"]'
"$B" click '[aria-label="实验 启动模块"]'
"$B" fill '#module-run-intent' '审核输入数据和参考方法，执行两组内部验证，并记录误差、偏差与失败原因。'
"$B" click 'button:text-is("手动")'
"$B" fill 'input[placeholder="可选，如 10"]' '2'
"$B" fill 'input[placeholder="可选，如 50000"]' '200000'
"$B" screenshot static/img/current/experiment-launch.png --selector '[role=dialog] > div'
"$B" screenshot static/img/current/experiment-input-controls.png --selector '[role=dialog] fieldset:nth-of-type(2)'
"$B" click '[aria-label="关闭"]'
"$B" click '[aria-label="结果交付 启动模块"]'
"$B" screenshot static/img/current/delivery-launch.png --selector '[role=dialog] > div'
"$B" js 'window.__docs.approval()'
"$B" screenshot static/img/current/module-approval.png --selector '#docs-screenshot > div > div:nth-child(2)'
"$B" js 'window.__docs.manual()'
"$B" screenshot static/img/current/manual-continuation.png --selector '#docs-screenshot > div > div:nth-child(2)'
"$B" js 'window.__docs.detail()'
"$B" screenshot static/img/current/experiment-detail.png --selector '#docs-screenshot > div > div:nth-child(2)'
"$B" js 'window.__docs.chats()'
"$B" js 'Array.from(document.querySelectorAll("button")).find(x=>x.textContent.includes("梳理数据审计清单")).dispatchEvent(new MouseEvent("click",{bubbles:true,metaKey:true}))'
"$B" js 'Array.from(document.querySelectorAll("button")).find(x=>x.textContent.includes("讨论统计分析方案")).dispatchEvent(new MouseEvent("click",{bubbles:true,metaKey:true}))'
"$B" screenshot static/img/current/chat-selection.png --clip 590,44,420,340
"$B" js 'window.__docs.engine()'
"$B" screenshot static/img/current/engine-controls.png --selector '#docs-screenshot > div > div:nth-child(2)'
"$B" console --errors
