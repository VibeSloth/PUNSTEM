# Sign-in component integration

This project already has React, TypeScript, Tailwind CSS 4, shadcn aliases,
`lucide-react`, and `tw-animate-css`. No CLI initialization or dependency
installation is needed for this component.

- Reusable UI: `components/ui/sign-in.tsx` (the established `@/components/ui` alias).
- Global Tailwind/theme styles: `app/globals.css`.
- Scoped sign-in animation styles: `app/sign-in.css`.
- Route and auth integration: `app/sign-in/page.tsx`, `components/account-sign-in.tsx`.

Keep reusable UI in `components/ui` so shadcn tooling and the configured import
aliases resolve consistently; application authentication is deliberately outside
the presentational component. The public `/account.html` fallback redirects to
the same React page. `/` starts at `/sign-in`; existing sessions continue to home.

The form uses the existing same-origin login/register endpoints and verifies
`/api/auth/me` before continuing. Passwords are never logged or stored in browser
storage. `rememberMe` defaults to the prior 30-day behavior for legacy clients;
the new form sends the checkbox value. Unchecked uses browser-session cookies
with a maximum 24-hour server session. Browser session-restore settings can keep
session cookies, so closing a browser is not a guaranteed logout: use Sign out.

Google sign-in/reset-password actions appear only when corresponding callbacks
are supplied. Neither is configured for Punstem; no placeholder success is shown.
Testimonials remain empty, rather than publishing the demo's fictional reviews.

Hero: [Purple nebula by Hamish Dowson on Unsplash](https://unsplash.com/photos/purple-nebula-HgxVSzUHDRY).
The image loads directly from Unsplash; a local gradient remains if it is blocked.
No external avatar or font requests are required by the Punstem integration.

This feature is submitted for PR review; it is not automatically merged or deployed.

## Verification

Deterministic auth tests exercise real route handlers against an in-memory D1
fixture, including cookie verification, persistence preferences, and legacy
clients. UI tests render the component with React and check optional controls,
registration, busy/error semantics, unique IDs, saved theme, and feedback guards.
No production account or live AI call is used. Private-textbook checks are
unavailable in the public checkout and remain explicit skips.

The framework production build passes. Full-repository TypeScript checking has
34 existing diagnostics in unrelated binding/source-index code and the existing
crypto helper; a virtual HEAD comparison found the same 34 before and after,
with no introduced diagnostics. This PR does not hide or weaken type checking.

The Claude Desktop handoff could not be submitted from the coordinator's UI
controls for this task. The coordinator implemented the template locally, and
GPT-6 Luna reviewed it; no Claude-authored patch is claimed for this PR.
