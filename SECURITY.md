# Security policy

## Reporting a vulnerability

Please report vulnerabilities privately through GitHub:
[Report a vulnerability](https://github.com/Sebas1705/ad-skipper/security/advisories/new).
Do not open a public issue for a security problem. This is a one-person project, so expect a reply
within a few days, not hours.

## Supported versions

Only the latest release receives fixes.

## What the extension does

AdSkipper is a Manifest V3 Chromium extension with a deliberately small surface:

- **Permissions:** `storage` only. The content script runs only on `https://www.youtube.com/*`.
- It clicks the Skip button that the player itself shows; it does not block, hide or fast-forward ads.
- It makes no network requests of its own and runs no remote code: everything it executes is bundled
  in the package.
- It stores two values locally with `chrome.storage.local` (the on/off switch and the skipped
  counter). It collects no page content, browsing history or personal data.

## What to know about the releases

- GitHub releases carry a build zip produced by CI (`npm run zip`). It is not signed by the project.
  The copy distributed through the Chrome Web Store, if any, is signed by Google.
- Dependencies are installed from `package-lock.json` (`npm ci`) in CI.

A report is most useful if it covers the content script (`entrypoints/content.ts`, `lib/skip.ts`)
or the extension's permissions.
