import { env } from 'cloudflare:workers';
import { localUser } from '../../../db/auth';

const headers={'cache-control':'no-store'};
export async function GET(request:Request){
 const user=await localUser(request);
 if(!user)return Response.json({error:'Sign in required'},{status:401,headers});
 try{
  const rows=await env.DB.prepare("SELECT id,details,created_at FROM activity_events WHERE user_id=? AND kind='learning_attempt' ORDER BY created_at DESC LIMIT 2000").bind(user.userId).all();
  return Response.json({userId:user.userId,attempts:rows.results.map(row=>({...JSON.parse(String(row.details)),id:row.id,at:row.created_at})).reverse()},{headers});
 }catch{return Response.json({error:'Learning history could not load'},{status:503,headers});}
}
export async function POST(request:Request){
 const user=await localUser(request);
 if(!user)return Response.json({error:'Sign in required'},{status:401,headers});
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403,headers});
 try{
  const text=await request.text();if(text.length>16000)return Response.json({error:'Request too large'},{status:413,headers});
  const input=JSON.parse(text);if(!Array.isArray(input.attempts)||input.attempts.length>30)throw Error();
  const statements=input.attempts.map((a:Record<string,unknown>)=>{
   if(typeof a.id!=='string'||!/^[-a-zA-Z0-9_]{8,80}$/.test(a.id)||!['math','chemistry'].includes(String(a.subject))||typeof a.correct!=='boolean'||typeof a.elapsedMs!=='number'||!Number.isFinite(a.elapsedMs)||typeof a.limitSeconds!=='number'||!Number.isFinite(a.limitSeconds)||![1,2].includes(Number(a.attempt)))throw Error();
   const clean={subject:a.subject,questionId:String(a.questionId||'').slice(0,100),section:String(a.section||'').slice(0,40),kind:String(a.kind||'').slice(0,60),label:String(a.label||'').slice(0,100),difficulty:String(a.difficulty||'standard').slice(0,20),correct:a.correct,attempt:Number(a.attempt),elapsedMs:Math.min(3600000,Math.max(0,Number(a.elapsedMs))),limitSeconds:Math.min(3600,Math.max(0,Number(a.limitSeconds))),errors:Array.isArray(a.errors)?a.errors.filter(x=>typeof x==='string').slice(0,8).map(x=>x.slice(0,100)):[]};
   return env.DB.prepare('INSERT OR IGNORE INTO activity_events (id,user_id,kind,page,details,created_at) VALUES (?,?,?,?,?,?)').bind(a.id,user.userId,'learning_attempt',clean.subject,JSON.stringify(clean),Date.now());
  });
  if(statements.length)await env.DB.batch(statements);
  return Response.json({saved:true},{headers});
 }catch{return Response.json({error:'Could not save learning history'},{status:400,headers});}
}
