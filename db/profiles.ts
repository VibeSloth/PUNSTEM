import { env } from "cloudflare:workers";
import { readStreak } from "./streaks";

export async function accountList() {
  return (await env.DB.prepare(`SELECT a.user_id AS id, a.email, u.display_name AS name, a.created_at AS createdAt, u.last_seen_at AS lastSeen FROM local_accounts a JOIN function_sprint_users u ON u.id=a.user_id ORDER BY a.created_at DESC`).all()).results;
}

export async function accountProfile(id: string, full = false, zone: unknown = "UTC") {
  const limit = full ? "" : " LIMIT 100";
  const user = await env.DB.prepare("SELECT id, email, display_name AS name, created_at AS createdAt, last_seen_at AS lastSeen FROM function_sprint_users WHERE id=?").bind(id).first();
  if (!user) return null;
  const [usage, practice, days, visits, sessions] = await Promise.all([
    env.DB.prepare("SELECT SUM(event_type='visit') AS visits, COUNT(DISTINCT occurred_on) AS activeDays, COALESCE(SUM(duration_ms),0) AS activeMs, MAX(created_at) AS lastActivity FROM usage_events WHERE user_id=?").bind(id).first(),
    env.DB.prepare("SELECT COUNT(*) AS sessions, COALESCE(SUM(questions),0) AS questions, COALESCE(SUM(first_correct),0) AS firstCorrect, COALESCE(SUM(solved),0) AS solved, COALESCE(SUM(misses),0) AS misses, COALESCE(SUM(total_ms),0) AS practiceMs FROM function_sprint_sessions WHERE user_id=?").bind(id).first(),
    env.DB.prepare(`SELECT day, SUM(visits) AS visits, SUM(active_ms) AS activeMs, SUM(questions) AS questions, SUM(first_correct) AS firstCorrect, SUM(practice_ms) AS practiceMs FROM (SELECT occurred_on AS day, SUM(event_type='visit') AS visits, SUM(duration_ms) AS active_ms, 0 AS questions, 0 AS first_correct, 0 AS practice_ms FROM usage_events WHERE user_id=? GROUP BY occurred_on UNION ALL SELECT completed_on AS day, 0, 0, SUM(questions), SUM(first_correct), SUM(total_ms) FROM function_sprint_sessions WHERE user_id=? GROUP BY completed_on) GROUP BY day ORDER BY day DESC LIMIT 90`).bind(id,id).all(),
    env.DB.prepare("SELECT page, created_at AS timestamp FROM usage_events WHERE user_id=? AND event_type='visit' ORDER BY created_at DESC"+limit).bind(id).all(),
    env.DB.prepare("SELECT section, difficulty, created_at AS timestamp, questions, first_correct AS firstCorrect, solved, misses, total_ms AS practiceMs FROM function_sprint_sessions WHERE user_id=? ORDER BY created_at DESC"+limit).bind(id).all(),
  ]);
  return {user, usage, practice, streak:await readStreak(id,zone), days:days.results, visits:visits.results, sessions:sessions.results};
}
