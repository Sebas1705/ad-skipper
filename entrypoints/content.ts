import { enabled, skipped } from "../lib/settings";
import { skipIfPossible } from "../lib/skip";

// Only the site the extension is about: `<all_urls>` would draw a longer store
// review and a scarier install warning for no benefit.
export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_idle",
  async main() {
    let on = await enabled.getValue();
    console.log("Ad Skipper: active", { enabled: on });
    enabled.watch((value) => (on = value));

    // The Skip button appears a few seconds into an ad, inside a page that is
    // never reloaded, so watch for it instead of checking once. Batched to one
    // check per frame: the player mutates the DOM constantly.
    let scheduled = false;
    const check = () => {
      scheduled = false;
      if (!on) return;
      if (skipIfPossible(document)) {
        console.log("Ad Skipper: pressed the Skip button");
        void skipped.getValue().then((n) => skipped.setValue(n + 1));
      }
    };

    new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(check);
    }).observe(document.body, { childList: true, subtree: true, attributes: true });
  },
});
