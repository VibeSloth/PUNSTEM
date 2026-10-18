import { safeActivity } from "./activity";
import { env } from "cloudflare:workers";
import type { ProgressUser } from "./progress";

export type UsageInput = {
  id?: unknown;
  deviceId?: unknown;
  displayName?: unknown;
  page?: unknown;
  eventType?: unknown;
  occurredOn?: unknown;
  durationMs?: unknown;
};

function db() { if (!env.DB) throw new Error("Usage storage is unavailable"); return env.DB; }
function cleanId(value: unknown, name: string) { const result = typeof value === "string" ? value.trim() : ""; if (!/^[a-zA-Z0-9_-]{8,80}$/.test(result)) throw new Error(`Invalid ${name}`); return result; }
function cleanName(value: unknown) { const result = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : ""; return /^[\p{L}\p{N}][\p{L}\p{N} ._'-]{0,23}$/u.test(result) ? result : null; }

export async function saveUsageEvent(input: UsageInput, user: ProgressUser = null) {
  const id = cleanId(input.id, "event id"), deviceId = cleanId(input.deviceId, "device id");
  const page = typeof input.page === "string" && ["chemistry", "math", "home", "profile", "learn", "admin", "leaderboard"].includes(input.page) ? input.page : null;
  const eventType = input.eventType === "visit" ? "visit" : input.eventType === "engagement" ? "engagement" : null;
  const occurredOn = typeof input.occurredOn === "string" ? input.occurredOn : "";
  const durationMs = Math.min(21_600_000, Math.max(0, Math.round(Number(input.durationMs) || 0)));
  if (!page || !eventType || !/^\d{4}-\d{2}-\d{2}$/.test(occurredOn)) throw new Error("Invalid usage event");
  await db().prepare("INSERT OR IGNORE INTO usage_events (id, device_id, user_id, display_name, page, event_type, occurred_on, duration_ms, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(id, deviceId, user?.userId ?? null, user?.displayName ?? cleanName(input.displayName), page, eventType, new Date().toISOString().slice(0,10), eventType === "engagement" ? Math.min(30000,durationMs) : 0, Date.now()).run();
  await safeActivity(user,eventType === "visit" ? "visit" : "active_use",page,{durationMs},`usage_${id}`); return { saved: true };
}

type CountRow = { visits: number; learners: number; engagement_ms: number };
type SprintRow = { sessions: number; questions: number; first_correct: number; total_ms: number };
type DailyUsageRow = { day: string; visits: number; learners: number; engagement_ms: number };
type DailySprintRow = { day: string; sessions: number; questions: number };
type BreakdownRow = { label: string; count: number };
type LearnerRow = { display_name: string; last_seen: number; visits: number };
type LeaderRow = { display_name: string; sessions: number; questions: number; first_correct: number; total_ms: number };

export async function readUsageStats() {
  const [usage, sprints, dailyUsage, dailySprints, pages, sections, difficulties, learners, leaderboard] = await Promise.all([
    db().prepare("SELECT SUM(CASE WHEN event_type = 'visit' THEN 1 ELSE 0 END) AS visits, COUNT(DISTINCT CASE WHEN event_type = 'visit' THEN device_id END) AS learners, SUM(CASE WHEN event_type = 'engagement' THEN duration_ms ELSE 0 END) AS engagement_ms FROM usage_events").first<CountRow>(),
    db().prepare("SELECT COUNT(*) AS sessions, COALESCE(SUM(questions), 0) AS questions, COALESCE(SUM(first_correct), 0) AS first_correct, COALESCE(SUM(total_ms), 0) AS total_ms FROM function_sprint_sessions").first<SprintRow>(),
    db().prepare("SELECT occurred_on AS day, SUM(CASE WHEN event_type = 'visit' THEN 1 ELSE 0 END) AS visits, COUNT(DISTINCT CASE WHEN event_type = 'visit' THEN device_id END) AS learners, SUM(CASE WHEN event_type = 'engagement' THEN duration_ms ELSE 0 END) AS engagement_ms FROM usage_events GROUP BY occurred_on ORDER BY occurred_on DESC LIMIT 30").all<DailyUsageRow>(),
    db().prepare("SELECT completed_on AS day, COUNT(*) AS sessions, SUM(questions) AS questions FROM function_sprint_sessions GROUP BY completed_on ORDER BY completed_on DESC LIMIT 30").all<DailySprintRow>(),
    db().prepare("SELECT page AS label, COUNT(*) AS count FROM usage_events WHERE event_type = 'visit' GROUP BY page ORDER BY count DESC").all<BreakdownRow>(),
    db().prepare("SELECT section AS label, COUNT(*) AS count FROM function_sprint_sessions GROUP BY section ORDER BY count DESC").all<BreakdownRow>(),
    db().prepare("SELECT difficulty AS label, COUNT(*) AS count FROM function_sprint_sessions GROUP BY difficulty ORDER BY count DESC").all<BreakdownRow>(),
    db().prepare("SELECT COALESCE(MAX(display_name), 'Learner') AS display_name, MAX(created_at) AS last_seen, SUM(CASE WHEN event_type = 'visit' THEN 1 ELSE 0 END) AS visits FROM usage_events GROUP BY device_id ORDER BY last_seen DESC LIMIT 20").all<LearnerRow>(),
    db().prepare("SELECT COALESCE(MAX(p.display_name), 'Player') AS display_name, COUNT(*) AS sessions, SUM(s.questions) AS questions, SUM(s.first_correct) AS first_correct, SUM(s.total_ms) AS total_ms FROM function_sprint_sessions s LEFT JOIN function_sprint_players p ON p.device_id = s.device_id GROUP BY s.device_id HAVING SUM(s.questions) >= 5 ORDER BY (1.0 * SUM(s.first_correct) / SUM(s.questions)) DESC, (1.0 * SUM(s.total_ms) / SUM(s.questions)) ASC LIMIT 20").all<LeaderRow>(),
  ]);
  const sprintMap = new Map((dailySprints.results ?? []).map(row => [row.day, row]));
  const usageMap = new Map((dailyUsage.results ?? []).map(row => [row.day, row]));
  const days = [...new Set([...usageMap.keys(), ...sprintMap.keys()])].sort().reverse().slice(0, 30).map(day => {
    const u = usageMap.get(day), s = sprintMap.get(day);
    return { day, visits: Number(u?.visits ?? 0), learners: Number(u?.learners ?? 0), minutes: Math.round(Number(u?.engagement_ms ?? 0) / 6000) / 10, sessions: Number(s?.sessions ?? 0), questions: Number(s?.questions ?? 0) };
  });
  const questions = Number(sprints?.questions ?? 0), firstCorrect = Number(sprints?.first_correct ?? 0);
  return {
    totals: { visits: Number(usage?.visits ?? 0), learners: Number(usage?.learners ?? 0), minutes: Math.round(Number(usage?.engagement_ms ?? 0) / 6000) / 10, sessions: Number(sprints?.sessions ?? 0), questions, accuracy: questions ? Math.round(firstCorrect / questions * 100) : 0, practiceMinutes: Math.round(Number(sprints?.total_ms ?? 0) / 6000) / 10 },
    days,
    pages: (pages.results ?? []).map(row => ({ label: row.label, count: Number(row.count) })),
    sections: (sections.results ?? []).map(row => ({ label: row.label, count: Number(row.count) })),
    difficulties: (difficulties.results ?? []).map(row => ({ label: row.label, count: Number(row.count) })),
    learners: (learners.results ?? []).map(row => ({ name: row.display_name, lastSeen: Number(row.last_seen), visits: Number(row.visits) })),
    leaderboard: (leaderboard.results ?? []).map((row, index) => ({ rank: index + 1, name: row.display_name, sessions: Number(row.sessions), accuracy: Math.round(Number(row.first_correct) / Number(row.questions) * 100), averageSeconds: Math.round(Number(row.total_ms) / Number(row.questions)) / 1000 })),
  };
}
