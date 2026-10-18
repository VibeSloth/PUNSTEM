import { localUser, isAdmin } from "../../../db/auth";
import { accountList, accountProfile } from "../../../db/profiles";
export async function GET(request: Request) {
  const user = await localUser(request);
  if (!user) return Response.json({error:"Sign in to view your profile"},{status:401});
  const params = new URL(request.url).searchParams;
  if ((params.has("userId") || params.has("accounts")) && !isAdmin(user)) return Response.json({error:"Admin access required"},{status:403});
  try {
    const data = params.has("accounts") ? {accounts:await accountList()} : await accountProfile(params.get("userId") || user.userId, params.has("export") && isAdmin(user), params.get("timezone"));
    return Response.json(data,{headers:{"cache-control":"no-store"}});
  } catch { return Response.json({error:"Could not load profile. Please retry."},{status:503}); }
}
