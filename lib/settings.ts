import { storage } from "#imports";

/**
 * Typed storage items: one place that names each key and its default, so the
 * popup and the content script cannot disagree about them.
 */
export const enabled = storage.defineItem<boolean>("local:enabled", { fallback: true });
export const skipped = storage.defineItem<number>("local:skipped", { fallback: 0 });
