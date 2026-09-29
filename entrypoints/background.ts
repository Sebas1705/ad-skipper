// The service worker. It is torn down whenever the browser likes, so keep no
// state in module variables: put it in `storage` (lib/settings.ts).
export default defineBackground(() => {
  console.log("Ad Skipper: background started", { id: browser.runtime.id });
});
