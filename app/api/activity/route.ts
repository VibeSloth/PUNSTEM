import { localUser, isAdmin } from "../../../db/auth";
import { recordActivity, readActivity } from "../../../db/activity";
export async function GET(request: Request) {
  if (!isAdmin(await localUser(request))) return Response.json({error:"Admin access required"},{status:403});
  try { return Response.json(await readActivity(new URL(request.url)),{headers:{"cache-control":"no-store"}}); }
  catch { return Response.json({error:"Activity console is temporarily unavailable"},{status:503}); }
}
export async function POST(request: Request) {
  const user = await localUser(request);
  if (!user) return Response.json({error:"Sign in required"},{status:401});
  try {
    if (Number(request.headers.get("content-length")) > 2048) return Response.json({error:"Event too large"},{status:413});
    const raw = await request.text();
    if (raw.length > 2048) return Response.json({error:"Event too large"},{status:413});
    const input = JSON.parse(raw);
    if (!["page_view","sprint_started","question_shown","question_attempt"].includes(input.kind) || !/^[a-zA-Z0-9_-]{8,80}$/.test(input.id)) return Response.json({error:"Invalid event"},{status:400});
    await recordActivity(user,input.kind,String(input.page || "unknown"),input.details || {},input.id);
    return Response.json({saved:true});
  } catch { return Response.json({error:"Could not save event"},{status:400}); }
}
