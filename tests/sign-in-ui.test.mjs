import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const root = new URL('../', import.meta.url);
const source = fs.readFileSync(new URL('components/ui/sign-in.tsx', root), 'utf8');
const wrapper = fs.readFileSync(new URL('components/account-sign-in.tsx', root), 'utf8');
const themeHook = fs.readFileSync(new URL('hooks/use-punstem-theme.ts', root), 'utf8');
const signInCss = fs.readFileSync(new URL('app/sign-in.css', root), 'utf8');
assert.doesNotMatch(wrapper, /\btestimonials\s*=/, 'Punstem wrapper must not add sample or fictional reviews');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const exports = {};
vm.runInContext(compiled, vm.createContext({
  exports,
  require(id) {
    if (id === 'react') return React;
    if (id === 'react/jsx-runtime') return jsxRuntime;
    if (id === 'lucide-react') return { Eye: () => React.createElement('svg'), EyeOff: () => React.createElement('svg') };
    throw Error(`Unexpected sign-in UI dependency ${id}`);
  },
}));

const { SignInPage } = exports;
const defaultMarkup = renderToStaticMarkup(React.createElement(SignInPage, { title: 'Welcome back' }));
assert.match(defaultMarkup, /name="email"/);
assert.match(defaultMarkup, /name="password"/);
assert.match(defaultMarkup, /name="rememberMe"/);
assert.match(defaultMarkup, /Keep me signed in/);
assert.doesNotMatch(defaultMarkup, /Continue with Google|Reset password|fake|fictional/i,
  'unconfigured provider/reset actions and fabricated testimonials must not render');
assert.match(defaultMarkup, /aria-label="Show password"/);
assert.match(defaultMarkup, /aria-controls="[^"]+-password"/);
assert.match(defaultMarkup, /aria-busy="false"/);
assert.match(defaultMarkup, /role="alert"/);

const ids = [...defaultMarkup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'all rendered input/error IDs must be unique');
for (const id of ids.filter(value => value.endsWith('-email') || value.endsWith('-password'))) {
  assert.match(defaultMarkup, new RegExp(`for="${id}"`), `input ${id} needs a matching visible label`);
}

const registerMarkup = renderToStaticMarkup(React.createElement(SignInPage, { mode: 'register', busy: true, error: 'Please retry.', onSignInInstead() {} }));
assert.match(registerMarkup, /name="displayName"/);
assert.match(registerMarkup, /autocomplete="new-password"/i);
assert.match(registerMarkup, /aria-busy="true"/);
assert.match(registerMarkup, /disabled=""/);
assert.match(registerMarkup, /role="alert"[^>]*>Please retry\./);
assert.match(registerMarkup, /Already have an account\?/);
assert.doesNotMatch(registerMarkup, /Reset password/);

const configuredMarkup = renderToStaticMarkup(React.createElement(SignInPage, {
  onGoogleSignIn() {}, onResetPassword() {},
}));
assert.match(configuredMarkup, /Continue with Google/);
assert.match(configuredMarkup, /Reset password/);

assert.match(source, /event\.preventDefault\(\);\s*onSignIn\?\.\(event\)/,
  'form submission must never fall through to browser navigation when callback is absent');
assert.doesNotMatch(source + wrapper, /localStorage|sessionStorage|console\.(?:log|info|debug|warn|error)\s*\(/,
  'passwords and credentials must not be browser-stored or logged');
assert.match(wrapper, /rememberMe:\s*fields\.get\("rememberMe"\)\s*===\s*"on"/);
assert.match(wrapper, /fetch\("\/api\/auth\/me"/);

assert.match(wrapper, /getElementById\("punstem-feedback-bootstrap"\)/,
  'React effect replay or HMR must not inject a second feedback bootstrap');
assert.match(wrapper, /script\.id\s*=\s*"punstem-feedback-bootstrap"/);
assert.equal((wrapper.match(/script\.remove\(\)/g) || []).length, 1,
  'only a failed script load may remove the bootstrap; successful script remains installed across effect cleanup');
assert.match(wrapper, /script\.onerror\s*=\s*\(\)\s*=>\s*script\.remove\(\)/);
assert.match(wrapper, /return\s*\(\)\s*=>\s*\{\s*controller\.abort\(\);\s*submitRequest\.current\?\.abort\(\);\s*\}/,
  'effect cleanup still aborts pending auth requests');

assert.match(themeHook, /localStorage\.getItem\("punstemTheme"\)/);
assert.match(themeHook, /saved\s*===\s*"light"\s*\|\|\s*saved\s*===\s*"dark"/);
assert.doesNotMatch(themeHook, /getItem\((?!"punstemTheme")|email|password|session|token/i,
  'theme hook must read only the appearance setting, never authentication state');
assert.match(signInCss, /html\[data-theme="light"\] \.punstem-signin/);
assert.match(signInCss, /html\[data-theme="dark"\] \.punstem-signin/);

console.log('Sign-in UI checks passed: optional actions, form navigation prevention, unique labeled controls, accessibility states, busy modes, registration fields, credential handling, saved theme, and feedback-script idempotence.');
