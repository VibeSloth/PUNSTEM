import { env } from 'cloudflare:workers';
import { localUser } from '../../../db/auth';
const headers={'cache-control':'no-store'};
export async function GET(request:Request){
 const user=await localUser(request);if(!user)return Response.json({error:'Sign in required'},{status:401,headers});
 try{const rows=await env.DB.prepare("SELECT id,details,created_at FROM activity_events WHERE user_id=? AND kind='study_attempt' ORDER BY created_at DESC LIMIT 5000").bind(user.userId).all();return Response.json({userId:user.userId,attempts:rows.results.map(row=>({...JSON.parse(String(row.details)),id:row.id,at:row.created_at})).reverse()},{headers});}catch{return Response.json({error:'Study history could not load'},{status:503,headers});}
}
export async function POST(request:Request){
 const user=await localUser(request);if(!user)return Response.json({error:'Sign in required'},{status:401,headers});
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403,headers});
 try{const text=await request.text();if(text.length>24000)return Response.json({error:'Request too large'},{status:413,headers});const input=JSON.parse(text);if(!Array.isArray(input.attempts)||!input.attempts.length||input.attempts.length>50)throw Error();
 const statements=input.attempts.map((a:Record<string,unknown>)=>{
  if(typeof a.id!=='string'||!/^[-\w]{8,80}$/.test(a.id)||typeof a.questionId!=='string'||!a.questionId||a.questionId.length>100||!['math','chemistry'].includes(String(a.subject))||!['practice','test','review'].includes(String(a.mode))||typeof a.correct!=='boolean'||typeof a.independent!=='boolean'||typeof a.elapsedMs!=='number'||!Number.isFinite(a.elapsedMs))throw Error();
  const clean={questionId:a.questionId,subject:a.subject,mode:a.mode,correct:a.correct,independent:a.independent===true&&a.correct===true,elapsedMs:Math.min(14400000,Math.max(0,a.elapsedMs)),rating:['too-easy','about-right','too-hard','off-topic'].includes(String(a.rating))?a.rating:null};
  return env.DB.prepare('INSERT OR IGNORE INTO activity_events (id,user_id,kind,page,details,created_at) VALUES (?,?,?,?,?,?)').bind(a.id,user.userId,'study_attempt','/study.html',JSON.stringify(clean),Date.now());
 });await env.DB.batch(statements);return Response.json({saved:true},{headers});}catch{return Response.json({error:'Invalid study attempts'},{status:400,headers});}
}
