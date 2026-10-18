import { safeActivity } from "../../../db/activity";
import { readFunctionProgress, saveFunctionSprint, savePlayer, type ProgressInput } from "../../../db/progress";
import { localUser } from "../../../db/auth";
import { recordPracticeDay } from "../../../db/streaks";
import { claimSprintFeedbackPrompt } from "../../../db/notices";

type ProgressRequest = ProgressInput & { profileOnly?: unknown; lessonComplete?: unknown; timezone?: unknown };

function message(error: unknown) { return error instanceof Error ? error.message : "Progress is temporarily unavailable"; }

export async function GET(request: Request) {
  if (!await localUser(request)) return Response.json({error:"Sign in required"},{status:401});
  try { const deviceId = new URL(request.url).searchParams.get("deviceId") ?? ""; return Response.json(await readFunctionProgress(deviceId, await localUser(request))); }
  catch (error) { return Response.json({ error: message(error) }, { status: 400 }); }
}

export async function POST(request: Request) {
  const user = await localUser(request);
  if (!user) return Response.json({error:"Sign in required"},{status:401});
  try { const input = await request.json() as ProgressRequest; if (input.profileOnly === true) return Response.json(await savePlayer(input.deviceId, input.playerName, user)); const result=await saveFunctionSprint(input,user); await safeActivity(user,input.lessonComplete===true?"sprint_completed":"sprint_saved",String(input.section || "unknown"),input,`sprint_${input.id}`); const streak=input.lessonComplete===true?await recordPracticeDay(user.userId,input.timezone):null; const showFeedbackPrompt=input.lessonComplete===true?await claimSprintFeedbackPrompt(user.userId).catch(()=>false):false; return Response.json({...result,streak,showFeedbackPrompt}, { status: 201 }); }
  catch (error) { return Response.json({ error: message(error) }, { status: 400 }); }
}
