# AdSkipper

Chromium extension (Manifest V3) that clicks the **Skip** button on video ads as soon as the player offers it. Built with [Templetry](https://github.com/Templetry) (`browser-extension/wxt-svelte`): [WXT](https://wxt.dev) + Svelte 5 + TypeScript.

It only clicks the button the player itself shows. It does not hide, block or fast-forward ads, so an ad that cannot be skipped plays normally.

```sh
npm install
npm run dev       # opens Chrome with the extension loaded, rebuilds on save
npm run build     # svelte-check + wxt build, output in .output/chrome-mv3
npm run zip       # the .zip you upload to the Chrome Web Store
npm test          # vitest
```

To try a build by hand: `chrome://extensions` → Developer mode → **Load unpacked** → `.output/chrome-mv3`.

## How it works

| Path | What it is |
|---|---|
| `entrypoints/content.ts` | Runs on the site, watches the page for the Skip button and clicks it |
| `lib/skip.ts` | The selectors and the find-and-click logic. **When it stops working, start here**: the player's class names change |
| `lib/settings.ts` | Typed storage: the on/off switch and the skipped counter |
| `entrypoints/popup/` | The toolbar popup: switch and counter |

Permissions: `storage` only. The content script runs only on `https://www.youtube.com/*`.
