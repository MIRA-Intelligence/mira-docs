# Current MiraUI documentation screenshots

Captured 2026-10-12 from the actual MiraUI React components and Vite styles, with demonstration records in an isolated page. These are UI illustrations, not real research results or model/integration test evidence. The local engine control image uses a mock Electron bridge; no service is started, stopped, or restarted.

Source baselines:

- mira: `d877a5e`, branch `release/v0.3.5rc1`, agent `0.3.5rc1`.
- mira-ui: `052e5a6`, branch `dev`, compatibility UI `0.4.5rc1` / agent `0.3.5rc1`.
- Published release metadata checked with the GitHub API: stable `0.3.4` / `0.4.4`, prerelease `0.3.5rc1` / `0.4.5rc1`.

The paired source checkouts changed during the documentation work. Final comparison against engine `de330b5` and UI `c5cc231` found no UI or feature behavior changes affecting these pages; engine differences were release-runner setup, formatting and tests. The original capture baselines above remain the screenshot provenance.

## Reproduce

Run the current mira-ui Vite server on `http://localhost:5173`, then from mira-docs:

```bash
MIRA_DOCS_BROWSE_BIN=/path/to/gstack/browse/dist/browse bash scripts/screenshots/capture.sh
```

The default browse path is this workspace owner's installed skill path; override it on other machines. The host file and fixture currently target port 5173. A source/UI change can require updating imports, field selectors or demonstration record shapes.

The capture script navigates to a same-origin non-App resource and loads `host.html`, then mounts the real components with `fixture.js`. This avoids App startup effects. The fixture blocks `/api` fetches, disconnects the chat socket, rejects workflow mutations and message sends, and never submits launch/approval forms. No actual project is created. Browser-local storage belongs to the isolated screenshot browser.

Images are saved at 2x scale in `static/img/current/`. Dialogs and controls use element screenshots; chat selection uses a fixed crop to omit empty space. Keep captions that identify demonstration data in the published pages.

## Evidence-to-page map

| Image | Real component | Documentation |
| --- | --- | --- |
| workflow-overview | WorkflowWorkspace, PipelineOverview, ProjectQueue | UI index, concepts navigation, pipeline |
| create-project | CreateProjectDialog | project management, quickstart |
| research-launch | WorkflowWorkspace initiation dialog | pipeline |
| experiment-launch | WorkflowWorkspace experiment dialog | experiment inputs, automation policy |
| experiment-input-controls | ExperimentInputPaths | experiment inputs |
| delivery-launch | WorkflowWorkspace delivery dialog | result center |
| module-approval | WorkflowInteractionPanel | interactions |
| manual-continuation | WorkflowInteractionPanel | interactions |
| experiment-detail | ExperimentDetail | experiment detail |
| chat-selection | ProjectQueue | Quick Chat |
| engine-controls | EngineLifecycleControls, mock desktop bridge | local engine service |

## Source audit

Descriptions were checked against the implemented API/CLI and UI, not only design documents:

- Engine: `workflows/{http,service,experiments,input_paths}.py`, `modules/{runtime,executors,profiles}.py`, `cli/{workflow,agent_service,commands}.py`, `config/schema.py`, `mira_engine.py`, `command/builtin.py`, and deployment compose.
- UI: workflow components/store/candidate mapping, CreateProjectDialog/NewProjectModal, ProjectQueue/chat organization, exportRequests, SettingsModal/EngineLifecycleControls, and compatibility.json.
- Engine docs: modular workflow API/storage/executor contracts, service-lifecycle, MEMORY, PYTHON_SDK, and self-hosted guide.

Some design-doc routes/CLI commands remain proposals (for example legacy conversion). SDK `tools_used`/`messages` are currently empty in the implementation. Module token goals are not documented as an immediate provider billing cutoff. Public docs retain these boundaries.

Validation: production build for zh-CN and en, strict broken-link checks, zero missing local fragment targets, Mermaid parsing, all 11 screenshot asset references and PNG integrity, screenshot inspection, CLI `--help` checks for workflow/run creation and engine restart, and browser checks of generated pages. New pages and release links returned 200; CLI anchor and new English homepage copy were verified. Desktop (1600 px) and mobile (390 px) checks found no horizontal overflow on the sampled pages and no console errors. The English locale uses Chinese source docs as its existing fallback; this update also refreshes affected English homepage messages, but does not claim a full English document translation.


## Provider UI screenshots

The Provider guide now uses the UI as the preferred configuration path. Four additional images were captured on 2026-10-12 from the real `ProvidersPage` component at UI `052e5a6`, compared against engine `81959b3` and the current working tree. These checkout IDs identify the capture baseline; local changes are not release acceptance evidence.

```bash
MIRA_DOCS_BROWSE_BIN=/path/to/gstack/browse/dist/browse bash scripts/screenshots/capture-providers.sh
```

`providers-fixture.js` mounts the component in the same isolated host without importing App. It intercepts all `/api` requests: configuration and model-list GETs return demonstration payloads, configuration POSTs stay in memory, and every other API request is rejected. The script only reads mock configuration/models; it does not press Test connection or Save, use real credentials, or call a model. A masked demo key is shown in the screenshot. These pictures demonstrate controls, not live connectivity or persistence.

| Image | Real component area | Documentation |
| --- | --- | --- |
| provider-settings | ProvidersPage credentials, curated/fetched models, active bindings | Provider guide, quickstart |
| provider-role-menu | ProvidersPage role assignment menu | Provider guide |
| provider-runtime | RuntimeSettingsEditor | Provider guide |
| provider-model-params | ModelParamsEditor | Provider guide |

Descriptions of save/test/fetch behavior were checked against `services/runtimeConfig.ts`, `ProvidersPage.tsx`, engine `channels/ui.py` and gateway runtime reload callbacks. The test accepts draft credentials; model fetch uses saved engine configuration. OAuth login is not provided by this page. API Base/default addresses are provider-specific. Empty saved-key input preserves the old key. A curated model list is distinct from an ordered fallback model list.

Provider follow-up validation: all four PNGs passed integrity checks and visual inspection; the full capture script completed with only the two mocked GETs recorded and no console errors. zh-CN/en production builds passed; 33 config examples parsed against the actual engine schema, all Mermaid blocks parsed, and 4,003 local links across 78 built HTML pages had no missing target or fragment. Source image references had no missing assets. The Provider documentation page loaded all four images at desktop width and had no horizontal overflow at 390 px.
