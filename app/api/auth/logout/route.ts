import { clearSessionHeaders, deleteLocalSession, localUser, validAuthOrigin } from "../../../../db/auth";
import { safeActivity } from "../../../../db/activity";
export async function POST(request: Request) {if(!validAuthOrigin(request))return Response.json({error:'Invalid origin'},{status:403}); const user=await localUser(request); await deleteLocalSession(request); await safeActivity(user,"sign_out","account"); return Response.json({ signedOut: true }, { headers: clearSessionHeaders() }); }
