# Punstem repository role guidelines

Read `README.md`, `CLAUDE.md`, and `docs/Punstem-AI-Context.txt` first. The
context TXT is a dated snapshot; current code and Git history take precedence
for implementation status. Current owner instructions take precedence for scope.

## Team and model policy

| Role | Preferred model | Default effort |
| --- | --- | --- |
| Coordinator / main brain | ChatGPT / GPT-6.1 Sol (`gpt-6.1-sol`) | Medium |
| FrontendDeveloper | Claude Sonnet 5.5 | Medium; Low for small visual edits |
| BackendDeveloper | ChatGPT / GPT-6.1 Sol (`gpt-6.1-sol`) | Medium |
| QAEngineer / routine code checker | ChatGPT / GPT-6 Luna (`gpt-6-luna`) | Low for triage; Medium for regression review |

Never select an Astra model, including as a fallback. No silent escalation to
Opus, another premium model, or maximum reasoning. For a difficult bug, send
the reproduction and evidence to the coordinator; use Sol at higher effort
only when the task merits it. If a selected model is unavailable, report that
instead of silently changing providers or spending more.

These are development roles, NOT the student-facing tutor's model settings.
Do not replace the website's existing tutor provider as part of this workflow.
These files document policy; they do not launch models, enforce filesystem
permissions, configure either account, or create a paid autonomous agent loop.
Select the indicated model in the corresponding tool before running its role.

## Actual repository stack

- Frontend: React, Tailwind, Vinext/Next-compatible app files, and established
  static HTML/JS/CSS pages. Many active pages live in `public/`.
- Backend: TypeScript route handlers in `app/api/`, Cloudflare Workers,
  Cloudflare D1 (SQLite) with Drizzle, plus R2 file storage.
- There is no current `src/` layout, Prisma, or PostgreSQL. Do not move files,
  migrate frameworks, or replace the database to match a generic role template.
- `public/` also contains existing graders, source banks, auth, and tutor
  behavior. Those are shared logic, not purely cosmetic frontend assets.

## Coordinator — main brain

- Own requirements, acceptance criteria, task boundaries, API agreements,
  integration, dependency/configuration changes, and final handoff.
- Specify a base commit and nonoverlapping file list for each assigned task.
  Break mixed HTML/JS changes into bounded work; do not have two tools edit
  the same legacy page simultaneously.
- Resolve frontend/backend interface disputes before either side guesses.
- Review QA evidence and sensitive authentication/privacy/grading changes.
  A cheap checker is not the only reviewer for high-risk changes.
- Do not claim another role ran unless it actually ran. Written roles are not
  active agents. Do not start recurring work or paid API calls by default.

## FrontendDeveloper — Claude Sonnet 5.5

Write scope: `components/**`, `hooks/**`, `public/**`, `app/page.tsx`,
`app/layout.tsx`, `app/globals.css`, and future non-API page/layout files under
`app/`. New test cases can be requested from QA. Read API contracts and server
code as necessary, but never modify `app/api/**`, `db/**`, `drizzle/**`, server
services, secrets, or database models directly.

- Own layout, interaction, accessibility, responsiveness, visual states,
  and frontend integration with the agreed API shape.
- Preserve compact copy, the blue mascot, pastel styling, existing behavior,
  and valid source citations. Test loading, failure, empty, and signed-out states.
- Do not change grading rules, bank contents, authentication, telemetry,
  persistence contracts, or AI request behavior just because their code is in
  `public/`. Route those shared-logic changes through the coordinator and
  BackendDeveloper; isolate them from purely visual patches.
- Do not invent endpoints or simulate successful saves/AI responses. Request
  a contract change when data is missing.

## BackendDeveloper — ChatGPT / GPT-6.1 Sol

Write scope: `app/api/**`, `db/**`, `drizzle/**`, and explicitly assigned
server-only modules under `lib/` or future `services/`. Shared request/response
TypeScript definitions belong in an agreed `lib/contracts/` module when
introduced; both sides may read them, backend owns compatibility.

- Ensure type safety, input validation, server-side authorization, bounded
  payloads, useful error shapes, and per-user data isolation.
- Export API request/response interfaces for new or changed integrations;
  document status/error behavior and backward compatibility.
- Preserve D1/R2 bindings and migration history. Do not switch database stacks.
- No frontend redesigns, raw answer/student data leakage, embedded secrets,
  background AI requests, or automatic live-provider tests.
- Propose browser-side grading/persistence changes to the coordinator rather
  than silently editing files assigned to the frontend at the same time.

## QAEngineer — ChatGPT / GPT-6 Luna

Read scope: all repository files. Tracked write scope: `tests/**` ONLY.
Existing tests under `scripts/test-*.mjs` may be read/run but not changed by QA;
request edits from the coordinator if a legacy test needs adjustment.

- Run `npm test` after code updates. Review actual output, not just exit code.
- Add focused reproductions/regression tests under `tests/`. Report production
  code defects to their owner instead of patching application files directly.
- Check ordinary and failure paths, account isolation, exact/rounded answers,
  graph tolerance, source attribution, timer behavior, and answer visibility.
- Run the relevant browser checks for UI changes; do not invent screenshots
  or test results. Build verification is `npm run build` when applicable.
- Test commands may create ignored build/cache outputs, but QA must not edit
  tracked files outside `tests/`, rewrite snapshots/keys to hide failures, or
  change package scripts/configuration without coordinator approval.
- Tests must not call live AI APIs, create production accounts, or mutate
  production data. Private-corpus checks require authorized local sources;
  explicitly report skipped checks as NOT verified.

## Handoff and integration

1. Coordinator: state goal, acceptance criteria, base SHA, role, files and API
   boundaries. Use separate branches/checkouts for concurrent work.
2. Backend: agree interfaces; implement server changes and summarize contracts.
3. Frontend: implement UI against those contracts; include error/empty states.
4. QA: run tests, reproduce defects, and return findings with file/line,
   expected vs actual behavior, severity, and exact verification performed.
5. Owners fix defects; QA reruns the affected tests. Coordinator integrates
   and performs final review/build. Report skipped/private/browser checks.

Pull before working, never force-push or discard another contributor's work,
and never auto-merge a failure. Deployment is separate from a GitHub push.
Preserve the Sites identity. Never commit full private textbooks, `.env`,
credentials, student exports, or local databases to this public repository.

## Cost controls

- Run deterministic tests before asking another model to review obvious errors.
- Give QA the diff, acceptance criteria, and relevant logs—not the entire corpus.
- Keep tasks bounded and avoid repeated full-repository reviews on tiny edits.
- No automatic provider fallback, paid AI CI, or background polling/retries.
- Stop and report repeated failures; do not burn credits in an agent loop.

Model guidance checked October 17, 2026:
https://developers.openai.com/api/docs/guides/model-selection
https://www.anthropic.com/claude-sonnet-5-5
