# PUNSTEM
Punstem is a STEM website for students

Source-backed math and chemistry practice, recognition drills, worked help,
personal review, and an on-demand AI tutor.

## Start here

- **Full project context:** [docs/Punstem-AI-Context.txt](docs/Punstem-AI-Context.txt)
- **AI contributor guide:** [CLAUDE.md](CLAUDE.md)
- Last-known published site: https://punstem.chang-5319.chatgpt.site/
- Owner-requested additional link: https://colorgami.com (domain relationship
  to the published site has not been verified).

This import preserves this repository's initial commit and adds a snapshot
of the existing Punstem project. It does not deploy the website or import
production student data, credentials, or local databases.

## Development

Use Node.js 22.13 or newer.

```sh
npm ci
npm run dev -- --port 5178
```

Open the loopback URL printed by the development server. The new study hub
is `/study.html`; existing practice is `/math.html`, `/trainer.html`, and
`/super-speed.html`. The root page embeds `/home.html`.

```sh
node scripts/test-study.mjs
node scripts/test-study-api.mjs
npm run build
```

The application uses Vinext, React, and Cloudflare Workers with D1 (`DB`)
and R2 (`BUCKET`) bindings. Deployment identity is in `.openai/hosting.json`.
Local database state is separate from production. Database migrations are
under `drizzle/`; configure the local bindings and apply the existing
migrations before expecting account/storage features to work in a fresh
environment. Do not change hosting identity to make a local preview work.

The AI tutor requires a server-only `GEMINI_API_KEY`. Configure it privately
in the local environment or hosting secrets. Do not put keys in browser
code or Git. Ordinary practice does not require a live AI call.

## Current scope and work status

The owner says the Functions unit and Chemistry Unit 3 have passed. Set up
the foundation for future units; do not automatically generate new content
or infer the next unit without confirming its scope.

This snapshot includes the new study hub, practice tests, coverage,
correction/retry flow, spaced-review scheduling, and printable worksheets.
These changes passed local tests and a framework build, but were not yet
published to the live site at the time of this GitHub import. Printed/PDF
page layout still needs visual QA. See the context file for precise limits.

## Working with multiple AI tools

Treat this GitHub repository as the shared development history. Pull before
working, use a feature branch when coordinating, and review/merge changes
before another tool starts from them. GitHub pushes do not automatically
sync the separate Sites repository or publish production. Do not force-push
or overwrite another contributor's work.

Keep `.env*`, local account/database state, dependencies, and build output
out of Git. The source bank in `db/` is application content, not a production
database backup. Never add student activity exports. Full extracted textbook
and packet text (`db/tutor-corpus.json`) is deliberately NOT uploaded to this
public repository. Installation creates an empty local index from
`db/tutor-corpus.example.json` if no private index exists. The exercise bank
works independently, but full page-text retrieval needs separately supplied,
authorized source materials. Never deploy an empty index over the live
private corpus without planning that change. Index-dependent tests require
the real private materials. Do not commit a rebuilt full-text corpus.
