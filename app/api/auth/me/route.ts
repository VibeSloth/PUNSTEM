import { localUser, isAdmin } from "../../../../db/auth";
export async function GET(request: Request) { const user = await localUser(request); return Response.json({ user: user ? { ...user, isAdmin: isAdmin(user) } : null }, {headers:{"cache-control":"no-store"}}); }
