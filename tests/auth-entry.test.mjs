import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const page = fs.readFileSync(new URL('app/page.tsx', root), 'utf8');
const account = fs.readFileSync(new URL('public/account.html', root), 'utf8');
const settings = fs.readFileSync(new URL('public/site-settings.js', root), 'utf8');

assert.match(page, /redirect\(["']\/account\.html["']\)/, 'homepage must enter through the top-level account page');
assert.match(account, /data-auth-page/, 'account page must activate full-page auth mode');
assert.match(account, /id="accountForm"/, 'account page must provide the shared auth-form mount');
assert.match(settings, /appendChild\(auth\)/, 'shared auth form must mount on the account page');
assert.match(settings, /window\.top\.location\.replace\('\/home\.html'\)/, 'successful account-page auth must return to classes');
assert.match(settings, /credentials:'same-origin'/, 'login requests must preserve same-origin cookie credentials');
assert.doesNotMatch(settings, /localStorage\.(?:setItem|getItem)\([^)]*(?:session|token)/i, 'session credentials must not be stored in local storage');

const authLoad = settings.split('\n').find(line => line.includes('async function authLoad()'));
assert.ok(authLoad, 'authLoad implementation must exist');

async function invokeAuthLoad(fetchImpl, { start = true } = {}) {
  const events = [];
  const status = { textContent: '' };
  const panel = { opened: false, closed: false };
  const context = vm.createContext({
    fetch: fetchImpl,
    window: { PunstemStreak: { refresh() { events.push('streak'); } } },
    document: {
      querySelector(selector) {
        if (selector === '#authStatus') return status;
        return null;
      },
      dispatchEvent(event) { events.push(event.detail); },
    },
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init.detail; } },
    authRender() { events.push('render'); },
    authOpen() { panel.opened = true; },
    authClose() { panel.closed = true; },
  });
  vm.runInContext(`let signedInUser=null,authEpoch=0;${authLoad};globalThis.load=authLoad;`, context);
  if (start) await context.load();
  return { context, events, status, panel };
}

const guest = await invokeAuthLoad(async url => {
  assert.equal(url, '/api/auth/me');
  return { ok: true, json: async () => ({ user: null }) };
});
assert.deepEqual(guest.events, ['render', null]);
assert.equal(guest.panel.opened, true, 'guest should be shown the sign-in form');
assert.equal(guest.context.window.PunstemCurrentUser, null);

const user = { userId: 'local-test-user', displayName: 'Test Student' };
const signedIn = await invokeAuthLoad(async (_url, options) => {
  assert.equal(options.credentials, 'same-origin');
  assert.equal(options.cache, 'no-store');
  return { ok: true, json: async () => ({ user }) };
});
assert.deepEqual(signedIn.events, ['render', user, 'streak']);
assert.equal(signedIn.panel.closed, true, 'existing session should leave the auth panel closed');
assert.equal(signedIn.context.window.PunstemCurrentUser.userId, user.userId);

const failed = await invokeAuthLoad(async () => ({ ok: false, json: async () => ({ user }) }));
assert.equal(failed.panel.opened, true, 'session-check errors should leave sign-in available');
assert.match(failed.status.textContent, /Could not check your session/);
assert.deepEqual(failed.events, [], 'failed session check must not claim a user or dispatch auth-ready');

// A login or newer session check increments the epoch while the original fetch is pending.
let resolveRequest;
const stale = await invokeAuthLoad(() => new Promise(resolve => { resolveRequest = resolve; }), { start: false });
const pending = stale.context.load();
vm.runInContext('authEpoch++', stale.context);
resolveRequest({ ok: true, json: async () => ({ user }) });
await pending;
assert.deepEqual(stale.events, [], 'stale session result must not overwrite newer auth state');
assert.equal(stale.panel.opened, false);
assert.equal(stale.context.window.PunstemCurrentUser, undefined);

console.log('Auth-entry checks passed: root routing, shared form mount, guest/session/error/stale session handling, and cookie-safe request conventions. No production accounts or data used.');
