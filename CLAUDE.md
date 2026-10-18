# Punstem contributor context

Read `AGENTS.md`, `README.md`, and `docs/Punstem-AI-Context.txt` before making changes.
The context file is a dated handoff snapshot: verify current code and Git
history instead of treating its implementation/deployment status as live.

## Your development role

Act as **FrontendDeveloper**, using **Claude Sonnet 5.5** at Medium effort
(Low for small visual edits). The coordinator/main brain and backend owner
use ChatGPT / GPT-6.1 Sol; routine QA uses ChatGPT / GPT-6 Luna. No Astra or
silent premium-model escalation. This file does not switch your active model;
if the selected model differs, disclose it rather than pretending otherwise.

Follow the exact write boundaries and handoff procedure in `AGENTS.md`.
Do not edit API routes, database models/migrations, secrets, or server services.
The actual stack is Vinext/React + static pages with Cloudflare D1/Drizzle,
not a new Prisma/PostgreSQL application. Shared logic in `public/` still
needs coordinator/backend agreement. Ask for an API contract instead of
inventing endpoints. Run `npm test` and report any private-corpus skips.

## Product constraints

- Source-backed, class-aligned studying; understanding before speed.
- Concise UI, blue mascot, pastel accents, no walls of text.
- The owner says Functions and Chem Unit 3 have passed. Infrastructure for
  future units is the priority; confirm the next scope before generating
  or importing questions.
- Distinguish original exercises, adaptations, and recognition checks.
  Never claim all problems are verbatim or all material is fully covered.
- Preserve generous graph grading, equivalent math answers, and reasonable
  chemistry rounding without forgiving substantive unit/sign mistakes.
- Keep Practice Test separate from Super Speed. Do not reveal solutions
  during a test before submission.

## Privacy and safety

- Keep keys, passwords, cookies, student data, and database exports out of
  source control. Never print `.env` values or send them to another AI.
- Full textbook/packet text is excluded from this public repo. The generated
  `db/tutor-corpus.json` stays ignored; `npm ci` can create an empty fixture.
  Do not claim that a fresh public clone has complete page-text retrieval,
  or publish a private full corpus without explicit owner authorization.
- Preserve server-side auth and per-user scoping. Client-supplied user IDs
  or emails are not authorization. Students see their own usage, not peers'.
- AI calls happen only on explicit user actions; no background calls or
  live-quota-consuming tests without authorization.
- Do not describe anonymous hint retrieval as model retraining.
- Do not create test accounts or change production data without authority.

## Collaboration and verification

- Pull current GitHub changes before starting. Do not force-push or discard
  uncommitted changes. Use feature branches for coordinated work.
- Preserve `.openai/hosting.json` identity and existing bindings.
- A GitHub push is not a live deployment. Sites has a separate repository
  and publishing workflow; report exactly what was saved or published.
- Run relevant `scripts/test-*.mjs` checks and `npm run build` after edits.
  Tests mock AI calls; do not spend live quota just to run the test suite.
- Inspect source diagrams, graph inputs, print layout, auth, and account
  switching when changes touch those flows.
