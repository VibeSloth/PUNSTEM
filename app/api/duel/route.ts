import { claimPoint, createRoom, joinRoom, readRoom } from "../../../db/duels";
import { localUser } from "../../../db/auth";

function message(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected duel error";
}

export async function GET(request: Request) {
  if (!await localUser(request)) return Response.json({error:"Sign in required"},{status:401});
  try {
    const url = new URL(request.url);
    return Response.json(await readRoom(url.searchParams.get("code") ?? "", url.searchParams.get("token") ?? ""));
  } catch (error) {
    return Response.json({ error: message(error) }, { status: 404 });
  }
}

export async function POST(request: Request) {
  if (!await localUser(request)) return Response.json({error:"Sign in required"},{status:401});
  try {
    const payload = (await request.json()) as { action?: string; code?: string; token?: string; round?: number; questions?: unknown[] };
    if (payload.action === "create") {
      if (!Array.isArray(payload.questions) || payload.questions.length < 9) throw new Error("A duel needs at least nine questions");
      return Response.json(await createRoom(payload.questions), { status: 201 });
    }
    if (payload.action === "join") return Response.json(await joinRoom(payload.code ?? ""));
    if (payload.action === "claim") return Response.json(await claimPoint(payload.code ?? "", payload.token ?? "", Number(payload.round)));
    throw new Error("Unknown duel action");
  } catch (error) {
    return Response.json({ error: message(error) }, { status: 400 });
  }
}
