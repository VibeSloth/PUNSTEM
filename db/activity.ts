import { env } from "cloudflare:workers";
import type { ProgressUser } from "./progress";

// A narrow event payload: never persist passwords, tokens, or typed answers.
export async function recordActivity(user: ProgressUser, kind: string, page: string, input: Record<string, unknown> = {}, id = crypto.randomUUID()) {
  if (!user) return;
  const details: Record<string, string | number | boolean> = {};
  for (const key of ["section", "difficulty", "questionType", "outcome", "attempt", "elapsedMs", "questions", "solved", "misses", "durationMs"]) {
    const value = input[key];
    if (typeof value === "string") details[key] = value.slice(0, 80);
    else if (typeof value === "number" && Number.isFinite(value)) details[key] = Math.max(0, Math.min(value, 21600000));
    else if (typeof value === "boolean") details[key] = value;
  }
  await env.DB.prepare("INSERT OR IGNORE INTO activity_events (id,user_id,kind,page,details,created_at) VALUES (?,?,?,?,?,?)").bind(id, user.userId, kind, page.slice(0, 80), JSON.stringify(details), Date.now()).run();
}

export async function safeActivity(...args: Parameters<typeof recordActivity>) {
  try { await recordActivity(...args); } catch { console.error("Activity event could not be saved"); }
}

export async function readActivity(url: URL) {
  const search = (url.searchParams.get("search") || "").slice(0, 100);
  const kind = (url.searchParams.get("kind") || "").slice(0, 40);
  const before = Number(url.searchParams.get("before")) || Date.now() + 1;
  const rows = await env.DB.prepare(`SELECT a.id,a.user_id,a.kind,a.page,a.details,a.created_at,u.email,u.display_name FROM activity_events a JOIN function_sprint_users u ON u.id=a.user_id WHERE a.created_at < ? AND (?='' OR a.kind=?) AND (?='' OR instr(lower(u.email || ' ' || coalesce(u.display_name,'')),lower(?))>0) ORDER BY a.created_at DESC,a.id DESC LIMIT 150`).bind(before,kind,kind,search,search).all();
  return { events: rows.results, nextBefore: rows.results.length === 150 ? rows.results.at(-1)?.created_at : null };
}
