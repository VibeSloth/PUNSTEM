import { env } from "cloudflare:workers";
import type { ProgressUser } from "./progress";

const encoder = new TextEncoder();
const COOKIE = "punstem_session";
const EMBED_COOKIE = "__Host-punstem_session_embed";
// Cloudflare Workers currently caps Web Crypto PBKDF2 at 100,000 iterations.
const ITERATIONS = 100_000;
const SESSION_SECONDS = 60 * 60 * 24 * 30;
const BROWSER_SESSION_SECONDS = 60 * 60 * 24;
export function rememberSession(value: unknown): boolean { if (value === undefined) return true; if (typeof value !== 'boolean') throw new Error('Invalid sign-in preference'); return value; }
// Bind administration to the owner's existing account, never a client-supplied email.
export function isAdmin(user: ProgressUser) { return user?.userId === "ab88c6876f614db0a63975418f5b3b61"; }

function db() { if (!env.DB) throw new Error("Account storage is unavailable"); return env.DB; }
function bytes(size: number) { const value = new Uint8Array(size); crypto.getRandomValues(value); return value; }
function hex(value: ArrayBuffer | Uint8Array) { return [...new Uint8Array(value instanceof ArrayBuffer ? value : value.buffer)].map(x => x.toString(16).padStart(2, "0")).join(""); }
function fromHex(value: string) { if (!/^[0-9a-f]+$/i.test(value) || value.length % 2) throw new Error("Invalid encoded value"); return new Uint8Array(value.match(/../g)!.map(x => parseInt(x, 16))); }
function cleanEmail(value: unknown) { const email = typeof value === "string" ? value.trim().toLowerCase() : ""; if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address"); return email; }
function cleanPassword(value: unknown) { const password = typeof value === "string" ? value : ""; if (password.length < 8 || password.length > 128) throw new Error("Password must be 8–128 characters"); return password; }
function cleanName(value: unknown) { const name = typeof value === "string" ? value.trim().replace(/\s+/g, " ") : ""; if (!/^[\p{L}\p{N}][\p{L}\p{N} ._'-]{0,23}$/u.test(name)) throw new Error("Name must be 1–24 letters or numbers"); return name; }
async function digest(value: string) { return hex(await crypto.subtle.digest("SHA-256", encoder.encode(value))); }
async function passwordHash(password: string, salt: Uint8Array, iterations = ITERATIONS) { const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]); return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256)); }
function same(a: string, b: string) { if (a.length !== b.length) return false; let diff = 0; for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i); return diff === 0; }
function cookieValues(request:Request){return [...new Set((request.headers.get('cookie')||'').split(';').map(x=>x.trim()).filter(x=>x.startsWith(COOKIE+'=')||x.startsWith(EMBED_COOKIE+'=')).map(x=>x.slice(x.indexOf('=')+1)).filter(x=>/^[a-f0-9]{64}$/i.test(x)))];}
function sessionCookie(token: string, remember = true) { return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax${remember ? `; Max-Age=${SESSION_SECONDS}` : ''}`; }
function embeddedCookie(token:string, remember = true){return `${EMBED_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=None; Partitioned${remember ? `; Max-Age=${SESSION_SECONDS}` : ''}`;}
export function sessionHeaders(cookie:string,embedded:string){const h=new Headers({'cache-control':'no-store'});h.append('set-cookie',cookie);h.append('set-cookie',embedded);return h;}
export function validAuthOrigin(request:Request){const origin=request.headers.get('origin');return (!origin||origin===new URL(request.url).origin)&&request.headers.get('sec-fetch-site')!=='cross-site';}
export function clearSessionCookie() { return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`; }
export function clearSessionHeaders(){return sessionHeaders(clearSessionCookie(),`${EMBED_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=0`);}

async function createSession(userId: string, remember = true) { const token = hex(bytes(32)), tokenHash = await digest(token), now = Date.now(), expiresAt = now + (remember ? SESSION_SECONDS : BROWSER_SESSION_SECONDS) * 1000; await db().prepare("INSERT INTO auth_sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)").bind(tokenHash, userId, expiresAt, now).run(); return {cookie:sessionCookie(token,remember),embeddedCookie:embeddedCookie(token,remember)}; }

export async function registerLocalAccount(rawEmail: unknown, rawPassword: unknown, rawName: unknown, remember = true) {
  const email = cleanEmail(rawEmail), password = cleanPassword(rawPassword), displayName = cleanName(rawName), userId = crypto.randomUUID().replaceAll("-", ""), salt = bytes(16), hash = await passwordHash(password, salt), now = Date.now();
  const token=hex(bytes(32)), tokenHash=await digest(token);
  try { await db().batch([
    db().prepare("INSERT INTO local_accounts (user_id, email, password_hash, password_salt, iterations, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(userId, email, hash, hex(salt), ITERATIONS, now),
    db().prepare("INSERT INTO function_sprint_users (id, email, display_name, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?)").bind(userId, email, displayName, now, now),
    db().prepare("INSERT INTO auth_sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)").bind(tokenHash,userId,now+(remember?SESSION_SECONDS:BROWSER_SESSION_SECONDS)*1000,now),
  ]); } catch (error) { const message = error instanceof Error ? error.message : String(error); if (/unique|constraint/i.test(message)) throw new Error("An account with that email already exists"); throw error; }
  return { user: { userId, email, displayName }, cookie: sessionCookie(token,remember),embeddedCookie:embeddedCookie(token,remember) };
}

export async function loginLocalAccount(rawEmail: unknown, rawPassword: unknown, remember = true) {
  const email = cleanEmail(rawEmail), password = cleanPassword(rawPassword);
  const account = await db().prepare("SELECT a.user_id, a.password_hash, a.password_salt, a.iterations, u.display_name FROM local_accounts a JOIN function_sprint_users u ON u.id = a.user_id WHERE a.email = ?").bind(email).first<{ user_id: string; password_hash: string; password_salt: string; iterations: number; display_name: string }>();
  if (!account) { await passwordHash(password, bytes(16)); throw new Error("Email or password is incorrect"); }
  const candidate = await passwordHash(password, fromHex(account.password_salt), account.iterations);
  if (!same(candidate, account.password_hash)) throw new Error("Email or password is incorrect");
  await db().prepare("UPDATE function_sprint_users SET last_seen_at = ? WHERE id = ?").bind(Date.now(), account.user_id).run();
  return { user: { userId: account.user_id, email, displayName: account.display_name }, ...await createSession(account.user_id, remember) };
}

export async function localUser(request: Request): Promise<ProgressUser> {
  if(!['GET','HEAD','OPTIONS'].includes(request.method)&&!validAuthOrigin(request))return null;
  const tokens=cookieValues(request);if(!tokens.length)return null;const now=Date.now();let newest:{user_id:string;email:string;display_name:string;created_at:number}|null=null;
  for(const token of tokens){const tokenHash=await digest(token),row=await db().prepare("SELECT s.user_id, s.expires_at, s.created_at, u.email, u.display_name FROM auth_sessions s JOIN function_sprint_users u ON u.id = s.user_id WHERE s.token_hash = ?").bind(tokenHash).first<{user_id:string;expires_at:number;created_at:number;email:string;display_name:string}>();if(!row||row.expires_at<=now){await db().prepare("DELETE FROM auth_sessions WHERE token_hash = ?").bind(tokenHash).run();continue;}if(!newest||row.created_at>newest.created_at)newest=row;}
  return newest?{userId:newest.user_id,email:newest.email,displayName:newest.display_name}:null;
}

export async function deleteLocalSession(request:Request){if(!validAuthOrigin(request))return;for(const token of cookieValues(request))await db().prepare("DELETE FROM auth_sessions WHERE token_hash = ?").bind(await digest(token)).run();}
