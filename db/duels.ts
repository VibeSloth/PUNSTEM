import { env } from "cloudflare:workers";

type RoomRow = {
  code: string; host_token: string; guest_token: string | null; questions: string;
  status: string; round: number; host_score: number; guest_score: number;
  last_winner: string | null; winner: string | null; created_at: number; updated_at: number;
};

function db() {
  if (!env.DB) throw new Error("Duel storage is unavailable");
  return env.DB;
}

function publicRoom(row: RoomRow, token: string) {
  const role = token === row.host_token ? "host" : token === row.guest_token ? "guest" : null;
  if (!role) throw new Error("Invalid room token");
  return { code: row.code, role, questions: JSON.parse(row.questions), status: row.status, round: row.round, hostScore: row.host_score, guestScore: row.guest_score, lastWinner: row.last_winner, winner: row.winner, updatedAt: row.updated_at };
}

async function rowFor(code: string) {
  return db().prepare("SELECT * FROM duel_rooms WHERE code = ?").bind(code).first<RoomRow>();
}

export async function createRoom(questions: unknown[]) {
  const now = Date.now();
  await db().prepare("DELETE FROM duel_rooms WHERE created_at < ?").bind(now - 86_400_000).run();
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
    const token = crypto.randomUUID();
    try {
      await db().prepare("INSERT INTO duel_rooms (code, host_token, questions, status, round, host_score, guest_score, created_at, updated_at) VALUES (?, ?, ?, 'waiting', 0, 0, 0, ?, ?)").bind(code, token, JSON.stringify(questions), now, now).run();
      const row = await rowFor(code);
      if (!row) throw new Error("Room creation failed");
      return { ...publicRoom(row, token), token };
    } catch (error) {
      if (attempt === 4) throw error;
    }
  }
  throw new Error("Room creation failed");
}

export async function joinRoom(code: string) {
  const normalized = code.trim().toUpperCase();
  const token = crypto.randomUUID();
  const now = Date.now();
  const result = await db().prepare("UPDATE duel_rooms SET guest_token = ?, status = 'playing', updated_at = ? WHERE code = ? AND guest_token IS NULL AND status = 'waiting'").bind(token, now, normalized).run();
  if (!result.meta.changes) throw new Error("Room not found or already full");
  const row = await rowFor(normalized);
  if (!row) throw new Error("Room not found");
  return { ...publicRoom(row, token), token };
}

export async function readRoom(code: string, token: string) {
  const row = await rowFor(code.trim().toUpperCase());
  if (!row) throw new Error("Room not found");
  return publicRoom(row, token);
}

export async function claimPoint(code: string, token: string, round: number) {
  const row = await rowFor(code.trim().toUpperCase());
  if (!row) throw new Error("Room not found");
  const role = token === row.host_token ? "host" : token === row.guest_token ? "guest" : null;
  if (!role) throw new Error("Invalid room token");
  if (row.status !== "playing" || row.round !== round || row.winner) return publicRoom(row, token);
  const now = Date.now();
  const scoreColumn = role === "host" ? "host_score" : "guest_score";
  const sql = `UPDATE duel_rooms SET ${scoreColumn} = ${scoreColumn} + 1, last_winner = ?, winner = CASE WHEN ${scoreColumn} + 1 >= 5 THEN ? ELSE NULL END, status = CASE WHEN ${scoreColumn} + 1 >= 5 THEN 'complete' ELSE 'playing' END, round = round + 1, updated_at = ? WHERE code = ? AND status = 'playing' AND round = ? AND winner IS NULL`;
  await db().prepare(sql).bind(role, role, now, row.code, round).run();
  const updated = await rowFor(row.code);
  if (!updated) throw new Error("Room disappeared");
  return publicRoom(updated, token);
}
