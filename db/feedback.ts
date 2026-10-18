import { env } from "cloudflare:workers";
export async function saveFeedback(userId:string,input:Record<string,unknown>){
  const message=typeof input.message==='string'?input.message.trim():'';
  const kind=input.kind==='bug'?'bug':input.kind==='suggestion'?'suggestion':null;
  const page=typeof input.page==='string'?input.page.slice(0,200):'/';
  if(!kind||message.length<5||message.length>3000)throw new Error('Write 5–3000 characters.');
  if(!/^\/[a-zA-Z0-9_./-]*$/.test(page))throw new Error('Invalid page.');
  const now=Date.now();
  const context:Record<string,string|number|unknown[]>={};
  const raw=input.context && typeof input.context==='object'?input.context as Record<string,unknown>:{};
  for(const key of ['screen','section','difficulty','questionType','equation','prompt','source','status','data']){
    if(typeof raw[key]==='string')context[key]=(raw[key] as string).slice(0,2000);
  }
  for(const key of ['problemNumber','problemCount','secondsRemaining','attempt']){
    if(typeof raw[key]==='number'&&Number.isFinite(raw[key]))context[key]=Math.max(0,Math.min(raw[key] as number,10000));
  }
  for(const key of ['givens','visual','points']){
    if(raw[key] && JSON.stringify(raw[key]).length<=5000)context[key]=JSON.parse(JSON.stringify(raw[key]));
  }
  const recent=await env.DB.prepare('SELECT COUNT(*) AS count FROM site_feedback WHERE user_id = ? AND created_at > ?').bind(userId,now-60000).first<{count:number}>();
  if((recent?.count||0)>=3)throw new Error('Please wait a minute before sending another report.');
  await env.DB.prepare('INSERT INTO site_feedback (id,user_id,kind,message,page,context,created_at) VALUES (?,?,?,?,?,?,?)').bind(crypto.randomUUID(),userId,kind,message,page,JSON.stringify(context),now).run();
  return {saved:true};
}
export async function readFeedback(){
  const rows=await env.DB.prepare('SELECT f.id,f.kind,f.message,f.page,f.context,f.created_at AS createdAt,u.email,u.display_name AS displayName FROM site_feedback f LEFT JOIN function_sprint_users u ON u.id = f.user_id ORDER BY f.created_at DESC LIMIT 200').all();
  return {reports:rows.results};
}
