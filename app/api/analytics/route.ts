import { readUsageStats, saveUsageEvent, type UsageInput } from "../../../db/analytics";
import { localUser, isAdmin } from "../../../db/auth";

function message(error: unknown) { return error instanceof Error ? error.message : "Usage statistics are temporarily unavailable"; }

export async function GET(request: Request) {
  if (!isAdmin(await localUser(request))) return Response.json({error:"Admin access required"},{status:403});
  try { return Response.json(await readUsageStats(), { headers: { "cache-control": "no-store" } }); }
  catch (error) { return Response.json({ error: message(error) }, { status: 400 }); }
}

export async function POST(request: Request) {
  try { return Response.json(await saveUsageEvent(await request.json() as UsageInput, await localUser(request)), { status: 201 }); }
  catch (error) { return Response.json({ error: message(error) }, { status: 400 }); }
}
