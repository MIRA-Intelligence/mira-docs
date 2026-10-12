return (async () => {
  const React = (await import('/node_modules/.vite/deps/react.js')).default;
  const { createRoot } = (await import('/node_modules/.vite/deps/react-dom_client.js')).default;
  const { flushSync } = (await import('/node_modules/.vite/deps/react-dom.js')).default;
  const component = async (path, name) => (await import(path))[name];
  const workspacePath = '/src/components/workflow/WorkflowWorkspace.tsx';
  const workspaceSource = await (await fetch(workspacePath)).text();
  const store = async (name) => {
    const url = workspaceSource.match(new RegExp('"([^"\\n]*' + name + '\\.ts[^"\\n]*)"'))?.[1] || `/src/stores/${name}.ts`;
    return (await import(url))['use' + name[0].toUpperCase() + name.slice(1)];
  };
  const project = await store('projectStore');
  const workflow = await store('workflowStore');
  const settings = await store('settingsStore');
  const agent = await store('agentStore');
  const queueSource = await (await fetch('/src/components/queue/ProjectQueue.tsx')).text();
  const queueStore = async (name) => (await import(queueSource.match(new RegExp('"([^"\\n]*' + name + '\\.ts[^"\\n]*)"'))[1]))['use' + name[0].toUpperCase() + name.slice(1)];
  const chat = await queueStore('chatStore');
  const organization = await queueStore('organizationStore');
  const { wsClient } = await import('/src/services/websocket.ts');
  wsClient.disconnect();
  wsClient.send = () => { throw new Error('Screenshot fixture cannot send messages'); };
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = String(input?.url || input);
    if (/\/api(?:\/|$)/.test(url)) return Promise.resolve(new Response('{}', {status: 503, headers: {'Content-Type':'application/json'}}));
    return originalFetch(input, init);
  };
  const never = async () => { throw new Error('Screenshot fixture is read-only'); };
  const id = 'demo-qmri';
  const timestamp = '2026-10-12T06:00:00Z';
  const task = { id, label:'定量 MRI 方法比较（演示）', title:'定量 MRI 方法比较（演示）', projectDir:'/data/mira/projects/demo-qmri', status:'running', coreQuestion:'比较两种定量 MRI 方法，先审核数据与验证范围。', knowledge:[], experiments:[], research:{}, result:{}, stages:[], experimentCount:2 };
  const makeRun = (run_id, module_type, label, module_data, outputs=[]) => ({schema_version:1, workflow_contract_version:1, run_id, project_id:id, module_type, label, status:'completed', revision:3, created_at:timestamp, updated_at:timestamp, inputs:[], outputs, attempt:{number:1}, attempts:[], conversation_key:`ui:${id}:run:${run_id}`, last_project_sequence:10, last_run_sequence:3, module_data});
  const experiment = {id:'EXP-001',title:'基线方法：内部验证',status:'completed',question:'现有数据能否稳定复现基线？',hypothesis:'基线误差在预设阈值内。',method:'固定数据划分，重复拟合并记录误差与偏差。',results:{metrics:{mae_ms:24.6,bias_ms:3.1}, findings:'演示结果：仅用于说明界面，不能作为真实研究结论。',artifacts:[]},conclusion:'演示结果：完成内部验证；外部泛化待验证。',theoretical_proof:'使用同一参考方法与统一单位比较。',isolation_test:{control:'基线拟合方法',treatment:'替代拟合方法',isolated_variable:'固定划分和预处理，只改变拟合方法。'},post_mortem:{residual_analysis:'外部队列尚未提供，不推断外部性能。',implementation_fidelity:'核对同一参考方法、单位和拟合输入。'},evidence_refs:[]};
  const research = makeRun('demo-research','initiation','调研 1',{research_result:{directions:[{id:'direction-a',title:'方向 A：稳定性与偏差评估',rationale:'先锁定参考、单位与验证划分。'},{id:'direction-b',title:'方向 B：跨设备泛化验证',rationale:'需要补充独立外部队列。'}]}},['research-summary']);
  const exp = makeRun('demo-experiment','experiment','实验 1',{parent_run_id:research.run_id,upstream_selection:{run_id:research.run_id,item_id:'direction-a'},experiment_execution_mode:'manual',experiments:[experiment,{...experiment,id:'EXP-002',title:'替代方法：对照验证'}]},['experiment-results']);
  const delivery = makeRun('demo-delivery','delivery','交付 1',{parent_run_id:exp.run_id,upstream_selection:{run_id:exp.run_id,item_id:'EXP-001'},delivery_format:'experiment_report',output_path:'result/exports/experiment_report.md',completion_summary:'内部验证阶段报告（演示）'},['report','figures']);
  project.setState({tasks:[task],selectedTaskId:id,appMode:'project',mode:'manual',agentProfile:'research',activeStage:'overview',loadTasks:async()=>{},createProjectShell:never,deleteTask:never,duplicateTask:never,stats:{total:1,running:0,completed:1,failed:0}});
  settings.setState({language:'zh',theme:'light',workspacePath:'/data/mira/projects',deploymentMode:'remoteManual',engineVersion:'0.3.5rc1',engineStartedAt:null,runtimeConfig:null});
  settings.getState().setTheme('light');
  agent.setState({connected:false});
  workflow.setState({snapshots:{[id]:{workflow_contract_version:1,project_id:id,project_sequence:10,workflow:{contract_version:1,status:'active',revision:3,last_project_sequence:10,handoff_policy:{mode:'manual',interrupt_grace_seconds:10,rules:[]}},runs:[research,exp,delivery]}},selectedRunByProject:{[id]:research.run_id},selectedCandidateByProject:{[id]:{initiation:{runId:research.run_id,itemId:'direction-a'},experiment:{runId:exp.run_id,itemId:'EXP-001'},delivery:{runId:delivery.run_id,itemId:delivery.run_id}}},loadProject:async()=>{},createRun:never,commandRun:never,setHandoffMode:never});
  chat.setState({chats:[{id:'chat-demo-1',title:'梳理数据审计清单',createdAt:timestamp,updatedAt:timestamp},{id:'chat-demo-2',title:'讨论统计分析方案',createdAt:timestamp,updatedAt:timestamp},{id:'chat-demo-3',title:'整理组会报告大纲',createdAt:timestamp,updatedAt:timestamp}],activeChatId:'chat-demo-1',workspaceKey:'docs-fixture',deleteChats:never});
  organization.setState({folders:[{id:'folder-demo',name:'MRI 方法研究',created_at:timestamp,updated_at:timestamp}],assignments:{project:{[id]:'folder-demo'},chat:{'chat-demo-1':'folder-demo','chat-demo-2':'folder-demo','chat-demo-3':'folder-demo'}},loaded:true,moveItem:never,deleteFolder:never});
  document.getElementById('root').style.display='none';
  const mount = document.createElement('div'); mount.id='docs-screenshot'; document.body.appendChild(mount);
  const root = createRoot(mount);
  const h=React.createElement;
  const Workspace=await component(workspacePath,'WorkflowWorkspace');
  const Queue=await component('/src/components/queue/ProjectQueue.tsx','ProjectQueue');
  const Create=await component('/src/components/project/CreateProjectDialog.tsx','CreateProjectDialog');
  const Interaction=await component('/src/components/workflow/WorkflowInteractionPanel.tsx','WorkflowInteractionPanel');
  const Detail=await component('/src/components/experiment/ExperimentDetail.tsx','ExperimentDetail');
  const Lifecycle=await component('/src/components/settings/EngineLifecycleControls.tsx','EngineLifecycleControls');
  const banner=h('div',{style:{padding:'12px 24px',fontSize:13,color:'#64748b',borderBottom:'1px solid #e2e8f0'}},'MiraUI · 当前界面 / 演示数据 · 非真实研究结果');
  const render=(content)=>flushSync(()=>root.render(h('div',{style:{height:'100vh',background:'var(--color-bg-primary)'}},banner,content)));
  const interaction=(type,title,prompt,choices)=>({interaction_id:'demo-'+type,interaction_type:type,title,prompt,choices,allow_freeform:true,response_schema:{type:'object',required:['decision'],properties:{decision:{type:'string'},notes:{type:'string'}}}});
  window.__docs={
    overview:()=>{project.setState({appMode:'project'});render(h('div',{style:{display:'grid',gridTemplateColumns:'240px 1fr',height:'calc(100vh - 44px)'}},h(Queue),h(Workspace)));},
    create:()=>render(h(Create,{onClose:()=>window.__docs.overview()})),
    approval:()=>render(h('div',{style:{maxWidth:760,margin:'40px auto',padding:24}},h(Interaction,{projectId:id,run:{...exp,status:'waiting_input',module_data:{interaction:interaction('approve_experiment_plan','请确认本次实验方案','目标：复现基线并比较替代方法。\n输入：已确认单位和参考方法的数据。\n验证：固定内部划分，不声明外部泛化。\n范围：最多 2 个实验；先记录误差、偏差与失败原因。\n停止：超出预算或输入校验失败。',[{value:'approve',label:'批准执行'},{value:'revise',label:'修改方案'}])}}}))),
    manual:()=>render(h('div',{style:{maxWidth:760,margin:'40px auto',padding:24}},h(Interaction,{projectId:id,run:{...exp,status:'waiting_input',module_data:{interaction:interaction('confirm_experiment_continuation','本次实验已结束，接下来怎么做？','EXP-001 已保存结果。请先检查指标、结论与证据，再决定继续一个实验或结束本次运行。',[{value:'continue',label:'继续下一个实验',description:'只授权再执行一个实验。'},{value:'finish',label:'结束并汇总',description:'汇总已有结果，不再运行剩余实验。'}])}}}))),
    detail:()=>{project.setState({tasks:[{...task,experiments:[{...experiment,id:'workflow:demo-experiment:EXP-001',experiment_id:'EXP-001',workflow_run_id:'demo-experiment',workflow_run_label:'实验 1'}]}],selectedExperimentId:'workflow:demo-experiment:EXP-001'});render(h('div',{style:{maxWidth:980,margin:'24px auto'}},h(Detail,{experiment:{...experiment,experiment_id:"EXP-001",workflow_run_id:"demo-experiment",workflow_run_label:"实验 1"}})));},
    chats:()=>{project.setState({appMode:'normal'});render(h('div',{style:{width:420,height:'calc(100vh - 44px)',margin:'0 auto'}},h(Queue)));},
    engine:()=>{window.electronAPI={bootstrapLocalEngine:async()=>null,getLocalEngineStatus:async()=>({result:{ok:true,code:0,stdout:'',stderr:'',command:[],executablePath:null},payload:{installed:true,running:true,healthy:true,config_path:'/Users/demo/.mira/config.json'}})};render(h('div',{style:{maxWidth:800,margin:'40px auto',padding:24,border:'1px solid #e2e8f0',borderRadius:12}},h('h2',{style:{fontSize:18,fontWeight:600}},'Local Engine'),h('p',{style:{fontSize:12,color:'#64748b',marginTop:8}},'桌面服务状态示例 · 此截图使用模拟桌面桥接'),h(Lifecycle,{busy:false,onBusyChange:()=>{}})));},
  };
  window.__docs.overview();
  return {mounted:true,project:id,fixture:true};
})();
