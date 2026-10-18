import { env } from "cloudflare:workers";
export function todayInZone(raw: unknown) {
  const zone = typeof raw === "string" && raw.length < 100 ? raw : "UTC";
  try { return new Intl.DateTimeFormat("en-CA",{timeZone:zone,year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date()); }
  catch { return new Date().toISOString().slice(0,10); }
}
export function summarizeStreak(days: string[], today: string) {
  const sorted=[...new Set(days)].sort(); let best=0,run=0,last=0;
  for(const day of sorted){const n=Date.parse(day+"T00:00:00Z");run=n-last===86400000?run+1:1;best=Math.max(best,run);last=n;}
  const set=new Set(sorted),now=Date.parse(today+"T00:00:00Z");let end=now;
  if(!set.has(today))end-=86400000;
  let current=0;while(set.has(new Date(end).toISOString().slice(0,10))){current++;end-=86400000;}
  return {current,best,completedToday:set.has(today)};
}
export async function readStreak(userId: string, zone: unknown) {
  const rows=await env.DB.prepare("SELECT day FROM practice_days WHERE user_id=? ORDER BY day").bind(userId).all<{day:string}>();
  return summarizeStreak(rows.results.map(x=>x.day),todayInZone(zone));
}
export async function recordPracticeDay(userId: string, zone: unknown) {
  const result=await env.DB.prepare("INSERT OR IGNORE INTO practice_days (user_id, day, created_at) VALUES (?, ?, ?)").bind(userId,todayInZone(zone),Date.now()).run();
  return {...await readStreak(userId,zone),earned:result.meta.changes>0};
}
