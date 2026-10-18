import { localUser } from "../../../db/auth";
import { feedbackNoticeSeen, dismissFeedbackNotice } from "../../../db/notices";
export async function GET(request: Request) {
  const user = await localUser(request);
  if (!user) return Response.json({error:"Sign in required"},{status:401});
  try { return Response.json({seen:await feedbackNoticeSeen(user.userId)}, {headers:{"cache-control":"no-store"}}); }
  catch { return Response.json({error:"Could not load notice"},{status:503}); }
}
export async function POST(request: Request) {
  const user = await localUser(request);
  if (!user) return Response.json({error:"Sign in required"},{status:401});
  try { await dismissFeedbackNotice(user.userId); return Response.json({saved:true}); }
  catch { return Response.json({error:"Could not save. Try again."},{status:503}); }
}
