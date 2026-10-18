import { env } from "cloudflare:workers";

export type ProgressInput = { id?: unknown; deviceId?: unknown; playerName?: unknown; completedOn?: unknown; questions?: unknown; firstCorrect?: unknown; solved?: unknown; misses?: unknown; totalMs?: unknown; section?: unknown; difficulty?: unknown };
export type ProgressUser = { userId: string; email: string; displayName: string } | null;
type DailyRow = { day: string; sessions: number; questions: number; first_correct: number; solved: number; misses: number; total_ms: number };
type SessionRow = { created_at: number; questions: number; first_correct: number; total_ms: number };
type LeaderRow = { identity: string; display_name: string; sessions: number; questions: number; first_correct: number; total_ms: number };

function db() { if (!env.DB) throw new Error("Progress storage is unavailable"); return env.DB; }
function cleanId(value: unknown, name: string) { const result = typeof value === "string" ? value.trim() : ""; if (!/^[a-zA-Z0-9_-]{8,80}$/.test(result)) throw new Error(`Invalid ${name}`); return result; }
function cleanName(value: unknown) { const result = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : ""; if (!/^[\p{L}\p{N}][\p{L}\p{N} ._'-]{0,23}$/u.test(result)) throw new Error("Name must be 1–24 letters or numbers"); return result; }
function whole(value: unknown, min: number, max: number, name: string) { const result = Number(value); if (!Number.isInteger(result) || result < min || result > max) throw new Error(`Invalid ${name}`); return result; }

export async function savePlayer(rawDeviceId: unknown, rawPlayerName: unknown, user: ProgressUser = null) {
  const deviceId = cleanId(rawDeviceId, "device id"), playerName = cleanName(rawPlayerName), now = Date.now();
  await db().prepare("INSERT INTO function_sprint_players (device_id, display_name, created_at, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(device_id) DO UPDATE SET display_name = excluded.display_name, updated_at = excluded.updated_at").bind(deviceId, playerName, now, now).run();
  if (user) await db().prepare("INSERT INTO function_sprint_users (id, email, display_name, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET email = excluded.email, display_name = excluded.display_name, last_seen_at = excluded.last_seen_at").bind(user.userId, user.email, playerName || user.displayName, now, now).run();
  return { saved: true, playerName, authenticated: Boolean(user) };
}

export async function saveFunctionSprint(input: ProgressInput, user: ProgressUser = null) {
  const id = cleanId(input.id, "session id"), deviceId = cleanId(input.deviceId, "device id");
  await savePlayer(deviceId, input.playerName, user);
  const completedOn = typeof input.completedOn === "string" ? input.completedOn : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(completedOn)) throw new Error("Invalid completion date");
  const questions = whole(input.questions, 1, 100, "question count"), firstCorrect = whole(input.firstCorrect, 0, questions, "first-try count"), solved = whole(input.solved, 0, questions, "solved count"), misses = whole(input.misses, 0, questions * 4, "miss count"), totalMs = whole(input.totalMs, 0, 10_800_000, "elapsed time");
  const section = typeof input.section === "string" && /^(2\.[12678]|chemistry|math-mixed|super-speed-math|super-speed-chemistry)$/.test(input.section) ? input.section : "unknown";
  const difficulty = input.difficulty === "hard" ? "hard" : input.difficulty === "easy" ? "easy" : "standard";
  await db().prepare("INSERT OR IGNORE INTO function_sprint_sessions (id, device_id, user_id, completed_on, questions, first_correct, solved, misses, total_ms, section, difficulty, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(id, deviceId, user?.userId ?? null, completedOn, questions, firstCorrect, solved, misses, totalMs, section, difficulty, Date.now()).run();
  return { saved: true };
}

export async function readFunctionProgress(rawDeviceId: string, user: ProgressUser = null) {
  const deviceId = cleanId(rawDeviceId, "device id");
  const scope = user ? "(user_id = ? OR (user_id IS NULL AND device_id = ?))" : "user_id IS NULL AND device_id = ?";
  const scopeValues = user ? [user.userId, deviceId] : [deviceId];
  const [playerResult, dailyResult, sessionResult] = await Promise.all([
    user ? db().prepare("SELECT display_name FROM function_sprint_users WHERE id = ?").bind(user.userId).first<{ display_name: string }>() : db().prepare("SELECT display_name FROM function_sprint_players WHERE device_id = ?").bind(deviceId).first<{ display_name: string }>(),
    db().prepare(`SELECT completed_on AS day, COUNT(*) AS sessions, SUM(questions) AS questions, SUM(first_correct) AS first_correct, SUM(solved) AS solved, SUM(misses) AS misses, SUM(total_ms) AS total_ms FROM function_sprint_sessions WHERE ${scope} GROUP BY completed_on ORDER BY completed_on DESC LIMIT 30`).bind(...scopeValues).all<DailyRow>(),
    db().prepare(`SELECT created_at, questions, first_correct, total_ms FROM function_sprint_sessions WHERE ${scope} ORDER BY created_at DESC LIMIT 30`).bind(...scopeValues).all<SessionRow>(),
  ]);
  const days = (dailyResult.results ?? []).map(row => ({ day: row.day, sessions: Number(row.sessions), questions: Number(row.questions), accuracy: row.questions ? Math.round(Number(row.first_correct) / Number(row.questions) * 100) : 0, solvedAccuracy: row.questions ? Math.round(Number(row.solved) / Number(row.questions) * 100) : 0, misses: Number(row.misses), averageSeconds: row.questions ? Math.round(Number(row.total_ms) / Number(row.questions)) / 1000 : 0 }));
  const sessions = (sessionResult.results ?? []).map(row => ({ createdAt: Number(row.created_at), questions: Number(row.questions), accuracy: row.questions ? Math.round(Number(row.first_correct) / Number(row.questions) * 100) : 0, averageSeconds: row.questions ? Math.round(Number(row.total_ms) / Number(row.questions)) / 1000 : 0 }));
  return { playerName: playerResult?.display_name ?? user?.displayName.slice(0, 24) ?? null, authenticated: Boolean(user), days, sessions };
}
