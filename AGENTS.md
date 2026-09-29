# AGENTS

Operating contract for AI agents and automation helpers working in this project.

## Mission

- Keep this extension to a single, clear purpose: WXT + Svelte 5 + TypeScript, Manifest V3, no UI kit or state library until it actually needs one.

## Core Rules

- Entrypoints live under `entrypoints/` and WXT derives `manifest.json` from them; do not hand-write a manifest.
- Use runes (`$state`, `$derived`, `$effect`); do not reintroduce Svelte 4 store syntax.
- The service worker keeps no state in variables. Persist through the typed items in `lib/settings.ts`.
- Request the fewest `permissions` and the narrowest content-script `matches` that work. Never add `<all_urls>`, `tabs`, `history` or `cookies` without a stated need.
- No remote code: everything executed must be bundled into the package.
- Strict TypeScript stays on.
- Update docs in the same change when behavior or process changes.

## Required Checks Before Finishing

- `npm run build` compiles clean (svelte-check + wxt build).
- `npm test` passes when tests exist.

```sh templetry:checks
npm install
npm run build
```

## Safe Change Workflow

1. Read the affected files fully before editing.
2. Make the smallest change that solves the task.
3. Build and test, then review the diff with git before committing.

## This project came from a template

Four facts you cannot infer from the code in front of you:

- **Never hand-edit `.templetry-answers.yml`.** It records what generated this project. Editing it makes the next update merge against a state that never existed.
- **Before writing a capability by hand, run `templetry pieces`.** Auth, RBAC, audit trails, API keys and whole CRUD resources may already exist as pieces for this template. Adopting one is `templetry add <name>`, and it brings its own tests.
- **`templetry update` pulls improvements from the template** through a three-way merge that keeps your edits. Use it instead of copying files from the template by hand.
- **Directives like `tpl:if` belong to the template, not here.** If you find one in this project, it is a rendering bug worth reporting — do not try to interpret it.
