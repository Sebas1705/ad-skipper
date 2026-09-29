<script lang="ts">
  import { enabled, skipped } from "../../lib/settings";

  let on = $state(true);
  let count = $state(0);

  enabled.getValue().then((value) => (on = value));
  skipped.getValue().then((value) => (count = value));
  // The content script keeps counting while the popup is open.
  skipped.watch((value) => (count = value));

  async function toggle() {
    await enabled.setValue(on);
  }
</script>

<main>
  <h1>Ad Skipper</h1>
  <label class="row">
    <input type="checkbox" bind:checked={on} onchange={toggle} />
    Click "Skip" when it appears
  </label>
  <p class="muted">Skipped {count} {count === 1 ? "ad" : "ads"} so far.</p>
</main>
