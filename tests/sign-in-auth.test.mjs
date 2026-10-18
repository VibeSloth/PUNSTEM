import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { webcrypto } from 'node:crypto';
import ts from 'typescript';

const root = new URL('../', import.meta.url);
const accounts = new Map(), users = new Map(), sessions = new Map();
const DB = {
  prepare(sql) {
    let args;
    return {
      bind(...values) { args = values; return this; },
      async first() {
        if (sql.includes('FROM local_accounts')) {
          const account = accounts.get(args[0]);
          return account ? { ...account, display_name: users.get(account.user_id).display_name } : null;
        }
        if (sql.includes('FROM auth_sessions')) {
          const session = sessions.get(args[0]);
          return session ? { ...session, ...users.get(session.user_id) } : null;
        }
        return null;
      },
      async run() {
        if (sql.includes('INSERT INTO auth_sessions')) sessions.set(args[0], { user_id: args[1], expires_at: args[2], created_at: args[3] });
        if (sql.includes('DELETE FROM auth_sessions')) sessions.delete(args[0]);
      },
      async execute() {
        if (sql.includes('INSERT INTO local_accounts')) {
          if (accounts.has(args[1])) throw Error('UNIQUE constraint');
          accounts.set(args[1], { user_id: args[0], password_hash: args[2], password_salt: args[3], iterations: args[4] });
        } else if (sql.includes('INSERT INTO function_sprint_users')) {
          users.set(args[0], { email: args[1], display_name: args[2] });
        } else await this.run();
      },
    };
  },
  async batch(statements) { for (const statement of statements) await statement.execute(); },
};

function loadTs(path, exports, require) {
  const source = fs.readFileSync(new URL(path, root), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInContext(js, vm.createContext({ exports, require, TextEncoder, Uint8Array, ArrayBuffer, Headers, URL, Request, Response, Date, crypto: webcrypto }));
  return exports;
}

const auth = loadTs('db/auth.ts', {}, id => {
  if (id === 'cloudflare:workers') return { env: { DB } };
  throw Error(`Unexpected auth dependency ${id}`);
});
const safeActivity = async () => {};
const login = loadTs('app/api/auth/login/route.ts', {}, id => {
  if (id.endsWith('/db/activity')) return { safeActivity };
  if (id.endsWith('/db/auth')) return auth;
  throw Error(`Unexpected login dependency ${id}`);
});
const register = loadTs('app/api/auth/register/route.ts', {}, id => {
  if (id.endsWith('/db/activity')) return { safeActivity };
  if (id.endsWith('/db/auth')) return auth;
  throw Error(`Unexpected register dependency ${id}`);
});

assert.equal(auth.rememberSession(undefined), true, 'legacy callers retain the old remember behavior');
assert.equal(auth.rememberSession(true), true);
assert.equal(auth.rememberSession(false), false);
for (const invalid of ['true', 1, null, {}, '']) assert.throws(() => auth.rememberSession(invalid), /preference/);

const signupResponse = await register.POST(new Request('https://punstem.test/api/auth/register', {
  method: 'POST', headers: { origin: 'https://punstem.test', 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'remember@example.test', password: 'TestPassword123', displayName: 'Remember Test', rememberMe: false }),
}));
assert.equal(signupResponse.status, 201);
const signupCookies = signupResponse.headers.getSetCookie();
assert.equal(signupCookies.length, 2, 'registration returns both first-party and embedded session cookies');
for (const cookie of signupCookies) {
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /Secure/);
  assert.doesNotMatch(cookie, /Max-Age=/, 'unchecked remember preference returns browser-session cookies');
}
assert.match(signupCookies[0], /SameSite=Lax/);
assert.match(signupCookies[1], /SameSite=None; Partitioned/);
const signupToken = signupCookies[0].split(';')[0];
assert.equal((await auth.localUser(new Request('https://punstem.test/api/auth/me', { headers: { cookie: signupToken } }))).userId, (await signupResponse.json()).user.userId,
  'the actual registration response cookie authenticates through /me session validation');
const signupSession = [...sessions.values()].at(-1);
assert(signupSession.expires_at - signupSession.created_at <= 24 * 60 * 60 * 1000);

const loginResponse = await login.POST(new Request('https://punstem.test/api/auth/login', {
  method: 'POST', headers: { origin: 'https://punstem.test', 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'remember@example.test', password: 'TestPassword123', rememberMe: false }),
}));
assert.equal(loginResponse.status, 200);
const loginCookies = loginResponse.headers.getSetCookie();
assert.equal(loginCookies.length, 2);
assert(loginCookies.every(cookie => !/Max-Age=/.test(cookie)));
const loginSession = [...sessions.values()].at(-1);
assert(loginSession.expires_at - loginSession.created_at <= 24 * 60 * 60 * 1000);
const invalidPreference = await login.POST(new Request('https://punstem.test/api/auth/login', {
  method: 'POST', headers: { origin: 'https://punstem.test', 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'remember@example.test', password: 'TestPassword123', rememberMe: 'false' }),
}));
assert.equal(invalidPreference.status, 401, 'nonboolean preference is rejected');

// Old callers that omit rememberMe still receive 30-day persistent cookies.
const legacy = await auth.loginLocalAccount('remember@example.test', 'TestPassword123');
assert(legacy.cookie.includes('Max-Age=2592000'));
assert(legacy.embeddedCookie.includes('Max-Age=2592000'));
assert([...sessions.values()].at(-1).expires_at - [...sessions.values()].at(-1).created_at <= 30 * 24 * 60 * 60 * 1000);

const wrapper = fs.readFileSync(new URL('components/account-sign-in.tsx', root), 'utf8');
assert.match(wrapper, /sessionRequest\.current\?\.abort\(\)/, 'sign-in aborts the pending session check before submit');
assert.match(wrapper, /submitRequest\.current\?\.abort\(\)/, 'component cleanup aborts the in-flight submit');
assert.match(wrapper, /if\s*\(inFlight\.current\)\s*return/, 'duplicate submits are ignored');
assert.match(wrapper, /setMode\("login"\)/, 'registration without a retained cookie switches the retry to login');
assert.match(wrapper, /if\s*\(!inFlight\.current\)\s*\{\s*setMode/, 'mode changes are blocked while a request is in flight');
assert.match(wrapper, /credentials:\s*"same-origin"/);
assert.doesNotMatch(wrapper, /localStorage|sessionStorage|console\.(?:log|info|debug|warn|error)\s*\(/, 'credentials must not be logged or stored in browser storage');

console.log('Sign-in auth checks passed: real route POSTs, checked session cookie, remember-me cookie/expiry behavior, legacy default, invalid preference rejection, and wrapper request guards. No live accounts or production data used.');
