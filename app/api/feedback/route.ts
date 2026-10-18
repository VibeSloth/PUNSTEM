import { localUser,isAdmin } from '../../../db/auth';
import { saveFeedback,readFeedback } from '../../../db/feedback';
export async function POST(request:Request){
  const user=await localUser(request);
  if(!user)return Response.json({error:'Sign in to send feedback.'},{status:401});
  try{const raw=await request.text();if(raw.length>24000)return Response.json({error:'Report is too large.'},{status:413});return Response.json(await saveFeedback(user.userId,JSON.parse(raw)),{status:201});}
  catch(error){return Response.json({error:error instanceof Error?error.message:'Could not send feedback. Try again.'},{status:400});}
}
export async function GET(request:Request){
  const user=await localUser(request);
  if(!user)return Response.json({error:'Sign in required'},{status:401});
  if(!isAdmin(user))return Response.json({error:'Admin access required'},{status:403});
  try{return Response.json(await readFeedback());}
  catch{return Response.json({error:'Feedback is temporarily unavailable.'},{status:503});}
}
