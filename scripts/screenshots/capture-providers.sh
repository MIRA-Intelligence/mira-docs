#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
B="${MIRA_DOCS_BROWSE_BIN:-/Users/cwang/.codex/skills/gstack/browse/dist/browse}"
"$B" viewport 1440x920 --scale 2
"$B" goto http://localhost:5173/@vite/client
"$B" load-html scripts/screenshots/host.html
"$B" console --clear >/dev/null
"$B" eval scripts/screenshots/providers-fixture.js
"$B" wait 'button:text-is("从供应商拉取")'
"$B" click 'button:text-is("从供应商拉取")'
"$B" wait 'p:text-is("可用模型")'
# Dismiss the informational model-count toast before capturing the controls.
"$B" js 'Array.from(document.querySelectorAll("button")).find(x=>x.textContent.includes("已拉取 2 个模型"))?.click()'
"$B" screenshot static/img/current/provider-settings.png --viewport
"$B" click '[aria-label="分配角色"]'
"$B" screenshot static/img/current/provider-role-menu.png --selector '[role=menu]'
"$B" click 'button[aria-hidden="true"]'
"$B" click 'button:has-text("运行参数")'
"$B" screenshot static/img/current/provider-runtime.png --selector '.max-w-xl'
"$B" click 'button:has-text("模型参数")'
"$B" screenshot static/img/current/provider-model-params.png --selector '.max-w-3xl'
"$B" js 'JSON.stringify(window.__providerDocs.calls)'
"$B" console --errors
