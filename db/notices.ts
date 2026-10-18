import { env } from "cloudflare:workers";
export async function claimSprintFeedbackPrompt(userId: string) {
  if (!env.DB) return false;
  const result = await env.DB.prepare("INSERT OR IGNORE INTO sprint_feedback_prompts (user_id, shown_at) VALUES (?, ?)").bind(userId, Date.now()).run();
  return Number(result.meta.changes) === 1;
}
export async function feedbackNoticeSeen(userId: string) {
  if (!env.DB) throw new Error("Account storage unavailable");
  return Boolean(await env.DB.prepare("SELECT user_id FROM feedback_notices WHERE user_id = ?").bind(userId).first());
}
export async function dismissFeedbackNotice(userId: string) {
  if (!env.DB) throw new Error("Account storage unavailable");
  await env.DB.prepare("INSERT OR IGNORE INTO feedback_notices (user_id, seen_at) VALUES (?, ?)").bind(userId, Date.now()).run();
}
