import {env} from 'cloudflare:workers';
import {localUser,isAdmin} from '../../../db/auth';
const headers={'cache-control':'no-store'};
type Uploaded={id:string;key:string;name:string;category:string;size:number};
const reply=(error:string,status:number)=>Response.json({error},{status,headers});
export async function POST(request:Request){
 const user=await localUser(request);if(!user)return reply('Sign in required',401);
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return reply('Invalid origin',403);
 if(Number(request.headers.get('content-length'))>32*1024*1024)return reply('Use at most 30 MB of PDFs.',413);
 const uploaded:Uploaded[]=[];
 try{
  if(!env.BUCKET)return reply('Uploads are temporarily unavailable.',503);
  const recent=await env.DB.prepare("SELECT COUNT(*) AS count FROM activity_events WHERE user_id=? AND kind='class_request' AND created_at>?").bind(user.userId,Date.now()-86400000).first<{count:number}>();
  if(Number(recent?.count)>=5)return reply('Please wait until tomorrow before sending another class request.',429);
  const form=await request.formData(),className=String(form.get('className')||'').trim(),priority=String(form.get('priority')||'').trim();
  if(!className||className.length>100||!priority||priority.length>2000)return reply('Add a class name and what you need most.',400);
  const inputs=['textbook','cycle','other'].flatMap(category=>form.getAll(category).filter((f):f is File=>typeof f!=='string'&&f.size>0).map(file=>({category,file})));
  if(inputs.length>6||!inputs.length)return reply('Attach 1–6 PDFs.',400);
  if(inputs.reduce((n,x)=>n+x.file.size,0)>30*1024*1024)return reply('Use at most 30 MB of PDFs.',413);
  const id=crypto.randomUUID();
  // Validate every file before writing any object. Never accept a client-supplied storage key.
  for(const {file} of inputs){if(file.size>15*1024*1024)return reply('Each PDF must be under 15 MB.',413);if(!file.name.toLowerCase().endsWith('.pdf')||new TextDecoder().decode(await file.slice(0,5).arrayBuffer())!=='%PDF-')return reply('Only PDF files are accepted.',400);}
  for(const {category,file} of inputs){const fileId=crypto.randomUUID(),key=`class-requests/${id}/${fileId}.pdf`,name=file.name.replace(/[\\/\r\n\x00-\x1f]/g,'_').slice(0,160);await env.BUCKET.put(key,await file.arrayBuffer(),{httpMetadata:{contentType:'application/pdf'}});uploaded.push({id:fileId,key,name,category,size:file.size});}
  await env.DB.prepare('INSERT INTO activity_events (id,user_id,kind,page,details,created_at) VALUES (?,?,?,?,?,?)').bind(id,user.userId,'class_request','home',JSON.stringify({className,priority,files:uploaded}),Date.now()).run();
  return Response.json({submitted:true},{headers});
 }catch{await Promise.allSettled(uploaded.map(f=>env.BUCKET.delete(f.key)));return reply('Could not submit. Please try again.',503);}
}
export async function GET(request:Request){
 const user=await localUser(request);if(!user)return reply('Sign in required',401);if(!isAdmin(user))return reply('Admin only',403);
 try{
  const url=new URL(request.url),requestId=url.searchParams.get('request'),fileId=url.searchParams.get('file');
  if(requestId&&fileId){const row=await env.DB.prepare("SELECT details FROM activity_events WHERE id=? AND kind='class_request'").bind(requestId).first<{details:string}>();const file:Uploaded|undefined=row?JSON.parse(row.details).files.find((f:Uploaded)=>f.id===fileId):undefined;if(!file)return reply('PDF not found',404);const object=await env.BUCKET.get(file.key);if(!object)return reply('PDF not found',404);return new Response(object.body,{headers:{...headers,'content-type':'application/pdf','x-content-type-options':'nosniff','content-disposition':`attachment; filename="document.pdf"; filename*=UTF-8''${encodeURIComponent(file.name)}`}});}
  const rows=await env.DB.prepare("SELECT a.id,a.details,a.created_at,u.display_name,u.email FROM activity_events a LEFT JOIN function_sprint_users u ON u.id=a.user_id WHERE a.kind='class_request' ORDER BY a.created_at DESC LIMIT 100").all();
  return Response.json({requests:rows.results.map(r=>{const d=JSON.parse(String(r.details));return{id:r.id,createdAt:r.created_at,name:r.display_name,email:r.email,className:d.className,priority:d.priority,files:d.files.map(({key,...f}:Uploaded)=>f)};})},{headers});
 }catch{return reply('Class requests could not load.',503);}
}
