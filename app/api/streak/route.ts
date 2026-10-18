import { localUser } from "../../../db/auth";
import { readStreak } from "../../../db/streaks";
export async function GET(request: Request) {
  const user=await localUser(request);
  if(!user)return Response.json({error:"Sign in required"},{status:401});
  return Response.json(await readStreak(user.userId,new URL(request.url).searchParams.get("timezone")),{headers:{"cache-control":"no-store"}});
}
