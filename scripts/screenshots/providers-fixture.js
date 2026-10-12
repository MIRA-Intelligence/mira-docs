return (async () => {
  const React = (await import('/node_modules/.vite/deps/react.js')).default;
  const { createRoot } = (await import('/node_modules/.vite/deps/react-dom_client.js')).default;
  const source = await (await fetch('/src/components/providers/ProvidersPage.tsx')).text();
  const store = async (name) => {
    const path = source.match(new RegExp('"([^"\\n]*' + name + '\\.ts[^"\\n]*)"'))?.[1] || `/src/stores/${name}.ts`;
    return (await import(path))['use' + name[0].toUpperCase() + name.slice(1)];
  };
  const settings = await store('settingsStore');
  const ui = await store('uiStore');
  settings.setState({language:'zh',theme:'light',apiUrl:'http://localhost:5173/api'});
  settings.getState().setTheme('light');
  const provider = (display_name, overrides={}) => ({display_name,api_key_configured:false,api_key_preview:null,api_base:null,models:[],configured:false,enabled:false,api_key_required:true,api_base_required:false,default_api_base:null,is_oauth:false,is_local:false,...overrides});
  const payload = {
    projects_root:'/data/mira/projects',config_path:'/data/mira/config.json',persisted:false,
    runtime:{workspace:'/data/mira/projects',provider:'deepseek',model:'deepseek/deepseek-chat',reasoning_effort:null,temperature:0.1,max_tool_iterations:200,auto_max_rounds:100,restrict_to_workspace:true,supervisor_provider:'auto',supervisor_model:null,student_provider:'deepseek',student_model:'deepseek/deepseek-chat',critic_provider:'auto',critic_model:null},
    providers:{
      deepseek:provider('DeepSeek',{enabled:true,configured:true,api_key_configured:true,api_key_preview:'sk…demo',default_api_base:'https://api.deepseek.com',models:['deepseek/deepseek-chat']}),
      custom:provider('Custom',{api_base_required:true}),openai:provider('OpenAI'),anthropic:provider('Anthropic'),openrouter:provider('OpenRouter'),ollama:provider('Ollama',{is_local:true,api_key_required:false,default_api_base:'http://localhost:11434'}),openai_codex:provider('OpenAI Codex',{is_oauth:true,api_key_required:false}),github_copilot:provider('GitHub Copilot',{is_oauth:true,api_key_required:false}),
    },
    model_params:[{pattern:'deepseek/*',params:{temperature:0.1}}],
  };
  const calls=[];
  const originalFetch=window.fetch.bind(window);
  window.fetch=async(input,init)=>{
    const url=new URL(typeof input==='string'?input:input.url,location.href);
    if(!url.pathname.startsWith('/api'))return originalFetch(input,init);
    const method=init?.method||'GET';calls.push({path:url.pathname,method});
    const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
    if(url.pathname==='/api/config'){
      if(method==='POST'){
        const body=JSON.parse(init.body);Object.assign(payload.runtime,body.runtime);
        for(const [name,update]of Object.entries(body.providers||{})){
          const p=payload.providers[name];if(!p)return json({error:'Unknown fixture provider'},400);
          for(const key of ['api_base','models','enabled'])if(key in update)p[key]=update[key];
          if(update.api_key){p.api_key_configured=true;p.api_key_preview='sk…demo';}p.configured=true;
        }
        if(body.model_params)payload.model_params=body.model_params;payload.persisted=true;
      }
      return json(payload);
    }
    if(url.pathname==='/api/providers/deepseek/models')return json({provider:'deepseek',api_base:null,models:['deepseek/deepseek-chat','deepseek/deepseek-reasoner'],cached:false});
    // Deliberately do not simulate connection success: screenshots only show controls.
    return json({error:'Blocked by isolated documentation fixture'},403);
  };
  window.__providerDocs={calls,payload};
  ui.getState().openProviders();
  const { ProvidersPage }=await import('/src/components/providers/ProvidersPage.tsx');
  document.getElementById('root').style.display='none';
  const mount=document.createElement('div');mount.id='docs-providers';document.body.appendChild(mount);
  createRoot(mount).render(React.createElement(ProvidersPage));
  return {fixture:true,component:'ProvidersPage',backend:'mocked; no real credentials or model calls'};
})();
