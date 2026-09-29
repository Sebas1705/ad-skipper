/**
 * Every class name the player has used for the "Skip" button. The player is
 * redesigned now and then, so this list is the one place that ages: when the
 * extension stops working, look here first.
 */
export const SKIP_SELECTORS = [
  ".ytp-skip-ad-button",
  ".ytp-ad-skip-button-modern",
  ".ytp-ad-skip-button",
  ".ytp-ad-skip-button-container button",
];

type Box = { offsetWidth: number; offsetHeight: number };

/** Rendered, not merely present: the player keeps hidden copies around. */
export function isVisible(el: Box): boolean {
  return el.offsetWidth > 0 && el.offsetHeight > 0;
}

/**
 * The Skip button the viewer could click right now, or null.
 *
 * It only ever finds the button the player itself offers. It does not hide,
 * block or fast-forward anything: an ad that cannot be skipped is left alone.
 */
export function findSkipButton(root: ParentNode): HTMLElement | null {
  for (const selector of SKIP_SELECTORS) {
    for (const el of root.querySelectorAll<HTMLElement>(selector)) {
      if (isVisible(el)) return el;
    }
  }
  return null;
}

/** Clicks the Skip button if there is one. Returns whether it did. */
export function skipIfPossible(root: ParentNode): boolean {
  const button = findSkipButton(root);
  if (!button) return false;
  button.click();
  return true;
}
